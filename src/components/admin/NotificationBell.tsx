import { useEffect, useState, useRef, useCallback } from "react";
import { Bell, Check, CheckCheck } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { formatDistanceToNow } from "date-fns";

interface StaffNotification {
  id: string;
  user_id: string;
  appointment_id: string | null;
  title: string;
  message: string;
  read: boolean;
  created_at: string;
}

/**
 * Generate a short notification beep using Web Audio API.
 * This avoids needing an external file and works reliably
 * once the AudioContext has been unlocked by a user gesture.
 */
let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  return audioCtx;
}

function unlockAudio() {
  try {
    const ctx = getAudioContext();
    if (ctx.state === "suspended") ctx.resume();
  } catch {}
}

function playNotificationSound() {
  try {
    const ctx = getAudioContext();
    if (ctx.state === "suspended") {
      ctx.resume();
    }

    // Create a pleasant two-tone notification beep
    const now = ctx.currentTime;

    // First tone
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = "sine";
    osc1.frequency.setValueAtTime(830, now);
    gain1.gain.setValueAtTime(0.3, now);
    gain1.gain.exponentialRampToValueAtTime(0.01, now + 0.15);
    osc1.connect(gain1).connect(ctx.destination);
    osc1.start(now);
    osc1.stop(now + 0.15);

    // Second tone (higher)
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = "sine";
    osc2.frequency.setValueAtTime(1050, now + 0.12);
    gain2.gain.setValueAtTime(0.3, now + 0.12);
    gain2.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
    osc2.connect(gain2).connect(ctx.destination);
    osc2.start(now + 0.12);
    osc2.stop(now + 0.3);
  } catch (e) {
    console.warn("Could not play notification sound:", e);
  }
}

const NotificationBell = ({ userId }: { userId: string }) => {
  const [notifications, setNotifications] = useState<StaffNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Unlock AudioContext on first user interaction with the page
  useEffect(() => {
    const handler = () => unlockAudio();
    document.addEventListener("click", handler, { once: true });
    document.addEventListener("keydown", handler, { once: true });
    return () => {
      document.removeEventListener("click", handler);
      document.removeEventListener("keydown", handler);
    };
  }, []);

  // Request browser notification permission
  useEffect(() => {
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission();
    }
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Fetch notifications
  const fetchNotifications = useCallback(async () => {
    const { data } = await supabase
      .from("staff_notifications")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(30);
    if (data) {
      setNotifications(data as StaffNotification[]);
      setUnreadCount((data as StaffNotification[]).filter((n) => !n.read).length);
    }
  }, [userId]);

  useEffect(() => {
    if (!userId) return;
    fetchNotifications();
  }, [userId, fetchNotifications]);

  // Realtime subscription
  useEffect(() => {
    if (!userId) return;
    const channel = supabase
      .channel("staff-notifications-" + userId)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "staff_notifications",
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          const newNotif = payload.new as StaffNotification;
          setNotifications((prev) => [newNotif, ...prev].slice(0, 30));
          setUnreadCount((prev) => prev + 1);

          // Play notification sound (Web Audio API)
          playNotificationSound();

          // Browser notification when tab is hidden
          if (
            "Notification" in window &&
            Notification.permission === "granted" &&
            document.hidden
          ) {
            new Notification(newNotif.title, {
              body: newNotif.message,
              icon: "/favicon.ico",
            });
          }
        }
      )
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "staff_notifications",
          filter: `user_id=eq.${userId}`,
        },
        () => {
          fetchNotifications();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId, fetchNotifications]);

  const markAsRead = async (id: string) => {
    await supabase
      .from("staff_notifications")
      .update({ read: true })
      .eq("id", id);
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
    setUnreadCount((prev) => Math.max(0, prev - 1));
  };

  const markAllAsRead = async () => {
    await supabase
      .from("staff_notifications")
      .update({ read: true })
      .eq("user_id", userId)
      .eq("read", false);
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    setUnreadCount(0);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setOpen(!open)}
        className="relative p-2 rounded-full hover:bg-muted transition-colors"
        aria-label="Notifications"
      >
        <Bell className="w-5 h-5 text-foreground" />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 flex items-center justify-center min-w-[18px] h-[18px] rounded-full bg-destructive text-destructive-foreground text-[10px] font-bold px-1 animate-pulse">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-80 sm:w-96 bg-card border rounded-lg shadow-lg z-50">
          <div className="flex items-center justify-between p-3 border-b">
            <h3 className="font-semibold text-sm">Notifications</h3>
            {unreadCount > 0 && (
              <Button variant="ghost" size="sm" onClick={markAllAsRead} className="text-xs h-7">
                <CheckCheck className="w-3.5 h-3.5 mr-1" /> Mark all read
              </Button>
            )}
          </div>
          <ScrollArea className="max-h-80">
            {notifications.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">
                No notifications yet
              </p>
            ) : (
              notifications.map((n) => (
                <div
                  key={n.id}
                  className={`flex items-start gap-3 p-3 border-b last:border-b-0 hover:bg-muted/50 transition-colors ${
                    !n.read ? "bg-primary/5" : ""
                  }`}
                >
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm ${!n.read ? "font-semibold" : ""}`}>
                      {n.title}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5 truncate">
                      {n.message}
                    </p>
                    <p className="text-[10px] text-muted-foreground mt-1">
                      {formatDistanceToNow(new Date(n.created_at), {
                        addSuffix: true,
                      })}
                    </p>
                  </div>
                  {!n.read && (
                    <button
                      onClick={() => markAsRead(n.id)}
                      className="shrink-0 p-1 rounded hover:bg-muted"
                      title="Mark as read"
                    >
                      <Check className="w-3.5 h-3.5 text-primary" />
                    </button>
                  )}
                </div>
              ))
            )}
          </ScrollArea>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
