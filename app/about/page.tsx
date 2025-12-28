import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { siteConfig } from '@/lib/config';
import { Github, Linkedin, Mail, Twitter, MapPin, Briefcase, GraduationCap } from 'lucide-react';

export const metadata: Metadata = {
  title: 'About',
  description: `Learn more about ${siteConfig.user.name}, a passionate software engineer specializing in full-stack development and embedded systems.`,
  openGraph: {
    title: `About ${siteConfig.user.name}`,
    description: `Learn more about ${siteConfig.user.name}, a passionate software engineer.`,
    url: `${siteConfig.site.url}/about`,
  },
};

export default function AboutPage() {
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
            <Link href="/blog">
              <Button variant="ghost">Blog</Button>
            </Link>
            <Link href="/work">
              <Button variant="ghost">Work</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* About Content */}
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <h1 className="text-4xl md:text-5xl font-bold mb-6">About Me</h1>

        <div className="prose prose-lg max-w-none dark:prose-invert mb-12">
          <p className="text-xl text-muted-foreground leading-relaxed mb-6">
            Hi! I'm {siteConfig.user.name}, a passionate software engineer with expertise in
            building modern web applications and embedded systems.
          </p>

          <p>
            I specialize in full-stack development using cutting-edge technologies like React,
            Next.js, and TypeScript, combined with a deep interest in hardware programming and
            embedded systems. My work spans from creating performant web applications to developing
            firmware for microcontrollers like the ESP32.
          </p>

          <p>
            Throughout my career, I've focused on writing clean, maintainable code and building
            scalable solutions that solve real-world problems. I'm particularly interested in the
            intersection of web technologies and IoT, where I can leverage both my software
            development and hardware expertise.
          </p>

          <p>
            When I'm not coding, you can find me exploring new technologies, contributing to
            open-source projects, or writing about software development on my blog.
          </p>
        </div>

        {/* Skills Section */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold mb-6">Skills & Expertise</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Frontend Development</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary">React</Badge>
                  <Badge variant="secondary">Next.js</Badge>
                  <Badge variant="secondary">TypeScript</Badge>
                  <Badge variant="secondary">Tailwind CSS</Badge>
                  <Badge variant="secondary">Framer Motion</Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Backend Development</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary">Node.js</Badge>
                  <Badge variant="secondary">REST APIs</Badge>
                  <Badge variant="secondary">PostgreSQL</Badge>
                  <Badge variant="secondary">Redis</Badge>
                  <Badge variant="secondary">Docker</Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Embedded Systems</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary">Rust</Badge>
                  <Badge variant="secondary">ESP32</Badge>
                  <Badge variant="secondary">IoT</Badge>
                  <Badge variant="secondary">Firmware</Badge>
                  <Badge variant="secondary">C/C++</Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Tools & Practices</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary">Git</Badge>
                  <Badge variant="secondary">CI/CD</Badge>
                  <Badge variant="secondary">Testing</Badge>
                  <Badge variant="secondary">Agile</Badge>
                  <Badge variant="secondary">Clean Code</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Contact Section */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold mb-6">Get In Touch</h2>
          <p className="text-lg text-muted-foreground mb-6">
            I'm always interested in hearing about new opportunities, collaborations, or just
            chatting about technology. Feel free to reach out!
          </p>
          <div className="flex flex-wrap gap-4">
            <a href={siteConfig.contact.github} target="_blank" rel="noopener noreferrer">
              <Button variant="outline" size="lg">
                <Github className="mr-2 h-5 w-5" />
                GitHub
              </Button>
            </a>
            <a href={siteConfig.contact.linkedin} target="_blank" rel="noopener noreferrer">
              <Button variant="outline" size="lg">
                <Linkedin className="mr-2 h-5 w-5" />
                LinkedIn
              </Button>
            </a>
            {siteConfig.contact.twitter && (
              <a href={siteConfig.contact.twitter} target="_blank" rel="noopener noreferrer">
                <Button variant="outline" size="lg">
                  <Twitter className="mr-2 h-5 w-5" />
                  Twitter
                </Button>
              </a>
            )}
            {siteConfig.contact.email && (
              <a href={`mailto:${siteConfig.contact.email}`}>
                <Button variant="outline" size="lg">
                  <Mail className="mr-2 h-5 w-5" />
                  Email
                </Button>
              </a>
            )}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center py-8 bg-muted rounded-lg">
          <h3 className="text-2xl font-bold mb-4">Want to work together?</h3>
          <p className="text-muted-foreground mb-6">
            Check out my portfolio and previous work
          </p>
          <Link href="/work">
            <Button size="lg" className="bg-orange-600 hover:bg-orange-700">
              View My Work
            </Button>
          </Link>
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
