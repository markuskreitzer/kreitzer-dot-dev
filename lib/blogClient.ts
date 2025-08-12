// Client-side blog utilities
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

// For now, we'll serve static blog data
// In production, this would fetch from an API or be pre-generated
export async function getAllPosts(): Promise<BlogPost[]> {
  // This will be replaced with actual API calls or pre-generated data
  // For now, return the data from our markdown files
  const posts: BlogPost[] = [
    {
      slug: 'clean-code-principles',
      title: 'The Beauty of Clean Code',
      description: 'Exploring the principles of writing maintainable and readable code',
      date: '2024-07-28',
      tags: ['Coding', 'Clean Code', 'Software Development'],
      published: true,
      excerpt: 'Exploring the principles of writing maintainable and readable code',
    },
    {
      slug: 'react-hooks-guide',
      title: 'Mastering React Hooks',
      description: 'A deep dive into React Hooks and how to use them effectively',
      date: '2024-07-25',
      tags: ['React', 'Hooks', 'Frontend'],
      published: true,
      excerpt: 'A deep dive into React Hooks and how to use them effectively',
    },
    {
      slug: 'scalable-apis-nodejs',
      title: 'Building Scalable APIs with Node.js',
      description: 'Learn how to design and build scalable and performant APIs using Node.js',
      date: '2024-07-21',
      tags: ['Node.js', 'API', 'Backend', 'Scalability'],
      published: true,
      excerpt: 'Learn how to design and build scalable and performant APIs using Node.js',
    },
    {
      slug: 'machine-learning-intro',
      title: 'Introduction to Machine Learning',
      description: 'A gentle introduction to the world of Machine Learning',
      date: '2024-07-18',
      tags: ['Machine Learning', 'AI', 'Data Science'],
      published: true,
      excerpt: 'A gentle introduction to the world of Machine Learning',
    },
  ];

  // Sort by date, newest first
  return posts.sort((a, b) => {
    if (a.date < b.date) return 1;
    if (a.date > b.date) return -1;
    return 0;
  });
}