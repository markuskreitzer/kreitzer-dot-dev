import Link from "next/link";

export function WorkshopNav() {
  return (
    <header className="workshop-nav">
      <Link className="wordmark" href="/">
        Markus Kreitzer<span>Engineering notebook & workbench</span>
      </Link>
      <nav aria-label="Main navigation">
        <Link href="/work">Work</Link>
        <Link href="/about">About</Link>
        <Link href="/blog">Writing</Link>
        <a href="https://www.linkedin.com/in/markuskreitzer/">Contact</a>
      </nav>
    </header>
  );
}
