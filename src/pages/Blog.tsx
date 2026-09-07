import { useState, useMemo, useEffect } from "react";
import { posts } from "@/data/posts";
import PostCard from "@/components/PostCard";
import SearchBar from "@/components/SearchBar";
import TagFilter from "@/components/TagFilter";

const POSTS_PER_PAGE = 8;

const normalize = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, "");

const Blog = () => {
  const [search, setSearch] = useState("");
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [page, setPage] = useState(1);

  const filteredPosts = useMemo(() => {
    const query = normalize(search);
    return posts.filter((post) => {
        const matchesSearch =
          query === "" ||
          normalize(post.title).includes(query) ||
          normalize(post.excerpt).includes(query);
        const matchesTag = activeTag === null || post.tags.includes(activeTag);
        return matchesSearch && matchesTag;
      })
  }, [search, activeTag]);

  const totalPages = Math.ceil(filteredPosts.length / POSTS_PER_PAGE);
  const startIndex = (page - 1) * POSTS_PER_PAGE;
  const visiblePosts = filteredPosts.slice(startIndex, startIndex + POSTS_PER_PAGE);

  useEffect(() => {
    setPage(1);
  }, [search, activeTag]);
  
  return (
    <div className="max-w-5xl mx-auto px-6 py-16">
      <h1 className="text-3xl font-semibold tracking-tight mb-8">Blog</h1>

      <div className="space-y-4 mb-10">
        <SearchBar value={search} onChange={setSearch} />
        <TagFilter activeTag={activeTag} onTagChange={setActiveTag} />
      </div>

      {filteredPosts.length === 0 ? (
        <p className="text-sm text-muted-foreground text-center py-16">
          No posts found.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {visiblePosts.map((post) => (
            <PostCard
              key={post.slug}
              post={post}
            />
          ))}
        </div>
      )}
      
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-4 mt-10">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-3 py-1.5 text-sm rounded-md border border-border disabled:opacity-40 disabled:cursor-not-allowed hover:bg-muted"
          >
            Prev
          </button>
          <span className="text-sm text-muted-foreground">
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="px-3 py-1.5 text-sm rounded-md border border-border disabled:opacity-40 disabled:cursor-not-allowed hover:bg-muted"
          >
            Next
          </button>
        </div>
      )}
      
    </div>
  );
};

export default Blog;
