import React from 'react';

export function Flashcards() {
  return (
    <>
      
 TopAppBar 
<header className="flex justify-between items-center w-full px-margin-desktop h-16 ml-64 docked full-width top-0 z-40 bg-surface/80 dark:bg-surface-dim/80 backdrop-blur-md border-b border-outline-variant dark:border-outline flat no shadows hidden md:flex">
<div className="flex items-center gap-2">
<span className="font-headline-md text-headline-md font-black text-primary dark:text-primary-fixed-dim">StudyForge AI</span>
</div>
<div className="flex items-center gap-6">
<div className="relative hidden lg:block w-64">
<span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-lg">search</span>
<input className="w-full pl-10 pr-4 py-2 bg-surface-container-lowest border border-outline-variant rounded-full text-body-md focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors" placeholder="Search..." type="text"/>
</div>
<div className="flex items-center gap-4 text-on-surface-variant dark:text-outline">
<button className="hover:text-primary dark:hover:text-primary-fixed-dim transition-all Active: opacity-80 transition-opacity">
<span className="material-symbols-outlined" style={{ fontVariationSettings: '"FILL" 1' }}>local_fire_department</span>
</button>
<button className="hover:text-primary dark:hover:text-primary-fixed-dim transition-all Active: opacity-80 transition-opacity">
<span className="material-symbols-outlined" style={{ fontVariationSettings: '"FILL" 1' }}>stars</span>
</button>
<button className="hover:text-primary dark:hover:text-primary-fixed-dim transition-all Active: opacity-80 transition-opacity relative">
<span className="material-symbols-outlined" style={{ fontVariationSettings: '"FILL" 1' }}>notifications</span>
<span className="absolute top-0 right-0 w-2 h-2 bg-error rounded-full"></span>
</button>
<img alt="User avatar" className="w-8 h-8 rounded-full border border-outline-variant object-cover ml-2 cursor-pointer" data-alt="A small, circular avatar portrait of a modern student in soft, warm lighting. Minimalist light-mode styling." src="https://lh3.googleusercontent.com/aida-public/AB6AXuAQrcGtql6Bg9NqdrTltTH_dwLaEPWKAVVlNQAfgcjTClYY1V1LIUD--UhLM3UVUsa2MbKBd2hucqtvilpwDvCvcsU3l_HclTLapgx8cNVehghsWqXGEJJqc2_vkv00x1VdKy-v3uv4wFhHg5xb2sPNCfUJVXUYUaYILy8-GQ5gf_QzIkbhcRhrpEN8O-FBCfC8dnMBuILJ-z3xyO8NvFjh6VYhKxVGue53ljzCXgSFgyADrJVwWeMPwA"/>
</div>
</div>
</header>
 SideNavBar 
<nav className="fixed left-0 top-0 h-full flex flex-col py-stack-md h-screen w-64 border-r border-outline-variant dark:border-outline bg-surface dark:bg-surface-dim shadow-sm hidden md:flex z-50" style={{ background: 'linear-gradient(rgb(248, 249, 255) 0%, rgb(239, 244, 255) 100%)' }}>
<div className="px-6 mb-8 flex items-center gap-3">
<div className="w-10 h-10 rounded-lg bg-primary-container text-on-primary-container flex items-center justify-center font-bold text-xl">S</div>
<div>
<h2 className="font-headline-md text-headline-md font-bold text-primary dark:text-primary-fixed-dim leading-none">StudyForge AI</h2>
<p className="font-caption text-caption text-outline mt-1">Level 12 Focus Master</p>
</div>
</div>
<div className="flex-1 px-4 space-y-1">
<a className="flex items-center gap-3 px-4 py-3 rounded-lg text-on-surface-variant dark:text-outline hover:text-primary dark:hover:text-primary-fixed-dim hover:bg-surface-container-high dark:hover:bg-surface-container transition-colors duration-200 active:scale-95 transition-transform group" href="#">
<span className="material-symbols-outlined group-hover:text-primary transition-colors">home</span>
<span className="font-label-md text-label-md font-medium">Home</span>
</a>
<a className="flex items-center gap-3 px-4 py-3 rounded-lg text-on-surface-variant dark:text-outline hover:text-primary dark:hover:text-primary-fixed-dim hover:bg-surface-container-high dark:hover:bg-surface-container transition-colors duration-200 active:scale-95 transition-transform group" href="#">
<span className="material-symbols-outlined group-hover:text-primary transition-colors">chat</span>
<span className="font-label-md text-label-md font-medium">Chat</span>
</a>
<a className="flex items-center gap-3 px-4 py-3 rounded-lg text-primary dark:text-primary-fixed-dim font-bold border-r-4 border-primary dark:border-primary-fixed-dim bg-primary-container/10 active:scale-95 transition-transform" href="#">
<span className="material-symbols-outlined" style={{ fontVariationSettings: '"FILL" 1' }}>style</span>
<span className="font-label-md text-label-md font-bold">Flashcards</span>
</a>
<a className="flex items-center gap-3 px-4 py-3 rounded-lg text-on-surface-variant dark:text-outline hover:text-primary dark:hover:text-primary-fixed-dim hover:bg-surface-container-high dark:hover:bg-surface-container transition-colors duration-200 active:scale-95 transition-transform group" href="#">
<span className="material-symbols-outlined group-hover:text-primary transition-colors">quiz</span>
<span className="font-label-md text-label-md font-medium">Quiz</span>
</a>
<a className="flex items-center gap-3 px-4 py-3 rounded-lg text-on-surface-variant dark:text-outline hover:text-primary dark:hover:text-primary-fixed-dim hover:bg-surface-container-high dark:hover:bg-surface-container transition-colors duration-200 active:scale-95 transition-transform group" href="#">
<span className="material-symbols-outlined group-hover:text-primary transition-colors">map</span>
<span className="font-label-md text-label-md font-medium">Roadmap</span>
</a>
<a className="flex items-center gap-3 px-4 py-3 rounded-lg text-on-surface-variant dark:text-outline hover:text-primary dark:hover:text-primary-fixed-dim hover:bg-surface-container-high dark:hover:bg-surface-container transition-colors duration-200 active:scale-95 transition-transform group" href="#">
<span className="material-symbols-outlined group-hover:text-primary transition-colors">person</span>
<span className="font-label-md text-label-md font-medium">Profile</span>
</a>
</div>
<div className="px-6 mt-auto">
<button className="w-full py-3 px-4 bg-surface-container-high text-primary rounded-lg font-label-md text-label-md font-semibold hover:bg-surface-container-highest transition-colors flex items-center justify-center gap-2 btn-actionable">
<span className="material-symbols-outlined text-sm">workspace_premium</span>
                Upgrade to Pro
            </button>
</div>
</nav>
 Main Content Canvas 
<main className="md:ml-64 pt-16 min-h-screen flex flex-col p-margin-mobile md:p-margin-desktop gap-stack-lg max-w-container-max mx-auto">

<section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
<div className="lg:col-span-2 flex flex-col justify-center">
<h1 className="font-headline-xl text-headline-xl text-on-background mb-2">Cellular Biology Review</h1>
<p className="font-body-lg text-body-lg text-on-surface-variant">Mastering mitochondria and cellular respiration.</p>

<div className="mt-6 flex items-center gap-4 bg-surface-container-lowest p-4 rounded-xl border border-outline-variant/50 shadow-sm w-max">
<div className="w-48 h-2 bg-surface-variant rounded-full overflow-hidden">
<div className="h-full bg-primary rounded-full" style={{ width: '40%', background: 'linear-gradient(90deg, rgb(195, 192, 255) 0%, rgb(53, 37, 205) 100%)' }}></div>
</div>
<span className="font-label-md text-label-md text-on-surface-variant font-medium">12 / 20 cards remaining</span>
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

<div className="w-full aspect-[4/3] md:aspect-[16/9] perspective-1000 flashcard cursor-pointer group" id="flashcard-container">
<div className="relative w-full h-full transform-style-3d flashcard-inner shadow-sm rounded-2xl group-hover:-translate-y-1 group-hover:shadow-md transition-all duration-300">

<div className="absolute inset-0 w-full h-full backface-hidden bg-surface-container-lowest border border-outline-variant rounded-2xl p-8 md:p-12 flex flex-col items-center justify-center text-center" style={{ background: 'radial-gradient(circle, rgb(255, 255, 255) 0%, rgb(229, 238, 255) 100%)' }}>
<div className="absolute top-6 left-6 text-outline font-label-md text-label-md">Question</div>
<div className="absolute top-6 right-6">
<span className="material-symbols-outlined text-outline cursor-help hover:text-primary transition-colors">volume_up</span>
</div>
<h2 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-background max-w-xl">
                            What is the primary function of the mitochondria in a eukaryotic cell?
                        </h2>
<div className="absolute bottom-6 flex items-center gap-2 text-outline opacity-60">
<span className="material-symbols-outlined text-sm">touch_app</span>
<span className="font-caption text-caption">Click or press Space to flip</span>
</div>
</div>

<div className="absolute inset-0 w-full h-full backface-hidden rotate-y-180 bg-inverse-on-surface border border-primary-fixed-dim rounded-2xl p-8 md:p-12 flex flex-col items-center justify-center text-center">
<div className="absolute top-6 left-6 text-primary font-label-md text-label-md">Answer</div>
<h2 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-background max-w-xl mb-4">
                            Cellular Respiration
                        </h2>
<p className="font-body-lg text-body-lg text-on-surface-variant max-w-lg">
                            They generate most of the cell's supply of adenosine triphosphate (ATP), used as a source of chemical energy. Often referred to as the "powerhouse of the cell."
                        </p>
</div>
</div>
</div>

<div className="mt-8 flex items-center justify-between w-full max-w-md">
<button className="px-6 py-3 rounded-lg font-label-md text-label-md font-semibold text-error bg-error-container/50 hover:bg-error-container transition-colors flex items-center gap-2 btn-actionable">
<span className="material-symbols-outlined text-sm">history</span>
                    Review Later
                </button>
<div className="flex items-center gap-4 text-outline font-caption text-caption hidden md:flex">
<kbd className="px-2 py-1 bg-surface-container-high rounded border border-outline-variant">←</kbd>
<span className="">/</span>
<kbd className="px-2 py-1 bg-surface-container-high rounded border border-outline-variant">→</kbd>
</div>
<button className="px-8 py-3 rounded-lg font-label-md text-label-md font-semibold text-on-tertiary-fixed-variant bg-tertiary-fixed hover:bg-tertiary-fixed-dim transition-colors flex items-center gap-2 btn-actionable shadow-sm" style={{ background: 'linear-gradient(rgb(111, 251, 190) 0%, rgb(78, 222, 163) 100%)' }}>
                    Got it
                    <span className="material-symbols-outlined text-sm">check</span>
</button>
</div>
</section>
</main>


    </>
  );
}
