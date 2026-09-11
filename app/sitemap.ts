import { MetadataRoute } from "next";
import { getAllPosts } from "@/lib/blog";
import { featuredProjects } from "@/lib/projects";
import { siteConfig } from "@/lib/config";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    ...["", "/work", "/about", "/blog"].map((route) => ({
      url: `${siteConfig.site.url}${route}`,
    })),
    ...featuredProjects.map((project) => ({
      url: `${siteConfig.site.url}/work/${project.slug}`,
    })),
    ...getAllPosts().map((post) => ({
      url: `${siteConfig.site.url}/blog/${post.slug}`,
      lastModified: new Date(post.date),
    })),
  ];
}
