import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { FileSpreadsheet, Download, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import * as XLSX from "xlsx";

// Default range = previous calendar month
function defaultRange() {
  const now = new Date();
  const firstOfThisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const firstOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const lastOfLastMonth = new Date(firstOfThisMonth.getTime() - 24 * 60 * 60 * 1000);
  return {
    from: format(firstOfLastMonth, "yyyy-MM-dd"),
    to: format(lastOfLastMonth, "yyyy-MM-dd"),
  };
}

const HEADERS = [
  "Appointment ID",
  "Patient Name",
  "Mobile",
  "Email",
  "Age",
  "Gender",
  "Patient Type",
  "Department",
  "Consultation Type",
  "Appointment Date",
  "Appointment Time",
  "Status",
  "Fee (₹)",
  "Address",
  "Notes",
  "Booked On",
];

const STATUS_FILL: Record<string, string> = {
  pending: "FFF2CC",
  confirmed: "C6EFCE",
  cancelled: "FFC7CE",
  completed: "BDD7EE",
};

const ExcelReportButton = () => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [range, setRange] = useState(defaultRange());
  const { toast } = useToast();

  const handleGenerate = async () => {
    if (!range.from || !range.to) {
      toast({ title: "Select a date range", variant: "destructive" });
      return;
    }
    if (range.from > range.to) {
      toast({ title: "Invalid range", description: "Start date must be before end date.", variant: "destructive" });
      return;
    }

    setLoading(true);
    try {
      // Range in IST — inclusive of end day
      const fromIso = new Date(`${range.from}T00:00:00+05:30`).toISOString();
      const toIso = new Date(`${range.to}T23:59:59+05:30`).toISOString();

      const { data, error } = await supabase
        .from("appointments")
        .select("*")
        .gte("time_slot", fromIso)
        .lte("time_slot", toIso)
        .order("time_slot", { ascending: true });

      if (error) throw error;

      const appts = data || [];

      if (appts.length === 0) {
        toast({
          title: "No appointments found",
          description: `No records between ${range.from} and ${range.to}.`,
        });
        setLoading(false);
        return;
      }

      // Build rows
      const rows = appts.map((a: any) => {
        const slot = new Date(a.time_slot);
        const created = new Date(a.created_at);
        return [
          a.appointment_id || a.id?.slice(0, 8) || "",
          a.patient_name || "",
          a.mobile || "",
          a.email || "",
          a.age ?? "",
          a.gender || "",
          a.patient_type || "",
          a.department || "",
          a.consultation_type || "in-person",
          format(slot, "dd MMM yyyy"),
          format(slot, "hh:mm a"),
          (a.status || "").toUpperCase(),
          a.fee ?? "",
          a.address || "",
          a.notes || "",
          format(created, "dd MMM yyyy, hh:mm a"),
        ];
      });

      // Summary
      const byStatus: Record<string, number> = {};
      const byDept: Record<string, number> = {};
      let totalRevenue = 0;
      appts.forEach((a: any) => {
        const s = (a.status || "unknown").toLowerCase();
        byStatus[s] = (byStatus[s] || 0) + 1;
        const d = a.department || "Unassigned";
        byDept[d] = (byDept[d] || 0) + 1;
        if (a.status === "completed" && a.fee) totalRevenue += Number(a.fee);
      });

      const summaryAoA: any[][] = [
        ["Avira Hospital — Appointment Report"],
        [`Period: ${format(new Date(range.from), "dd MMM yyyy")} to ${format(new Date(range.to), "dd MMM yyyy")}`],
        [`Generated: ${format(new Date(), "dd MMM yyyy, hh:mm a")}`],
        [],
        ["Total Appointments", appts.length],
        ["Estimated Revenue (Completed)", `₹ ${totalRevenue.toLocaleString("en-IN")}`],
        [],
        ["Status Breakdown", "Count"],
        ...Object.entries(byStatus).map(([k, v]) => [k.toUpperCase(), v]),
        [],
        ["Department Breakdown", "Count"],
        ...Object.entries(byDept).map(([k, v]) => [k, v]),
      ];

      const wb = XLSX.utils.book_new();

      // Summary sheet
      const wsSummary = XLSX.utils.aoa_to_sheet(summaryAoA);
      wsSummary["!cols"] = [{ wch: 40 }, { wch: 25 }];
      wsSummary["!merges"] = [
        { s: { r: 0, c: 0 }, e: { r: 0, c: 1 } },
        { s: { r: 1, c: 0 }, e: { r: 1, c: 1 } },
        { s: { r: 2, c: 0 }, e: { r: 2, c: 1 } },
      ];
      // Style title
      if (wsSummary["A1"]) {
        wsSummary["A1"].s = {
          font: { bold: true, sz: 16, color: { rgb: "1F4E78" } },
          alignment: { horizontal: "center" },
        };
      }
      ["A2", "A3"].forEach((c) => {
        if (wsSummary[c]) wsSummary[c].s = { font: { italic: true, color: { rgb: "555555" } }, alignment: { horizontal: "center" } };
      });
      XLSX.utils.book_append_sheet(wb, wsSummary, "Summary");

      // Details sheet
      const wsData = XLSX.utils.aoa_to_sheet([HEADERS, ...rows]);
      wsData["!cols"] = HEADERS.map((h) => {
        const maxLen = Math.max(
          h.length,
          ...rows.map((r) => String(r[HEADERS.indexOf(h)] ?? "").length)
        );
        return { wch: Math.min(Math.max(maxLen + 2, 12), 40) };
      });
      wsData["!freeze"] = { xSplit: 0, ySplit: 1 } as any;
      if (!wsData["!rows"]) wsData["!rows"] = [];
      wsData["!rows"][0] = { hpt: 22 };

      // Style header row
      for (let c = 0; c < HEADERS.length; c++) {
        const addr = XLSX.utils.encode_cell({ r: 0, c });
        if (wsData[addr]) {
          wsData[addr].s = {
            font: { bold: true, color: { rgb: "FFFFFF" } },
            fill: { fgColor: { rgb: "1F4E78" } },
            alignment: { horizontal: "center", vertical: "center" },
            border: {
              top: { style: "thin", color: { rgb: "FFFFFF" } },
              bottom: { style: "thin", color: { rgb: "FFFFFF" } },
              left: { style: "thin", color: { rgb: "FFFFFF" } },
              right: { style: "thin", color: { rgb: "FFFFFF" } },
            },
          };
        }
      }

      // Style status cells (column L, index 11) + alternating rows
      for (let r = 1; r <= rows.length; r++) {
        const zebra = r % 2 === 0 ? "F2F7FB" : "FFFFFF";
        for (let c = 0; c < HEADERS.length; c++) {
          const addr = XLSX.utils.encode_cell({ r, c });
          if (!wsData[addr]) continue;
          wsData[addr].s = {
            fill: { fgColor: { rgb: zebra } },
            alignment: { vertical: "center", wrapText: true },
            border: {
              top: { style: "thin", color: { rgb: "E5E7EB" } },
              bottom: { style: "thin", color: { rgb: "E5E7EB" } },
              left: { style: "thin", color: { rgb: "E5E7EB" } },
              right: { style: "thin", color: { rgb: "E5E7EB" } },
            },
          };
        }
        // Overwrite status cell fill
        const statusAddr = XLSX.utils.encode_cell({ r, c: 11 });
        const statusVal = String(rows[r - 1][11] || "").toLowerCase();
        const fill = STATUS_FILL[statusVal];
        if (fill && wsData[statusAddr]) {
          wsData[statusAddr].s = {
            font: { bold: true },
            fill: { fgColor: { rgb: fill } },
            alignment: { horizontal: "center", vertical: "center" },
            border: {
              top: { style: "thin", color: { rgb: "E5E7EB" } },
              bottom: { style: "thin", color: { rgb: "E5E7EB" } },
              left: { style: "thin", color: { rgb: "E5E7EB" } },
              right: { style: "thin", color: { rgb: "E5E7EB" } },
            },
          };
        }
      }

      XLSX.utils.book_append_sheet(wb, wsData, "Appointments");

      const filename = `Avira-Appointments_${range.from}_to_${range.to}.xlsx`;
      XLSX.writeFile(wb, filename, { cellStyles: true });

      toast({
        title: "Report downloaded",
        description: `${appts.length} appointment${appts.length === 1 ? "" : "s"} exported to ${filename}`,
      });
      setOpen(false);
    } catch (err: any) {
      console.error("Excel export error:", err);
      toast({
        title: "Failed to generate report",
        description: err.message || "Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const setPreset = (kind: "prev-month" | "this-month" | "last-7" | "last-30") => {
    const now = new Date();
    let from: Date;
    let to: Date;
    if (kind === "prev-month") {
      from = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      to = new Date(now.getFullYear(), now.getMonth(), 0);
    } else if (kind === "this-month") {
      from = new Date(now.getFullYear(), now.getMonth(), 1);
      to = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    } else if (kind === "last-7") {
      to = now;
      from = new Date(now.getTime() - 6 * 24 * 60 * 60 * 1000);
    } else {
      to = now;
      from = new Date(now.getTime() - 29 * 24 * 60 * 60 * 1000);
    }
    setRange({ from: format(from, "yyyy-MM-dd"), to: format(to, "yyyy-MM-dd") });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2 border-primary/30 hover:bg-primary/5">
          <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
          <span className="hidden sm:inline">Generate Excel Report</span>
          <span className="sm:hidden">Report</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileSpreadsheet className="w-5 h-5 text-emerald-600" />
            Generate Appointment Report
          </DialogTitle>
          <DialogDescription>
            Select a date range. The report will be downloaded as an Excel file with a summary and detailed breakdown.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="flex flex-wrap gap-2">
            <Button size="sm" variant="secondary" onClick={() => setPreset("prev-month")}>Previous Month</Button>
            <Button size="sm" variant="secondary" onClick={() => setPreset("this-month")}>This Month</Button>
            <Button size="sm" variant="secondary" onClick={() => setPreset("last-7")}>Last 7 Days</Button>
            <Button size="sm" variant="secondary" onClick={() => setPreset("last-30")}>Last 30 Days</Button>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="from">From</Label>
              <Input
                id="from"
                type="date"
                value={range.from}
                onChange={(e) => setRange((p) => ({ ...p, from: e.target.value }))}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="to">To</Label>
              <Input
                id="to"
                type="date"
                value={range.to}
                onChange={(e) => setRange((p) => ({ ...p, to: e.target.value }))}
              />
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={() => setOpen(false)} disabled={loading}>
            Cancel
          </Button>
          <Button onClick={handleGenerate} disabled={loading} className="gap-2">
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> Generating...
              </>
            ) : (
              <>
                <Download className="w-4 h-4" /> Download Excel
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ExcelReportButton;
