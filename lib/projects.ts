export interface Project {
  slug: string;
  title: string;
  category:
    "AI and developer tools" | "Instrumentation" | "Applications" | "Research";
  summary: string;
  introduction?: string[];
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
      "Project direction with AI-assisted implementation.",
    status: "Prototype",
    technologies: ["Python", "FastMCP", "PicoSDK"],
    source: "https://github.com/markuskreitzer/picoscope_mcp",
    introduction: [
      "PicoScope oscilloscopes connect to a computer over USB. An AI assistant can help write code for an experiment, but working with the instrument also requires a way to configure it and retrieve its samples. This project provides that connection through the Model Context Protocol (MCP).",
      "The project uses a Python server between the assistant and PicoSDK, the library that controls the scope. The assistant can request operations such as selecting a channel, setting a trigger, and capturing a waveform. The server translates those requests into calls to the instrument library."
],
    sections: [
      {
            "title": "From a request to a waveform",
            "body": "A capture involves several decisions before any samples come back: which device to connect to, which channel to enable, what voltage range to use, and when to trigger. The server exposes these as separate operations so the assistant can configure the measurement explicitly. The block-capture path then returns the sampled waveform for inspection."
      },
      {
            "title": "What is implemented",
            "body": "Device configuration and block acquisition have implementation paths, but they still need validation with the connected scope and its native SDK. Streaming is unfinished. Several analysis tools, including FFT, THD, and rise time, are placeholders; the frequency and amplitude tools currently return instructions rather than calculated measurements. The project is a prototype of the instrument connection, with more work needed before an assistant can rely on it for a complete measurement."
      }
],
  },
  {
    slug: "ryobi-moisture-meter",
    title: "Ryobi moisture-meter decoder",
    category: "Instrumentation",
    summary:
      "Reading a Ryobi ES3000 moisture meter through a Mac’s audio connection.",
    contribution:
      "I directed the investigation and tested the physical meter while Codex investigated the protocol and implemented the tools.",
    image: {
      src: "/images/ryobi-signal.svg",
      alt: "A 90 millisecond window of recorded Ryobi ES3000 audio, with time and full-scale amplitude axes.",
    },
    status: "Experimental hardware tool",
    technologies: ["Python", "NumPy", "FFmpeg", "Signal processing"],
    source: "https://github.com/markuskreitzer/ryobi-moisture-meter",
    introduction: [
      "The Ryobi ES3000 is a moisture meter from the Phone Works range. Its pins go into the material being measured, but the reading appears in a phone app. The meter connects through the phone’s headphone jack, using audio signals to communicate with the app.",
      "I had one connected to my Mac in the shop and wanted to make it useful again. I asked Codex to investigate how to read it, while I handled the meter and tried it on the materials around me. The manual and an archived Android app provided enough information to reconstruct the exchange. Codex examined the app’s code and implemented the capture and decoding tools."
],
    sections: [
      {
            "title": "Reconstructing the exchange",
            "body": "The request uses both stereo channels: a continuous 2.2 kHz square wave on the left and short request bursts on the right. The meter sends a pulse train back through the microphone input. Reproducing both parts of the request made it possible to generate the tone in Python and decode the reply without running the phone app."
      },
      {
            "title": "Turning pulses into a reading",
            "body": "The decoder looks for a frame prefix, extracts the device identifier and moisture payload, and applies the app’s conversion table for the selected material. The material choice matters because the same raw value can map to different percentages. Saved WAV captures let Codex work on the decoder against the same input while I changed the physical setup for the next measurement."
      },
      {
            "title": "Checking that contact changed the response",
            "body": "Air and the tested dry wood both returned a raw value of 6, which the hardwood table displays as 0.0%. A wet finger across the pins returned 26–27, and a damp cloth returned 19. Those observations showed that probe contact changed the response, although the wood result could still reflect poor contact or the bottom of the app’s display range. Establishing moisture accuracy requires paired readings against a reference meter; the logging tool can save those comparisons alongside the captures."
      }
],
  },
  {
    slug: "coffee-detector",
    title: "Coffee-roaster beep detector",
    category: "Instrumentation",
    summary:
      "A phone alert so I don’t miss the moment to add green beans to my coffee roaster.",
    contribution:
      "I supplied the recording, set the requirements, and tested the detector with Codex handling implementation.",
    status: "Personal automation",
    technologies: ["Python", "NumPy", "FFmpeg", "Audio"],
    source: "https://github.com/markuskreitzer/coffee_detector",
    introduction: [
      "My Hottop coffee roaster takes a while to preheat. While I’m waiting, I usually start doing something around the yard or in my shop and miss the beep. That’s the signal to add the green beans, and if I miss that moment, I don’t get a good roast.",
      "I gave Codex a recording of the beep and asked it to build a detector that would send a Pushover alert to my phone. I tested it by playing the recording and checking whether an alert arrived. The first version only picked it up when the sound was close and loud, so we adjusted it and tried again.",
      "The detector listens through a microphone for a tone near 4.10 kHz and checks the spacing of three beeps before sending an alert. A recording can also be replayed through the program in dry-run mode, which checks detection without heating the roaster or sending a notification."
],
    sections: [
      {
            "title": "Getting the microphone to stay connected",
            "body": "I later moved the detector to the ASUS X202E laptop that runs my 3D printer, since it was now beside the roaster. During a roast, no alert arrived. We tested with the beep recording on a loop and investigated the audio input. One problem was that starting a capture stream caused PipeWire to restore the internal microphone route, even with an external microphone plugged into the combo jack. The service now waits for capture to start and then selects the external input. It also checks for missing frames and sustained digital silence, so a running process with a dead audio input does not quietly appear healthy."
      },
      {
            "title": "Testing the whole audio path",
            "body": "Replaying the file directly through the detector checks the signal-processing code, but it skips the microphone, room acoustics, and audio routing. For those tests, I played the beep aloud while Codex inspected the input. The live diagnostic reports the strongest frequency and its level relative to the background, which helps locate a failure before changing detection thresholds."
      },
      {
            "title": "Running on an ESP32",
            "body": "The repository also contains firmware for an ESP32-WROOM-32 with an INMP441 microphone. It detects the warm-up signal and sends the notification over Wi-Fi without streaming or storing the audio. Recognizing first crack or second crack would require a different detector; the current work is specifically about the warm-up beeps."
      }
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
      "My doctoral research uses flexible capacitive sensors and relaxation oscillators to investigate ice detection for airborne vehicles.",
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
