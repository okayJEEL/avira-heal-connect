import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Plus, Trash2, Edit2, Eye, EyeOff, Calendar, Clock, User, ChevronDown, ChevronUp, FileText } from "lucide-react";
import { format } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  category: string;
  read_time: string;
  published: boolean;
  created_at: string;
}

const CATEGORIES = [
  "Diabetes Care",
  "Heart & General Medicine",
  "Seasonal Health",
  "Aesthetic Medicine",
  "Cosmetology",
  "General Medicine",
];

const AUTHORS = ["Dr. Vivek Sidhapura", "Dr. Preeti Sidhapura"];

const BlogManagement = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    excerpt: "",
    content: "",
    author: AUTHORS[0],
    category: CATEGORIES[0],
    read_time: "5 min read",
    published: true,
  });
  const { toast } = useToast();

  const fetchPosts = async () => {
    const { data, error } = await supabase
      .from("blog_posts")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      setPosts((data as BlogPost[]) || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const resetForm = () => {
    setFormData({
      title: "",
      excerpt: "",
      content: "",
      author: AUTHORS[0],
      category: CATEGORIES[0],
      read_time: "5 min read",
      published: true,
    });
    setEditingId(null);
    setShowForm(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.excerpt || !formData.content) {
      toast({ title: "Error", description: "Please fill all required fields", variant: "destructive" });
      return;
    }

    if (editingId) {
      const { error } = await supabase
        .from("blog_posts")
        .update(formData)
        .eq("id", editingId);
      if (error) {
        toast({ title: "Error", description: error.message, variant: "destructive" });
      } else {
        toast({ title: "Success", description: "Blog post updated successfully" });
        resetForm();
        fetchPosts();
      }
    } else {
      const { error } = await supabase
        .from("blog_posts")
        .insert([formData]);
      if (error) {
        toast({ title: "Error", description: error.message, variant: "destructive" });
      } else {
        toast({ title: "Success", description: "Blog post added successfully" });
        resetForm();
        fetchPosts();
      }
    }
  };

  const handleEdit = (post: BlogPost) => {
    setFormData({
      title: post.title,
      excerpt: post.excerpt,
      content: post.content,
      author: post.author,
      category: post.category,
      read_time: post.read_time,
      published: post.published,
    });
    setEditingId(post.id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this blog post?")) return;
    const { error } = await supabase.from("blog_posts").delete().eq("id", id);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Success", description: "Blog post deleted" });
      fetchPosts();
    }
  };

  const togglePublish = async (id: string, current: boolean) => {
    const { error } = await supabase
      .from("blog_posts")
      .update({ published: !current })
      .eq("id", id);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Success", description: `Blog post ${!current ? "published" : "unpublished"}` });
      fetchPosts();
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with Add button */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-heading font-bold text-foreground">Blog Posts</h3>
          <p className="text-sm text-muted-foreground">{posts.length} total posts</p>
        </div>
        <Button
          onClick={() => { showForm ? resetForm() : setShowForm(true); }}
          className={showForm ? "bg-muted text-foreground hover:bg-muted/80" : ""}
        >
          <Plus className="w-4 h-4 mr-2" />
          {showForm ? "Cancel" : "Add New Blog"}
        </Button>
      </div>

      {/* Add/Edit Form */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="border-primary/30">
              <CardHeader>
                <CardTitle className="text-base">
                  {editingId ? "Edit Blog Post" : "Add New Blog Post"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="title">Title *</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder="Enter blog title"
                      className="mt-1"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label>Author *</Label>
                      <Select value={formData.author} onValueChange={(v) => setFormData({ ...formData, author: v })}>
                        <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          {AUTHORS.map(a => <SelectItem key={a} value={a}>{a}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Category *</Label>
                      <Select value={formData.category} onValueChange={(v) => setFormData({ ...formData, category: v })}>
                        <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          {CATEGORIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="read_time">Read Time</Label>
                      <Input
                        id="read_time"
                        value={formData.read_time}
                        onChange={(e) => setFormData({ ...formData, read_time: e.target.value })}
                        placeholder="e.g. 5 min read"
                        className="mt-1"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="excerpt">Excerpt / Summary *</Label>
                    <Textarea
                      id="excerpt"
                      value={formData.excerpt}
                      onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                      placeholder="Short summary of the blog post (shown in the blog card)"
                      className="mt-1"
                      rows={3}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="content">Full Content *</Label>
                    <Textarea
                      id="content"
                      value={formData.content}
                      onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                      placeholder="Full blog content (shown when user clicks 'Read more')"
                      className="mt-1"
                      rows={6}
                      required
                    />
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <label className="flex items-center gap-2 text-sm cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.published}
                        onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                        className="rounded border-border"
                      />
                      Publish immediately
                    </label>
                    <Button type="submit">
                      {editingId ? "Update Blog Post" : "Add Blog Post"}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Blog Posts List */}
      {loading ? (
        <p className="text-muted-foreground text-center py-8">Loading blog posts...</p>
      ) : posts.length === 0 ? (
        <div className="text-center py-12">
          <FileText className="w-12 h-12 text-muted-foreground/40 mx-auto mb-3" />
          <p className="text-muted-foreground">No blog posts yet. Add your first one!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {posts.map((post) => (
            <Card key={post.id} className="border-l-4 border-l-primary/60 hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-4">
                  <div
                    className="flex-1 cursor-pointer"
                    onClick={() => setExpandedId(expandedId === post.id ? null : post.id)}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <Badge className="bg-primary/10 text-primary border-0 text-[11px]">
                        {post.category}
                      </Badge>
                      {!post.published && (
                        <Badge variant="outline" className="text-[11px] text-orange-600 border-orange-300">
                          Draft
                        </Badge>
                      )}
                      <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {format(new Date(post.created_at), "dd MMM yyyy")}
                      </span>
                    </div>
                    <h4 className="font-semibold text-foreground text-sm">{post.title}</h4>
                    <div className="flex items-center gap-3 mt-1 text-[11px] text-muted-foreground">
                      <span className="flex items-center gap-1"><User className="w-3 h-3" />{post.author}</span>
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{post.read_time}</span>
                    </div>

                    {expandedId === post.id && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        className="mt-3 space-y-2"
                      >
                        <p className="text-sm text-muted-foreground"><strong>Excerpt:</strong> {post.excerpt}</p>
                        <p className="text-sm text-muted-foreground"><strong>Content:</strong> {post.content}</p>
                      </motion.div>
                    )}
                  </div>

                  <div className="flex items-center gap-1 flex-shrink-0">
                    <Button variant="ghost" size="sm" onClick={() => setExpandedId(expandedId === post.id ? null : post.id)}>
                      {expandedId === post.id ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => togglePublish(post.id, post.published)} title={post.published ? "Unpublish" : "Publish"}>
                      {post.published ? <Eye className="w-4 h-4 text-green-600" /> : <EyeOff className="w-4 h-4 text-orange-500" />}
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleEdit(post)}>
                      <Edit2 className="w-4 h-4 text-primary" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleDelete(post.id)}>
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default BlogManagement;
