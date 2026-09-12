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
            I have led teams developing TypeScript, Python, and Go applications
            for the test and evaluation community. My work includes agentic AI
            tools and evaluation benchmarks for retrieval performance,
            adversarial prompting, and agent behavior.
          </p>
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
            days to four hours. I also researched AI agents for reverse
            engineering binaries of unknown origin using Ghidra and other
            forensic and analysis tools, and built supporting ML pipelines
            and evaluation datasets. I served as Senior Research
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
            My doctoral research concerns low-cost ice detection for airborne
            vehicles using flexible capacitive sensors and relaxation
            oscillators. I work on sensor circuits, embedded measurement
            firmware, and experiments to study water-to-ice transitions.
            I earned an MS in 2018 and a Bachelor of Electrical Engineering in 2013.
          </p>
          <p>
            As a Graduate Research Assistant from August 2016 to May 2020, I
            developed a device placed inside hay bales to monitor temperature
            and moisture associated with spontaneous-combustion risk. The work
            included calibration, firmware, and a phone-accessible interface.
            I was first author of “An Agricultural IoT Device for Monitoring
            Environmental Conditions in Hay Bales” (2018). I also taught analog
            electronics and wireless engineering laboratories.
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
