import { useEffect, useMemo, useState } from "react";
import { format } from "date-fns";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Save, Trash2, CalendarDays, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

const WEEKDAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

interface WeeklyRow {
  weekday: number;
  is_available: boolean;
  start_time: string;
  end_time: string;
  slot_minutes: number;
}

interface OverrideRow {
  id?: string;
  doctor_id: string;
  date: string;
  type: "leave" | "custom";
  start_time: string | null;
  end_time: string | null;
  slot_minutes: number | null;
  note: string | null;
}

interface DoctorOption {
  id: string;
  name: string;
}

interface Props {
  currentUserId: string;
  isAdmin: boolean;
}

const defaultWeekly = (): WeeklyRow[] =>
  WEEKDAYS.map((_, i) => ({
    weekday: i,
    is_available: i !== 0, // closed Sunday by default
    start_time: "10:00",
    end_time: "13:00",
    slot_minutes: 15,
  }));

const DoctorAvailability = ({ currentUserId, isAdmin }: Props) => {
  const { toast } = useToast();
  const [doctors, setDoctors] = useState<DoctorOption[]>([]);
  const [selectedDoctor, setSelectedDoctor] = useState<string>("");
  const [weekly, setWeekly] = useState<WeeklyRow[]>(defaultWeekly());
  const [overrides, setOverrides] = useState<OverrideRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [dialogDate, setDialogDate] = useState<Date | null>(null);
  const [dialogType, setDialogType] = useState<"leave" | "custom">("leave");
  const [dialogStart, setDialogStart] = useState("10:00");
  const [dialogEnd, setDialogEnd] = useState("13:00");
  const [dialogSlot, setDialogSlot] = useState(15);
  const [dialogNote, setDialogNote] = useState("");

  // Load doctor list
  useEffect(() => {
    const loadDoctors = async () => {
      if (!isAdmin) {
        setSelectedDoctor(currentUserId);
        setDoctors([{ id: currentUserId, name: "Me" }]);
        return;
      }
      const { data: roles } = await supabase
        .from("user_roles")
        .select("user_id")
        .eq("role", "doctor");
      const ids = (roles || []).map((r) => r.user_id);
      if (ids.length === 0) {
        setDoctors([]);
        return;
      }
      const { data: profs } = await supabase
        .from("profiles")
        .select("id, full_name, email")
        .in("id", ids);
      const list: DoctorOption[] = (profs || []).map((p) => ({
        id: p.id,
        name: p.full_name || p.email || p.id.slice(0, 8),
      }));
      setDoctors(list);
      if (list.length > 0) setSelectedDoctor(list[0].id);
    };
    loadDoctors();
  }, [isAdmin, currentUserId]);

  // Load weekly + overrides for selected doctor
  useEffect(() => {
    if (!selectedDoctor) return;
    const load = async () => {
      setLoading(true);
      const [{ data: w }, { data: o }] = await Promise.all([
        supabase.from("doctor_weekly_availability").select("*").eq("doctor_id", selectedDoctor),
        supabase.from("doctor_date_overrides").select("*").eq("doctor_id", selectedDoctor),
      ]);
      const base = defaultWeekly();
      (w || []).forEach((row: any) => {
        base[row.weekday] = {
          weekday: row.weekday,
          is_available: row.is_available,
          start_time: row.start_time?.slice(0, 5) || "10:00",
          end_time: row.end_time?.slice(0, 5) || "13:00",
          slot_minutes: row.slot_minutes || 15,
        };
      });
      setWeekly(base);
      setOverrides(
        (o || []).map((r: any) => ({
          id: r.id,
          doctor_id: r.doctor_id,
          date: r.date,
          type: r.type,
          start_time: r.start_time?.slice(0, 5) || null,
          end_time: r.end_time?.slice(0, 5) || null,
          slot_minutes: r.slot_minutes,
          note: r.note,
        }))
      );
      setLoading(false);
    };
    load();
  }, [selectedDoctor]);

  const updateWeekly = (idx: number, patch: Partial<WeeklyRow>) => {
    setWeekly((prev) => prev.map((r, i) => (i === idx ? { ...r, ...patch } : r)));
  };

  const saveWeekly = async () => {
    if (!selectedDoctor) return;
    setSaving(true);
    const rows = weekly.map((r) => ({
      doctor_id: selectedDoctor,
      weekday: r.weekday,
      is_available: r.is_available,
      start_time: r.start_time,
      end_time: r.end_time,
      slot_minutes: r.slot_minutes,
    }));
    const { error } = await supabase
      .from("doctor_weekly_availability")
      .upsert(rows, { onConflict: "doctor_id,weekday" });
    setSaving(false);
    if (error) {
      toast({ title: "Save failed", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Weekly schedule saved" });
    }
  };

  const overrideMap = useMemo(() => {
    const m = new Map<string, OverrideRow>();
    overrides.forEach((o) => m.set(o.date, o));
    return m;
  }, [overrides]);

  const leaveDates = useMemo(
    () => overrides.filter((o) => o.type === "leave").map((o) => new Date(o.date + "T00:00:00")),
    [overrides]
  );
  const customDates = useMemo(
    () => overrides.filter((o) => o.type === "custom").map((o) => new Date(o.date + "T00:00:00")),
    [overrides]
  );

  const openDateDialog = (date: Date) => {
    const key = format(date, "yyyy-MM-dd");
    const existing = overrideMap.get(key);
    setDialogDate(date);
    if (existing) {
      setDialogType(existing.type);
      setDialogStart(existing.start_time || "10:00");
      setDialogEnd(existing.end_time || "13:00");
      setDialogSlot(existing.slot_minutes || 15);
      setDialogNote(existing.note || "");
    } else {
      setDialogType("leave");
      setDialogStart("10:00");
      setDialogEnd("13:00");
      setDialogSlot(15);
      setDialogNote("");
    }
  };

  const saveOverride = async () => {
    if (!dialogDate || !selectedDoctor) return;
    const key = format(dialogDate, "yyyy-MM-dd");
    const payload: any = {
      doctor_id: selectedDoctor,
      date: key,
      type: dialogType,
      note: dialogNote || null,
      start_time: dialogType === "custom" ? dialogStart : null,
      end_time: dialogType === "custom" ? dialogEnd : null,
      slot_minutes: dialogType === "custom" ? dialogSlot : null,
    };
    setSaving(true);
    const { error } = await supabase
      .from("doctor_date_overrides")
      .upsert(payload, { onConflict: "doctor_id,date" });
    setSaving(false);
    if (error) {
      toast({ title: "Save failed", description: error.message, variant: "destructive" });
      return;
    }
    toast({ title: "Date override saved" });
    // reload overrides
    const { data } = await supabase.from("doctor_date_overrides").select("*").eq("doctor_id", selectedDoctor);
    setOverrides(
      (data || []).map((r: any) => ({
        id: r.id,
        doctor_id: r.doctor_id,
        date: r.date,
        type: r.type,
        start_time: r.start_time?.slice(0, 5) || null,
        end_time: r.end_time?.slice(0, 5) || null,
        slot_minutes: r.slot_minutes,
        note: r.note,
      }))
    );
    setDialogDate(null);
  };

  const deleteOverride = async () => {
    if (!dialogDate || !selectedDoctor) return;
    const key = format(dialogDate, "yyyy-MM-dd");
    setSaving(true);
    const { error } = await supabase
      .from("doctor_date_overrides")
      .delete()
      .eq("doctor_id", selectedDoctor)
      .eq("date", key);
    setSaving(false);
    if (error) {
      toast({ title: "Delete failed", description: error.message, variant: "destructive" });
      return;
    }
    setOverrides((prev) => prev.filter((o) => o.date !== key));
    toast({ title: "Reset to weekly default" });
    setDialogDate(null);
  };

  const existingOverride = dialogDate ? overrideMap.get(format(dialogDate, "yyyy-MM-dd")) : null;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <CalendarDays className="w-5 h-5 text-primary" />
              Doctor Availability
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Manage weekly schedule and date-specific overrides.
            </p>
          </div>
          {isAdmin && doctors.length > 0 && (
            <div className="w-64">
              <Select value={selectedDoctor} onValueChange={setSelectedDoctor}>
                <SelectTrigger>
                  <SelectValue placeholder="Select doctor" />
                </SelectTrigger>
                <SelectContent>
                  {doctors.map((d) => (
                    <SelectItem key={d.id} value={d.id}>
                      {d.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </CardHeader>
      </Card>

      {!selectedDoctor ? (
        <Card><CardContent className="p-8 text-center text-muted-foreground">
          {isAdmin ? "No doctor accounts found. Create staff accounts with the 'doctor' role first." : "Loading..."}
        </CardContent></Card>
      ) : loading ? (
        <div className="flex justify-center p-8"><Loader2 className="w-6 h-6 animate-spin" /></div>
      ) : (
        <Tabs defaultValue="weekly">
          <TabsList className="grid w-full grid-cols-2 max-w-md">
            <TabsTrigger value="weekly">Weekly Schedule</TabsTrigger>
            <TabsTrigger value="calendar">Date Overrides</TabsTrigger>
          </TabsList>

          <TabsContent value="weekly" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Clock className="w-4 h-4" /> Weekly Working Hours
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {weekly.map((row, idx) => (
                  <div
                    key={row.weekday}
                    className={cn(
                      "grid grid-cols-12 gap-3 items-center p-3 rounded-lg border",
                      row.is_available ? "bg-card" : "bg-muted/40"
                    )}
                  >
                    <div className="col-span-12 sm:col-span-3 flex items-center gap-3">
                      <Switch
                        checked={row.is_available}
                        onCheckedChange={(v) => updateWeekly(idx, { is_available: v })}
                      />
                      <span className="font-medium">{WEEKDAYS[row.weekday]}</span>
                    </div>
                    <div className="col-span-4 sm:col-span-3">
                      <Label className="text-xs text-muted-foreground">Start</Label>
                      <Input
                        type="time"
                        value={row.start_time}
                        disabled={!row.is_available}
                        onChange={(e) => updateWeekly(idx, { start_time: e.target.value })}
                      />
                    </div>
                    <div className="col-span-4 sm:col-span-3">
                      <Label className="text-xs text-muted-foreground">End</Label>
                      <Input
                        type="time"
                        value={row.end_time}
                        disabled={!row.is_available}
                        onChange={(e) => updateWeekly(idx, { end_time: e.target.value })}
                      />
                    </div>
                    <div className="col-span-4 sm:col-span-3">
                      <Label className="text-xs text-muted-foreground">Slot (min)</Label>
                      <Input
                        type="number"
                        min={5}
                        max={120}
                        value={row.slot_minutes}
                        disabled={!row.is_available}
                        onChange={(e) => updateWeekly(idx, { slot_minutes: parseInt(e.target.value) || 15 })}
                      />
                    </div>
                  </div>
                ))}
                <div className="flex justify-end pt-2">
                  <Button onClick={saveWeekly} disabled={saving}>
                    {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                    Save Weekly Schedule
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="calendar" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Date-Specific Overrides</CardTitle>
                <p className="text-xs text-muted-foreground">
                  Click any date to mark leave or set custom hours.
                </p>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col lg:flex-row gap-6">
                  <div className="flex-shrink-0">
                    <Calendar
                      mode="single"
                      onSelect={(d) => d && openDateDialog(d)}
                      modifiers={{ leave: leaveDates, custom: customDates }}
                      modifiersClassNames={{
                        leave: "bg-destructive/20 text-destructive font-semibold",
                        custom: "bg-amber-200 text-amber-900 font-semibold",
                      }}
                      className={cn("p-3 pointer-events-auto rounded-md border")}
                    />
                    <div className="flex gap-3 mt-3 text-xs">
                      <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-destructive/30" /> Leave</span>
                      <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-amber-200" /> Custom hours</span>
                    </div>
                  </div>

                  <div className="flex-1 space-y-2">
                    <h4 className="font-medium text-sm">Upcoming overrides</h4>
                    {overrides.length === 0 && (
                      <p className="text-sm text-muted-foreground">No overrides set.</p>
                    )}
                    <div className="space-y-2 max-h-96 overflow-auto">
                      {[...overrides]
                        .sort((a, b) => a.date.localeCompare(b.date))
                        .map((o) => (
                          <div
                            key={o.date}
                            className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-muted/40 cursor-pointer"
                            onClick={() => openDateDialog(new Date(o.date + "T00:00:00"))}
                          >
                            <div>
                              <div className="font-medium">{format(new Date(o.date + "T00:00:00"), "EEE, dd MMM yyyy")}</div>
                              <div className="text-xs text-muted-foreground">
                                {o.type === "leave" ? "On leave" : `${o.start_time} – ${o.end_time} (${o.slot_minutes} min)`}
                                {o.note ? ` · ${o.note}` : ""}
                              </div>
                            </div>
                            <Badge variant={o.type === "leave" ? "destructive" : "secondary"}>{o.type}</Badge>
                          </div>
                        ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}

      <Dialog open={!!dialogDate} onOpenChange={(o) => !o && setDialogDate(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {dialogDate ? format(dialogDate, "EEE, dd MMM yyyy") : ""}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Type</Label>
              <Select value={dialogType} onValueChange={(v) => setDialogType(v as "leave" | "custom")}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="leave">Mark as leave (closed)</SelectItem>
                  <SelectItem value="custom">Custom hours</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {dialogType === "custom" && (
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <Label className="text-xs">Start</Label>
                  <Input type="time" value={dialogStart} onChange={(e) => setDialogStart(e.target.value)} />
                </div>
                <div>
                  <Label className="text-xs">End</Label>
                  <Input type="time" value={dialogEnd} onChange={(e) => setDialogEnd(e.target.value)} />
                </div>
                <div>
                  <Label className="text-xs">Slot (min)</Label>
                  <Input type="number" min={5} max={120} value={dialogSlot} onChange={(e) => setDialogSlot(parseInt(e.target.value) || 15)} />
                </div>
              </div>
            )}
            <div>
              <Label className="text-xs">Note (optional)</Label>
              <Textarea rows={2} value={dialogNote} onChange={(e) => setDialogNote(e.target.value)} placeholder="Reason / remarks" />
            </div>
          </div>
          <DialogFooter className="flex justify-between sm:justify-between">
            <div>
              {existingOverride && (
                <Button variant="outline" onClick={deleteOverride} disabled={saving}>
                  <Trash2 className="w-4 h-4 mr-2" /> Reset to default
                </Button>
              )}
            </div>
            <div className="flex gap-2">
              <Button variant="ghost" onClick={() => setDialogDate(null)}>Cancel</Button>
              <Button onClick={saveOverride} disabled={saving}>
                {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                Save
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DoctorAvailability;
