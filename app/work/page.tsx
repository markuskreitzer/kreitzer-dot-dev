import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { siteConfig } from '@/lib/config';
import { Github, ExternalLink, Code2, Cpu, Globe, Zap, Brain, Server, Shield, Sprout, Radio, Ship, Award, Video, Smartphone, Microscope } from 'lucide-react';

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
  const projects = [
    {
      title: 'AI/ML Service Broker System',
      description: 'Architected and implemented a novel service broker system for AI/ML tool integration at Peopletec. Developed AI pipelines integrating Azure AI services with locally hosted LLM inference models. Led technical direction and standards adoption across engineering teams.',
      tags: ['AI/ML', 'Python', 'Azure', 'LLM', 'Architecture', 'Leadership'],
      organization: 'Peopletec',
      period: 'Dec 2024 - Present',
      icon: Brain,
    },
    {
      title: 'Enterprise GitLab CI/CD & ML Infrastructure',
      description: 'Managed 89 diverse software projects using GitLab CI/CD on Kubernetes infrastructure. Developed custom machine learning solutions with fine-tuned LLMs and migrated complex MATLAB workflows to Python, achieving $160,000 in annual licensing cost savings.',
      tags: ['GitLab CI/CD', 'Kubernetes', 'Python', 'ML', 'DevOps', 'Cost Optimization'],
      organization: 'Valkyrie Enterprises',
      period: 'May 2020 - Dec 2024',
      icon: Server,
    },
    {
      title: 'Mission-Critical DoD/VA System',
      description: 'Led development and maintenance of mission-critical Department of Defense and VA systems supporting global user base of 300,000+ users. Implemented robust CI/CD pipelines, cybersecurity measures (SAST/DAST), and high-availability infrastructure across AWS and Azure.',
      tags: ['DoD', 'AWS', 'Azure', 'Cybersecurity', 'High Availability', 'CI/CD'],
      organization: 'Mantech',
      period: 'Aug 2011 - May 2020',
      icon: Shield,
    },
    {
      title: 'USDA IoT Fire Prevention System',
      description: 'Designed and developed an IoT sensor device for real-time hay bale moisture and temperature monitoring to prevent spontaneous combustion. Published research paper and presented findings at agricultural technology conferences. Utilized embedded systems and wireless communication protocols.',
      tags: ['IoT', 'Embedded Systems', 'Research', 'Agriculture', 'C/C++', 'Sensors'],
      organization: 'Auburn University',
      period: '2017 - 2018',
      icon: Sprout,
    },
    {
      title: 'NASA Chaos Communication System',
      description: 'Researched and developed chaos-based communication system for NASA applications. Focused on secure, noise-resistant communication protocols using chaotic signal processing. Applied advanced signal processing and neural network techniques for signal reconstruction.',
      tags: ['NASA', 'Signal Processing', 'Research', 'Neural Networks', 'MATLAB', 'Python'],
      organization: 'Auburn University',
      period: '2016 - 2017',
      icon: Radio,
    },
    {
      title: 'Autonomous Nautical Radiation Assessment',
      description: 'Developed autonomous vessel system for radiation assessment in marine environments. Integrated autonomous navigation, sensor fusion, and real-time data transmission capabilities. Applied robotics and embedded systems expertise to environmental monitoring challenge.',
      tags: ['Robotics', 'Autonomous Systems', 'Sensors', 'Embedded', 'Research'],
      organization: 'Research Project',
      period: '2013',
      icon: Ship,
    },
    {
      title: 'USMC Tactical Mobile Command Center',
      description: 'Designed innovative tactical mobile command center while serving as Ground Communications Technician in the United States Marine Corps. Awarded Navy and Marine Corps Achievement Medal for exceptional technical innovation and implementation. Demonstrated leadership and mission-critical system design under operational constraints.',
      tags: ['Military', 'Leadership', 'Communications', 'Tactical Systems', 'Hardware'],
      organization: 'U.S. Marine Corps',
      period: '2004 - 2005',
      icon: Award,
    },
    {
      title: 'AI Video Upscaler',
      description: 'Experimental FFmpeg/PyTorch video upscaler using ESRGAN (Enhanced Super-Resolution Generative Adversarial Networks) AI/ML methods. Implements state-of-the-art deep learning techniques to enhance video resolution and quality through intelligent pixel reconstruction.',
      tags: ['Python', 'PyTorch', 'FFmpeg', 'ESRGAN', 'AI/ML', 'Computer Vision'],
      github: 'https://github.com/markuskreitzer/video_upscaler',
      icon: Video,
    },
    {
      title: 'iOS Media Downloader',
      description: 'FastAPI-based media archiver with iOS share sheet integration. Enables quick media downloads from social platforms via iOS Shortcuts. ⚠️ Experimental project - users must comply with copyright laws and platform terms of service.',
      tags: ['Python', 'FastAPI', 'iOS Shortcuts', 'REST API', 'Media Processing'],
      github: 'https://github.com/markuskreitzer/media_downloader',
      icon: Smartphone,
      status: 'Experimental',
    },
    {
      title: 'PicoScope MCP Server',
      description: 'STDIO Model Context Protocol (MCP) server for controlling PicoScope oscilloscopes with AI assistants. Novel integration enabling AI-driven test equipment control and measurement automation. Currently in active development.',
      tags: ['Python', 'MCP', 'Test Equipment', 'AI Integration', 'Instrumentation'],
      github: 'https://github.com/markuskreitzer/picoscope_mcp',
      icon: Microscope,
      status: 'Alpha',
    },
    {
      title: 'Personal Blog & Portfolio',
      description: 'Modern, responsive technical blog built with Next.js 15, React 19, and TypeScript. Features markdown-based posts with syntax highlighting, mermaid diagrams, LaTeX math rendering, and comprehensive SEO optimization. Demonstrates full-stack development and modern web practices.',
      tags: ['Next.js', 'React', 'TypeScript', 'Tailwind CSS', 'Vercel'],
      github: 'https://github.com/markuskreitzer/kreitzer-dot-dev',
      live: 'https://kreitzer.dev',
      icon: Globe,
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
            A showcase of my professional work spanning AI/ML systems, enterprise infrastructure,
            embedded systems, research projects, and military service. Over 20 years of delivering
            mission-critical solutions across government, research, and commercial sectors.
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
                  <div className="flex items-center gap-2 mb-2">
                    <CardTitle className="flex-grow">{project.title}</CardTitle>
                    {project.status && (
                      <Badge variant="outline" className="text-xs">
                        {project.status}
                      </Badge>
                    )}
                  </div>
                  {project.organization && (
                    <div className="text-sm text-muted-foreground mb-1">
                      <strong>{project.organization}</strong>
                    </div>
                  )}
                  {project.period && (
                    <div className="text-xs text-muted-foreground mb-3">
                      {project.period}
                    </div>
                  )}
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

        {/* Open Source & Publications */}
        <div className="mb-16 text-center">
          <h2 className="text-2xl font-semibold mb-4">Open Source & Publications</h2>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            Active contributor to open-source projects with code preserved in GitHub's Arctic Code Vault.
            Published research papers on IoT sensors and agricultural monitoring systems.
          </p>
          <div className="flex justify-center gap-4">
            <a href={siteConfig.contact.github} target="_blank" rel="noopener noreferrer">
              <Button variant="outline">
                <Github className="mr-2 h-4 w-4" />
                View GitHub Profile
              </Button>
            </a>
            <Link href="/blog">
              <Button variant="outline">
                <Zap className="mr-2 h-4 w-4" />
                Read Technical Blog
              </Button>
            </Link>
          </div>
        </div>

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
