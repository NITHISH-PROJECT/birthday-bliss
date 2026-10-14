import React, { useState } from 'react';
import { Navbar } from '../components/Navbar';
import { HeroSection } from '../components/HeroSection';
import { HowItWorks } from '../components/HowItWorks';
import { ThemesShowcase } from '../components/ThemesShowcase';
import { FeatureCards } from '../components/FeatureCards';
import { Footer } from '../components/Footer';
import { InteractiveMiniPreview } from '../components/InteractiveMiniPreview';

export const HomePage: React.FC = () => {
  const [previewOpen, setPreviewOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#0b0813] text-slate-100 flex flex-col selection:bg-rose-500 selection:text-white">
      <Navbar onOpenPreview={() => setPreviewOpen(true)} />
      
      <main className="flex-1">
        <HeroSection onOpenPreview={() => setPreviewOpen(true)} />
        <HowItWorks />
        <ThemesShowcase />
        <FeatureCards />
      </main>

      <Footer />

      <InteractiveMiniPreview
        isOpen={previewOpen}
        onClose={() => setPreviewOpen(false)}
      />
    </div>
  );
};
