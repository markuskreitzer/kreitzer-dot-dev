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

// For client-side use, we'll need to create a simple API endpoint or use pre-built data
// For now, we'll simulate API calls by importing the server-side functions
// In production, this would be API calls to a backend

// Import server-side functions for client use
// Note: This is a workaround for client-side usage
export async function getAllPosts(): Promise<BlogPost[]> {
  try {
    // In a real implementation, this would be an API call
    // For now, we'll use the server-side function by dynamically importing it
    // This is a bit of a hack for client-side usage

    // Since we're in client-side, we'll need to fetch from our static data
    // In production, this would be an API endpoint
    const response = await fetch('/api/blog');
    if (!response.ok) {
      throw new Error('Failed to fetch blog posts');
    }
    const posts = await response.json();
    return posts;
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    // Fallback to hardcoded data if API fails
    return [
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
    ].sort((a, b) => {
      if (a.date < b.date) return 1;
      if (a.date > b.date) return -1;
      return 0;
    });
  }
}

// Get a specific blog post with content
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