"use client";

import { useEffect, useRef } from "react";
import { webApps } from "@/lib/projects";

export function WebAppsMenu() {
  const menu = useRef<HTMLDetailsElement>(null);

  useEffect(() => {
    const closeOutside = (event: PointerEvent) => {
      if (menu.current && !menu.current.contains(event.target as Node)) {
        menu.current.open = false;
      }
    };
    document.addEventListener("pointerdown", closeOutside);
    return () => document.removeEventListener("pointerdown", closeOutside);
  }, []);

  return (
    <details
      ref={menu}
      className="web-apps-menu"
      onKeyDown={(event) => {
        if (event.key === "Escape" && menu.current) {
          menu.current.open = false;
          menu.current.querySelector("summary")?.focus();
        }
      }}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) {
          event.currentTarget.open = false;
        }
      }}
    >
      <summary>Web Apps</summary>
      <ul>
        {webApps.map((app) => (
          <li key={app.slug}>
            <a href={app.demo}>{app.title}</a>
          </li>
        ))}
      </ul>
    </details>
  );
}
