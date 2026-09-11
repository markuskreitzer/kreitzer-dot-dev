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
        <h1>
          An engineer across
          <br />
          software and signals.
        </h1>
        <p className="page-intro">
          I like understanding how a system works, building the missing pieces,
          and making it easier for the next person to use.
        </p>
        <section>
          <h2>Hands-on engineering and technical leadership</h2>
          <p>
            At PeopleTec, I work on AI and platform engineering: CI/CD, secure
            container pipelines, reusable services, identity-aware integration,
            and developer workflows. I built a Go prototype for orchestration
            and help teams connect architecture with implementation through code
            review and mentoring.
          </p>
          <p>
            My roles are Technical Leader - Artificial Intelligence (April 2026
            to present), Lead Software Architect (October 2025 to May 2026), and
            Senior AIML Software Engineer/Architect (December 2024 to October
            2025).
          </p>
        </section>
        <section>
          <h2>Automation as part of the product</h2>
          <p>
            At Valkyrie Enterprises, my work included an 89-service system
            delivered through GitLab CI/CD on Kubernetes, automated security
            checks, and ML pipelines with benchmark datasets and typed audit
            trails. I served as Senior Research Scientist from May 2020 to
            December 2024; my Hill Technical Solutions role was Senior Software
            Engineer from May 2020 to August 2022.
          </p>
          <p>
            At Evolvent, a ManTech company, I was a Systems Engineer from August
            2011 to May 2020. I built deployment and operational tooling in Java
            and Python, used Ansible for automation, and created a one-click
            deployment dashboard supporting approximately 20 developers.
          </p>
        </section>
        <section>
          <h2>Research alongside practice</h2>
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
          <h2>A broad engineering foundation</h2>
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
