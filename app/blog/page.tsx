import type { Metadata } from "next";
import Link from "next/link";
import { WorkshopNav } from "@/components/WorkshopNav";
import { getAllPosts } from "@/lib/blog";

export const metadata: Metadata = {
  title: "Writing",
  description: "Notes on engineering, software, mathematics, and systems.",
  alternates: { canonical: "/blog" },
};
export default function BlogPage() {
  const posts = getAllPosts();
  return (
    <div className="workshop">
      <WorkshopNav />
      <main id="main-content" className="workshop-page">
        <h1>Writing</h1>
        <div className="writing-list">
          {posts.map((post) => (
            <article key={post.slug}>
              <time dateTime={String(post.date)}>
                {String(post.date).slice(0, 10)}
              </time>
              <h2>
                <Link href={`/blog/${post.slug}`}>{post.title}</Link>
              </h2>
              <p>{post.description}</p>
            </article>
          ))}
        </div>
      </main>
    </div>
  );
}
