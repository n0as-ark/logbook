import { useState, useMemo } from "react";
import { posts } from "@/data/posts";
import PostCard from "@/components/PostCard";
import SearchBar from "@/components/SearchBar";
import TagFilter from "@/components/TagFilter";

const Blog = () => {
  const [search, setSearch] = useState("");
  const [activeTag, setActiveTag] = useState<string | null>(null);

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

  return (
    <div className="max-w-5xl mx-auto px-6 py-16">
      <h1 className="text-3xl font-semibold tracking-tight mb-8">Blog</h1>

      <div className="space-y-4 mb-10">
        <SearchBar value={search} onChange={setSearch} />
        <TagFilter activeTag={activeTag} onTagChange={setActiveTag} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {posts.map((post) => (
          <PostCard
            key={post.slug}
            post={post}
            redacted={!filteredSlugs.includes(post.slug)}
          />
        ))}
      </div>
    </div>
  );
};

export default Blog;
