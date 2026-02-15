"use client";

import React from 'react';

export const ImageAutoSlider = () => {
  // Local Leo images provided by the user
  const images = [
    "leo1.jpg", "leo2.jpg", "leo3.jpg", "leo4.jpg",
    "leo5.jpg", "leo6.jpg", "leo7.jpg", "leo8.jpg",
    "leo9.jpg", "leo10.jpg", "leo11.jpg", "leo12.jpg"
  ];

  // Duplicate images for seamless loop
  const duplicatedImages = [...images, ...images];

  return (
    <div className="w-full h-full bg-transparent relative overflow-hidden flex items-center justify-center rounded-3xl border border-white/5">
      <style>{`
        @keyframes scroll-right {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }

        .infinite-scroll {
          animation: scroll-right 45s linear infinite;
        }

        .scroll-container {
          /* Clean viewing area without side masks if possible, or very subtle ones */
          width: 100%;
          overflow: hidden;
        }

        .image-item {
          transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1), filter 0.6s ease;
          /* Removed aggressive shadow */
          box-shadow: 0 10px 30px rgba(0,0,0,0.3);
        }

        .image-item:hover {
          transform: scale(1.03) translateY(-10px);
          filter: brightness(1.05);
          z-index: 50;
        }

        .gallery-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center; /* Ensures the center of the photo is always visible */
        }
      `}</style>

      {/* Background is now transparent to show site background clearly */}

      {/* Scrolling images container */}
      <div className="relative z-10 w-full flex items-center justify-center py-12">
        <div className="scroll-container">
          <div className="infinite-scroll flex gap-8 w-max px-4">
            {duplicatedImages.map((image, index) => (
              <div
                key={index}
                className="image-item flex-shrink-0 w-64 h-80 md:w-72 md:h-96 lg:w-80 lg:h-[450px] rounded-2xl overflow-hidden border border-white/10 group cursor-pointer bg-slate-800"
              >
                <img
                  src={image}
                  alt={`Gallery image ${(index % images.length) + 1}`}
                  className="gallery-img transition-all duration-700 group-hover:scale-110"
                  loading="lazy"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = `https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=2070&auto=format&fit=crop`;
                  }}
                />
                {/* REMOVED: Black bottom gradient and overlays */}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* REMOVED: Side Fade Overlays for maximum clarity */}
    </div>
  );
};
