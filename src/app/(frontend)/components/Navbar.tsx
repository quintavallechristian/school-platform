'use client'

import React, { useState } from 'react'
import Link from 'next/link'

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isTeachersOpen, setIsTeachersOpen] = useState(false)

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-8 py-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-gray-800 hover:text-indigo-600">
          Blog Scuola
        </Link>

        <button
          className="md:hidden flex flex-col gap-1.5 p-0 bg-transparent border-0 cursor-pointer"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          <span className="w-6 h-0.5 bg-gray-800 transition-all"></span>
          <span className="w-6 h-0.5 bg-gray-800 transition-all"></span>
          <span className="w-6 h-0.5 bg-gray-800 transition-all"></span>
        </button>

        <ul
          className={`${
            isMenuOpen ? 'max-h-96' : 'max-h-0 md:max-h-none'
          } md:flex md:gap-8 list-none m-0 p-0 overflow-hidden transition-all duration-300 absolute md:static top-full left-0 right-0 bg-white md:bg-transparent shadow-md md:shadow-none`}
        >
          <li
            className="relative border-b md:border-0 border-gray-100"
            onMouseEnter={() => setIsTeachersOpen(true)}
            onMouseLeave={() => setIsTeachersOpen(false)}
          >
            <Link
              href="/chi-siamo"
              className="block text-gray-800 no-underline px-4 py-2 hover:text-indigo-600 transition-colors"
            >
              Chi Siamo
            </Link>
            <ul
              className={`${
                isTeachersOpen
                  ? 'opacity-100 visible translate-y-0'
                  : 'opacity-0 invisible -translate-y-2'
              } md:absolute static top-full left-0 bg-white md:shadow-lg list-none p-2 md:p-0 m-0 min-w-[200px] transition-all duration-300 md:bg-gray-50`}
            >
              <li>
                <Link
                  href="/chi-siamo/insegnanti"
                  className="block text-gray-800 no-underline px-4 py-2 hover:bg-gray-100 hover:text-indigo-600 transition-colors"
                >
                  I Nostri Insegnanti
                </Link>
              </li>
            </ul>
          </li>
          <li className="border-b md:border-0 border-gray-100">
            <Link
              href="/blog"
              className="block text-gray-800 no-underline px-4 py-2 hover:text-indigo-600 transition-colors"
            >
              Blog
            </Link>
          </li>
          <li className="border-b md:border-0 border-gray-100">
            <Link
              href="/eventi"
              className="block text-gray-800 no-underline px-4 py-2 hover:text-indigo-600 transition-colors"
            >
              Eventi
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  )
}
