import Link from "next/link";
import { WebAppsMenu } from "@/components/WebAppsMenu";

export function WorkshopNav() {
  return (
    <header className="workshop-nav">
      <Link className="wordmark" href="/">
        Markus Kreitzer
      </Link>
      <nav aria-label="Main navigation">
        <Link href="/work">Projects</Link>
        <WebAppsMenu />
        <Link href="/about">About</Link>
        <Link href="/blog">Writing</Link>
        <a href="https://www.linkedin.com/in/markuskreitzer/">Contact</a>
      </nav>
    </header>
  );
}
