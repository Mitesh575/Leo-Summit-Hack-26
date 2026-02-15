import React from 'react';
import { createRoot } from 'react-dom/client';
import { ShaderCanvas, shaders } from './components/ui/astral-flare-shader';
import { ImageAutoSlider } from './components/ui/image-auto-slider';

// Function to mount the background animation
(window as any).mountBackgroundAnimation = (elementId: string) => {
    const container = document.getElementById(elementId);
    if (container) {
        const root = createRoot(container);
        root.render(
            <ShaderCanvas
                fragmentShader={shaders.ASTRAL_FLARE}
                className="absolute inset-0 -z-10"
                style={{ zIndex: -2 }}
            />
        );
    }
};

// Function to mount the infinite slider gallery
(window as any).mountGallerySlider = (elementId: string) => {
    const container = document.getElementById(elementId);
    if (container) {
        const root = createRoot(container);
        root.render(<ImageAutoSlider />);
    }
};

// Auto-mount if containers exist on load
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('react-bg-container')) {
        (window as any).mountBackgroundAnimation('react-bg-container');
    }
    if (document.getElementById('react-gallery-container')) {
        (window as any).mountGallerySlider('react-gallery-container');
    }
});
