"use client";

import Link from 'next/link';

const Navbar = () => {
  return (
    <nav className="bg-card text-foreground p-4 shadow-md">
      <div className="container mx-auto max-w-7xl">
        <Link href="/" className="text-2xl font-bold hover:text-primary transition-colors">
          PlateGenie
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;