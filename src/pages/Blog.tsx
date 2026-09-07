import { useState, useMemo, useEffect } from "react";
import { posts } from "@/data/posts";
import PostCard from "@/components/PostCard";
import SearchBar from "@/components/SearchBar";
import TagFilter from "@/components/TagFilter";

const POSTS_PER_PAGE = 8;

const Blog = () => {
  const [search, setSearch] = useState("");
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [page, setPage] = useState(1);

  const filteredSlugs = useMemo(() => {
    return posts
      .filter((post) => {
        const matchesSearch =
          search === "" ||
          post.title.toLowerCase().includes(search.toLowerCase()) ||
          post.excerpt.toLowerCase().includes(search.toLowerCase());
        const matchesTag = activeTag === null || post.tags.includes(activeTag);
        return matchesSearch && matchesTag;
      })
      .map((p) => p.slug);
  }, [search, activeTag]);

  const totalPages = Math.ceil(posts.length / POSTS_PER_PAGE);
  const startIndex = (page - 1) * POSTS_PER_PAGE;
  const visiblePosts = posts.slice(startIndex, startIndex + POSTS_PER_PAGE);

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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {visiblePosts.map((post) => (
          <PostCard
            key={post.slug}
            post={post}
            redacted={!filteredSlugs.includes(post.slug)}
          />
        ))}
      </div>

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
