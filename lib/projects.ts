export interface Project {
  slug: string;
  title: string;
  category:
    "AI and developer tools" | "Instrumentation" | "Applications" | "Research";
  summary: string;
  contribution: string;
  status: string;
  technologies: string[];
  image?: { src: string; alt: string };
  source?: string;
  demo?: string;
  sections: { title: string; body: string }[];
}

export const projects: Project[] = [
  {
    slug: "picoscope-mcp",
    title: "PicoScope MCP",
    category: "Instrumentation",
    summary:
      "A Python MCP interface that connects AI clients to PicoScope configuration and block acquisition.",
    contribution:
      "Designed and implemented the MCP server and instrument interface.",
    status: "Prototype",
    technologies: ["Python", "FastMCP", "PicoSDK"],
    source: "https://github.com/markuskreitzer/picoscope_mcp",
    sections: [
      {
        title: "Instrument control",
        body: "Can an AI client work through the same explicit setup steps as a person at a test bench? This project exposes discovery, connection, channel configuration, triggering, and block capture as structured tools.",
      },
      {
        title: "Implementation",
        body: "The server maps MCP requests into typed configuration models and PicoSDK calls. A capture workflow connects a device, configures a channel and trigger, then returns sampled waveform data for inspection.",
      },
      {
        title: "Acquisition support",
        body: "The implementation contains the configuration and block-acquisition paths. Hardware operation depends on a compatible instrument and native PicoSDK libraries. Hardware acquisition requires validation on the connected instrument.",
      },
      {
        title: "Limits",
        body: "Streaming is incomplete. Frequency and amplitude tools provide guidance rather than calculated results, and FFT, THD, rise-time, and several advanced tools are placeholders. The project is an instrument-integration prototype.",
      },
    ],
  },
  {
    slug: "ryobi-moisture-meter",
    title: "Ryobi moisture-meter decoder",
    category: "Instrumentation",
    summary:
      "Reconstructing an audio protocol to read a Ryobi ES3000 from a Mac.",
    contribution:
      "Reconstructed the read protocol and built capture, decoding, and calibration-log tools.",
    image: {
      src: "/images/ryobi-signal.svg",
      alt: "A 90 millisecond window of recorded Ryobi ES3000 audio, with time and full-scale amplitude axes.",
    },
    status: "Experimental hardware tool",
    technologies: ["Python", "NumPy", "FFmpeg", "Signal processing"],
    source: "https://github.com/markuskreitzer/ryobi-moisture-meter",
    sections: [
      {
        title: "Audio protocol",
        body: "The ES3000 communicates through a phone audio connection. The work starts with the original read path: a 2.2 kHz excitation tone, short request bursts, and a returning pulse train.",
      },
      {
        title: "Decoding",
        body: "Python generates the request waveform, records the response, finds candidate frames, decodes the moisture payload, and applies the original material-group conversion. Repeated captures can be aggregated, and readings can be logged beside a reference meter value.",
      },
      {
        title: "Sample captures",
        body: "Curated WAV captures make offline decoding repeatable. The stored wood capture decodes to two valid frames with raw value 6. The original material table maps that value to 0.0% for group 1.",
      },
      {
        title: "Limits",
        body: "A valid protocol frame does not establish measurement accuracy. Contact quality, audio hardware, material selection, and calibration still matter. The tool supports investigation and comparison; it is not a certified moisture instrument.",
      },
    ],
  },
  {
    slug: "coffee-detector",
    title: "Coffee-roaster beep detector",
    category: "Instrumentation",
    summary:
      "An acoustic monitor for the warm-up beep cadence of a first-generation Hottop coffee roaster.",
    contribution:
      "Built the tone and cadence detector, input health checks, and notification workflow.",
    status: "Personal automation",
    technologies: ["Python", "NumPy", "FFmpeg", "Audio"],
    source: "https://github.com/markuskreitzer/coffee_detector",
    sections: [
      {
        title: "Beep detection",
        body: "The detector listens for a tone near 4.10 kHz and requires three correctly timed beeps before declaring the roaster ready. Timing helps distinguish the desired event from unrelated sounds.",
      },
      {
        title: "Testing",
        body: "A reference recording can run through the same detector in dry-run mode. Input health checks detect missing frames and sustained digital silence. A separate tone diagnostic reports the received frequency and target-to-background ratio.",
      },
      {
        title: "Limits",
        body: "This is a warm-up beep detector for a specific roaster, not a general roasting-state classifier. First crack, second crack, and cooling recognition remain research directions. Pushover alerts require separately configured credentials; the repository uses the PolyForm Noncommercial license.",
      },
    ],
  },
  {
    slug: "image-gen",
    title: "Image generation experiments",
    category: "AI and developer tools",
    summary: "A Python workspace for image-generation tooling.",
    contribution: "Personal tooling and experimentation.",
    status: "Experimental",
    technologies: ["Python", "AI"],
    source: "https://github.com/markuskreitzer/image-gen",
    sections: [],
  },
  {
    slug: "midpoint",
    title: "Midpoint Calculator",
    category: "Applications",
    summary: "A web application for exploring a geographic midpoint.",
    contribution: "Application development.",
    status: "Public application",
    demo: "https://midpoint.kreitzer.dev",
    technologies: ["Svelte", "TypeScript"],
    source: "https://github.com/markuskreitzer/midpoint-calc",
    sections: [],
  },
  {
    slug: "recipes",
    title: "Kreitzer Family Recipes",
    category: "Applications",
    summary:
      "A searchable recipe collection with categories and individual recipe pages.",
    contribution: "Application development and maintenance.",
    status: "Live application",
    technologies: ["Svelte", "Web"],
    sections: [],
  },
  {
    slug: "heil-die-leser",
    title: "Heil die Leser",
    category: "Applications",
    summary:
      "A bilingual reading archive for Amanda Kreitzer’s essays and monthly columns.",
    contribution:
      "Website and archive presentation; writing by Amanda Kreitzer.",
    status: "Live website",
    technologies: ["SvelteKit", "Publishing"],
    demo: "https://www.heildieleser.com",
    sections: [],
  },
  {
    slug: "health-in-hand",
    title: "Health in Hand",
    category: "Applications",
    summary:
      "A clinic website with service information and downloadable intake forms.",
    contribution: "Website implementation.",
    status: "Client website",
    technologies: ["Next.js", "React"],
    demo: "https://healthinhand.vercel.app",
    sections: [],
  },
  {
    slug: "rv-reservation-demo",
    image: {
      src: "/images/rv-demo.png",
      alt: "RV reservation demo showing the ten-site calendar with no reservations.",
    },
    title: "RV Reservation Schedule",
    category: "Applications",
    summary:
      "An interactive reservation calendar with site occupancy and reservation entry.",
    contribution:
      "Application development; public demo with browser-local data.",
    status: "Interactive demo",
    technologies: ["SvelteKit", "TypeScript", "Tauri"],
    demo: "https://rv-reservation-demo.vercel.app",
    sections: [],
  },
  {
    slug: "sensor-research",
    title: "Doctoral research",
    category: "Research",
    summary:
      "Electrical engineering research spanning IoT sensors, communications, and chaotic systems.",
    contribution:
      "Research, firmware, hardware design, and laboratory teaching at Auburn University.",
    status: "Ongoing PhD",
    technologies: ["Embedded systems", "Python", "Signal processing"],
    sections: [],
  },
];

export const featuredProjects = projects.filter(
  (project) => project.sections.length > 0,
);
