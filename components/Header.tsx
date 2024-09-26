"use client"
import React from 'react'
import { Button } from "@/components/ui/button";
import { FaMap, FaUser } from "react-icons/fa";
import { motion } from 'framer-motion'

function Header() {
  return (
    <motion.header
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-white shadow-md"
      >
        <div className="container mx-auto px-4 py-4 flex justify-between items-center max-w-7xl">
          <h1 className="text-2xl font-bold text-indigo-600">CodeRonin</h1>
          <nav className="flex space-x-4">
            <Button variant="ghost" className="flex items-center">
              <FaUser className="mr-2" /> Dashboard
            </Button>
            <Button variant="ghost" className="flex items-center">
              <FaMap className="mr-2" /> Learning Roadmap
            </Button>
          </nav>
        </div>
      </motion.header>
  )
}

export default Header