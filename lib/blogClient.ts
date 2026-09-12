export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  date: string;
  tags: string[];
  published: boolean;
  content?: string;
  excerpt?: string;
}
export async function getAllPosts(): Promise<BlogPost[]> {
  try {
    const response = await fetch('/api/blog');
    if (!response.ok) {
      throw new Error('Failed to fetch blog posts');
    }
    const posts = await response.json();
    return posts;
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    return [
      {
        slug: 'clean-code-principles',
        title: "Code that is easier to change",
        description: "Notes on naming, validation, types, and the cost of splitting code into smaller pieces.",
        date: "2025-01-01",
        tags: ['Coding', 'Clean Code', 'Software Development'],
        published: true,
        excerpt: "Notes on naming, validation, types, and the cost of splitting code into smaller pieces.",
      },
      {
        slug: 'react-hooks-guide',
        title: "React hooks: state, effects, and stale results",
        description: "Working through derived state, effect cleanup, and when memoization helps.",
        date: "2025-01-01",
        tags: ['React', 'Hooks', 'Frontend'],
        published: true,
        excerpt: "Working through derived state, effect cleanup, and when memoization helps.",
      },
      {
        slug: 'scalable-apis-nodejs',
        title: "Where a Node.js API spends its time",
        description: "Request timing, database pools, caching, and what changes when an API runs in several processes.",
        date: "2025-01-01",
        tags: ['Node.js', 'API', 'Backend', 'Scalability'],
        published: true,
        excerpt: "Request timing, database pools, caching, and what changes when an API runs in several processes.",
      },
      {
        slug: 'machine-learning-intro',
        title: "A first classifier, with a test set",
        description: "A small scikit-learn example, followed by the evaluation mistakes that can make a good score misleading.",
        date: "2025-01-01",
        tags: ['Machine Learning', 'AI', 'Data Science'],
        published: true,
        excerpt: "A small scikit-learn example, followed by the evaluation mistakes that can make a good score misleading.",
      },
    ].sort((a, b) => {
      if (a.date < b.date) return 1;
      if (a.date > b.date) return -1;
      return 0;
    });
  }
}
export async function getPost(slug: string): Promise<BlogPost | null> {
  try {
    const response = await fetch(`/api/blog/${slug}`);
    if (!response.ok) {
      throw new Error('Failed to fetch blog post');
    }
    const post = await response.json();
    return post;
  } catch (error) {
    console.error('Error fetching blog post:', error);
    return null;
  }
}