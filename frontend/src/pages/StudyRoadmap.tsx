import React from 'react';

export function StudyRoadmap() {
  return (
    <>
      
 SideNavBar (Desktop) 
<nav className="hidden md:flex bg-surface dark:bg-surface-dim shadow-sm h-screen w-64 border-r border-outline-variant dark:border-outline fixed left-0 top-0 flex-col py-stack-md z-50">
<div className="px-6 mb-8">
<h1 className="font-headline-md text-headline-md font-bold text-primary dark:text-primary-fixed-dim mb-1">StudyForge AI</h1>
<p className="font-caption text-caption text-on-surface-variant flex items-center gap-1">
<span className="material-symbols-outlined text-secondary-container" style={{ fontSize: '14px', fontVariationSettings: '"FILL" 1' }}>stars</span>
                Level 12 Focus Master
            </p>
</div>
<ul className="flex flex-col gap-2 px-4 flex-grow">
<li>
<a className="flex items-center gap-3 px-4 py-3 rounded-lg text-on-surface-variant dark:text-outline hover:text-primary dark:hover:text-primary-fixed-dim hover:bg-surface-container-high dark:hover:bg-surface-container transition-colors duration-200 active:scale-95 transition-transform" href="#">
<span className="material-symbols-outlined">home</span>
<span className="font-label-md text-label-md">Home</span>
</a>
</li>
<li>
<a className="flex items-center gap-3 px-4 py-3 rounded-lg text-on-surface-variant dark:text-outline hover:text-primary dark:hover:text-primary-fixed-dim hover:bg-surface-container-high dark:hover:bg-surface-container transition-colors duration-200 active:scale-95 transition-transform" href="#">
<span className="material-symbols-outlined">chat</span>
<span className="font-label-md text-label-md">Chat</span>
</a>
</li>
<li>
<a className="flex items-center gap-3 px-4 py-3 rounded-lg text-on-surface-variant dark:text-outline hover:text-primary dark:hover:text-primary-fixed-dim hover:bg-surface-container-high dark:hover:bg-surface-container transition-colors duration-200 active:scale-95 transition-transform" href="#">
<span className="material-symbols-outlined">style</span>
<span className="font-label-md text-label-md">Flashcards</span>
</a>
</li>
<li>
<a className="flex items-center gap-3 px-4 py-3 rounded-lg text-on-surface-variant dark:text-outline hover:text-primary dark:hover:text-primary-fixed-dim hover:bg-surface-container-high dark:hover:bg-surface-container transition-colors duration-200 active:scale-95 transition-transform" href="#">
<span className="material-symbols-outlined">quiz</span>
<span className="font-label-md text-label-md">Quiz</span>
</a>
</li>
<li>
<a className="flex items-center gap-3 px-4 py-3 rounded-lg text-primary dark:text-primary-fixed-dim font-bold border-r-4 border-primary dark:border-primary-fixed-dim bg-primary-container/10 active:scale-95 transition-transform" href="#">
<span className="material-symbols-outlined" style={{ fontVariationSettings: '"FILL" 1' }}>map</span>
<span className="font-label-md text-label-md">Roadmap</span>
</a>
</li>
<li>
<a className="flex items-center gap-3 px-4 py-3 rounded-lg text-on-surface-variant dark:text-outline hover:text-primary dark:hover:text-primary-fixed-dim hover:bg-surface-container-high dark:hover:bg-surface-container transition-colors duration-200 active:scale-95 transition-transform" href="#">
<span className="material-symbols-outlined">person</span>
<span className="font-label-md text-label-md">Profile</span>
</a>
</li>
</ul>
<div className="px-4 mt-auto">
<button className="w-full bg-primary/5 text-primary font-label-md text-label-md font-bold py-3 rounded-lg border-b-2 border-primary/20 hover:bg-primary/10 transition-colors">
                Upgrade to Pro
            </button>
</div>
</nav>
 Main Content Wrapper 
<div className="flex-1 flex flex-col min-w-0 md:ml-64">

<header className="hidden md:flex justify-between items-center w-full px-margin-desktop h-16 bg-surface/80 dark:bg-surface-dim/80 backdrop-blur-md border-b border-outline-variant dark:border-outline docked full-width top-0 z-40 sticky">
<div className="flex-1"></div>
<div className="flex items-center gap-4">
<button className="text-on-surface-variant dark:text-outline hover:text-primary dark:hover:text-primary-fixed-dim transition-all active:opacity-80 transition-opacity">
<span className="material-symbols-outlined">local_fire_department</span>
</button>
<button className="text-on-surface-variant dark:text-outline hover:text-primary dark:hover:text-primary-fixed-dim transition-all active:opacity-80 transition-opacity">
<span className="material-symbols-outlined">stars</span>
</button>
<button className="text-on-surface-variant dark:text-outline hover:text-primary dark:hover:text-primary-fixed-dim transition-all active:opacity-80 transition-opacity relative">
<span className="material-symbols-outlined">notifications</span>
<span className="absolute top-0 right-0 w-2 h-2 bg-error rounded-full"></span>
</button>
<div className="w-8 h-8 rounded-full bg-surface-variant overflow-hidden border border-outline-variant ml-2">
<img alt="User avatar" className="w-full h-full object-cover" data-alt="A close up, vibrant portrait of a young student focused in a modern, light-filled study environment, high key lighting, modern minimalist aesthetic." src="https://lh3.googleusercontent.com/aida-public/AB6AXuB6h_0YDVdvvrXx4s3h-lYD0CTYr5NgxBafIkges-zTdIks8mU-hMFEVkOoEpXL63m0qlgwUue61Nxf_2kuwnjpbMiQlxd4SPZTm7MAdPPZLdd3Xnq9NWiLGTK-hMI5rG2mQz_yYMXxJP6-cVyUn8UfXRdDcU8tKI4k7KjFYoTbkYpU5ZhcNwjmz_NAAMoGPQTdK6MmtkdbzFnGglN9e2Q7-clvnWoDYiDV7QL_VdjUUuYJ77YBtbKckg"/>
</div>
</div>
</header>

<main className="flex-1 p-margin-mobile md:p-margin-desktop overflow-y-auto">
<div className="max-w-container-max mx-auto">

<div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-stack-md gap-4">
<div>
<h2 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-surface mb-2">Organic Chemistry Masterplan</h2>
<p className="font-body-md text-body-md text-on-surface-variant flex items-center gap-2">
<span className="material-symbols-outlined text-outline" style={{ fontSize: '18px' }}>calendar_month</span>
                            7 Days remaining
                        </p>
</div>
<button className="bg-primary text-white font-label-md text-label-md px-6 py-3 rounded-lg shadow-sm hover:shadow-md transition-shadow border-b-2 border-primary-fixed-variant flex items-center gap-2">
<span className="material-symbols-outlined" style={{ fontSize: '18px' }}>autorenew</span>
                        Regenerate Roadmap
                    </button>
</div>

<div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-stack-md shadow-sm mb-stack-lg">
<div className="flex justify-between items-center mb-4">
<span className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Overall Progress</span>
<span className="font-label-md text-label-md text-primary font-bold">4 / 7 days complete</span>
</div>
<div className="w-full bg-surface-variant rounded-full h-2 overflow-hidden">
<div className="bg-primary h-2 rounded-full" style={{ width: '57%' }}></div>
</div>
</div>

<div className="grid grid-cols-1 md:grid-cols-12 gap-6 relative">

<div className="hidden md:block absolute left-8 top-0 bottom-0 w-px bg-outline-variant/50"></div>

<div className="col-span-1 md:col-span-12 flex flex-col md:flex-row gap-6 group">
<div className="md:w-16 flex flex-col items-center z-10 shrink-0 hidden md:flex">
<div className="w-8 h-8 rounded-full bg-tertiary text-on-tertiary flex items-center justify-center font-bold font-label-md border-4 border-surface shadow-sm">
<span className="material-symbols-outlined" style={{ fontSize: '16px' }}>check</span>
</div>
</div>
<div className="flex-1 bg-surface-container-lowest border border-outline-variant rounded-xl p-stack-md shadow-sm opacity-60">
<div className="flex justify-between items-start mb-4">
<div>
<h3 className="font-headline-md text-headline-md text-on-surface line-through">Day 1: Alkanes Basics</h3>
<span className="inline-block px-3 py-1 bg-surface-variant text-on-surface-variant rounded-full font-caption text-caption mt-2">45 min</span>
</div>
<div className="w-6 h-6 rounded border-2 border-tertiary bg-tertiary flex items-center justify-center text-white">
<span className="material-symbols-outlined" style={{ fontSize: '16px' }}>check</span>
</div>
</div>
<p className="font-body-md text-body-md text-on-surface-variant">Nomenclature, physical properties, and simple combustion reactions.</p>
</div>
</div>

<div className="col-span-1 md:col-span-12 flex flex-col md:flex-row gap-6 group mt-4">
<div className="md:w-16 flex flex-col items-center z-10 shrink-0 hidden md:flex">
<div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold font-label-md border-4 border-surface shadow-md">
                                5
                            </div>
</div>
<div className="flex-1 bg-surface-container-lowest border-2 border-primary rounded-xl p-stack-md shadow-[0_8px_24px_rgba(79,70,229,0.1)] transform -translate-y-1 transition-transform">
<div className="flex justify-between items-start mb-4">
<div>
<div className="flex items-center gap-2 mb-1">
<h3 className="font-headline-md text-headline-md text-on-surface font-bold">Day 5: Aromatic Compounds</h3>
<span className="px-2 py-0.5 bg-secondary-container/20 text-secondary-container rounded text-[10px] font-bold uppercase tracking-wider">Today</span>
</div>
<span className="inline-block px-3 py-1 bg-primary/10 text-primary rounded-full font-caption text-caption mt-2 font-medium">90 min</span>
</div>
<div className="w-6 h-6 rounded border-2 border-outline hover:border-primary cursor-pointer transition-colors"></div>
</div>
<p className="font-body-md text-body-md text-on-surface-variant mb-4">Benzene structure, resonance, and electrophilic aromatic substitution mechanisms.</p>
<div className="space-y-2 mt-4 border-t border-outline-variant pt-4">
<label className="flex items-center gap-3 cursor-pointer group/task">
<input className="form-checkbox text-primary rounded border-outline-variant focus:ring-primary h-5 w-5" type="checkbox"/>
<span className="font-body-md text-body-md text-on-surface group-hover/task:text-primary transition-colors">Review Benzene MO Theory (20m)</span>
</label>
<label className="flex items-center gap-3 cursor-pointer group/task">
<input className="form-checkbox text-primary rounded border-outline-variant focus:ring-primary h-5 w-5" type="checkbox"/>
<span className="font-body-md text-body-md text-on-surface group-hover/task:text-primary transition-colors">Practice EAS Mechanisms (40m)</span>
</label>
<button className="mt-4 text-primary font-label-md text-label-md flex items-center gap-1 hover:underline">
<span className="material-symbols-outlined" style={{ fontSize: '16px' }}>add</span> Add Subtask
                                </button>
</div>
</div>
</div>

<div className="col-span-1 md:col-span-12 flex flex-col md:flex-row gap-6 group mt-4">
<div className="md:w-16 flex flex-col items-center z-10 shrink-0 hidden md:flex">
<div className="w-8 h-8 rounded-full bg-surface-variant text-on-surface-variant flex items-center justify-center font-bold font-label-md border-4 border-surface">
                                6
                            </div>
</div>
<div className="flex-1 bg-surface-container-lowest border border-outline-variant rounded-xl p-stack-md hover:shadow-sm transition-shadow">
<div className="flex justify-between items-start mb-4">
<div>
<h3 className="font-headline-md text-headline-md text-on-surface">Day 6: Aldehydes &amp; Ketones</h3>
<span className="inline-block px-3 py-1 bg-surface-variant text-on-surface-variant rounded-full font-caption text-caption mt-2">60 min</span>
</div>
<div className="w-6 h-6 rounded border-2 border-outline"></div>
</div>
<p className="font-body-md text-body-md text-on-surface-variant">Nucleophilic addition reactions and oxidation/reduction.</p>
</div>
</div>
</div>
</div>
</main>
</div>

    </>
  );
}
