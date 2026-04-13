import { useEffect, useState, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Send, MessageCircle } from "lucide-react";
import { format } from "date-fns";
import { motion } from "framer-motion";

interface ChatMessage {
  id: string;
  sender_id: string;
  sender_name: string;
  message: string;
  created_at: string;
}

const StaffChat = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [userId, setUserId] = useState("");
  const [userName, setUserName] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserId(user.id);
        setUserName(user.user_metadata?.full_name || user.email || "Staff");
      }

      const { data } = await supabase
        .from("internal_messages")
        .select("*")
        .order("created_at", { ascending: true })
        .limit(200);
      setMessages(data || []);
    };
    init();

    // Realtime subscription
    const channel = supabase
      .channel("staff-chat")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "internal_messages" },
        (payload) => {
          setMessages(prev => [...prev, payload.new as ChatMessage]);
        }
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!newMessage.trim() || !userId) return;
    setSending(true);
    const { error } = await supabase.from("internal_messages").insert({
      sender_id: userId,
      sender_name: userName,
      message: newMessage.trim(),
    });
    if (error) {
      toast({ title: "Failed to send", variant: "destructive" });
    }
    setNewMessage("");
    setSending(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <h3 className="font-heading font-bold text-lg">Internal Staff Chat</h3>
        <p className="text-sm text-muted-foreground">Real-time communication between staff, doctors & admin</p>
      </div>

      <Card className="flex flex-col" style={{ height: "500px" }}>
        <CardContent className="flex-1 overflow-y-auto p-4 space-y-3">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
              <MessageCircle className="w-12 h-12 mb-3 opacity-40" />
              <p>No messages yet. Start the conversation!</p>
            </div>
          ) : (
            messages.map((msg) => {
              const isMe = msg.sender_id === userId;
              return (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${isMe ? "justify-end" : "justify-start"}`}
                >
                  <div className={`max-w-[75%] rounded-2xl px-4 py-2.5 ${
                    isMe
                      ? "bg-primary text-primary-foreground rounded-br-sm"
                      : "bg-muted text-foreground rounded-bl-sm"
                  }`}>
                    {!isMe && (
                      <p className="text-xs font-semibold mb-0.5 opacity-70">{msg.sender_name}</p>
                    )}
                    <p className="text-sm whitespace-pre-wrap">{msg.message}</p>
                    <p className={`text-[10px] mt-1 ${isMe ? "text-primary-foreground/60" : "text-muted-foreground"}`}>
                      {format(new Date(msg.created_at), "hh:mm a")}
                    </p>
                  </div>
                </motion.div>
              );
            })
          )}
          <div ref={bottomRef} />
        </CardContent>

        <div className="p-3 border-t border-border flex gap-2">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a message..."
            className="flex-1"
          />
          <Button onClick={sendMessage} disabled={sending || !newMessage.trim()} size="icon">
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default StaffChat;
