import type { Metadata } from "next";
import { WorkshopNav } from "@/components/WorkshopNav";

export const metadata: Metadata = {
  title: "About",
  description:
    "Markus Kreitzer’s work at PeopleTec, deployment automation at Valkyrie and Evolvent, and research at Auburn.",
  alternates: { canonical: "/about" },
};
export default function AboutPage() {
  return (
    <div className="workshop">
      <WorkshopNav />
      <main id="main-content" className="workshop-page case-study">
        <h1>About</h1>
        <p className="page-intro">
          I work at PeopleTec in Huntsville and am pursuing a PhD at Auburn
          University.
        </p>
        <section>
          <h2>PeopleTec</h2>
          <p>
            I architected and built a Go application at PeopleTec and led its
            development team as technical lead. I have since handed that team
            over to another lead.
          </p>
          <p>
            I also set up DevOps for several projects. My team now handles most
            of that implementation; I specify the requirements and engineering
            standards and review the work. Other parts of my role include
            service integration, developer tooling, and code review.
          </p>
          <p>
            My roles are Technical Leader - Artificial Intelligence (April 2026
            to present), Lead Software Architect (October 2025 to May 2026), and
            Senior AIML Software Engineer/Architect (December 2024 to October
            2025).
          </p>
        </section>
        <section>
          <h2>Valkyrie and Evolvent</h2>
          <p>
            At Valkyrie Enterprises, I inherited a system of 26 microservices
            across 89 repositories and overhauled its DevSecOps and GitLab
            CI/CD: SAST/DAST, SBOM generation, builds, and testing. I built a
            Kubernetes cluster from the lab’s high-performance desktops and
            parallelized end-to-end simulations, reducing test runs from seven
            days to four hours. I also built ML pipelines with benchmark
            datasets and typed audit trails. I served as Senior Research
            Scientist from May 2020 to December 2024; my Hill Technical
            Solutions role was Senior Software Engineer from May 2020 to August
            2022.
          </p>
          <p>
            At Evolvent, a ManTech company, I was a Systems Engineer from August
            2011 to May 2020. I built deployment and operational tooling in Java
            and Python, used Ansible for automation, and created a one-click
            deployment dashboard supporting approximately 20 developers.
          </p>
        </section>
        <section>
          <h2>Auburn University</h2>
          <p>
            I am pursuing a PhD in electrical engineering at Auburn University.
            My research background includes sensors, IoT, chaotic systems,
            software-defined radio, and neural networks. I earned an MS in 2018
            and a Bachelor of Electrical Engineering in 2013.
          </p>
          <p>
            As a Graduate Research Assistant from August 2016 to May 2020, I
            worked on hardware and firmware and taught analog electronics and
            wireless engineering laboratories.
          </p>
        </section>
        <section>
          <h2>Earlier experience</h2>
          <p>
            Before these roles, I worked at DISA, Unisys, QinetiQ, and Apple,
            and served in the Marine Corps. That work included troubleshooting,
            communications, and systems operations.
          </p>
        </section>
        <a href="https://www.linkedin.com/in/markuskreitzer/">
          Work history on LinkedIn
        </a>
      </main>
    </div>
  );
}
