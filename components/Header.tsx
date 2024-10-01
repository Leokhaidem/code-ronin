"use client"
import React from 'react'
import { Button } from "@/components/ui/button";
import { FaUser, FaSignOutAlt } from "react-icons/fa";
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation';
import { signOut } from "next-auth/react";

function Header() {
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut({ redirect: false });
    router.push("/");
  };

  return (
    <motion.header
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="bg-white shadow-md"
    >
      <div className="container mx-auto px-4 py-4 flex justify-between items-center max-w-7xl">
        <button onClick={() => router.push("/")}>
          <h1 className="text-2xl font-bold text-indigo-600">CodeRonin</h1>
        </button>
        <nav className="flex space-x-4">
          <Button variant="ghost" className="flex items-center" onClick={() => router.push("/dashboard")}>
            <FaUser className="mr-2" /> Dashboard
          </Button>
          <Button variant="ghost" className="flex items-center" onClick={handleSignOut}>
            <FaSignOutAlt className="mr-2" /> Log out
          </Button>
        </nav>
      </div>
    </motion.header>
  )
}

export default Header