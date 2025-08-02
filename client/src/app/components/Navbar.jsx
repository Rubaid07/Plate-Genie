"use client";

import Link from 'next/link';

const Navbar = () => {
  return (
    <nav className="bg-gray-800 text-white p-4 shadow-md">
      <div className="container mx-auto">
        <Link href="/" className="text-2xl font-bold hover:text-green-400 transition-colors">
          PlateGenie
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;