import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { siteConfig } from '@/lib/config';
import { Github, ExternalLink, Code2, Cpu, Globe, Zap } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Work & Projects',
  description: `Explore ${siteConfig.user.name}'s portfolio of web applications, embedded systems projects, and open-source contributions.`,
  openGraph: {
    title: `Work & Projects - ${siteConfig.user.name}`,
    description: `Explore ${siteConfig.user.name}'s portfolio of projects and work.`,
    url: `${siteConfig.site.url}/work`,
  },
};

export default function WorkPage() {
  // Placeholder projects - user will provide real content
  const projects = [
    {
      title: 'Personal Blog & Portfolio',
      description: 'A modern, responsive blog built with Next.js 15, React 19, and TypeScript. Features markdown-based blog posts with syntax highlighting, mermaid diagrams, LaTeX math rendering, and comprehensive SEO optimization.',
      tags: ['Next.js', 'React', 'TypeScript', 'Tailwind CSS', 'Vercel'],
      github: 'https://github.com/markuskreitzer/kreitzer-dot-dev',
      live: 'https://kreitzer.dev',
      icon: Globe,
    },
    {
      title: 'ESP32 Frequency Meter',
      description: 'A high-precision frequency measurement device built with ESP32 and Rust. Demonstrates hardware programming expertise and real-time signal processing capabilities.',
      tags: ['Rust', 'ESP32', 'Embedded', 'IoT', 'Hardware'],
      icon: Cpu,
    },
    {
      title: 'Scalable Node.js APIs',
      description: 'Design patterns and best practices for building scalable REST APIs with Node.js. Covers performance optimization, caching strategies, and microservices architecture.',
      tags: ['Node.js', 'REST API', 'Microservices', 'Redis', 'Docker'],
      icon: Code2,
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="py-4 bg-card border-b border-border">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold cursor-pointer">
            {siteConfig.user.name}
          </Link>
          <div className="flex gap-6 items-center">
            <Link href="/">
              <Button variant="ghost">Home</Button>
            </Link>
            <Link href="/about">
              <Button variant="ghost">About</Button>
            </Link>
            <Link href="/blog">
              <Button variant="ghost">Blog</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Work Content */}
      <div className="container mx-auto px-4 py-16 max-w-6xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Work & Projects</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            A showcase of my recent projects spanning web development, embedded systems,
            and open-source contributions. Each project represents a unique challenge and
            learning opportunity.
          </p>
        </div>

        {/* Projects Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {projects.map((project, index) => {
            const Icon = project.icon;
            return (
              <Card key={index} className="flex flex-col h-full transition-all duration-300 hover:shadow-lg">
                <CardHeader>
                  <div className="flex items-start justify-between mb-2">
                    <Icon className="h-8 w-8 text-orange-600" />
                    <div className="flex gap-2">
                      {project.github && (
                        <a href={project.github} target="_blank" rel="noopener noreferrer">
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Github className="h-4 w-4" />
                          </Button>
                        </a>
                      )}
                      {project.live && (
                        <a href={project.live} target="_blank" rel="noopener noreferrer">
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <ExternalLink className="h-4 w-4" />
                          </Button>
                        </a>
                      )}
                    </div>
                  </div>
                  <CardTitle>{project.title}</CardTitle>
                  <CardDescription>{project.description}</CardDescription>
                </CardHeader>
                <CardContent className="flex-grow">
                  <div className="flex flex-wrap gap-2">
                    {project.tags.map((tag, tagIndex) => (
                      <Badge key={tagIndex} variant="secondary">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Placeholder for More Projects */}
        <Card className="mb-16 border-dashed">
          <CardHeader className="text-center">
            <CardTitle>More Projects Coming Soon</CardTitle>
            <CardDescription>
              I'm constantly working on new projects and contributions. Check back soon for updates!
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <div className="flex justify-center gap-4">
              <a href={siteConfig.contact.github} target="_blank" rel="noopener noreferrer">
                <Button variant="outline">
                  <Github className="mr-2 h-4 w-4" />
                  View GitHub
                </Button>
              </a>
              <Link href="/blog">
                <Button variant="outline">
                  <Zap className="mr-2 h-4 w-4" />
                  Read Blog
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Skills Highlight */}
        <div className="text-center py-12 bg-muted rounded-lg">
          <h2 className="text-3xl font-bold mb-4">Interested in Working Together?</h2>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            I'm always open to discussing new projects, creative ideas, or opportunities to be part of your visions.
          </p>
          <div className="flex justify-center gap-4">
            <Link href="/about">
              <Button size="lg" className="bg-orange-600 hover:bg-orange-700">
                Learn More About Me
              </Button>
            </Link>
            {siteConfig.contact.email && (
              <a href={`mailto:${siteConfig.contact.email}`}>
                <Button size="lg" variant="outline">
                  Get In Touch
                </Button>
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="py-6 mt-12 bg-card border-t border-border">
        <div className="container mx-auto px-4 text-center">
          <p className="text-muted-foreground">
            &copy; {new Date().getFullYear()} {siteConfig.user.name}. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
