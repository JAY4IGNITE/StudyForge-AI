import React, { useState } from 'react';
import { Layout } from '../components/layout/Layout';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import {
  Images,
  Zap,
  Loader2,
  CheckCircle2,
  Award,
  Sparkles,
  Layers,
  MessageSquareText,
  Aperture,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { StaggerContainer, FadeUp, AnimatedButton } from '../components/motion';

const steps = [
  {
    n: 1,
    title: 'Identify the substitution.',
    body: (
      <>
        Let <em className="not-italic font-serif italic text-foreground">u</em> be the inner function. The
        derivative of <em className="not-italic font-serif italic text-foreground">x³ + 1</em> is{' '}
        <em className="not-italic font-serif italic text-foreground">3x²</em>, which is closely related to the
        remaining part of the integrand.
      </>
    ),
    math: 'u = x³ + 1\ndu = 3x² dx',
  },
  {
    n: 2,
    title: 'Rewrite the integral.',
    body: null,
    math: '∫ (1/3) · u⁴ du',
  },
];

export function PhotoSolve() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showSolution, setShowSolution] = useState(false);

  const handleCapture = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      setIsAnalyzing(false);
      setShowSolution(true);
    }, 2000);
  };

  return (
    <Layout>
      <div className="mx-auto flex h-full max-w-7xl flex-col gap-6 lg:flex-row">
        {/* Camera / viewfinder */}
        <section className="flex min-h-[500px] flex-1 flex-col gap-4">
          <div>
            <h2 className="font-display text-2xl font-medium tracking-tight text-foreground">Photo Solve</h2>
            <p className="mt-1 text-secondary">
              Capture or upload a math problem to get step-by-step solutions.
            </p>
          </div>

          <Card className="relative flex flex-1 flex-col overflow-hidden p-0">
            <div className="relative flex flex-1 items-center justify-center overflow-hidden bg-[#0a0b0e]">
              <div className="pointer-events-none absolute inset-0 z-10 bg-[radial-gradient(circle,transparent_40%,rgba(0,0,0,0.55)_100%)]" />
              <div
                className="absolute inset-0 bg-cover bg-center opacity-70 mix-blend-luminosity"
                style={{
                  backgroundImage:
                    'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBx06L8wdI3krJn2OcyahOgtKrMOeafNcZbxyeS60S5IGhwgWjFN256KElhsydVDl9UEDrHfzM1pA4M_XxgtesCB3azWJ69AUip3iAWIzAvUnwdC1XgH33zcxTDL-_RX0nhBasRS4aHj8d9gmjfytTQyuerHKda1ucBvfV89tCdeDvp1MlbzRHQE5VK7arByGi5OBsxCVh5Nb_L00DrDfse0bcPZ6_XDBQifVCJXTBw2AQrBAQbglYZbA")',
                }}
              />
              <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-ember/5 backdrop-blur-[2px]">
                {(isAnalyzing || showSolution) && (
                  <div className="relative aspect-[4/3] w-[80%] max-w-md overflow-hidden rounded-xl border-2 border-ember/50">
                    <div className="absolute left-0 top-0 h-8 w-8 rounded-tl-lg border-l-4 border-t-4 border-ember" />
                    <div className="absolute right-0 top-0 h-8 w-8 rounded-tr-lg border-r-4 border-t-4 border-ember" />
                    <div className="absolute bottom-0 left-0 h-8 w-8 rounded-bl-lg border-b-4 border-l-4 border-ember" />
                    <div className="absolute bottom-0 right-0 h-8 w-8 rounded-br-lg border-b-4 border-r-4 border-ember" />

                    {isAnalyzing && (
                      <div className="absolute inset-x-0 top-1/2 z-20 h-0.5 animate-pulse bg-ember shadow-[0_0_12px_2px_hsl(var(--ember)/0.8)]" />
                    )}

                    <div className="absolute inset-0 flex items-center justify-center p-4">
                      <div className="scale-110 rounded-lg border border-border bg-card/90 p-3 shadow-lg backdrop-blur-sm">
                        <span className="font-serif text-lg font-semibold text-foreground">
                          ∫ x²(x³ + 1)⁴ dx
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {isAnalyzing && (
                  <div className="mt-6 flex items-center gap-2 rounded-full bg-background/80 px-4 py-2 backdrop-blur-md">
                    <Loader2 className="h-4 w-4 animate-spin text-ember" />
                    <span className="font-mono text-xs tracking-wider text-foreground">ANALYZING EQUATION...</span>
                  </div>
                )}
              </div>
            </div>

            <div className="z-20 flex h-20 items-center justify-between border-t border-border bg-card px-6">
              <Button variant="ghost" size="icon" className="h-11 w-11 rounded-full text-secondary">
                <Images className="h-5 w-5" />
              </Button>

              <button
                onClick={handleCapture}
                disabled={isAnalyzing}
                className={`flex h-14 w-14 items-center justify-center rounded-full border-4 border-border transition-all ${
                  isAnalyzing ? 'cursor-not-allowed opacity-50' : 'hover:scale-105 hover:border-ember'
                }`}
              >
                <div className={`h-10 w-10 rounded-full ${isAnalyzing ? 'bg-muted' : 'bg-ember-gradient'}`} />
              </button>

              <Button variant="ghost" size="icon" className="h-11 w-11 rounded-full text-secondary">
                <Zap className="h-5 w-5" />
              </Button>
            </div>
          </Card>
        </section>

        {/* Solution panel */}
        <section className="flex flex-[1.2] flex-col gap-4 overflow-y-auto pb-8 pr-1">
          <AnimatePresence mode="wait">
            {showSolution ? (
              <StaggerContainer key="solution" className="flex flex-[1.2] flex-col gap-4">
                <FadeUp>
                  <Card className="flex items-start justify-between p-6">
                    <div>
                      <div className="mb-2 flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-gold" />
                        <span className="text-sm font-medium text-gold">Problem detected</span>
                      </div>
                      <h3 className="font-display text-xl font-medium text-foreground">
                        Integration by Substitution
                      </h3>
                      <p className="text-sm text-secondary">Calculus II • Techniques of Integration</p>
                    </div>
                    <Badge variant="gold" className="gap-1 rounded-full">
                      <Award className="h-3.5 w-3.5" /> +15 XP
                    </Badge>
                  </Card>
                </FadeUp>

                <FadeUp>
                  <Card className="p-6">
                    <h4 className="mb-4 border-b border-border pb-2 font-mono text-xs uppercase tracking-wider text-secondary">
                      Extracted problem
                    </h4>
                    <div className="flex justify-center overflow-x-auto rounded-xl border border-border bg-secondary/30 py-4">
                      <div className="whitespace-nowrap px-4 py-2 font-serif text-2xl text-foreground">
                        ∫ x²(x³ + 1)⁴ dx
                      </div>
                    </div>
                  </Card>
                </FadeUp>

                <FadeUp>
                  <Card className="flex flex-1 flex-col p-6">
                    <div className="mb-6 flex items-center justify-between border-b border-border pb-2">
                      <h4 className="flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-ember">
                        <Sparkles className="h-3.5 w-3.5" />
                        Solution steps
                      </h4>
                      <Badge variant="secondary" className="rounded-md font-sans">
                        4 steps
                      </Badge>
                    </div>

                    <div className="relative flex flex-col gap-4">
                      <div className="absolute bottom-4 left-[15px] top-4 z-0 w-px bg-border" />

                      {steps.map((step) => (
                        <div
                          key={step.n}
                          className="relative z-10 flex gap-4 rounded-xl border border-border bg-secondary/20 p-4 shadow-sm transition-transform hover:-translate-y-0.5"
                        >
                          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-border bg-ember-gradient text-sm font-bold text-ember-foreground shadow-sm">
                            {step.n}
                          </div>
                          <div className="flex-1">
                            <p className="mb-2 font-medium text-foreground">{step.title}</p>
                            {step.body && <p className="mb-3 text-sm leading-relaxed text-secondary">{step.body}</p>}
                            <div className="whitespace-pre-line rounded-lg border border-border/60 bg-card p-3 font-serif text-foreground">
                              {step.math}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </Card>
                </FadeUp>

                <FadeUp className="mt-2 grid grid-cols-2 gap-4">
                  <AnimatedButton className="h-14 gap-2">
                    <Layers className="h-4 w-4" />
                    Add to flashcards
                  </AnimatedButton>
                  <AnimatedButton variant="secondary" className="h-14 gap-2">
                    <MessageSquareText className="h-4 w-4 text-ember" />
                    Ask AI about this
                  </AnimatedButton>
                </FadeUp>
              </StaggerContainer>
            ) : (
              <motion.div
                key="placeholder"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                className="flex flex-1"
              >
                <Card className="flex flex-1 flex-col items-center justify-center border-2 border-dashed border-border bg-secondary/10 p-8 text-center">
                  <Aperture className="mb-4 h-12 w-12 text-secondary" />
                  <h3 className="mb-2 font-display text-xl font-medium text-foreground">Capture to solve</h3>
                  <p className="max-w-sm text-secondary">
                    Tap the capture button to scan a math problem. StudyForge AI will provide step-by-step solutions
                    instantly.
                  </p>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </section>
      </div>
    </Layout>
  );
}
