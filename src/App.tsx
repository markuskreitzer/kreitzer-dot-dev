import React, { useState, useCallback, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Book, BookOpen, ChevronRight, Github, Linkedin, Mail, Twitter, User, Zap, Sun, Moon } from 'lucide-react';
import { load } from 'js-yaml';

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
            'text-lg sm:text-xl leading-relaxed max-w-2xl',
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
const HomePage = ({ isDarkMode, userName }: { isDarkMode: boolean, userName: string }) => {
    // Dummy blog post data for the carousel
    const blogPosts = [
        {
            title: "The Future of AI",
            imageUrl: "https://placehold.co/400x300/EEE/31343C", // Replace with actual image URLs
            link: "#",
        },
        {
            title: "Web Development Trends",
            imageUrl: "https://placehold.co/400x300/EEE/31343C",
            link: "#",
        },
        {
            title: "Data Science Explained",
            imageUrl: "https://placehold.co/400x300/EEE/31343C",
            link: "#",
        },
        {
            title: "Mobile App Development",
            imageUrl: "https://placehold.co/400x300/EEE/31343C",
            link: "#",
        },
        {
            title: "Cloud Computing Basics",
            imageUrl: "https://placehold.co/400x300/EEE/31343C",
            link: "#",
        },
    ];

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
                <AnimatedHeading className={isDarkMode ? "text-white bg-gradient-to-r from-brass-600 to-brass-800 text-transparent bg-clip-text" : "text-gray-900"}>
                    Hi, I&apos;m <span className={isDarkMode ? "text-transparent bg-clip-text bg-gradient-to-r from-brass-600 to-brass-800" : "text-blue-600"}>{userName}</span>
                </AnimatedHeading>
                <AnimatedParagraph className={isDarkMode ? "text-beige-200" : "text-gray-700"}>
                    I&apos;m a passionate <span className={isDarkMode ? "text-blue-400" : "text-blue-600"}>Software Engineer</span> specializing in building
                    robust and scalable web applications.  I love turning complex problems into elegant,
                    efficient code.  I'm particularly interested in <span className={isDarkMode ? "text-blue-400" : "text-purple-600"}>Full-Stack Development</span>,
                    <span className="text-green-400">Cloud Technologies</span>, and <span className="text-yellow-400">Machine Learning</span>.
                </AnimatedParagraph>
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeInOut', delay: 0.4 } }}
                    className="mt-8 flex flex-col sm:flex-row justify-center gap-4"
                >
                    <Button
                        variant="outline"
                        size="lg"
                        className={cn(
                            "transition-all duration-300 shadow-lg",
                            isDarkMode
                                ? "bg-gradient-to-r from-brass-500/20 to-brass-700/20 text-white border border-white/10 hover:from-brass-500/30 hover:to-brass-700/30 hover:scale-105"
                                : "bg-gray-100 text-gray-900 border border-gray-200 hover:bg-gray-200 hover:scale-105"
                        )}
                    >
                        <User className="mr-2 h-5 w-5" />
                        About Me
                    </Button>
                    <Button
                        variant="outline"
                        size="lg"
                        className={cn(
                            "transition-all duration-300 shadow-lg",
                            isDarkMode
                                ? "bg-gradient-to-r from-brass-700/20 to-brass-500/20 text-white border border-white/10 hover:from-brass-700/30 hover:to-brass-500/30 hover:scale-105"
                                : "bg-gray-100 text-gray-900 border border-gray-200 hover:bg-gray-200 hover:scale-105"
                        )}
                    >
                        <BookOpen className="mr-2 h-5 w-5" />
                        My Work
                    </Button>
                </motion.div>

                {/* Blog Posts Carousel */}
                <div className="mt-12">
                    <h2 className={cn(
                        "text-2xl font-semibold mb-6 text-center",
                        isDarkMode ? "text-white" : "text-gray-900"
                    )}>
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
                            <div key={index} className="flex-shrink-0 w-[80%] sm:w-[60%] md:w-[40%] lg:w-[30%]">
                                <a href={post.link} className="block">
                                    <Card className={cn(
                                        "transition-all duration-300",
                                        isDarkMode ? "bg-white/5 backdrop-blur-lg border border-white/10 shadow-lg hover:shadow-xl" : "bg-white shadow-md hover:shadow-lg border border-gray-200"
                                    )}>
                                        <img
                                            src={post.imageUrl}
                                            alt={post.title}
                                            className="w-full h-48 object-cover rounded-t-lg"
                                        />
                                        <CardHeader>
                                            <CardTitle className={isDarkMode ? "text-lg font-semibold text-white" : "text-lg font-semibold text-gray-900"}>
                                                {post.title}
                                            </CardTitle>
                                        </CardHeader>
                                    </Card>
                                </a>
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
                        href="https://github.com/yourusername"
                        icon={Github}
                        className={isDarkMode ? "text-gray-400 hover:text-white" : "text-gray-600 hover:text-gray-900"}
                    />
                    <AnimatedLink
                        href="https://linkedin.com/in/yourprofile"
                        icon={Linkedin}
                        className={isDarkMode ? "text-gray-400 hover:text-white" : "text-gray-600 hover:text-gray-900"}
                    />
                    <AnimatedLink
                        href="https://twitter.com/yourhandle"
                        icon={Twitter}
                        className={isDarkMode ? "text-gray-400 hover:text-white" : "text-gray-600 hover:text-gray-900"}
                    />
                    <AnimatedLink
                        href="mailto:your.email@example.com"
                        icon={Mail}
                        className={isDarkMode ? "text-gray-400 hover:text-white" : "text-gray-600 hover:text-gray-900"}
                    />
                </motion.div>
            </div>
        </div>
    );
};

const BlogPage = ({ isDarkMode }: { isDarkMode: boolean }) => {
    // Dummy blog posts data
    const blogPosts = [
        {
            title: 'The Beauty of Clean Code',
            description: 'Exploring the principles of writing maintainable and readable code.',
            date: '2024-07-28',
            link: '#',
            tags: ['Coding', 'Clean Code', 'Software Development']
        },
        {
            title: 'Mastering React Hooks',
            description: 'A deep dive into React Hooks and how to use them effectively.',
            date: '2024-07-25',
            link: '#',
            tags: ['React', 'Hooks', 'Frontend']
        },
        {
            title: 'Building Scalable APIs with Node.js',
            description: 'Learn how to design and build scalable and performant APIs using Node.js.',
            date: '2024-07-21',
            link: '#',
            tags: ['Node.js', 'API', 'Backend', 'Scalability']
        },
        {
            title: 'Introduction to Machine Learning',
            description: 'A gentle introduction to the world of Machine Learning.',
            date: '2024-07-18',
            link: '#',
            tags: ['Machine Learning', 'AI', 'Data Science']
        },
    ];

    return (
        <div className="container mx-auto px-4 py-16 md:py-24">
            <AnimatedHeading className={cn("text-center mb-12", isDarkMode ? "text-white bg-gradient-to-r from-brass-600 to-brass-800 text-transparent bg-clip-text" : "text-gray-900")}>
                My Blog
            </AnimatedHeading>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {blogPosts.map((post, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeInOut', delay: 0.2 + index * 0.1 } }}
                    >
                        <Card className={cn(
                            "transition-all duration-300",
                            isDarkMode ? "bg-white/5 backdrop-blur-lg border border-white/10 shadow-lg hover:shadow-xl" : "bg-white shadow-md hover:shadow-lg border border-gray-200"
                        )}>
                            <CardHeader>
                                <CardTitle className={isDarkMode ? "text-xl font-semibold text-white" : "text-xl font-semibold text-gray-900"}>{post.title}</CardTitle>
                                <CardDescription className={isDarkMode ? "text-gray-400" : "text-gray-500"}>{post.date}</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <p className={isDarkMode ? "text-gray-300 mb-4" : "text-gray-700 mb-4"}>{post.description}</p>
                                <div className="mb-4">
                                    {post.tags.map((tag, index) => (
                                        <Badge
                                            key={index}
                                            variant="secondary"
                                            className={isDarkMode ? "bg-brass-500/20 text-brass-300 border-brass-500/30 mr-2" : "bg-gray-200 text-gray-700 border-gray-300 mr-2"}
                                        >
                                            {tag}
                                        </Badge>
                                    ))}
                                </div>
                                <AnimatedLink href={post.link} className={isDarkMode ? "text-blue-400 hover:text-blue-300" : "text-blue-600 hover:text-blue-800"}>
                                    Read More <ChevronRight className="w-4 h-4" />
                                </AnimatedLink>
                            </CardContent>
                        </Card>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

// --- Main App Component ---

// Define custom color variables (in hex)
const beige = '#F5F5DC';  // Beige
const brass = '#B5A642';  // Brass
const blue = '#0000FF';    // Blue


const App = () => {
    const [activeTab, setActiveTab] = useState<'home' | 'blog'>('home');
    const [isDarkMode, setIsDarkMode] = useState(true); // Start with dark mode
    const [userName, setUserName] = useState<string>('Your Name'); // Default value
    const prefersDark = typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches;


    // Function to handle tab changes
    const handleTabChange = useCallback((tab: 'home' | 'blog') => {
        setActiveTab(tab);
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
        }
    }, [isDarkMode]);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const storedDarkMode = localStorage.getItem('darkMode');
            if (storedDarkMode) {
                setIsDarkMode(JSON.parse(storedDarkMode));
            }
        }
    }, []);

    // Load data from YAML file
    useEffect(() => {
        const fetchData = async () => {
            try {
                // Use a raw fetch instead of next/server functions
                const response = await fetch('/data/config.yaml'); // Assumes config.yaml is in the public directory
                if (!response.ok) {
                    throw new Error(`Failed to fetch config.yaml: ${response.status}`);
                }
                const text = await response.text();
                const config = load(text) as { name: string }; // Type assertion
                setUserName(config.name);
            } catch (error) {
                console.error("Error loading config.yaml:", error);
                // Handle error (e.g., set default value, show error message)
            }
        };

        fetchData();
    }, []);



    return (
        <div className={cn(
            "min-h-screen font-sans transition-colors duration-500",
            isDarkMode
                ? "bg-gradient-to-br from-gray-900 via-brass-900 to-black text-white"
                : "bg-gradient-to-br from-gray-50 to-gray-100 to-white text-gray-900"
        )}
            style={{
                '--beige': beige,
                '--brass': brass,
                '--blue': blue,
            }}
        >
            {/* Navbar */}
            <nav className={cn(
                "py-4 transition-colors duration-500",
                isDarkMode ? "bg-white/5 backdrop-blur-lg border-b border-white/10" : "bg-white border-b border-gray-200"
            )}>
                <div className="container mx-auto px-4 flex justify-between items-center">
                    <div
                        className={cn(
                            "text-2xl font-bold cursor-pointer transition-colors duration-500",
                            isDarkMode
                                ? "text-transparent bg-clip-text bg-gradient-to-r from-brass-600 to-brass-800"
                                : "text-gray-900"
                        )}
                        onClick={() => handleTabChange('home')}
                    >
                        {userName}
                    </div>
                    <div className="flex gap-6 items-center">
                        <Button
                            variant="ghost"
                            className={cn(
                                'transition-colors duration-300',
                                isDarkMode
                                    ? 'text-gray-300 hover:text-white hover:bg-white/10'
                                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100',
                                activeTab === 'home' && (isDarkMode ? 'text-white border-b-2 border-blue-400' : 'text-gray-900 border-b-2 border-blue-600')
                            )}
                            onClick={() => handleTabChange('home')}
                        >
                            Home
                        </Button>
                        <Button
                            variant="ghost"
                            className={cn(
                                'transition-colors duration-300',
                                isDarkMode
                                    ? 'text-gray-300 hover:text-white hover:bg-white/10'
                                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100',
                                activeTab === 'blog' && (isDarkMode ? 'text-white border-b-2 border-blue-400' : 'text-gray-900 border-b-2 border-blue-600')
                            )}
                            onClick={() => handleTabChange('blog')}
                        >
                            Blog
                        </Button>
                        <Button
                            variant="ghost"
                            onClick={toggleDarkMode}
                            className={cn(
                                "transition-colors duration-300",
                                isDarkMode ? "text-gray-300 hover:text-white" : "text-gray-600 hover:text-gray-900"
                            )}
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
                        <HomePage isDarkMode={isDarkMode} userName={userName} />
                    </motion.div>
                )}
                {activeTab === 'blog' && (
                    <motion.div
                        key="blog"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <BlogPage isDarkMode={isDarkMode} />
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Footer */}
            <footer className={cn(
                "py-6 mt-12 transition-colors duration-500",
                isDarkMode ? "bg-white/5 backdrop-blur-lg border-t border-white/10" : "bg-gray-100 border-t border-gray-200"
            )}>
                <div className="container mx-auto px-4 text-center">
                    <p className={isDarkMode ? "text-gray-400" : "text-gray-600"}>
                        &copy; {new Date().getFullYear()} {userName}. All rights reserved.
                    </p>
                    <div className='mt-2' style={{ color: isDarkMode ? beige : 'inherit' }}>
                        <Zap className='inline-block w-4 h-4 mr-1' />
                        Designed & Built by {userName}
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default App;
