import type { Metadata } from "next";
import { WorkshopNav } from "@/components/WorkshopNav";
import { ProjectList } from "@/components/ProjectList";
import { engineeringProjects } from "@/lib/projects";

export const metadata: Metadata = {
  title: "Work",
  description:
    "GitHub projects, instrumentation, AI tools, and doctoral research by Markus Kreitzer.",
  alternates: { canonical: "/work" },
};
export default function WorkPage() {
  return (
    <div className="workshop">
      <WorkshopNav />
      <main id="main-content" className="workshop-page">
        <h1>Projects</h1>
        <ProjectList items={engineeringProjects} />
      </main>
    </div>
  );
}
