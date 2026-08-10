import React, { useState } from 'react';
import { Layout } from '../components/layout/Layout';
import { Card, CardContent, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { TemperBar } from '../components/ui/temper-gauge';
import { Sparkles, Volume2, PointerIcon, History, Check } from 'lucide-react';

export function Flashcards() {
  const [isFlipped, setIsFlipped] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const mockCards = [
    {
      q: 'What is the primary function of the mitochondria in a eukaryotic cell?',
      a: "They generate most of the cell's supply of adenosine triphosphate (ATP), used as a source of chemical energy. Often referred to as the \"powerhouse of the cell.\"",
    },
    {
      q: 'What is the process of Mitosis?',
      a: 'A type of cell division that results in two daughter cells each having the same number and kind of chromosomes as the parent nucleus.',
    },
    {
      q: 'What is the Krebs Cycle?',
      a: 'A series of chemical reactions used by all aerobic organisms to release stored energy through the oxidation of acetyl-CoA derived from carbohydrates, fats, and proteins.',
    },
  ];

  const currentCard = mockCards[currentIndex];
  const progressPct = ((currentIndex + 1) / mockCards.length) * 100;

  const handleNext = () => {
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % mockCards.length);
    }, 150);
  };

  return (
    <Layout>
      <div className="mx-auto flex max-w-7xl flex-col gap-8">
        <section className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="flex flex-col justify-center lg:col-span-2">
            <h1 className="font-display text-3xl font-medium tracking-tight text-foreground text-balance">
              Cellular Biology Review
            </h1>
            <p className="mt-1 text-secondary">Mastering mitochondria and cellular respiration.</p>

            <Card className="mt-6 w-max px-5 py-4">
              <div className="flex items-center gap-4">
                <TemperBar value={progressPct} showValue={false} className="w-48" />
                <span className="whitespace-nowrap font-mono text-sm font-medium text-secondary">
                  {mockCards.length - currentIndex - 1} cards remaining
                </span>
              </div>
            </Card>
          </div>

          <Card>
            <CardContent className="p-6">
              <CardTitle className="mb-4 flex items-center gap-2 text-lg">
                <Sparkles className="h-4 w-4 text-ember" />
                Quick generate
              </CardTitle>
              <div className="space-y-3">
                <Input placeholder="e.g. Krebs Cycle, Mitosis..." />
                <Button className="w-full">Generate 8 flashcards</Button>
              </div>
            </CardContent>
          </Card>
        </section>

        <section className="mx-auto flex w-full max-w-3xl flex-1 flex-col items-center justify-center py-4">
          <div
            className="group aspect-[4/3] w-full cursor-pointer md:aspect-[16/9]"
            style={{ perspective: '1000px' }}
            onClick={() => setIsFlipped(!isFlipped)}
          >
            <div
              className="relative h-full w-full rounded-2xl shadow-sm transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-[0_16px_40px_-16px_hsl(var(--ember)/0.3)]"
              style={{
                transformStyle: 'preserve-3d',
                transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
              }}
            >
              {/* Front — question */}
              <div
                className="bg-forge-glow absolute inset-0 flex h-full w-full flex-col items-center justify-center rounded-2xl border border-border bg-card p-8 text-center md:p-12"
                style={{ backfaceVisibility: 'hidden' }}
              >
                <div className="absolute left-6 top-6 font-mono text-xs uppercase tracking-wider text-secondary">
                  Question
                </div>
                <button
                  className="absolute right-6 top-6 text-secondary transition-colors hover:text-ember"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Volume2 className="h-5 w-5" />
                </button>
                <h2 className="max-w-xl font-display text-2xl font-medium leading-snug text-foreground text-balance md:text-3xl">
                  {currentCard.q}
                </h2>
                <div className="absolute bottom-6 flex items-center gap-2 text-secondary opacity-70">
                  <PointerIcon className="h-3.5 w-3.5" />
                  <span className="text-xs">Click to flip</span>
                </div>
              </div>

              {/* Back — answer */}
              <div
                className="absolute inset-0 flex h-full w-full flex-col items-center justify-center rounded-2xl border border-ember/25 bg-card p-8 text-center md:p-12"
                style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
              >
                <div className="absolute left-6 top-6 font-mono text-xs uppercase tracking-wider text-ember">
                  Answer
                </div>
                <p className="max-w-lg text-lg leading-relaxed text-secondary">{currentCard.a}</p>
              </div>
            </div>
          </div>

          <div className="mt-8 flex w-full max-w-md items-center justify-between">
            <Button
              onClick={handleNext}
              variant="secondary"
              className="gap-2 text-destructive hover:bg-destructive/10 hover:text-destructive"
            >
              <History className="h-4 w-4" />
              Review later
            </Button>
            <div className="hidden items-center gap-2 font-mono text-xs text-secondary md:flex">
              <kbd className="rounded border border-border bg-secondary px-2 py-1">←</kbd>
              <span>/</span>
              <kbd className="rounded border border-border bg-secondary px-2 py-1">→</kbd>
            </div>
            <Button onClick={handleNext} className="gap-2">
              Got it
              <Check className="h-4 w-4" />
            </Button>
          </div>
        </section>
      </div>
    </Layout>
  );
}
