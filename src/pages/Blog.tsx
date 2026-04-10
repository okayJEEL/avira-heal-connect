import { useState, useEffect } from "react";
import { Calendar, Clock, ArrowRight, User, Tag } from "lucide-react";
import { motion } from "framer-motion";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  category: string;
  read_time: string;
  created_at: string;
}

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.15 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" as const },
  },
};

const Blog = () => {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      const { data } = await supabase
        .from("blog_posts")
        .select("*")
        .eq("published", true)
        .order("created_at", { ascending: false });
      setBlogPosts((data as BlogPost[]) || []);
      setLoading(false);
    };
    fetchPosts();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen">
        <Header />
        <div className="flex items-center justify-center py-32">
          <p className="text-muted-foreground">Loading blog posts...</p>
        </div>
        <Footer />
      </div>
    );
  }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="min-h-screen">
      <Header />

      {/* Hero */}
      <section className="section-padding bg-gradient-to-br from-primary/10 via-background to-accent/20">
        <div className="container-custom max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Badge variant="secondary" className="mb-4 text-sm px-4 py-1">
              <Tag className="w-3.5 h-3.5 mr-1.5" />
              Health & Wellness
            </Badge>
            <h1 className="text-3xl md:text-5xl font-heading font-bold mb-3 text-foreground">
              Health Blog
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Expert articles, health tips, and medical insights from our
              specialist doctors to help you live a healthier life.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Blog Grid */}
      <section className="section-padding bg-background">
        {blogPosts.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-muted-foreground">No blog posts available yet.</p>
          </div>
        ) : (
          <motion.div
            className="container-custom max-w-6xl"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
          >
            {/* Featured Post (first) */}
            <motion.article
              variants={cardVariants}
              className="mb-12 group cursor-pointer"
              onClick={() =>
                setExpandedId(expandedId === blogPosts[0].id ? null : blogPosts[0].id)
              }
            >
              <div className="rounded-2xl overflow-hidden bg-card shadow-lg border border-border hover:shadow-xl transition-shadow duration-300">
                <div className="p-6 md:p-8 flex flex-col justify-center">
                  <div className="flex items-center gap-3 mb-3">
                    <Badge className="bg-primary/10 text-primary border-0 hover:bg-primary/20">
                      {blogPosts[0].category}
                    </Badge>
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {formatDate(blogPosts[0].created_at)}
                    </span>
                  </div>
                  <h2 className="text-xl md:text-2xl font-heading font-bold text-foreground mb-3 group-hover:text-primary transition-colors">
                    {blogPosts[0].title}
                  </h2>
                  <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                    {blogPosts[0].excerpt}
                  </p>
                  {expandedId === blogPosts[0].id && (
                    <motion.p
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="text-muted-foreground text-sm leading-relaxed mb-4"
                    >
                      {blogPosts[0].content}
                    </motion.p>
                  )}
                  <div className="flex items-center justify-between mt-auto">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <User className="w-3.5 h-3.5" />
                      {blogPosts[0].author}
                      <span className="mx-1">•</span>
                      <Clock className="w-3.5 h-3.5" />
                      {blogPosts[0].read_time}
                    </div>
                    <Button variant="ghost" size="sm" className="text-primary gap-1">
                      {expandedId === blogPosts[0].id ? "Read less" : "Read more"}
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </motion.article>

            {/* Remaining posts grid */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {blogPosts.slice(1).map((post) => (
                <motion.article
                  key={post.id}
                  variants={cardVariants}
                  className="group cursor-pointer rounded-2xl overflow-hidden bg-card shadow-md border border-border hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                  onClick={() =>
                    setExpandedId(expandedId === post.id ? null : post.id)
                  }
                >
                  <div className="p-5">
                    <div className="flex items-center gap-2 mb-3">
                      <Badge className="bg-primary/10 text-primary border-0 text-[11px] hover:bg-primary/20">
                        {post.category}
                      </Badge>
                      <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {formatDate(post.created_at)}
                      </span>
                    </div>
                    <h3 className="text-base font-heading font-bold text-foreground mb-2 group-hover:text-primary transition-colors line-clamp-2">
                      {post.title}
                    </h3>
                    <p className="text-muted-foreground text-sm leading-relaxed mb-3 line-clamp-3">
                      {post.excerpt}
                    </p>
                    {expandedId === post.id && (
                      <motion.p
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="text-muted-foreground text-sm leading-relaxed mb-3"
                      >
                        {post.content}
                      </motion.p>
                    )}
                    <div className="flex items-center justify-between pt-3 border-t border-border">
                      <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                        <User className="w-3 h-3" />
                        {post.author}
                      </div>
                      <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
                        <Clock className="w-3 h-3" />
                        {post.read_time}
                      </div>
                    </div>
                  </div>
                </motion.article>
              ))}
            </div>
          </motion.div>
        )}
      </section>

      <Footer />
    </div>
  );
};

export default Blog;
