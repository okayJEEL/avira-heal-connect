import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Megaphone, Plus, Trash2, AlertTriangle } from "lucide-react";
import { format } from "date-fns";
import { motion } from "framer-motion";

interface Announcement {
  id: string;
  title: string;
  content: string;
  priority: string;
  author_name: string;
  created_at: string;
  expires_at: string | null;
}

interface Props {
  isAdmin: boolean;
}

const AnnouncementsBoard = ({ isAdmin }: Props) => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [posting, setPosting] = useState(false);
  const [userId, setUserId] = useState("");
  const [userName, setUserName] = useState("");
  const { toast } = useToast();

  const [form, setForm] = useState({ title: "", content: "", priority: "normal" });

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserId(user.id);
        setUserName(user.user_metadata?.full_name || user.email || "Admin");
      }
      const { data } = await supabase
        .from("announcements")
        .select("*")
        .order("created_at", { ascending: false });
      setAnnouncements(data || []);
      setLoading(false);
    };
    init();
  }, []);

  const handlePost = async () => {
    if (!form.title.trim() || !form.content.trim()) return;
    setPosting(true);
    const { data, error } = await supabase.from("announcements").insert({
      title: form.title,
      content: form.content,
      priority: form.priority,
      author_id: userId,
      author_name: userName,
    }).select().single();

    if (error) {
      toast({ title: "Failed to post", variant: "destructive" });
    } else {
      toast({ title: "Announcement posted!" });
      setAnnouncements(prev => [data, ...prev]);
      setForm({ title: "", content: "", priority: "normal" });
      setShowForm(false);
    }
    setPosting(false);
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("announcements").delete().eq("id", id);
    if (error) {
      toast({ title: "Failed to delete", variant: "destructive" });
    } else {
      setAnnouncements(prev => prev.filter(a => a.id !== id));
      toast({ title: "Announcement deleted" });
    }
  };

  if (loading) return <p className="text-muted-foreground p-4">Loading...</p>;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-heading font-bold text-lg">Announcements</h3>
          <p className="text-sm text-muted-foreground">Internal notices for all staff</p>
        </div>
        {isAdmin && (
          <Button size="sm" onClick={() => setShowForm(!showForm)} className="gap-1">
            <Plus className="w-4 h-4" />
            New Announcement
          </Button>
        )}
      </div>

      {/* Post Form (admin only) */}
      {showForm && isAdmin && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
          <Card>
            <CardContent className="p-5 space-y-3">
              <div>
                <Label>Title *</Label>
                <Input value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} placeholder="Announcement title" />
              </div>
              <div>
                <Label>Content *</Label>
                <Textarea value={form.content} onChange={e => setForm(p => ({ ...p, content: e.target.value }))} placeholder="Write your announcement..." rows={3} />
              </div>
              <div>
                <Label>Priority</Label>
                <Select value={form.priority} onValueChange={v => setForm(p => ({ ...p, priority: v }))}>
                  <SelectTrigger className="w-[180px]"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="normal">Normal</SelectItem>
                    <SelectItem value="urgent">Urgent</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex gap-2">
                <Button onClick={handlePost} disabled={posting || !form.title.trim() || !form.content.trim()}>
                  {posting ? "Posting..." : "Post Announcement"}
                </Button>
                <Button variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Announcements List */}
      {announcements.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Megaphone className="w-12 h-12 text-muted-foreground/40 mx-auto mb-3" />
            <p className="text-muted-foreground">No announcements yet</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {announcements.map((ann, i) => (
            <motion.div key={ann.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <Card className={ann.priority === "urgent" ? "border-l-4 border-l-destructive" : ""}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        {ann.priority === "urgent" && <AlertTriangle className="w-4 h-4 text-destructive" />}
                        <h4 className="font-semibold text-foreground">{ann.title}</h4>
                        {ann.priority === "urgent" && (
                          <Badge variant="destructive" className="text-xs">Urgent</Badge>
                        )}
                      </div>
                      <p className="text-sm text-foreground whitespace-pre-wrap">{ann.content}</p>
                      <p className="text-xs text-muted-foreground mt-2">
                        Posted by {ann.author_name} • {format(new Date(ann.created_at), "dd MMM yyyy, hh:mm a")}
                      </p>
                    </div>
                    {isAdmin && (
                      <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-destructive" onClick={() => handleDelete(ann.id)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AnnouncementsBoard;
