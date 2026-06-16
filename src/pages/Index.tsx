import { Link } from "react-router-dom";
import { posts } from "@/data/posts";
import PostCard from "@/components/PostCard";
const Index = () => {
  const latestPosts = [...posts]
  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  .slice(0, 3);

  const allTags = [...new Set(posts.flatMap((p) => p.tags))];
  
  return (
    <div className="max-w-5xl mx-auto px-6 py-16">
      <div className="grid grid-cols-1 md:grid-cols-[1fr_220px] gap-16">

        <div>
          <section className="mb-16">
            <h1 className="text-3xl font-semibold tracking-tight mb-4">
              Building my way into cybersecurity.
            </h1>
            <p className="text-muted-foreground leading-relaxed max-w-lg">
              Notes on what I'm learning — C++, systems, networking, cryptography, and eventually the fun stuff. Written for myself, useful if it helps someone else.
            </p>
          </section>
          
          {/* Posts */}
          <section>
            <div className="flex items-center justify-between mb-8">
              <h2 className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
                Recent entries
              </h2>
              <Link
                to="/blog"
                className="font-mono text-xs text-primary hover:underline underline-offset-4"
              >
                View all →
              </Link>
            </div>
            <div>
              {latestPosts.map((post) => (
                <PostCard key={post.slug} post={post} />
              ))}
            </div>
          </section>
        </div>
        
        {/* Sidebar */}
        <aside className="space-y-10 md:border-l md:border-border md:pl-10 pt-10 md:pt-0">

        {/* About blurb */}
        <div>
          <h3 className="font-mono text-xs uppercase tracking-wider text-muted-foreground mb-3">
            About
          </h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Learning security from the ground up — systems, C++, crypto, and
            networking. This is my public notebook.
          </p>
          <Link
            to="/about"
            className="font-mono text-xs text-primary hover:underline underline-offset-4 mt-3 inline-block"
          >
            More →
          </Link>
        </div>

        {/* Topics */}
        <div>
          <h3 className="font-mono text-xs uppercase tracking-wider text-muted-foreground mb-3">
            Topics
          </h3>
          <div className="flex flex-wrap gap-2">
            {allTags.map((tag) => (
              <Link
                key={tag}
                to={`/blog?tag=${tag}`}
                className="font-mono text-xs uppercase tracking-wider text-muted-foreground border border-border rounded-sm px-2 py-1 hover:text-primary hover:border-primary transition-colors"
              >
                {tag}
              </Link>
            ))}
          </div>
        </div>

        {/* Archive */}
        <div>
          <h3 className="font-mono text-xs uppercase tracking-wider text-muted-foreground mb-3">
            Archive
          </h3>
          <p className="text-sm text-muted-foreground">
            {posts.length} posts and counting.
          </p>
          <Link
            to="/blog"
            className="font-mono text-xs text-primary hover:underline underline-offset-4 mt-1 inline-block"
          >
            View all →
          </Link>
        </div>
      </aside>
        
    </div>
  </div>
  );
};
export default Index;
