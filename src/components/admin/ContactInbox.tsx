import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Mail, Phone, Clock, ChevronDown, ChevronUp, Send, Eye } from "lucide-react";
import { format } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";

interface ContactMessage {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  subject: string | null;
  message: string;
  status: string;
  reply_text: string | null;
  replied_at: string | null;
  created_at: string;
}

const ContactInbox = () => {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");
  const [replying, setReplying] = useState(false);
  const { toast } = useToast();

  const fetchMessages = async () => {
    const { data, error } = await supabase
      .from("contact_messages")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) {
      toast({ title: "Error loading messages", variant: "destructive" });
    } else {
      setMessages(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const markAsRead = async (id: string) => {
    await supabase.from("contact_messages").update({ status: "read" }).eq("id", id);
    setMessages(prev => prev.map(m => m.id === id ? { ...m, status: "read" } : m));
  };

  const handleReply = async (id: string) => {
    if (!replyText.trim()) return;
    setReplying(true);
    const { error } = await supabase
      .from("contact_messages")
      .update({ status: "replied", reply_text: replyText, replied_at: new Date().toISOString() })
      .eq("id", id);
    if (error) {
      toast({ title: "Failed to save reply", variant: "destructive" });
    } else {
      toast({ title: "Reply saved successfully" });
      setMessages(prev => prev.map(m => m.id === id ? { ...m, status: "replied", reply_text: replyText, replied_at: new Date().toISOString() } : m));
      setReplyText("");
      setExpandedId(null);
    }
    setReplying(false);
  };

  const toggleExpand = (msg: ContactMessage) => {
    if (expandedId === msg.id) {
      setExpandedId(null);
    } else {
      setExpandedId(msg.id);
      setReplyText(msg.reply_text || "");
      if (msg.status === "new") markAsRead(msg.id);
    }
  };

  const statusBadge = (status: string) => {
    switch (status) {
      case "new": return <Badge className="bg-blue-100 text-blue-700 border-blue-200">New</Badge>;
      case "read": return <Badge variant="outline">Read</Badge>;
      case "replied": return <Badge className="bg-green-100 text-green-700 border-green-200">Replied</Badge>;
      default: return <Badge variant="outline">{status}</Badge>;
    }
  };

  const newCount = messages.filter(m => m.status === "new").length;

  if (loading) return <p className="text-muted-foreground p-4">Loading inbox...</p>;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-heading font-bold text-lg">Contact Form Inbox</h3>
          <p className="text-sm text-muted-foreground">{messages.length} messages • {newCount} new</p>
        </div>
        <Button variant="outline" size="sm" onClick={fetchMessages}>Refresh</Button>
      </div>

      {messages.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Mail className="w-12 h-12 text-muted-foreground/40 mx-auto mb-3" />
            <p className="text-muted-foreground">No messages yet</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {messages.map((msg, i) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Card className={`cursor-pointer transition-all hover:shadow-md ${msg.status === "new" ? "border-l-4 border-l-blue-500" : ""}`}>
                <CardContent className="p-4" onClick={() => toggleExpand(msg)}>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-foreground">{msg.name}</span>
                        {statusBadge(msg.status)}
                      </div>
                      {msg.subject && <p className="text-sm font-medium text-foreground">{msg.subject}</p>}
                      <p className="text-sm text-muted-foreground truncate">{msg.message}</p>
                      <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                        {msg.email && <span className="flex items-center gap-1"><Mail className="w-3 h-3" />{msg.email}</span>}
                        {msg.phone && <span className="flex items-center gap-1"><Phone className="w-3 h-3" />{msg.phone}</span>}
                        <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{format(new Date(msg.created_at), "dd MMM yyyy, hh:mm a")}</span>
                      </div>
                    </div>
                    {expandedId === msg.id ? <ChevronUp className="w-5 h-5 text-muted-foreground" /> : <ChevronDown className="w-5 h-5 text-muted-foreground" />}
                  </div>

                  <AnimatePresence>
                    {expandedId === msg.id && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="mt-4 pt-4 border-t border-border space-y-3">
                          <div className="bg-muted/50 rounded-lg p-3">
                            <p className="text-sm font-medium text-foreground mb-1">Full Message:</p>
                            <p className="text-sm text-foreground whitespace-pre-wrap">{msg.message}</p>
                          </div>
                          {msg.reply_text && msg.status === "replied" && (
                            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                              <p className="text-sm font-medium text-green-700 mb-1">Your Reply:</p>
                              <p className="text-sm text-green-800">{msg.reply_text}</p>
                              {msg.replied_at && (
                                <p className="text-xs text-green-600 mt-1">Replied on {format(new Date(msg.replied_at), "dd MMM yyyy, hh:mm a")}</p>
                              )}
                            </div>
                          )}
                          <div>
                            <p className="text-sm font-medium text-foreground mb-1">{msg.status === "replied" ? "Update Reply:" : "Reply:"}</p>
                            <Textarea
                              value={replyText}
                              onChange={(e) => setReplyText(e.target.value)}
                              placeholder="Type your reply..."
                              rows={3}
                            />
                            <Button
                              size="sm"
                              className="mt-2 gap-1"
                              onClick={() => handleReply(msg.id)}
                              disabled={replying || !replyText.trim()}
                            >
                              <Send className="w-3 h-3" />
                              {replying ? "Saving..." : "Save Reply"}
                            </Button>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ContactInbox;
