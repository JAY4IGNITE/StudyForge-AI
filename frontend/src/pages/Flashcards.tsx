import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Layout } from '../components/layout/Layout';

export function Flashcards() {
  const [isFlipped, setIsFlipped] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const mockCards = [
    {
      q: "What is the primary function of the mitochondria in a eukaryotic cell?",
      a: "They generate most of the cell's supply of adenosine triphosphate (ATP), used as a source of chemical energy. Often referred to as the \"powerhouse of the cell.\""
    },
    {
      q: "What is the process of Mitosis?",
      a: "A type of cell division that results in two daughter cells each having the same number and kind of chromosomes as the parent nucleus."
    },
    {
      q: "What is the Krebs Cycle?",
      a: "A series of chemical reactions used by all aerobic organisms to release stored energy through the oxidation of acetyl-CoA derived from carbohydrates, fats, and proteins."
    }
  ];

  const currentCard = mockCards[currentIndex];

  const handleNext = () => {
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % mockCards.length);
    }, 150);
  };
  return (
    <Layout>
      <div className="min-h-screen flex flex-col gap-stack-lg max-w-container-max mx-auto">

<section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
<div className="lg:col-span-2 flex flex-col justify-center">
<h1 className="font-headline-xl text-headline-xl text-on-background mb-2">Cellular Biology Review</h1>
<p className="font-body-lg text-body-lg text-on-surface-variant">Mastering mitochondria and cellular respiration.</p>

<div className="mt-6 flex items-center gap-4 bg-surface-container-lowest p-4 rounded-xl border border-outline-variant/50 shadow-sm w-max">
<div className="w-48 h-2 bg-surface-variant rounded-full overflow-hidden">
<div className="h-full bg-primary rounded-full transition-all" style={{ width: `${((currentIndex + 1) / mockCards.length) * 100}%`, background: 'linear-gradient(90deg, rgb(195, 192, 255) 0%, rgb(53, 37, 205) 100%)' }}></div>
</div>
<span className="font-label-md text-label-md text-on-surface-variant font-medium">{mockCards.length - currentIndex - 1} cards remaining</span>
</div>
</div>

<div className="bg-surface-container-lowest p-stack-md rounded-2xl border border-outline-variant shadow-sm hover:shadow-md transition-shadow">
<h3 className="font-headline-md text-headline-md text-on-background mb-4 flex items-center gap-2">
<span className="material-symbols-outlined text-primary">auto_awesome</span>
                    Quick Generate
                </h3>
<div className="space-y-4">
<input className="w-full px-4 py-3 bg-surface-container-low border border-outline-variant rounded-lg font-body-md text-body-md focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all placeholder:text-outline" placeholder="e.g. Krebs Cycle, Mitosis..." type="text"/>
<button className="w-full bg-primary text-on-primary font-label-md text-label-md py-3 rounded-lg font-semibold hover:bg-surface-tint transition-colors btn-actionable flex items-center justify-center gap-2" style={{ background: 'linear-gradient(rgb(79, 70, 229) 0%, rgb(53, 37, 205) 100%)' }}>
                        Generate 8 Flashcards
                    </button>
</div>
</div>
</section>

<section className="flex flex-col items-center justify-center flex-1 w-full max-w-3xl mx-auto py-8">

<div className="w-full aspect-[4/3] md:aspect-[16/9] cursor-pointer group" style={{ perspective: '1000px' }} onClick={() => setIsFlipped(!isFlipped)}>
<div className="relative w-full h-full shadow-sm rounded-2xl group-hover:-translate-y-1 group-hover:shadow-md transition-all duration-300" style={{ transformStyle: 'preserve-3d', transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)' }}>

<div className="absolute inset-0 w-full h-full bg-surface-container-lowest border border-outline-variant rounded-2xl p-8 md:p-12 flex flex-col items-center justify-center text-center" style={{ backfaceVisibility: 'hidden', background: 'radial-gradient(circle, rgb(255, 255, 255) 0%, rgb(229, 238, 255) 100%)' }}>
<div className="absolute top-6 left-6 text-outline font-label-md text-label-md">Question</div>
<div className="absolute top-6 right-6" onClick={(e) => e.stopPropagation()}>
<span className="material-symbols-outlined text-outline cursor-help hover:text-primary transition-colors">volume_up</span>
</div>
<h2 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-background max-w-xl">
                            {currentCard.q}
                        </h2>
<div className="absolute bottom-6 flex items-center gap-2 text-outline opacity-60">
<span className="material-symbols-outlined text-sm">touch_app</span>
<span className="font-caption text-caption">Click to flip</span>
</div>
</div>

<div className="absolute inset-0 w-full h-full bg-inverse-on-surface border border-primary-fixed-dim rounded-2xl p-8 md:p-12 flex flex-col items-center justify-center text-center" style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}>
<div className="absolute top-6 left-6 text-primary font-label-md text-label-md">Answer</div>
<p className="font-body-lg text-body-lg text-on-surface-variant max-w-lg">
                            {currentCard.a}
                        </p>
</div>
</div>
</div>

<div className="mt-8 flex items-center justify-between w-full max-w-md">
<button onClick={handleNext} className="px-6 py-3 rounded-lg font-label-md text-label-md font-semibold text-error bg-error-container/50 hover:bg-error-container transition-colors flex items-center gap-2 btn-actionable">
<span className="material-symbols-outlined text-sm">history</span>
                    Review Later
                </button>
<div className="flex items-center gap-4 text-outline font-caption text-caption hidden md:flex">
<kbd className="px-2 py-1 bg-surface-container-high rounded border border-outline-variant">←</kbd>
<span className="">/</span>
<kbd className="px-2 py-1 bg-surface-container-high rounded border border-outline-variant">→</kbd>
</div>
<button onClick={handleNext} className="px-8 py-3 rounded-lg font-label-md text-label-md font-semibold text-on-tertiary-fixed-variant bg-tertiary-fixed hover:bg-tertiary-fixed-dim transition-colors flex items-center gap-2 btn-actionable shadow-sm" style={{ background: 'linear-gradient(rgb(111, 251, 190) 0%, rgb(78, 222, 163) 100%)' }}>
                    Got it
                    <span className="material-symbols-outlined text-sm">check</span>
</button>
</div>
</section>
</div>
    </Layout>
  );
}