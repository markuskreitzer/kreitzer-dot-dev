'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Twitter, Linkedin, Link as LinkIcon, Check } from 'lucide-react';
import { siteConfig } from '@/lib/config';

interface ShareButtonsProps {
  title: string;
  slug: string;
}

export function ShareButtons({ title, slug }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);
  const url = `${siteConfig.site.url}/blog/${slug}`;

  const shareOnTwitter = () => {
    const text = encodeURIComponent(`${title} by ${siteConfig.user.name}`);
    const twitterUrl = `https://twitter.com/intent/tweet?text=${text}&url=${encodeURIComponent(url)}`;
    window.open(twitterUrl, '_blank', 'width=550,height=420');
  };

  const shareOnLinkedIn = () => {
    const linkedInUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
    window.open(linkedInUrl, '_blank', 'width=550,height=420');
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy link:', err);
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-3">
      <span className="text-sm font-medium text-muted-foreground">Share:</span>

      <Button
        variant="outline"
        size="sm"
        onClick={shareOnTwitter}
        className="gap-2"
      >
        <Twitter className="h-4 w-4" />
        Twitter
      </Button>

      <Button
        variant="outline"
        size="sm"
        onClick={shareOnLinkedIn}
        className="gap-2"
      >
        <Linkedin className="h-4 w-4" />
        LinkedIn
      </Button>

      <Button
        variant="outline"
        size="sm"
        onClick={copyLink}
        className="gap-2"
      >
        {copied ? (
          <>
            <Check className="h-4 w-4" />
            Copied!
          </>
        ) : (
          <>
            <LinkIcon className="h-4 w-4" />
            Copy Link
          </>
        )}
      </Button>
    </div>
  );
}
