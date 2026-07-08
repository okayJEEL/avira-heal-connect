import { useEffect, useMemo, useState } from "react";
import { format } from "date-fns";
import { supabase } from "@/integrations/supabase/client";
import { doctors } from "@/components/DoctorsSection";
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
import { Loader2, Save, Trash2, CalendarDays, Clock, Copy, CalendarRange, AlertTriangle, ChevronDown, ChevronUp } from "lucide-react";
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

interface Props {
  currentUserId: string;
  isAdmin: boolean;
}

const defaultWeekly = (): WeeklyRow[] =>
  WEEKDAYS.map((_, i) => ({
    weekday: i,
    is_available: i !== 0,
    start_time: "10:00",
    end_time: "13:00",
    slot_minutes: 15,
  }));

// Compute number of bookable slots for a weekday config
const slotCount = (row: WeeklyRow): number => {
  if (!row.is_available) return 0;
  const [sh, sm] = row.start_time.split(":").map(Number);
  const [eh, em] = row.end_time.split(":").map(Number);
  const mins = eh * 60 + em - (sh * 60 + sm);
  if (mins <= 0 || !row.slot_minutes) return 0;
  return Math.floor(mins / row.slot_minutes);
};

const todayStr = () => format(new Date(), "yyyy-MM-dd");

const DoctorAvailability = ({ currentUserId, isAdmin }: Props) => {
  const { toast } = useToast();
  const [selectedDoctor, setSelectedDoctor] = useState<string>("");
  const [mySlug, setMySlug] = useState<string | null>(null);
  const [mappingLoaded, setMappingLoaded] = useState(false);

  // Admin mapping UI state
  const [doctorUsers, setDoctorUsers] = useState<{ id: string; name: string; slug: string | null }[]>([]);

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
  const [dialogBookings, setDialogBookings] = useState<number>(0);

  // Multi-day leave state
  const [rangeFrom, setRangeFrom] = useState("");
  const [rangeTo, setRangeTo] = useState("");
  const [rangeNote, setRangeNote] = useState("");
  const [savingRange, setSavingRange] = useState(false);

  // Toggle for past overrides
  const [showPast, setShowPast] = useState(false);

  // Determine current user's doctor mapping (for non-admin doctors)
  useEffect(() => {
    const loadMapping = async () => {
      const { data } = await supabase
        .from("doctor_profiles")
        .select("doctor_slug")
        .eq("user_id", currentUserId)
        .maybeSingle();
      const slug = (data as any)?.doctor_slug || null;
      setMySlug(slug);
      setMappingLoaded(true);
      if (isAdmin) {
        setSelectedDoctor(doctors[0]?.id || "");
      } else if (slug) {
        setSelectedDoctor(slug);
      }
    };
    loadMapping();
  }, [currentUserId, isAdmin]);

  // Admins: load doctor staff accounts + current mapping for the mapping UI
  useEffect(() => {
    if (!isAdmin) return;
    const load = async () => {
      const { data: roles } = await supabase
        .from("user_roles")
        .select("user_id")
        .eq("role", "doctor");
      const ids = (roles || []).map((r: any) => r.user_id);
      if (ids.length === 0) {
        setDoctorUsers([]);
        return;
      }
      const [{ data: profs }, { data: maps }] = await Promise.all([
        supabase.from("profiles").select("id, full_name, email").in("id", ids),
        supabase.from("doctor_profiles").select("user_id, doctor_slug").in("user_id", ids),
      ]);
      const slugByUser = new Map<string, string>();
      (maps || []).forEach((m: any) => slugByUser.set(m.user_id, m.doctor_slug));
      setDoctorUsers(
        (profs || []).map((p: any) => ({
          id: p.id,
          name: p.full_name || p.email || p.id.slice(0, 8),
          slug: slugByUser.get(p.id) || null,
        }))
      );
    };
    load();
  }, [isAdmin]);

  const assignSlugToUser = async (userId: string, slug: string | "none") => {
    if (slug === "none") {
      const { error } = await supabase.from("doctor_profiles").delete().eq("user_id", userId);
      if (error) {
        toast({ title: "Failed", description: error.message, variant: "destructive" });
        return;
      }
    } else {
      // Remove any previous owner of this slug, then upsert mapping for this user
      await supabase.from("doctor_profiles").delete().eq("doctor_slug", slug);
      const { error } = await supabase
        .from("doctor_profiles")
        .upsert({ user_id: userId, doctor_slug: slug }, { onConflict: "user_id" });
      if (error) {
        toast({ title: "Failed", description: error.message, variant: "destructive" });
        return;
      }
    }
    setDoctorUsers((prev) =>
      prev.map((d) => {
        if (d.id === userId) return { ...d, slug: slug === "none" ? null : slug };
        // Clear slug from anyone else who had it
        if (slug !== "none" && d.slug === slug && d.id !== userId) return { ...d, slug: null };
        return d;
      })
    );
    toast({ title: "Doctor link updated" });
  };


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
    // Delete + re-insert to keep things simple (no unique index on text+smallint guaranteed)
    await supabase.from("doctor_weekly_availability").delete().eq("doctor_id", selectedDoctor);
    const rows = weekly.map((r) => ({
      doctor_id: selectedDoctor,
      weekday: r.weekday,
      is_available: r.is_available,
      start_time: r.start_time,
      end_time: r.end_time,
      slot_minutes: r.slot_minutes,
    }));
    const { error } = await supabase.from("doctor_weekly_availability").insert(rows);
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

  const reloadOverrides = async () => {
    const { data } = await supabase
      .from("doctor_date_overrides")
      .select("*")
      .eq("doctor_id", selectedDoctor);
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
  };

  const saveOverride = async () => {
    if (!dialogDate || !selectedDoctor) return;
    const key = format(dialogDate, "yyyy-MM-dd");
    setSaving(true);
    // Delete any existing then insert (avoids needing a unique constraint on text column)
    await supabase
      .from("doctor_date_overrides")
      .delete()
      .eq("doctor_id", selectedDoctor)
      .eq("date", key);
    const payload: any = {
      doctor_id: selectedDoctor,
      date: key,
      type: dialogType,
      note: dialogNote || null,
      start_time: dialogType === "custom" ? dialogStart : null,
      end_time: dialogType === "custom" ? dialogEnd : null,
      slot_minutes: dialogType === "custom" ? dialogSlot : null,
    };
    const { error } = await supabase.from("doctor_date_overrides").insert(payload);
    setSaving(false);
    if (error) {
      toast({ title: "Save failed", description: error.message, variant: "destructive" });
      return;
    }
    toast({ title: "Date override saved" });
    await reloadOverrides();
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

  // Non-admin doctor without a mapping yet
  if (!isAdmin && mappingLoaded && !mySlug) {
    return (
      <Card>
        <CardContent className="p-8 text-center text-muted-foreground space-y-2">
          <p className="font-medium text-foreground">Your account is not linked to a doctor profile yet.</p>
          <p className="text-sm">Ask an admin to link your account to a doctor (Dr. Vivek or Dr. Preeti) from the Availability tab.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between flex-wrap gap-3">
          <div>
            <CardTitle className="flex items-center gap-2">
              <CalendarDays className="w-5 h-5 text-primary" />
              Doctor Availability
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              {isAdmin
                ? "Set weekly hours and block specific dates. Affects what slots patients can book."
                : `Editing your schedule (${doctors.find((d) => d.id === mySlug)?.name || mySlug}).`}
            </p>
          </div>
          {isAdmin && (
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

      {isAdmin && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Doctor Account Links</CardTitle>
            <p className="text-xs text-muted-foreground">
              Link each doctor's staff login to a doctor on the website so they can edit their own availability.
            </p>
          </CardHeader>
          <CardContent className="space-y-2">
            {doctorUsers.length === 0 ? (
              <p className="text-sm text-muted-foreground">No staff accounts with the "doctor" role yet.</p>
            ) : (
              doctorUsers.map((u) => (
                <div key={u.id} className="flex items-center justify-between gap-3 p-3 rounded-lg border">
                  <div className="min-w-0">
                    <div className="font-medium truncate">{u.name}</div>
                    <div className="text-xs text-muted-foreground truncate">
                      {u.slug ? `Linked to ${doctors.find((d) => d.id === u.slug)?.name || u.slug}` : "Not linked"}
                    </div>
                  </div>
                  <div className="w-56">
                    <Select value={u.slug || "none"} onValueChange={(v) => assignSlugToUser(u.id, v)}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">Not linked</SelectItem>
                        {doctors.map((d) => (
                          <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      )}


      {loading ? (
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
