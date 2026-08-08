import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Layout } from '../components/layout/Layout';

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
      <div className="max-w-container-max mx-auto h-full flex flex-col lg:flex-row gap-gutter">

<section className="flex-1 flex flex-col gap-stack-md min-h-[500px]">
<div className="flex items-center justify-between">
<div>
<h2 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-surface">Photo Solve</h2>
<p className="font-body-md text-body-md text-on-surface-variant mt-1">Capture or upload a math problem to get step-by-step solutions.</p>
</div>
</div>

<div className="relative flex-1 bg-surface-container-lowest rounded-2xl border border-outline-variant shadow-sm overflow-hidden flex flex-col">

<div className="relative flex-1 bg-inverse-surface flex items-center justify-center overflow-hidden"><div className="absolute inset-0 z-10 pointer-events-none bg-[radial-gradient(circle,transparent_40%,rgba(0,0,0,0.4)_100%)]"></div>

<div className="absolute inset-0 bg-cover bg-center opacity-80 mix-blend-luminosity" data-alt="A slightly blurred, top-down view of a textbook page showing complex calculus integration problems. The paper is well-lit but slightly off-white, typical of a textbook. A modern UI overlay is framing the central equation." style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBx06L8wdI3krJn2OcyahOgtKrMOeafNcZbxyeS60S5IGhwgWjFN256KElhsydVDl9UEDrHfzM1pA4M_XxgtesCB3azWJ69AUip3iAWIzAvUnwdC1XgH33zcxTDL-_RX0nhBasRS4aHj8d9gmjfytTQyuerHKda1ucBvfV89tCdeDvp1MlbzRHQE5VK7arByGi5OBsxCVh5Nb_L00DrDfse0bcPZ6_XDBQifVCJXTBw2AQrBAQbglYZbA")' }}></div>

<div className="absolute inset-0 bg-primary-container/20 backdrop-blur-[2px] z-10 flex flex-col items-center justify-center">

{(isAnalyzing || showSolution) && (
<div className="relative w-[80%] max-w-md aspect-[4/3] border-2 border-primary-fixed-dim/50 rounded-xl overflow-hidden pulse-overlay">

<div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-primary rounded-tl-lg"></div>
<div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-primary rounded-tr-lg"></div>
<div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-primary rounded-bl-lg"></div>
<div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-primary rounded-br-lg"></div>

{isAnalyzing && <div className="absolute left-0 right-0 h-1 scanning-line z-20"></div>}

<div className="absolute inset-0 flex items-center justify-center p-4">
<div className="bg-surface-container-lowest/90 backdrop-blur-sm p-3 rounded-lg shadow-lg border border-outline-variant transform scale-110 transition-all">
<span className="font-body-lg text-body-lg text-on-surface font-semibold font-serif">∫ x²(x³ + 1)⁴ dx</span>
</div>
</div>
</div>
)}

{isAnalyzing && (
<div className="mt-6 flex items-center gap-2 text-surface-container-lowest bg-inverse-surface/80 px-4 py-2 rounded-full backdrop-blur-md">
<span className="material-symbols-outlined animate-spin text-sm">progress_activity</span>
<span className="font-label-md text-label-md tracking-wider">ANALYZING EQUATION...</span>
</div>
)}
</div>
</div>

<div className="h-20 bg-surface-container-lowest border-t border-outline-variant flex items-center justify-between px-6 z-20">
<button className="p-3 rounded-full hover:bg-surface-container transition-colors text-on-surface-variant">
<span className="material-symbols-outlined">photo_library</span>
</button>

<button onClick={handleCapture} disabled={isAnalyzing} className={`w-14 h-14 rounded-full border-4 border-outline-variant flex items-center justify-center transition-all ${isAnalyzing ? 'opacity-50 cursor-not-allowed' : 'hover:border-primary hover:scale-105'}`}>
<div className={`w-10 h-10 rounded-full ${isAnalyzing ? 'bg-outline-variant' : 'bg-primary'}`}></div>
</button>
<button className="p-3 rounded-full hover:bg-surface-container transition-colors text-on-surface-variant">
<span className="material-symbols-outlined">flash_on</span>
</button>
</div>
</div>
</section>

<section className="flex-[1.2] flex flex-col gap-stack-md h-full overflow-y-auto pr-2 pb-8">
{showSolution ? (
  <>
<div className="flex items-start justify-between bg-surface-container-lowest p-6 rounded-2xl shadow-sm border border-outline-variant bg-gradient-to-br from-surface-container-lowest to-surface-container-low">
<div>
<div className="flex items-center gap-2 mb-2">
<span className="material-symbols-outlined text-tertiary">check_circle</span>
<span className="font-label-md text-label-md text-tertiary">Problem Detected</span>
</div>
<h3 className="font-headline-md text-headline-md text-on-surface mb-1">Integration by Substitution</h3>
<p className="font-body-md text-body-md text-on-surface-variant">Calculus II • Techniques of Integration</p>
</div>
<div className="bg-secondary-container/20 text-on-secondary-container px-3 py-1 rounded-full flex items-center gap-1 border border-secondary-container/30">
<span className="material-symbols-outlined text-sm text-secondary">workspace_premium</span>
<span className="font-caption text-caption font-bold">+15 XP</span>
</div>
</div>

<div className="bg-surface-container-lowest p-6 rounded-2xl shadow-sm border border-outline-variant bg-gradient-to-br from-surface-container-lowest to-surface-container-low">
<h4 className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider mb-4 border-b border-outline-variant pb-2">Extracted Problem</h4>
<div className="flex justify-center py-4 bg-surface rounded-xl border border-outline-variant/50 overflow-x-auto">
<div className="text-2xl font-serif text-on-surface whitespace-nowrap px-4 py-2">
                                ∫ x²(x³ + 1)⁴ dx
                            </div>
</div>
</div>

<div className="bg-surface-container-lowest p-6 rounded-2xl shadow-sm border border-outline-variant flex-1 flex flex-col bg-gradient-to-br from-surface-container-lowest to-surface-container-low">
<div className="flex items-center justify-between mb-6 border-b border-outline-variant pb-2">
<h4 className="font-label-md text-label-md text-primary uppercase tracking-wider flex items-center gap-2">
<span className="material-symbols-outlined text-sm">auto_awesome</span>
                                Solution Steps
                            </h4>
<span className="font-caption text-caption text-on-surface-variant bg-surface px-2 py-1 rounded-md border border-outline-variant">4 Steps</span>
</div>
<div className="flex flex-col gap-4 relative">

<div className="absolute left-[15px] top-4 bottom-4 w-[2px] bg-outline-variant/30 z-0"></div>

<div className="relative z-10 flex gap-4 bg-surface hover:-translate-y-[2px] transition-transform p-4 rounded-xl border border-outline-variant/50 shadow-sm">
<div className="w-8 h-8 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center font-bold text-sm shrink-0 border border-surface shadow-sm">1</div>
<div className="flex-1">
<p className="font-label-md text-label-md text-on-surface mb-2">Identify the substitution.</p>
<p className="font-body-md text-body-md text-on-surface-variant mb-3">Let <span className="font-serif italic text-on-surface">u</span> be the inner function. The derivative of <span className="font-serif italic text-on-surface">x³ + 1</span> is <span className="font-serif italic text-on-surface">3x²</span>, which is closely related to the remaining part of the integrand.</p>
<div className="bg-surface-container-low p-3 rounded-lg border border-outline-variant/30 font-serif text-on-surface">
                                        u = x³ + 1<br/>
                                        du = 3x² dx
                                    </div>
</div>
</div>

<div className="relative z-10 flex gap-4 bg-surface hover:-translate-y-[2px] transition-transform p-4 rounded-xl border border-outline-variant/50 shadow-sm">
<div className="w-8 h-8 rounded-full bg-surface-container-highest text-on-surface flex items-center justify-center font-bold text-sm shrink-0 border border-outline-variant shadow-sm">2</div>
<div className="flex-1">
<p className="font-label-md text-label-md text-on-surface mb-2">Rewrite the integral.</p>
<div className="bg-surface-container-low p-3 rounded-lg border border-outline-variant/30 font-serif text-on-surface">
                                        ∫ (1/3) * u⁴ du
                                    </div>
</div>
</div>
</div>
</div>

<div className="grid grid-cols-2 gap-4 mt-2">
<button className="bg-primary-container text-on-primary-container font-label-md text-label-md py-4 rounded-xl border-push hover:bg-primary transition-colors flex items-center justify-center gap-2 shadow-sm bg-gradient-to-r from-primary-container to-primary">
<span className="material-symbols-outlined">style</span>
                            Add to Flashcards
                        </button>
<button className="bg-surface-container-highest text-on-surface font-label-md text-label-md py-4 rounded-xl border-push border border-outline-variant hover:bg-surface-variant transition-colors flex items-center justify-center gap-2 shadow-sm">
<span className="material-symbols-outlined text-primary">chat_spark</span>
                            Ask AI about this
                        </button>
</div>
  </>
) : (
  <div className="flex-1 flex flex-col items-center justify-center text-center p-8 bg-surface-container-lowest/50 rounded-2xl border-2 border-dashed border-outline-variant/50">
    <span className="material-symbols-outlined text-[48px] text-outline mb-4">center_focus_weak</span>
    <h3 className="font-headline-md text-headline-md text-on-surface mb-2">Capture to Solve</h3>
    <p className="font-body-md text-body-md text-on-surface-variant max-w-sm">Tap the capture button to scan a math problem. StudyForge AI will provide step-by-step solutions instantly.</p>
  </div>
)}
</section>
</div>
    </Layout>
  );
}