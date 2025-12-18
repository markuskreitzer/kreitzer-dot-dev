"use client"

import React, { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { BookOpen, ChevronRight, Github, Linkedin, Mail, Twitter, MessageCircle, Sun, Moon, User } from 'lucide-react';
import { siteConfig, getUserName, getUserDescription } from '@/lib/config';
import { getAllPosts, getPost, BlogPost } from '@/lib/blogClient';

// Helper Components
const AnimatedHeading = ({ children, className }: { children: React.ReactNode, className?: string }) => (
  <motion.h1
    initial={{ opacity: 0, y: -20 }}
    animate={{ opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeInOut' } }}
    className={cn('text-4xl sm:text-5xl md:text-6xl font-bold mb-4 drop-shadow-lg', className)}
  >
    {children}
  </motion.h1>
);

const AnimatedParagraph = ({ children, className }: { children: React.ReactNode, className?: string }) => (
  <motion.p
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeInOut', delay: 0.2 } }}
    className={cn('text-lg sm:text-xl leading-relaxed max-w-2xl mx-auto', className)}
  >
    {children}
  </motion.p>
);

const AnimatedLink = ({
  href,
  children = null,
  className,
  icon: Icon,
  ...props
}: {
  href: string;
  children?: React.ReactNode;
  className?: string;
  icon?: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  [key: string]: any;
}) => (
  <motion.a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    className={cn('transition-colors duration-300 inline-flex items-center gap-2', className)}
    {...props}
  >
    {Icon && <Icon className="w-5 h-5" />}
    {children}
  </motion.a>
);



// Page Components
const HomePage = ({ isDarkMode, userName, onPostSelect }: {
  isDarkMode: boolean;
  userName: string;
  onPostSelect: (slug: string) => void;
}) => {
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);

  useEffect(() => {
    const loadPosts = async () => {
      try {
        const posts = await getAllPosts();
        setBlogPosts(posts.slice(0, 3));
      } catch (error) {
        console.error('Error loading blog posts:', error);
      }
    };
    loadPosts();
  }, []);

  return (
    <div className="container mx-auto px-4 py-16 md:py-24">
      <div className="text-center">
        <AnimatedHeading className={isDarkMode ? "text-foreground" : "text-foreground"}>
          Hi, I'm <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-red-600">{userName}</span>
        </AnimatedHeading>
        <AnimatedParagraph className="text-muted-foreground">
          {getUserDescription()}
        </AnimatedParagraph>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeInOut', delay: 0.4 } }}
          className="mt-8 flex flex-col sm:flex-row justify-center gap-4"
        >
          <Button variant="outline" size="lg" className="transition-all duration-300 hover:scale-105">
            <User className="mr-2 h-5 w-5" />
            About Me
          </Button>
          <Button variant="outline" size="lg" className="transition-all duration-300 hover:scale-105">
            <BookOpen className="mr-2 h-5 w-5" />
            My Work
          </Button>
        </motion.div>

        {/* Blog Posts Carousel */}
        <div className="mt-12">
          <h2 className="text-2xl font-semibold mb-6 text-center text-foreground">
            Latest from My Blog
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {blogPosts.map((post, index) => (
              <Card
                key={post.slug}
                className="transition-all duration-300 hover:shadow-lg cursor-pointer"
                onClick={() => onPostSelect(post.slug)}
              >
                <CardHeader>
                  <CardTitle className="text-lg font-semibold">{post.title}</CardTitle>
                  <CardDescription className="line-clamp-3">{post.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {post.tags.slice(0, 3).map((tag, tagIndex) => (
                      <Badge key={tagIndex} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <Button variant="ghost" className="p-0 h-auto text-primary hover:text-primary/80">
                    Read More <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeInOut', delay: 0.6 } }}
          className="mt-12 flex justify-center gap-6"
        >
          <AnimatedLink href={siteConfig.contact.github} icon={Github} className="text-muted-foreground hover:text-primary" />
          <AnimatedLink href={siteConfig.contact.linkedin} icon={Linkedin} className="text-muted-foreground hover:text-primary" />
          {siteConfig.contact.twitter && (
            <AnimatedLink href={siteConfig.contact.twitter} icon={Twitter} className="text-muted-foreground hover:text-primary" />
          )}
          {siteConfig.contact.email && (
            <AnimatedLink href={`mailto:${siteConfig.contact.email}`} icon={Mail} className="text-muted-foreground hover:text-primary" />
          )}
        </motion.div>
      </div>
    </div>
  );
};

const BlogPage = ({ onPostSelect }: {
  onPostSelect: (slug: string) => void;
}) => {
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPosts = async () => {
      try {
        const posts = await getAllPosts();
        setBlogPosts(posts);
      } catch (error) {
        console.error('Error loading blog posts:', error);
      } finally {
        setLoading(false);
      }
    };
    loadPosts();
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16 md:py-24">
        <div className="text-center text-muted-foreground">Loading posts...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-16 md:py-24">
      <AnimatedHeading className="text-center mb-12">
        My Blog
      </AnimatedHeading>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {blogPosts.map((post, index) => (
          <motion.div
            key={post.slug}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeInOut', delay: 0.2 + index * 0.1 } }}
          >
            <Card className="transition-all duration-300 hover:shadow-lg cursor-pointer" onClick={() => onPostSelect(post.slug)}>
              <CardHeader>
                <CardTitle className="text-xl font-semibold">{post.title}</CardTitle>
                <CardDescription className="text-muted-foreground">
                  {new Date(post.date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4 line-clamp-3">{post.description}</p>
                <div className="mb-4">
                  {post.tags.slice(0, 3).map((tag, index) => (
                    <Badge key={index} variant="secondary" className="mr-2">
                      {tag}
                    </Badge>
                  ))}
                </div>
                <Button variant="ghost" className="text-primary hover:text-primary/80 p-0 h-auto">
                  Read More <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

const BlogPostView = ({ slug, onBack }: { slug: string; onBack: () => void }) => {
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPost = async () => {
      try {
        const foundPost = await getPost(slug);
        if (foundPost) {
          setPost(foundPost);
        }
      } catch (error) {
        console.error('Error loading blog post:', error);
      } finally {
        setLoading(false);
      }
    };
    loadPost();
  }, [slug]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16 md:py-24">
        <div className="text-center text-muted-foreground">Loading post...</div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="container mx-auto px-4 py-16 md:py-24">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Post Not Found</h1>
          <p className="text-muted-foreground mb-6">The requested blog post could not be found.</p>
          <Button onClick={onBack} variant="outline">
            ← Back to Blog
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-16 max-w-4xl">
      <header className="mb-8">
        <Button onClick={onBack} variant="ghost" className="mb-6">
          ← Back to Blog
        </Button>
        <h1 className="text-4xl md:text-5xl font-bold mb-4">{post.title}</h1>
        <div className="flex flex-wrap items-center gap-4 text-muted-foreground mb-6">
          <time dateTime={post.date}>
            {new Date(post.date).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </time>
          <span>•</span>
          <div className="flex flex-wrap gap-2">
            {post.tags.map((tag, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        </div>
        {post.description && (
          <p className="text-xl text-muted-foreground leading-relaxed">
            {post.description}
          </p>
        )}
      </header>

       <div className="prose prose-lg max-w-none dark:prose-invert">
         <div dangerouslySetInnerHTML={{ __html: post.content || '' }} />
       </div>
    </div>
  );
};

// Main App Component
const App = () => {
  const [activeTab, setActiveTab] = useState<'home' | 'blog'>('home');
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [userName, setUserName] = useState<string>(getUserName());
  const [selectedPost, setSelectedPost] = useState<string | null>(null);

  const handleTabChange = useCallback((tab: 'home' | 'blog') => {
    setActiveTab(tab);
    setSelectedPost(null);
  }, []);

  const handlePostSelect = useCallback((slug: string) => {
    setSelectedPost(slug);
    setActiveTab('blog');
  }, []);

  const toggleDarkMode = () => {
    setIsDarkMode(prev => !prev);
    if (typeof window !== 'undefined') {
      localStorage.setItem('darkMode', JSON.stringify(!isDarkMode));
      const root = document.documentElement;
      root.classList.toggle('dark', !isDarkMode);
    }
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedDarkMode = localStorage.getItem('darkMode');
      if (storedDarkMode) {
        const darkModeValue = JSON.parse(storedDarkMode);
        setIsDarkMode(darkModeValue);
        document.documentElement.classList.toggle('dark', darkModeValue);
      }
    }
  }, []);

  useEffect(() => {
    setUserName(getUserName());
  }, []);

  return (
    <div className="min-h-screen font-sans bg-background text-foreground">
      {/* Navbar */}
      <nav className="py-4 bg-card border-b border-border">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <div className="text-2xl font-bold cursor-pointer" onClick={() => handleTabChange('home')}>
            {userName}
          </div>
          <div className="flex gap-6 items-center">
            <Button
              variant="ghost"
              className={cn(
                'transition-colors duration-300',
                activeTab === 'home' && 'border-b-2 border-orange-600'
              )}
              onClick={() => handleTabChange('home')}
            >
              Home
            </Button>
            <Button
              variant="ghost"
              className={cn(
                'transition-colors duration-300',
                activeTab === 'blog' && 'border-b-2 border-orange-600'
              )}
              onClick={() => handleTabChange('blog')}
            >
              Blog
            </Button>
            <Button
              variant="ghost"
              onClick={() => window.open(siteConfig.site.chatUrl, '_blank')}
            >
              <MessageCircle className="h-5 w-5 mr-2" />
              Chat
            </Button>
            <Button variant="ghost" onClick={toggleDarkMode}>
              {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <AnimatePresence mode='wait'>
        {activeTab === 'home' && (
          <motion.div
            key="home"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <HomePage isDarkMode={isDarkMode} userName={userName} onPostSelect={handlePostSelect} />
          </motion.div>
        )}
        {activeTab === 'blog' && !selectedPost && (
          <motion.div
            key="blog"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <BlogPage onPostSelect={handlePostSelect} />
          </motion.div>
        )}
        {activeTab === 'blog' && selectedPost && (
          <motion.div
            key="blog-post"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <BlogPostView slug={selectedPost} onBack={() => setSelectedPost(null)} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer */}
      <footer className="py-6 mt-12 bg-card border-t border-border">
        <div className="container mx-auto px-4 text-center">
          <p className="text-muted-foreground">
            &copy; {new Date().getFullYear()} {userName}. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default App;