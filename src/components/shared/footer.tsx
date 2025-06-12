'use client';

export default function Footer() {
  return (
    <footer className="w-full border-t pb-6 pt-4 text-center text-sm text-muted-foreground">
      &copy; 2025{' '}
      <a
        href="https://www.gravitasdrc.com"
        target="_blank"
        rel="noopener noreferrer"
        className="font-medium text-foreground hover:underline"
      >
        GRAVITAS sarl
      </a>{' '}
      — All rights reserved.
    </footer>
  );
}
