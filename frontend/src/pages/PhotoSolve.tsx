import React from 'react';

export function PhotoSolve() {
  return (
    <>
      
 TopAppBar 
<header className="docked full-width top-0 z-40 bg-surface/80 dark:bg-surface-dim/80 backdrop-blur-md border-b border-outline-variant dark:border-outline flex justify-between items-center w-full px-margin-desktop h-16 md:ml-64 transition-all">
<div className="flex items-center gap-4">
<button className="md:hidden p-2 text-on-surface-variant hover:text-primary transition-colors">
<span className="material-symbols-outlined">menu</span>
</button>
<h1 className="font-headline-md text-headline-md font-black text-primary dark:text-primary-fixed-dim">StudyForge AI</h1>
</div>
<div className="flex items-center gap-4">

<div className="hidden md:flex items-center bg-surface-container-low rounded-full px-4 py-2 border border-outline-variant focus-within:border-primary focus-within:ring-1 focus-within:ring-primary transition-all">
<span className="material-symbols-outlined text-on-surface-variant mr-2">search</span>
<input className="bg-transparent border-none outline-none text-body-md font-body-md placeholder-outline w-48 text-on-surface" placeholder="Search..." type="text"/>
</div>

<button className="text-on-surface-variant hover:text-primary transition-colors active:opacity-80">
<span className="material-symbols-outlined" data-icon="local_fire_department">local_fire_department</span>
</button>
<button className="text-on-surface-variant hover:text-primary transition-colors active:opacity-80">
<span className="material-symbols-outlined" data-icon="stars">stars</span>
</button>
<button className="text-on-surface-variant hover:text-primary transition-colors active:opacity-80 relative">
<span className="material-symbols-outlined" data-icon="notifications">notifications</span>
<span className="absolute top-0 right-0 w-2 h-2 bg-error rounded-full"></span>
</button>

<img alt="User avatar" className="w-8 h-8 rounded-full border-2 border-surface object-cover cursor-pointer hover:opacity-80 transition-opacity" data-alt="A modern UI design user avatar portrait, professional yet approachable, set against a clean, light mode studio background, high quality, soft studio lighting." src="https://lh3.googleusercontent.com/aida-public/AB6AXuC1E5fmmr5GqhtL9Q9CVEvDCMsHNdmiyFy-2oxJvlKEIgRrwGcNbdstfowDPFAE0DzprzR28zqNpyvI21q-Rbzrj8WXwG3K-x-zYeH-BAdkqlbEPBFelWMLaT0Is5WdGsuDqCvOpAPFjV48ZP6hrFBIfQeABc0AodsjMYHi3Ky2-4q928QuYgEIH0sowmXcedkNy9uytRr3K28wOQdpY0ugfKMbLUVZL6XsaGdTxGH5IZFUn4utaSiRfw"/>
</div>
</header>
<div className="flex flex-1 overflow-hidden">

<nav className="hidden md:flex fixed left-0 top-0 h-full flex-col py-stack-md bg-surface dark:bg-surface-dim shadow-sm w-64 border-r border-outline-variant dark:border-outline z-50 bg-gradient-to-b from-surface to-surface-container-low">
<div className="px-6 mb-8">
<h1 className="font-headline-md text-headline-md font-bold text-primary dark:text-primary-fixed-dim mb-2">StudyForge AI</h1>
<div className="flex items-center gap-3 bg-surface-container-low p-3 rounded-xl border border-outline-variant/30">
<img alt="User profile avatar" className="w-10 h-10 rounded-full object-cover border border-outline-variant" data-alt="A small circular avatar of a student looking focused, clean modern light mode aesthetic, well-lit, professional headshot." src="https://lh3.googleusercontent.com/aida-public/AB6AXuCh4vjltOm7q_e1GBK4aMzcKosSelLr1qQ9Wx_xb1lqcIar4qNKzGmvIsgmGqFx9wlr9G-BGrxhRyy98TEOUMYvkfYHxFMbBt_GKSP9xMKDY_6qKZpyhOe08LUJTBbvPcs7yOiT5rhhi_cbjS-31KQZqfpX3wwP8Uyqkz3cSkxlFmJlZi8OppZiflmVdP5DBQBzauyInzTik8NHdLVBiwjw-PoAN-hFmLa7Bztdic6bgq8tB75-xnwhuQ"/>
<div>
<p className="font-label-md text-label-md text-on-surface">Alex Chen</p>
<p className="font-caption text-caption text-secondary">Level 12 Focus Master</p>
</div>
</div>
</div>
<ul className="flex flex-col gap-1 px-4 flex-1">
<li className="">
<a className="flex items-center gap-3 px-4 py-3 rounded-lg text-on-surface-variant dark:text-outline hover:text-primary dark:hover:text-primary-fixed-dim hover:bg-surface-container-high dark:hover:bg-surface-container transition-colors duration-200 active:scale-95 font-body-md text-body-md" href="#">
<span className="material-symbols-outlined" data-icon="home">home</span>
                        Home
                    </a>
</li>
<li className="">
<a className="flex items-center gap-3 px-4 py-3 rounded-lg text-primary dark:text-primary-fixed-dim font-bold border-r-4 border-primary dark:border-primary-fixed-dim bg-primary-container/10 transition-colors duration-200 active:scale-95 font-body-md text-body-md" href="#">
<span className="material-symbols-outlined" data-icon="chat" data-weight="fill">chat</span>
                        Chat
                    </a>
</li>
<li className="">
<a className="flex items-center gap-3 px-4 py-3 rounded-lg text-on-surface-variant dark:text-outline hover:text-primary dark:hover:text-primary-fixed-dim hover:bg-surface-container-high dark:hover:bg-surface-container transition-colors duration-200 active:scale-95 font-body-md text-body-md" href="#">
<span className="material-symbols-outlined" data-icon="style">style</span>
                        Flashcards
                    </a>
</li>
<li className="">
<a className="flex items-center gap-3 px-4 py-3 rounded-lg text-on-surface-variant dark:text-outline hover:text-primary dark:hover:text-primary-fixed-dim hover:bg-surface-container-high dark:hover:bg-surface-container transition-colors duration-200 active:scale-95 font-body-md text-body-md" href="#">
<span className="material-symbols-outlined" data-icon="quiz">quiz</span>
                        Quiz
                    </a>
</li>
<li className="">
<a className="flex items-center gap-3 px-4 py-3 rounded-lg text-on-surface-variant dark:text-outline hover:text-primary dark:hover:text-primary-fixed-dim hover:bg-surface-container-high dark:hover:bg-surface-container transition-colors duration-200 active:scale-95 font-body-md text-body-md" href="#">
<span className="material-symbols-outlined" data-icon="map">map</span>
                        Roadmap
                    </a>
</li>
<li className="">
<a className="flex items-center gap-3 px-4 py-3 rounded-lg text-on-surface-variant dark:text-outline hover:text-primary dark:hover:text-primary-fixed-dim hover:bg-surface-container-high dark:hover:bg-surface-container transition-colors duration-200 active:scale-95 font-body-md text-body-md" href="#">
<span className="material-symbols-outlined" data-icon="person">person</span>
                        Profile
                    </a>
</li>
</ul>
<div className="px-4 mt-auto pt-6 border-t border-outline-variant/30">
<button className="w-full bg-secondary-container text-on-secondary-container font-label-md text-label-md py-3 rounded-xl border-push hover:bg-secondary-fixed transition-colors flex items-center justify-center gap-2">
<span className="material-symbols-outlined text-sm">workspace_premium</span>
                    Upgrade to Pro
                </button>
</div>
</nav>

<main className="flex-1 md:ml-64 overflow-y-auto p-margin-mobile md:p-margin-desktop bg-surface-bright">
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

<div className="relative w-[80%] max-w-md aspect-[4/3] border-2 border-primary-fixed-dim/50 rounded-xl overflow-hidden pulse-overlay">

<div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-primary rounded-tl-lg"></div>
<div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-primary rounded-tr-lg"></div>
<div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-primary rounded-bl-lg"></div>
<div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-primary rounded-br-lg"></div>

<div className="absolute left-0 right-0 h-1 scanning-line z-20"></div>

<div className="absolute inset-0 flex items-center justify-center p-4">
<div className="bg-surface-container-lowest/90 backdrop-blur-sm p-3 rounded-lg shadow-lg border border-outline-variant transform scale-110">
<span className="font-body-lg text-body-lg text-on-surface font-semibold font-serif">∫ x²(x³ + 1)⁴ dx</span>
</div>
</div>
</div>
<div className="mt-6 flex items-center gap-2 text-surface-container-lowest bg-inverse-surface/80 px-4 py-2 rounded-full backdrop-blur-md">
<span className="material-symbols-outlined animate-spin text-sm">progress_activity</span>
<span className="font-label-md text-label-md tracking-wider">ANALYZING EQUATION...</span>
</div>
</div>
</div>

<div className="h-20 bg-surface-container-lowest border-t border-outline-variant flex items-center justify-between px-6 z-20">
<button className="p-3 rounded-full hover:bg-surface-container transition-colors text-on-surface-variant">
<span className="material-symbols-outlined">photo_library</span>
</button>

<button className="w-14 h-14 rounded-full border-4 border-outline-variant flex items-center justify-center opacity-50 cursor-not-allowed">
<div className="w-10 h-10 rounded-full bg-outline-variant"></div>
</button>
<button className="p-3 rounded-full hover:bg-surface-container transition-colors text-on-surface-variant">
<span className="material-symbols-outlined">flash_on</span>
</button>
</div>
</div>
</section>

<section className="flex-[1.2] flex flex-col gap-stack-md h-full overflow-y-auto pr-2 pb-8">

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

<div className="relative z-10 flex gap-4 bg-surface hover:-translate-y-[2px] transition-transform p-4 rounded-xl border border-outline-variant/50 shadow-sm opacity-50 blur-[1px]">
<div className="w-8 h-8 rounded-full bg-surface-container-highest text-on-surface flex items-center justify-center font-bold text-sm shrink-0 border border-outline-variant shadow-sm">2</div>
<div className="flex-1">
<p className="font-label-md text-label-md text-on-surface mb-2">Rewrite the integral.</p>
<div className="bg-surface-container-low p-3 rounded-lg border border-outline-variant/30 font-serif text-on-surface">
                                        ... Generating step ...
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
</section>
</div>
</main>
</div>

    </>
  );
}
