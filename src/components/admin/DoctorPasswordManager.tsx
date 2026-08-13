import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { KeyRound, ShieldCheck, Eye, EyeOff, Loader2, RefreshCw, Copy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface DoctorAccount {
  name: string;
  email: string;
  image: string;
}

const generatePassword = () => {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789@#$%";
  return Array.from(
    { length: 12 },
    () => chars[Math.floor(Math.random() * chars.length)]
  ).join("");
};

const DoctorPasswordManager = ({ doctors }: { doctors: DoctorAccount[] }) => {
  const { toast } = useToast();
  const [openFor, setOpenFor] = useState<DoctorAccount | null>(null);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [show, setShow] = useState(false);
  const [saving, setSaving] = useState(false);

  const reset = () => {
    setPassword("");
    setConfirm("");
    setShow(false);
  };

  const handleSubmit = async () => {
    if (!openFor) return;
    if (password.length < 8) {
      toast({ title: "Password too short", description: "Use at least 8 characters.", variant: "destructive" });
      return;
    }
    if (password !== confirm) {
      toast({ title: "Passwords do not match", variant: "destructive" });
      return;
    }
    setSaving(true);
    const { data, error } = await supabase.functions.invoke("admin-reset-doctor-password", {
      body: { email: openFor.email, password },
    });
    setSaving(false);

    const errMsg = (error as any)?.message || (data as any)?.error;
    if (error || (data as any)?.error) {
      toast({ title: "Could not update password", description: errMsg, variant: "destructive" });
      return;
    }

    toast({
      title: "Password updated",
      description: `${openFor.name} can now sign in with the new password.`,
    });
    setOpenFor(null);
    reset();
  };

  return (
    <Card className="border-primary/20">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
          <ShieldCheck className="w-5 h-5 text-primary" />
          Doctor Login Credentials
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Admin only — set or reset the staff portal password for each doctor.
        </p>
      </CardHeader>
      <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {doctors.map((doc) => (
          <div
            key={doc.email}
            className="flex items-center gap-3 rounded-xl border bg-card p-3 sm:p-4"
          >
            <img
              src={doc.image}
              alt={doc.name}
              className="w-12 h-12 rounded-full object-cover flex-shrink-0"
            />
            <div className="min-w-0 flex-1">
              <p className="font-semibold text-foreground truncate">{doc.name}</p>
              <p className="text-xs text-muted-foreground truncate">{doc.email}</p>
              <Badge variant="secondary" className="mt-1 text-[10px]">Doctor account</Badge>
            </div>
            <Button
              size="sm"
              variant="outline"
              className="flex-shrink-0 gap-1"
              onClick={() => {
                reset();
                setOpenFor(doc);
              }}
            >
              <KeyRound className="w-4 h-4" />
              <span className="hidden sm:inline">Reset</span>
            </Button>
          </div>
        ))}
      </CardContent>

      <Dialog
        open={!!openFor}
        onOpenChange={(o) => {
          if (!o) {
            setOpenFor(null);
            reset();
          }
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <KeyRound className="w-5 h-5 text-primary" />
              Reset password
            </DialogTitle>
            <DialogDescription>
              Set a new staff portal password for {openFor?.name} ({openFor?.email}).
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="new-pass">New password</Label>
              <div className="relative">
                <Input
                  id="new-pass"
                  type={show ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 8 characters"
                  className="pr-10"
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => setShow((s) => !s)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground"
                  aria-label={show ? "Hide password" : "Show password"}
                >
                  {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirm-pass">Confirm password</Label>
              <Input
                id="confirm-pass"
                type={show ? "text" : "password"}
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                placeholder="Re-enter password"
                autoComplete="new-password"
              />
            </div>

            <div className="flex flex-wrap gap-2">
              <Button
                type="button"
                variant="secondary"
                size="sm"
                className="gap-1"
                onClick={() => {
                  const p = generatePassword();
                  setPassword(p);
                  setConfirm(p);
                  setShow(true);
                }}
              >
                <RefreshCw className="w-4 h-4" />
                Generate strong password
              </Button>
              {password && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="gap-1"
                  onClick={() => {
                    navigator.clipboard?.writeText(password);
                    toast({ title: "Copied to clipboard" });
                  }}
                >
                  <Copy className="w-4 h-4" />
                  Copy
                </Button>
              )}
            </div>

            <p className="text-xs text-muted-foreground">
              Share the new password with the doctor securely. They can sign in immediately at the staff portal.
            </p>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setOpenFor(null)} disabled={saving}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={saving}>
              {saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Update password
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default DoctorPasswordManager;
