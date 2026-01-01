import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { siteConfig } from '@/lib/config';
import { Github, Linkedin, Mail, Twitter, MapPin, Briefcase, GraduationCap, ChefHat } from 'lucide-react';

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
            Hi! I'm {siteConfig.user.name}, a technology leader with over 20 years of experience
            architecting, building, securing, and managing complex systems across government, research,
            and commercial sectors.
          </p>

          <p>
            Currently serving as an <strong>AI/ML Software Engineer/Architect Leader at Peopletec</strong>,
            I spearhead the Corporate Division's AI/ML tool implementation, establishing technical direction
            and standards for adoption across engineering teams. My work focuses on architecting novel
            service broker systems, developing AI pipelines that integrate Azure AI services with locally
            hosted LLM inference models, and mentoring teams of 5-10 engineers on best practices in CI/CD
            and infrastructure automation.
          </p>

          <p>
            My expertise spans <strong>software engineering, DevOps methodologies, cloud infrastructure
            (AWS/Azure), AI/ML integration, cybersecurity, and distributed systems design</strong>. I have
            a proven track record of leading technical direction, implementing robust CI/CD pipelines, and
            delivering mission-critical solutions supporting global user bases numbering in the hundreds of
            thousands.
          </p>

          <p>
            Prior to my current role, I served as a <strong>Senior Research Scientist/Engineer at Valkyrie
            Enterprises</strong>, where I managed 89 diverse software projects using GitLab CI/CD on
            Kubernetes, developed custom machine learning solutions with fine-tuned LLMs, and migrated
            complex MATLAB workflows to Python—achieving $160,000 in annual licensing cost savings.
          </p>

          <p>
            I hold a <strong>Master of Science in Electrical Engineering from Auburn University</strong> (2018)
            with a focus on AI/ML, Neural Networks, and Advanced AI Systems. I'm an active open-source
            contributor with code included in GitHub's Arctic Code Vault program, and I've published multiple
            research papers on IoT sensors and agricultural monitoring systems.
          </p>

          <p>
            As a proud <strong>United States Marine Corps veteran</strong> (Sergeant, Ground Communications
            Technician), I was awarded the Navy and Marine Corps Achievement Medal for designing an innovative
            tactical mobile command center. This experience instilled in me the importance of reliability,
            security, and mission-critical system design.
          </p>

          <p>
            When I'm not coding, you can find me perfecting my espresso brewing technique, experimenting
            with new recipes in the kitchen, or exploring the outdoors through hiking and mountain biking.
            I've even trained a <a href="https://chatgpt.com/g/g-3oPIRNBis-chef-markus" target="_blank" rel="noopener noreferrer" className="text-orange-600 hover:text-orange-700 underline">personal AI chef</a> that
            cooks exactly to my style and preferences. I'm passionate about the balance between technology
            and nature, and I find that time spent on trails or crafting the perfect shot of espresso often
            leads to my best technical insights.
          </p>
        </div>

        {/* Skills Section */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold mb-6">Skills & Expertise</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Programming & Scripting</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary">Python (Advanced)</Badge>
                  <Badge variant="secondary">TypeScript/JavaScript</Badge>
                  <Badge variant="secondary">C/C++</Badge>
                  <Badge variant="secondary">Rust</Badge>
                  <Badge variant="secondary">Golang</Badge>
                  <Badge variant="secondary">Bash</Badge>
                  <Badge variant="secondary">Perl</Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Cloud & Infrastructure</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary">AWS</Badge>
                  <Badge variant="secondary">Azure</Badge>
                  <Badge variant="secondary">Kubernetes</Badge>
                  <Badge variant="secondary">Docker</Badge>
                  <Badge variant="secondary">Terraform</Badge>
                  <Badge variant="secondary">Ansible</Badge>
                  <Badge variant="secondary">GitLab CI/CD</Badge>
                  <Badge variant="secondary">Jenkins</Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>AI/ML & Data</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary">LLM Fine-tuning</Badge>
                  <Badge variant="secondary">Neural Networks</Badge>
                  <Badge variant="secondary">MLOps Pipelines</Badge>
                  <Badge variant="secondary">Data Engineering</Badge>
                  <Badge variant="secondary">Jupyter</Badge>
                  <Badge variant="secondary">Oracle DB</Badge>
                  <Badge variant="secondary">SQL</Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Security & Systems</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary">SSO/mTLS</Badge>
                  <Badge variant="secondary">SAST/DAST</Badge>
                  <Badge variant="secondary">DISA STIG</Badge>
                  <Badge variant="secondary">Supply Chain Security</Badge>
                  <Badge variant="secondary">Distributed Systems</Badge>
                  <Badge variant="secondary">High Availability</Badge>
                  <Badge variant="secondary">Microservices</Badge>
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
            <a href="https://chatgpt.com/g/g-3oPIRNBis-chef-markus" target="_blank" rel="noopener noreferrer">
              <Button variant="outline" size="lg">
                <ChefHat className="mr-2 h-5 w-5" />
                Chef Markus AI
              </Button>
            </a>
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
