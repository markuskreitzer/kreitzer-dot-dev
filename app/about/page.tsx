import type { Metadata } from "next";
import { WorkshopNav } from "@/components/WorkshopNav";

export const metadata: Metadata = {
  title: "About",
  description:
    "Hands-on AI engineering, developer tooling, deployment automation, and ongoing doctoral research.",
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
            At PeopleTec, I established DevOps practices for several projects. I
            now lead the team and define delivery requirements and engineering
            standards, while team members handle most day-to-day DevOps
            implementation. My work also includes reusable services,
            identity-aware integration, and developer workflows. I architected
            and built a full Go application and led its development team as
            technical lead before handing off team leadership. I also help teams
            connect architecture with implementation through code review and
            mentoring.
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
            Earlier roles at DISA, Unisys, QinetiQ, Apple, and the Marine Corps
            developed my approach to troubleshooting, instrumentation,
            communications, and reliable operations. Today that background
            informs both large software systems and small workbench experiments.
          </p>
        </section>
        <a href="https://www.linkedin.com/in/markuskreitzer/">
          Full professional profile
        </a>
      </main>
    </div>
  );
}
