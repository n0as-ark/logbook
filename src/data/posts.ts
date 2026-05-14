export interface Post {
  title: string;
  slug: string;
  date: string;
  tags: string[];
  excerpt: string;
  content: string;
  readTime: string;
}

export const ALL_TAGS = ["C++", "Network", "Data Structure", "Operating Systems", "Linux", "Cryptography"] as const;

export const posts: Post[] = [];
