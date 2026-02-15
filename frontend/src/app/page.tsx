"use client";
import React, { useEffect, useState } from "react";
import { BackgroundGradientAnimation } from "@/components/ui/background-gradient-animation";
import Image from "next/image";
import { cn } from "@/lib/utils";

export default function HeroSection() {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    // Set target date to Feb 23, 2026
    const targetDate = new Date("February 23, 2026 00:00:00").getTime();

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const distance = targetDate - now;

      if (distance < 0) {
        clearInterval(interval);
        return;
      }

      setTimeLeft({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000),
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <BackgroundGradientAnimation>
      <div className="absolute inset-0 z-50 flex flex-col items-center justify-center p-4 text-center">
        {/* Floating Shapes Background (Optional - can be added if needed, but gradient is nice) */}

        {/* Content */}
        <div className="relative z-10 max-w-5xl mx-auto space-y-8">

          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 animate-fade-in-up">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
            <span className="text-sm font-medium text-white/90">24 Hours of Innovation</span>
          </div>

          {/* Title */}
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight text-white drop-shadow-2xl">
            <span className="inline-block hover:scale-105 transition-transform duration-300">Tech</span>{" "}
            <span className="inline-block hover:scale-105 transition-transform duration-300">for</span>{" "}
            <span className="inline-block text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-amber-600 hover:scale-105 transition-transform duration-300">Social</span>{" "}
            <span className="inline-block text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-amber-600 hover:scale-105 transition-transform duration-300">Good</span>
          </h1>

          {/* Description */}
          <p className="max-w-2xl mx-auto text-lg md:text-xl text-white/80 leading-relaxed font-light">
            Where innovation meets impact. Build solutions that transform communities and create lasting change in 24 hours.
          </p>

          <p className="text-sm md:text-base text-yellow-300/90 italic font-medium">
            "This initiative enables Leo Club to create leaders who do not just innovate for success, but innovate for service."
          </p>

          {/* Countdown Timer */}
          <div className="grid grid-cols-4 gap-4 max-w-2xl mx-auto my-8">
            {[
              { label: "Days", value: timeLeft.days },
              { label: "Hrs", value: timeLeft.hours },
              { label: "Mins", value: timeLeft.minutes },
              { label: "Secs", value: timeLeft.seconds },
            ].map((item, index) => (
              <div key={index} className="flex flex-col items-center p-3 rounded-xl bg-black/20 backdrop-blur-sm border border-white/10">
                <span className="text-2xl md:text-4xl font-bold text-white tabular-nums">{String(item.value).padStart(2, '0')}</span>
                <span className="text-xs text-white/60 uppercase tracking-wider">{item.label}</span>
              </div>
            ))}
          </div>

          {/* CTA Button */}
          <button className="group relative px-8 py-4 bg-white text-indigo-900 rounded-full font-bold text-lg shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:shadow-[0_0_40px_rgba(255,255,255,0.5)] transition-all duration-300 hover:-translate-y-1 overflow-hidden">
            <span className="relative z-10 flex items-center gap-2">
              Begin Your Journey
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-yellow-300 to-yellow-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </button>
        </div>

        {/* Mascot */}
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] md:w-[600px] md:h-[600px] opacity-20 md:opacity-100 pointer-events-none z-0 translate-y-1/4 translate-x-1/4">
          {/* Note: In a real Next.js app, verify the path to public images. '/mascot-premium.png' assumes it's in public/ */}
          <Image
            src="/mascot-premium.png"
            alt="LeoSummit Mascot"
            width={800}
            height={800}
            className="object-contain drop-shadow-[0_0_50px_rgba(255,215,0,0.3)]"
          />
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/50 text-sm animate-bounce">
          Scroll to explore
        </div>
      </div>
    </BackgroundGradientAnimation>
  );
}
