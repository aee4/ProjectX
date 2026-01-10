'use client'

import { useEffect, useState } from "react"
import { ChevronDown, ArrowRight } from 'lucide-react'
import { Link } from "react-router-dom"
import homepageImage from "@/assets/homepage.jpg"

export function HeroLanding() {
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        // Handle escape if needed
      }
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [])

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#0a0f1a]">
      {/* Subtle blue background gradient overlays */}
      <div className="pointer-events-none absolute inset-0 z-0">
        <div
          className="absolute left-[-10%] top-[-20%] h-[600px] w-[600px] rounded-full opacity-30"
          style={{
            background:
              "radial-gradient(circle, rgba(59,130,246,0.5) 0%, transparent 70%)",
          }}
        />
        <div
          className="absolute bottom-[-10%] right-[-10%] h-[500px] w-[500px] rounded-full opacity-20"
          style={{
            background:
              "radial-gradient(circle, rgba(99,102,241,0.5) 0%, transparent 70%)",
          }}
        />
      </div>

      {/* Main Content */}
      <main className="relative z-10 flex min-h-screen flex-col">
        {/* Hero Image Background */}
        <div className="absolute inset-0 z-0">
          <img
            src={homepageImage}
            alt="Homepage background"
            className="h-full w-full object-cover opacity-40"
          />
        </div>

        <div className="relative z-10 flex flex-1 flex-col justify-center px-6 pb-20 pt-32 sm:px-12 lg:px-20">
          {/* Left Content */}
          <div className="max-w-3xl">
            <h1 className="mb-6 text-4xl font-bold leading-tight tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl">
              Accelerate your
              <br />
              <span className="bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 bg-clip-text text-transparent">
                venue scheduling
              </span>
            </h1>

            <p className="mb-10 max-w-xl text-base leading-relaxed text-gray-300 sm:text-lg md:text-xl">
              Trusted by students and faculty, we solve scheduling challenges and
              <br className="hidden sm:block" />
              boost productivity through intelligent venue allocation.
            </p>

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <Link
                to="/timetable"
                className="group inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-amber-400 to-yellow-500 px-8 py-4 text-base font-semibold text-slate-900 shadow-lg shadow-amber-500/25 transition-all hover:scale-105 hover:shadow-amber-500/40"
              >
                Get Started
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                to="/about"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-white/20 bg-white/5 px-8 py-4 text-base font-medium text-white backdrop-blur-sm transition-all hover:bg-white/10"
              >
                Learn more
              </Link>
            </div>
          </div>

          {/* Stats Section */}
          <div className="mt-16 grid max-w-lg grid-cols-2 gap-8 sm:mt-20">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
              <p className="mb-1 text-3xl font-bold text-white sm:text-4xl">
                6+
              </p>
              <p className="text-sm text-gray-400 sm:text-base">
                Buildings managed
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
              <p className="mb-1 text-3xl font-bold text-white sm:text-4xl">
                500+
              </p>
              <p className="text-sm text-gray-400 sm:text-base">
                Classes scheduled
              </p>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <ChevronDown className="h-8 w-8 text-white/50" />
        </div>
      </main>
    </div>
  )
}
