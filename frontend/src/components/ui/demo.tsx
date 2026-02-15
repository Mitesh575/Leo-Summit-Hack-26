// This is file with demos of your component
// Each export is one usecase for your component

import { ImageAutoSlider } from "@/components/ui/image-auto-slider";

const DemoOne = () => {
    return (
        <div className="p-8 bg-slate-950 min-h-screen">
            <h1 className="text-white text-2xl mb-8 font-bold">Gallery Animation Demo</h1>
            <div className="h-[500px]">
                <ImageAutoSlider />
            </div>
        </div>
    );
};

export { DemoOne };
