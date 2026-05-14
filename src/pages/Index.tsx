import { Link } from "react-router-dom";
import { posts } from "@/data/posts";
import PostCard from "@/components/PostCard";
const Index = () => {
  const latestPosts = posts.slice(0, 3);
  return (
    <div className="max-w-2xl mx-auto px-6 py-16">
      {/* Hero */}
      <section className="mb-16">
        <h1 className="text-3xl font-semibold tracking-tight mb-4">
          Building my way into cybersecurity.
        </h1>
        <p className="text-muted-foreground leading-relaxed max-w-lg">
          Notes on what I'm learning — C++, systems, networking, and eventually the fun stuff. Written for myself, useful if it helps someone else.
        </p>
      </section>
      {/* Latest posts */}
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
  );
};
export default Index;
