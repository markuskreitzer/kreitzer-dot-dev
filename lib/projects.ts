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
      "A Python server that lets an MCP client configure a PicoScope and request a waveform capture.",
    contribution:
      "I wrote the MCP server and the PicoSDK interface.",
    status: "Prototype",
    technologies: ["Python", "FastMCP", "PicoSDK"],
    source: "https://github.com/markuskreitzer/picoscope_mcp",
    sections: [
      {
        title: "Instrument control",
        body: "The server gives an AI client separate tools to find an instrument, connect to it, configure channels and triggers, and capture a block of samples. Each step has explicit parameters so the client can inspect and change the setup.",
      },
      {
        title: "Implementation",
        body: "MCP requests become typed configuration objects and PicoSDK calls. A capture starts with a device connection, followed by channel and trigger setup. The block-acquisition path returns waveform samples for the client to inspect.",
      },
      {
        title: "Acquisition support",
        body: "Configuration and block acquisition are implemented. Running them requires a compatible PicoScope and the native PicoSDK libraries. The basic tests check server behavior; acquisition still needs to be checked against the connected instrument.",
      },
      {
        title: "Limits",
        body: "Streaming is unfinished. The frequency and amplitude tools return instructions, not measurements. FFT, THD, and rise-time tools are placeholders. Those limits make this a prototype; a client should not treat those tool responses as calculated results.",
      },
    ],
  },
  {
    slug: "ryobi-moisture-meter",
    title: "Ryobi moisture-meter decoder",
    category: "Instrumentation",
    summary:
      "Reading a Ryobi ES3000 moisture meter through a Mac’s audio connection.",
    contribution:
      "I reconstructed the read protocol and wrote the capture, decoder, and calibration logging tools.",
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
        body: "The ES3000 uses a phone’s audio connection for communication. To request a reading, the software sends a 2.2 kHz excitation tone and short bursts. The meter replies with a train of pulses that can be recorded as audio.",
      },
      {
        title: "Decoding",
        body: "The Python tools generate the request and record the response. The decoder finds candidate frames, extracts the raw moisture value, and looks it up in the original material-group table. Repeated captures can be combined, and the log can include a reference meter reading for comparison.",
      },
      {
        title: "Sample captures",
        body: "The repository includes WAV files that can be decoded without attaching a meter. The wood recording yields two valid frames with raw value 6. For material group 1, the original conversion table maps that value to 0.0%.",
      },
      {
        title: "Limits",
        body: "Decoding a valid frame checks the communication path. Measurement accuracy needs a separate comparison against a reference, with the material and contact conditions recorded. Audio hardware and calibration can affect the result.",
      },
    ],
  },
  {
    slug: "coffee-detector",
    title: "Coffee-roaster beep detector",
    category: "Instrumentation",
    summary:
      "A microphone listens for a first-generation Hottop roaster’s warm-up beeps and triggers a notification.",
    contribution:
      "I wrote the tone detector, beep timing checks, audio-input diagnostics, and notification code.",
    status: "Personal automation",
    technologies: ["Python", "NumPy", "FFmpeg", "Audio"],
    source: "https://github.com/markuskreitzer/coffee_detector",
    sections: [
      {
        title: "Beep detection",
        body: "The target tone is near 4.10 kHz. A tone at that frequency alone is not enough: the detector waits for three beeps with the expected timing before reporting that the roaster is ready.",
      },
      {
        title: "Testing",
        body: "A dry run feeds a reference recording through the detector without sending an alert. The input checks report missing audio frames and sustained digital silence. A tone diagnostic shows the received frequency and its level relative to the background, which helps when placing the microphone.",
      },
      {
        title: "Limits",
        body: "The detector recognizes this roaster’s warm-up signal. It does not identify first crack, second crack, or cooling. Pushover notifications need credentials supplied by the person running it. The code uses the PolyForm Noncommercial license.",
      },
    ],
  },
  {
    slug: "image-gen",
    title: "Image generation experiments",
    category: "AI and developer tools",
    summary: "A Python command-line tool for running FLUX image generation locally.",
    contribution: "I work on the command-line interface and local model execution.",
    status: "Experimental",
    technologies: ["Python", "AI"],
    source: "https://github.com/markuskreitzer/image-gen",
    sections: [],
  },
  {
    slug: "midpoint",
    title: "Midpoint Calculator",
    category: "Applications",
    summary: "Find a meeting point between locations on a map.",
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
      "A calendar for entering RV reservations and checking which sites are occupied.",
    contribution:
      "I built the application. The public demo stores its reservations in your browser.",
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
      "My electrical engineering research at Auburn includes IoT sensors, communications, and chaotic systems.",
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
