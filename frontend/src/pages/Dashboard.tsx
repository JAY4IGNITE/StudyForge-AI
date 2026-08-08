import React from 'react';

export function Dashboard() {
  return (
    <>
      
 TopAppBar (Hidden on Mobile, Visible on Desktop) 
<header className="hidden md:flex justify-between items-center w-full px-margin-desktop h-16 ml-64 bg-surface/80 backdrop-blur-md border-b border-outline-variant docked full-width top-0 z-40 fixed">
<div className="flex items-center gap-4">
<span className="font-headline-md text-headline-md font-black text-primary">StudyForge AI</span>
</div>
<div className="flex items-center gap-6">
<div className="relative w-64">
<span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline">search</span>
<input className="w-full h-10 pl-10 pr-4 bg-surface-container-lowest border border-outline-variant rounded-full text-body-md focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors placeholder-outline" placeholder="Search topics, notes..." type="text"/>
</div>
<div className="flex items-center gap-4 text-on-surface-variant">
<button className="hover:text-primary transition-all active:scale-95"><span className="material-symbols-outlined filled-icon" data-icon="local_fire_department">local_fire_department</span></button>
<button className="hover:text-primary transition-all active:scale-95"><span className="material-symbols-outlined" data-icon="stars">stars</span></button>
<button className="hover:text-primary transition-all active:scale-95"><span className="material-symbols-outlined" data-icon="notifications">notifications</span></button>
<img alt="User avatar" className="w-8 h-8 rounded-full object-cover border border-outline-variant" data-alt="A clean, professional portrait of a young student against a light neutral background, looking focused and optimistic. Soft, high-key studio lighting with a shallow depth of field. Modern, minimalist aesthetic suitable for an avatar." src="https://lh3.googleusercontent.com/aida-public/AB6AXuDT_RsUE5otVGNRkVoOCcB6QVli2-WDR6DatAvWZW4dCiNeLyW-o6B3lIMZvahL7Yz4b4wnWLP9yizHxYp2RuPuL6MLpflEI3jg5x4yeBVtXq3jkMhbexKW4Mi7bXNgMC6Ui-ntxpxnDj5N0kL9hvs4pCnuBxRLIkFRblWtAYx9Z2eS7rv0aMLy30DZizk4ZpLj4IdgWVz7R94Ggq-cljBbxVxydrotu9PyDGEPBwEIOFw68pbAkYlmMg"/>
</div>
</div>
</header>
 SideNavBar (Hidden on Mobile, Visible on Desktop) 
<nav className="hidden md:flex fixed left-0 top-0 h-full flex-col py-stack-md h-screen w-64 border-r border-outline-variant bg-surface shadow-sm z-50 bg-gradient-to-b from-surface to-surface-container-low">
<div className="px-6 mb-8 flex flex-col items-start">
<div className="flex items-center gap-3 mb-4">
<img alt="User profile avatar" className="w-10 h-10 rounded-full object-cover border border-outline-variant" data-alt="A clean, professional portrait of a young student against a light neutral background, looking focused and optimistic. Soft, high-key studio lighting with a shallow depth of field. Modern, minimalist aesthetic suitable for an avatar." src="https://lh3.googleusercontent.com/aida-public/AB6AXuAs1TWTfbAuUWCeFi7Y6Y-piT5-6OmX28xybM-7ZBFERpFy2-syN4Gw8enJ9CMR3cVCpHRB7mFXwlg5bWjNVWIhFaAwtB6xixCUyyCiDj9_Xn8x16-xLV-WUUQohtqrkdHd5Nq32tdwg7Q9zcaT7_rBlpuV8HbKgiyXkxNzBncqaCJl6tMTVrbdLuddSGEIKnV2ztUyYgCtg7kLg235BvXwZ6okG0eV3lcTf60lnupGqYDBtEIEgf5CQA"/>
<div>
<h2 className="font-label-md text-label-md font-bold text-on-surface">Alex Mercer</h2>
<p className="font-caption text-caption text-on-surface-variant">Level 12 Focus Master</p>
</div>
</div>
<button className="w-full bg-primary-container text-on-primary-container font-label-md text-label-md py-2 rounded-lg hover:bg-surface-tint hover:text-white transition-colors duration-200 border-b-2 border-primary bg-gradient-to-r from-primary-container to-primary">Upgrade to Pro</button>
</div>
<ul className="flex-1 px-4 space-y-1">
<li className="">
<a className="flex items-center gap-4 px-4 py-3 rounded-lg text-primary font-bold border-r-4 border-primary bg-primary-container/10 active:scale-95 transition-transform bg-gradient-to-r from-primary-container/20 to-transparent" href="#">
<span className="material-symbols-outlined filled-icon" data-icon="home">home</span>
<span className="font-label-md text-label-md">Home</span>
</a>
</li>
<li className="">
<a className="flex items-center gap-4 px-4 py-3 rounded-lg text-on-surface-variant hover:text-primary hover:bg-surface-container-high transition-colors duration-200 active:scale-95 transition-transform" href="#">
<span className="material-symbols-outlined" data-icon="chat">chat</span>
<span className="font-label-md text-label-md">Chat</span>
</a>
</li>
<li className="">
<a className="flex items-center gap-4 px-4 py-3 rounded-lg text-on-surface-variant hover:text-primary hover:bg-surface-container-high transition-colors duration-200 active:scale-95 transition-transform" href="#">
<span className="material-symbols-outlined" data-icon="style">style</span>
<span className="font-label-md text-label-md">Flashcards</span>
</a>
</li>
<li className="">
<a className="flex items-center gap-4 px-4 py-3 rounded-lg text-on-surface-variant hover:text-primary hover:bg-surface-container-high transition-colors duration-200 active:scale-95 transition-transform" href="#">
<span className="material-symbols-outlined" data-icon="quiz">quiz</span>
<span className="font-label-md text-label-md">Quiz</span>
</a>
</li>
<li className="">
<a className="flex items-center gap-4 px-4 py-3 rounded-lg text-on-surface-variant hover:text-primary hover:bg-surface-container-high transition-colors duration-200 active:scale-95 transition-transform" href="#">
<span className="material-symbols-outlined" data-icon="map">map</span>
<span className="font-label-md text-label-md">Roadmap</span>
</a>
</li>
<li className="">
<a className="flex items-center gap-4 px-4 py-3 rounded-lg text-on-surface-variant hover:text-primary hover:bg-surface-container-high transition-colors duration-200 active:scale-95 transition-transform" href="#">
<span className="material-symbols-outlined" data-icon="person">person</span>
<span className="font-label-md text-label-md">Profile</span>
</a>
</li>
</ul>
</nav>
 Main Content Area 
<main className="md:ml-64 pt-6 md:pt-24 px-margin-mobile md:px-margin-desktop pb-24 md:pb-12 max-w-container-max mx-auto">

<div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-stack-lg gap-6">
<div>
<h1 className="font-headline-xl text-headline-xl text-on-surface mb-2">Welcome back, Alex!</h1>
<p className="font-body-lg text-body-lg text-on-surface-variant">Ready to crush your goals today?</p>
</div>
<div className="flex items-center gap-3 bg-gradient-to-r from-secondary-container/20 to-secondary-fixed/30 border border-secondary-fixed p-4 rounded-xl shadow-[0_4px_12px_rgba(0,0,0,0.03)]">
<div className="bg-gradient-to-br from-secondary-container to-secondary w-12 h-12 rounded-full flex items-center justify-center shadow-sm">
<span className="material-symbols-outlined filled-icon text-white text-2xl" data-icon="local_fire_department">local_fire_department</span>
</div>
<div>
<div className="font-headline-md text-headline-md text-secondary font-bold">7 Days</div>
<div className="font-caption text-caption text-secondary/80 font-medium uppercase tracking-wider">Current Streak</div>
</div>
</div>
</div>

<div className="grid grid-cols-1 md:grid-cols-12 gap-6">

<div className="md:col-span-8 grid grid-cols-2 md:grid-cols-3 gap-4">

<button className="col-span-2 md:col-span-1 bg-surface-container-lowest border border-outline-variant p-stack-md rounded-xl shadow-[0_4px_12px_rgba(0,0,0,0.03)] hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)] transition-all flex flex-col items-start text-left group">
<div className="w-10 h-10 rounded-lg bg-primary-container/10 flex items-center justify-center mb-4 group-hover:bg-primary transition-colors">
<span className="material-symbols-outlined text-primary group-hover:text-white transition-colors" data-icon="smart_toy">smart_toy</span>
</div>
<h3 className="font-label-md text-label-md text-on-surface mb-1">Ask AI</h3>
<p className="font-caption text-caption text-on-surface-variant">Get instant help</p>
</button>

<button className="bg-surface-container-lowest border border-outline-variant p-stack-md rounded-xl shadow-[0_4px_12px_rgba(0,0,0,0.03)] hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)] transition-all flex flex-col items-start text-left group">
<div className="w-10 h-10 rounded-lg bg-tertiary-container/10 flex items-center justify-center mb-4 group-hover:bg-tertiary transition-colors">
<span className="material-symbols-outlined text-tertiary group-hover:text-white transition-colors" data-icon="style">style</span>
</div>
<h3 className="font-label-md text-label-md text-on-surface mb-1">Flashcards</h3>
<p className="font-caption text-caption text-on-surface-variant">Review daily deck</p>
</button>

<button className="bg-surface-container-lowest border border-outline-variant p-stack-md rounded-xl shadow-[0_4px_12px_rgba(0,0,0,0.03)] hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)] transition-all flex flex-col items-start text-left group">
<div className="w-10 h-10 rounded-lg bg-secondary-container/10 flex items-center justify-center mb-4 group-hover:bg-secondary-container transition-colors">
<span className="material-symbols-outlined text-secondary-container group-hover:text-white transition-colors" data-icon="quiz">quiz</span>
</div>
<h3 className="font-label-md text-label-md text-on-surface mb-1">Quiz Me</h3>
<p className="font-caption text-caption text-on-surface-variant">Test knowledge</p>
</button>

<button className="col-span-2 md:col-span-2 bg-gradient-to-br from-surface-container-lowest to-surface-container-low border border-outline-variant p-stack-md rounded-xl shadow-[0_4px_12px_rgba(0,0,0,0.03)] hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)] transition-all flex flex-row items-center justify-between text-left group to-surface-container-high">
<div>
<h3 className="font-headline-md text-headline-md text-on-surface mb-2">Study Roadmap</h3>
<p className="font-body-md text-body-md text-on-surface-variant mb-4">Calculus Midterm prep</p>
<div className="flex items-center gap-2">
<div className="w-32 h-2 bg-outline-variant/30 rounded-full overflow-hidden">
<div className="w-3/4 h-full bg-primary rounded-full"></div>
</div>
<span className="font-caption text-caption text-primary font-semibold">75%</span>
</div>
</div>
<div className="w-12 h-12 rounded-full bg-primary-container/10 flex items-center justify-center group-hover:bg-primary transition-colors">
<span className="material-symbols-outlined text-primary group-hover:text-white transition-colors" data-icon="map">map</span>
</div>
</button>

<button className="bg-surface-container-lowest border border-outline-variant p-stack-md rounded-xl shadow-[0_4px_12px_rgba(0,0,0,0.03)] hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)] transition-all flex flex-col items-start text-left group">
<div className="w-10 h-10 rounded-lg bg-inverse-surface/5 flex items-center justify-center mb-4 group-hover:bg-inverse-surface transition-colors">
<span className="material-symbols-outlined text-inverse-surface group-hover:text-white transition-colors" data-icon="summarize">summarize</span>
</div>
<h3 className="font-label-md text-label-md text-on-surface mb-1">Notes</h3>
<p className="font-caption text-caption text-on-surface-variant">Auto-summarize</p>
</button>
</div>

<div className="md:col-span-4 bg-primary-container text-white p-stack-md rounded-2xl shadow-[0_8px_24px_rgba(0,0,0,0.08)] flex flex-col items-center justify-center relative overflow-hidden bg-gradient-to-br from-primary-container via-primary to-on-primary-fixed-variant">

<div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10"></div>
<div className="absolute bottom-0 left-0 w-24 h-24 bg-surface-tint/50 rounded-full blur-xl -ml-6 -mb-6"></div>
<div className="z-10 text-center w-full">
<div className="flex justify-between items-center w-full mb-6">
<span className="font-label-md text-label-md text-primary-fixed-dim tracking-wider uppercase">Focus Session</span>
<span className="material-symbols-outlined text-primary-fixed-dim" data-icon="timer">timer</span>
</div>
<div className="relative w-48 h-48 mx-auto mb-8 flex items-center justify-center">

<svg className="absolute inset-0 w-full h-full" viewBox="0 0 120 120">
<circle cx="60" cy="60" fill="none" r="54" stroke="rgba(255,255,255,0.2)" strokeWidth="6"></circle>
<circle className="progress-ring__circle" cx="60" cy="60" fill="none" r="54" stroke="white" stroke-dasharray="339.292" stroke-dashoffset="84.823" strokeLinecap="round" strokeWidth="6"></circle>
</svg>
<div className="flex flex-col items-center">
<span className="text-5xl font-headline-xl font-bold font-mono tracking-tighter">18:42</span>
<span className="font-caption text-caption text-primary-fixed-dim mt-1">25/5 Sprint</span>
</div>
</div>
<div className="flex justify-center gap-4">
<button className="w-12 h-12 rounded-full bg-white text-primary-container flex items-center justify-center hover:scale-105 active:scale-95 transition-transform shadow-lg">
<span className="material-symbols-outlined filled-icon text-2xl" data-icon="pause">pause</span>
</button>
<button className="w-12 h-12 rounded-full bg-white/20 text-white flex items-center justify-center hover:bg-white/30 active:scale-95 transition-all backdrop-blur-sm border border-white/30">
<span className="material-symbols-outlined text-xl" data-icon="skip_next">skip_next</span>
</button>
</div>
</div>
</div>
</div> 

<div className="mt-8 bg-surface-container-lowest border border-outline-variant p-stack-md rounded-xl shadow-[0_4px_12px_rgba(0,0,0,0.03)]">
<h2 className="font-headline-md text-headline-md text-on-surface mb-6">Progress Snapshot</h2>
<div className="grid grid-cols-1 md:grid-cols-2 gap-8">

<div>
<div className="flex justify-between items-end mb-4">
<span className="font-label-md text-label-md text-on-surface-variant">Weekly Study Time</span>
<span className="font-body-md text-body-md text-on-surface font-bold">14h 20m <span className="text-tertiary-container font-normal text-sm ml-1">+2h</span></span>
</div>

<div className="h-32 flex items-end justify-between gap-2 border-b border-outline-variant pb-2">
<div className="w-full bg-primary/20 rounded-t-sm h-[40%] hover:bg-primary/40 transition-colors relative group"><span className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs opacity-0 group-hover:opacity-100 transition-opacity">2h</span></div>
<div className="w-full bg-primary/20 rounded-t-sm h-[60%] hover:bg-primary/40 transition-colors relative group"><span className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs opacity-0 group-hover:opacity-100 transition-opacity">3h</span></div>
<div className="w-full bg-primary rounded-t-sm h-[90%] relative group"><span className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs font-bold text-primary">4.5h</span></div>
<div className="w-full bg-primary/20 rounded-t-sm h-[30%] hover:bg-primary/40 transition-colors relative group"><span className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs opacity-0 group-hover:opacity-100 transition-opacity">1.5h</span></div>
<div className="w-full bg-primary/20 rounded-t-sm h-[70%] hover:bg-primary/40 transition-colors relative group"><span className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs opacity-0 group-hover:opacity-100 transition-opacity">3.5h</span></div>
<div className="w-full bg-surface-container-high rounded-t-sm h-1 border border-dashed border-outline-variant"></div>
<div className="w-full bg-surface-container-high rounded-t-sm h-1 border border-dashed border-outline-variant"></div>
</div>
<div className="flex justify-between text-xs text-outline mt-2 px-1">
<span className="">M</span><span className="">T</span><span className="">W</span><span className="">T</span><span className="">F</span><span className="">S</span><span className="">S</span>
</div>
</div>

<div>
<span className="font-label-md text-label-md text-on-surface-variant block mb-4">Mastery Breakdown</span>
<div className="space-y-4">

<div>
<div className="flex justify-between text-sm mb-1">
<span className="font-body-md text-body-md text-on-surface flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-primary"></span> Math</span>
<span className="font-body-md text-body-md font-medium">85%</span>
</div>
<div className="w-full h-2 bg-surface-container-high rounded-full overflow-hidden">
<div className="h-full bg-primary rounded-full w-[85%]"></div>
</div>
</div>

<div>
<div className="flex justify-between text-sm mb-1">
<span className="font-body-md text-body-md text-on-surface flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-tertiary"></span> Science</span>
<span className="font-body-md text-body-md font-medium">62%</span>
</div>
<div className="w-full h-2 bg-surface-container-high rounded-full overflow-hidden">
<div className="h-full bg-tertiary rounded-full w-[62%]"></div>
</div>
</div>

<div>
<div className="flex justify-between text-sm mb-1">
<span className="font-body-md text-body-md text-on-surface flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-secondary-container"></span> History</span>
<span className="font-body-md text-body-md font-medium">94%</span>
</div>
<div className="w-full h-2 bg-surface-container-high rounded-full overflow-hidden">
<div className="h-full bg-secondary-container rounded-full w-[94%]"></div>
</div>
</div>
</div>
</div>
</div>
</div>
</main>
 Bottom Nav Bar (Mobile Only) 
<nav className="md:hidden fixed bottom-0 left-0 w-full bg-surface border-t border-outline-variant px-4 py-2 flex justify-around items-center z-50 pb-safe shadow-[0_-4px_12px_rgba(0,0,0,0.05)]">
<a className="flex flex-col items-center gap-1 text-primary p-2" href="#">
<span className="material-symbols-outlined filled-icon text-2xl" data-icon="home">home</span>
<span className="text-[10px] font-medium">Home</span>
</a>
<a className="flex flex-col items-center gap-1 text-on-surface-variant p-2" href="#">
<span className="material-symbols-outlined text-2xl" data-icon="style">style</span>
<span className="text-[10px] font-medium">Cards</span>
</a>

<button className="w-14 h-14 bg-primary text-white rounded-full flex items-center justify-center -mt-6 shadow-lg border-4 border-surface active:scale-95 transition-transform">
<span className="material-symbols-outlined text-3xl" data-icon="smart_toy">smart_toy</span>
</button>
<a className="flex flex-col items-center gap-1 text-on-surface-variant p-2" href="#">
<span className="material-symbols-outlined text-2xl" data-icon="map">map</span>
<span className="text-[10px] font-medium">Roadmap</span>
</a>
<a className="flex flex-col items-center gap-1 text-on-surface-variant p-2" href="#">
<span className="material-symbols-outlined text-2xl" data-icon="person">person</span>
<span className="text-[10px] font-medium">Profile</span>
</a>
</nav>

    </>
  );
}
