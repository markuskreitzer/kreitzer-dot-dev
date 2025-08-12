import React, { useState, useCallback, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Book, BookOpen, ChevronRight, Github, Linkedin, Mail, Twitter, User, Zap, Sun, Moon, MessageCircle } from 'lucide-react';
import { siteConfig, getUserName, getUserDescription } from '@/lib/config';
import { getAllPosts, BlogPost } from '@/lib/blogClient';

// --- Helper Components ---

// Reusable animated heading
const AnimatedHeading = ({ children, className }: { children: React.ReactNode, className?: string }) => (
    <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeInOut' } }}
        className={cn(
            'text-4xl sm:text-5xl md:text-6xl font-bold mb-4',
            'drop-shadow-lg',
            className
        )}
    >
        {children}
    </motion.h1>
);

// Reusable animated paragraph
const AnimatedParagraph = ({ children, className }: { children: React.ReactNode, className?: string }) => (
    <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeInOut', delay: 0.2 } }}
        className={cn(
            'text-lg sm:text-xl leading-relaxed max-w-2xl mx-auto',
            className
        )}
    >
        {children}
    </motion.p>
);

// Reusable link component with hover effects
const AnimatedLink = ({
    href,
    children,
    className,
    icon: Icon,
    ...props
}: {
    href: string;
    children: React.ReactNode;
    className?: string;
    icon?: React.ComponentType<React.SVGProps<SVGSVGElement>>;
    [key: string]: any; // Allow other props like target, rel, etc.
}) => (
    <motion.a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={cn(
            'transition-colors duration-300',
            'inline-flex items-center gap-2',
            className
        )}
        {...props}
    >
        {Icon && <Icon className="w-5 h-5" />}
        {children}
    </motion.a>
);

// Reusable card component with hover effects
const ProjectCard = ({
    title,
    description,
    technologies,
    link,
    index
}: {
    title: string;
    description: string;
    technologies: string[];
    link: string;
    index: number;
}) => (
    <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeInOut', delay: 0.3 + index * 0.2 } }}
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.98 }}
    >
        <Card className="shadow-lg hover:shadow-xl transition-all duration-300">
            <CardHeader>
                <CardTitle className="text-2xl font-semibold">{title}</CardTitle>
                <CardDescription>{description}</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="mb-4">
                    <span className="mr-2">Technologies:</span>
                    {technologies.map((tech, index) => (
                        <Badge
                            key={index}
                            variant="secondary"
                            className="mr-2"
                        >
                            {tech}
                        </Badge>
                    ))}
                </div>
                <AnimatedLink href={link} className="">
                    View Project <ChevronRight className="w-4 h-4" />
                </AnimatedLink>
            </CardContent>
        </Card>
    </motion.div>
);

// --- Page Components ---
const HomePage = ({ isDarkMode, userName, onPostSelect }: { isDarkMode: boolean, userName: string, onPostSelect: (slug: string) => void }) => {
    const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);

    useEffect(() => {
        const loadPosts = async () => {
            try {
                const posts = await getAllPosts();
                // Get the latest 3 posts for the carousel
                setBlogPosts(posts.slice(0, 3));
            } catch (error) {
                console.error('Error loading blog posts:', error);
            }
        };

        loadPosts();
    }, []);

    const containerRef = useRef<HTMLDivElement>(null);
    const [isAtEnd, setIsAtEnd] = useState(false);
    const [isAtStart, setIsAtStart] = useState(true);

    const handleScroll = () => {
        if (containerRef.current) {
            const { scrollLeft, scrollWidth, clientWidth } = containerRef.current;
            setIsAtStart(scrollLeft === 0);
            setIsAtEnd(Math.abs(scrollWidth - clientWidth - scrollLeft) < 1);
        }
    };


    return (
        <div className="container mx-auto px-4 py-16 md:py-24">
            <div className="text-center">
                <AnimatedHeading className={isDarkMode ? "text-foreground" : "text-foreground"}>
                    Hi, I&apos;m <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-primary to-brand-secondary">{userName}</span>
                </AnimatedHeading>
                <AnimatedParagraph className="text-muted-foreground text-center">
                    {getUserDescription()}
                </AnimatedParagraph>
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeInOut', delay: 0.4 } }}
                    className="mt-8 flex flex-col sm:flex-row justify-center gap-4"
                >
                    <Button
                        variant="outline"
                        size="lg"
                        className="transition-all duration-300 hover:scale-105 bg-gradient-to-r from-brand-primary to-brand-secondary text-white border-0 hover:opacity-90"
                    >
                        <User className="mr-2 h-5 w-5" />
                        About Me
                    </Button>
                    <Button
                        variant="outline"
                        size="lg"
                        className="transition-all duration-300 hover:scale-105 border-brand-primary text-brand-primary hover:bg-brand-primary hover:text-white"
                    >
                        <BookOpen className="mr-2 h-5 w-5" />
                        My Work
                    </Button>
                </motion.div>

                {/* Blog Posts Carousel */}
                <div className="mt-12">
                    <h2 className="text-2xl font-semibold mb-6 text-center text-foreground">
                        Latest from My Blog
                    </h2>
                    <div
                        ref={containerRef}
                        onScroll={handleScroll}
                        className={cn(
                            "flex gap-6 overflow-x-auto pb-6 scrollbar-hide relative",
                            "transition-all duration-500",
                            isDarkMode ? "" : ""
                        )}
                    >
                        {!isAtStart && (
                            <div className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-white/50 backdrop-blur-md w-10 h-10 rounded-full flex items-center justify-center cursor-pointer shadow-lg">
                                <ChevronRight className="w-6 h-6 text-gray-700 rotate-180" />
                            </div>
                        )}
                        {!isAtEnd && (
                            <div className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-white/50 backdrop-blur-md w-10 h-10 rounded-full flex items-center justify-center cursor-pointer shadow-lg">
                                <ChevronRight className="w-6 h-6 text-gray-700" />
                            </div>
                        )}
                        {blogPosts.map((post, index) => (
                            <div key={post.slug} className="flex-shrink-0 w-[80%] sm:w-[60%] md:w-[40%] lg:w-[30%]">
                                <div onClick={() => onPostSelect(post.slug)} className="block cursor-pointer">
                                    <Card className="transition-all duration-300 hover:shadow-lg">
                                        <div className="w-full h-48 bg-gradient-to-br from-brand-primary/20 to-brand-secondary/20 rounded-t-lg flex items-center justify-center">
                                            <div className="text-center p-4">
                                                <BookOpen className="w-12 h-12 mx-auto mb-2 text-brand-primary" />
                                                <div className="text-xs text-muted-foreground">
                                                    {post.tags[0] || 'Blog Post'}
                                                </div>
                                            </div>
                                        </div>
                                        <CardHeader>
                                            <CardTitle className="text-lg font-semibold text-card-foreground">
                                                {post.title}
                                            </CardTitle>
                                        </CardHeader>
                                    </Card>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeInOut', delay: 0.6 } }}
                    className="mt-12 flex justify-center gap-6"
                >
                    <AnimatedLink
                        href={siteConfig.contact.github}
                        icon={Github}
                        className="text-muted-foreground hover:text-brand-primary"
                    />
                    <AnimatedLink
                        href={siteConfig.contact.linkedin}
                        icon={Linkedin}
                        className="text-muted-foreground hover:text-brand-primary"
                    />
                    {siteConfig.contact.twitter && (
                        <AnimatedLink
                            href={siteConfig.contact.twitter}
                            icon={Twitter}
                            className="text-muted-foreground hover:text-brand-primary"
                        />
                    )}
                    {siteConfig.contact.email && (
                        <AnimatedLink
                            href={`mailto:${siteConfig.contact.email}`}
                            icon={Mail}
                            className="text-muted-foreground hover:text-brand-primary"
                        />
                    )}
                </motion.div>
            </div>
        </div>
    );
};

const BlogPage = ({ isDarkMode, onPostSelect }: { isDarkMode: boolean, onPostSelect: (slug: string) => void }) => {
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
                <AnimatedHeading className="text-center mb-12 text-transparent bg-clip-text bg-gradient-to-r from-brand-primary to-brand-secondary">
                    My Blog
                </AnimatedHeading>
                <div className="text-center text-muted-foreground">Loading posts...</div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-16 md:py-24">
            <AnimatedHeading className="text-center mb-12 text-transparent bg-clip-text bg-gradient-to-r from-brand-primary to-brand-secondary">
                My Blog
            </AnimatedHeading>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {blogPosts.map((post, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeInOut', delay: 0.2 + index * 0.1 } }}
                    >
                        <Card className="transition-all duration-300 hover:shadow-lg">
                            <CardHeader>
                                <CardTitle className="text-xl font-semibold text-card-foreground">{post.title}</CardTitle>
                                <CardDescription className="text-muted-foreground">
                                    {new Date(post.date).toLocaleDateString('en-US', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric'
                                    })}
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <p className="text-muted-foreground mb-4">{post.description}</p>
                                <div className="mb-4">
                                    {post.tags.map((tag, index) => (
                                        <Badge
                                            key={index}
                                            variant="secondary"
                                            className="mr-2"
                                        >
                                            {tag}
                                        </Badge>
                                    ))}
                                </div>
                                <Button 
                                    variant="ghost" 
                                    onClick={() => onPostSelect(post.slug)}
                                    className="text-brand-primary hover:text-brand-secondary p-0 h-auto"
                                >
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
                // Since we're in client-side, we'll need to fetch from our static data
                const allPosts = await getAllPosts();
                const foundPost = allPosts.find(p => p.slug === slug);
                if (foundPost) {
                    setPost(foundPost);
                } else {
                    console.error('Post not found:', slug);
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
                    <h1 className="text-2xl font-bold text-foreground mb-4">Post Not Found</h1>
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
            {/* Post Header */}
            <header className="mb-8">
                <Button 
                    onClick={onBack} 
                    variant="ghost" 
                    className="mb-6 text-brand-primary hover:text-brand-secondary"
                >
                    ← Back to Blog
                </Button>
                <h1 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">
                    {post.title}
                </h1>
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
                            <Badge
                                key={index}
                                variant="secondary"
                                className="text-xs"
                            >
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

            {/* Post Content Preview */}
            <div className="prose prose-lg max-w-none prose-headings:text-foreground prose-p:text-foreground prose-li:text-foreground prose-strong:text-foreground">
                <p className="text-muted-foreground italic">
                    This is a preview of the blog post. In a full implementation, the complete markdown content would be rendered here.
                </p>
                <p className="text-muted-foreground">
                    To implement full blog post rendering, you would need to:
                </p>
                <ul className="text-muted-foreground">
                    <li>Set up an API route to serve markdown content</li>
                    <li>Process the markdown to HTML on the server</li>
                    <li>Render the HTML content safely</li>
                </ul>
            </div>
        </div>
    );
};

// --- Main App Component ---

// Brand colors matching chat app
const brandColors = {
  primary: '#ea580c',   // orange-600
  secondary: '#dc2626', // red-600
};


const App = () => {
    const [activeTab, setActiveTab] = useState<'home' | 'blog'>('home');
    const [isDarkMode, setIsDarkMode] = useState(true); // Start with dark mode
    const [userName, setUserName] = useState<string>(getUserName());
    const [selectedPost, setSelectedPost] = useState<string | null>(null);
    const prefersDark = typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches;


    // Function to handle tab changes
    const handleTabChange = useCallback((tab: 'home' | 'blog') => {
        setActiveTab(tab);
        setSelectedPost(null); // Clear selected post when changing tabs
    }, []);

    // Function to handle blog post selection
    const handlePostSelect = useCallback((slug: string) => {
        setSelectedPost(slug);
        setActiveTab('blog');
    }, []);

    const toggleDarkMode = () => {
        setIsDarkMode(prev => !prev);
    };

    useEffect(() => {
        if (prefersDark) {
            setIsDarkMode(true);
        }
    }, [prefersDark]);


    useEffect(() => {
        if (typeof window !== 'undefined') {
            localStorage.setItem('darkMode', JSON.stringify(isDarkMode));
            // Apply dark class to document element
            if (isDarkMode) {
                document.documentElement.classList.add('dark');
            } else {
                document.documentElement.classList.remove('dark');
            }
        }
    }, [isDarkMode]);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const storedDarkMode = localStorage.getItem('darkMode');
            if (storedDarkMode) {
                const darkModeValue = JSON.parse(storedDarkMode);
                setIsDarkMode(darkModeValue);
                // Apply dark class immediately on load
                if (darkModeValue) {
                    document.documentElement.classList.add('dark');
                } else {
                    document.documentElement.classList.remove('dark');
                }
            }
        }
    }, []);

    // Set user name from configuration
    useEffect(() => {
        setUserName(getUserName());
    }, []);



    return (
        <div className="min-h-screen font-sans bg-background text-foreground"
        >
            {/* Navbar */}
            <nav className="py-4 bg-card border-b border-border">
                <div className="container mx-auto px-4 flex justify-between items-center">
                    <div
                        className="text-2xl font-bold cursor-pointer text-transparent bg-clip-text bg-gradient-to-r from-brand-primary to-brand-secondary"
                        onClick={() => handleTabChange('home')}
                    >
                        {userName}
                    </div>
                    <div className="flex gap-6 items-center">
                        <Button
                            variant="ghost"
                            className={cn(
                                'transition-colors duration-300 text-muted-foreground hover:text-foreground hover:bg-accent',
                                activeTab === 'home' && 'text-foreground border-b-2 border-brand-primary'
                            )}
                            onClick={() => handleTabChange('home')}
                        >
                            Home
                        </Button>
                        <Button
                            variant="ghost"
                            className={cn(
                                'transition-colors duration-300 text-muted-foreground hover:text-foreground hover:bg-accent',
                                activeTab === 'blog' && 'text-foreground border-b-2 border-brand-primary'
                            )}
                            onClick={() => handleTabChange('blog')}
                        >
                            Blog
                        </Button>
                        <Button
                            variant="ghost"
                            className="transition-colors duration-300 text-muted-foreground hover:text-foreground hover:bg-accent"
                            onClick={() => window.open(siteConfig.site.chatUrl, '_blank')}
                        >
                            <MessageCircle className="h-5 w-5 mr-2" />
                            Chat
                        </Button>
                        <Button
                            variant="ghost"
                            onClick={toggleDarkMode}
                            className="transition-colors duration-300 text-muted-foreground hover:text-foreground"
                        >
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
                        <BlogPage isDarkMode={isDarkMode} onPostSelect={handlePostSelect} />
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
                    <div className='mt-2 text-muted-foreground'>
                        <Zap className='inline-block w-4 h-4 mr-1' />
                        Designed & Built by {userName}
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default App;
