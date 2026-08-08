import React from 'react';

export function Resources() {
  return (
    <>
      
 SideNavBar 
<nav className="hidden md:flex flex-col py-stack-md bg-surface shadow-sm h-screen w-64 border-r border-outline-variant fixed left-0 top-0 z-50 bg-gradient-to-b from-surface to-surface-container-low">

<div className="px-stack-md mb-stack-lg flex items-center gap-3">
<div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center text-on-primary font-bold shadow-sm">
                S
            </div>
<div className="flex flex-col">
<span className="font-headline-md text-headline-md font-bold text-primary">StudyForge AI</span>
<span className="font-caption text-caption text-on-surface-variant">Level 12 Focus Master</span>
</div>
</div>

<div className="flex flex-col flex-grow gap-1 px-base">
<a className="flex items-center gap-3 px-4 py-3 rounded-lg text-on-surface-variant hover:text-primary hover:bg-surface-container-high transition-colors duration-200 active:scale-95 transition-transform group" href="#">
<span className="material-symbols-outlined text-[20px] group-hover:text-primary transition-colors" data-icon="home">home</span>
<span className="font-label-md text-label-md">Home</span>
</a>
<a className="flex items-center gap-3 px-4 py-3 rounded-lg text-primary font-bold border-r-4 border-primary bg-primary-container/10 transition-colors duration-200 active:scale-95 transition-transform group" href="#">
<span className="material-symbols-outlined text-[20px] text-primary" data-icon="description" data-weight="fill">description</span>
<span className="font-label-md text-label-md">Notes &amp; Documents</span>
</a>
<a className="flex items-center gap-3 px-4 py-3 rounded-lg text-on-surface-variant hover:text-primary hover:bg-surface-container-high transition-colors duration-200 active:scale-95 transition-transform group" href="#">
<span className="material-symbols-outlined text-[20px] group-hover:text-primary transition-colors" data-icon="chat">chat</span>
<span className="font-label-md text-label-md">Chat</span>
</a>
<a className="flex items-center gap-3 px-4 py-3 rounded-lg text-on-surface-variant hover:text-primary hover:bg-surface-container-high transition-colors duration-200 active:scale-95 transition-transform group" href="#">
<span className="material-symbols-outlined text-[20px] group-hover:text-primary transition-colors" data-icon="style">style</span>
<span className="font-label-md text-label-md">Flashcards</span>
</a>
<a className="flex items-center gap-3 px-4 py-3 rounded-lg text-on-surface-variant hover:text-primary hover:bg-surface-container-high transition-colors duration-200 active:scale-95 transition-transform group" href="#">
<span className="material-symbols-outlined text-[20px] group-hover:text-primary transition-colors" data-icon="quiz">quiz</span>
<span className="font-label-md text-label-md">Quiz</span>
</a>
<a className="flex items-center gap-3 px-4 py-3 rounded-lg text-on-surface-variant hover:text-primary hover:bg-surface-container-high transition-colors duration-200 active:scale-95 transition-transform group" href="#">
<span className="material-symbols-outlined text-[20px] group-hover:text-primary transition-colors" data-icon="map">map</span>
<span className="font-label-md text-label-md">Roadmap</span>
</a>
<a className="flex items-center gap-3 px-4 py-3 rounded-lg text-on-surface-variant hover:text-primary hover:bg-surface-container-high transition-colors duration-200 active:scale-95 transition-transform group" href="#">
<span className="material-symbols-outlined text-[20px] group-hover:text-primary transition-colors" data-icon="person">person</span>
<span className="font-label-md text-label-md">Profile</span>
</a>
</div>

<div className="px-stack-md mt-auto">
<button className="w-full bg-surface-container-high text-primary font-label-md text-label-md py-3 rounded-lg hover:bg-primary hover:text-on-primary transition-colors action-btn">
                Upgrade to Pro
            </button>
</div>
</nav>
 Main Content Area 
<div className="flex-1 flex flex-col md:ml-64 h-full relative overflow-y-auto">

<header className="flex justify-between items-center w-full px-margin-desktop h-16 bg-surface/80 backdrop-blur-md border-b border-outline-variant sticky top-0 z-40">
<div className="flex-1">

<button className="md:hidden p-2 text-on-surface-variant hover:text-primary transition-colors">
<span className="material-symbols-outlined" data-icon="menu">menu</span>
</button>
</div>
<div className="flex items-center gap-4">
<button className="p-2 text-on-surface-variant hover:text-primary transition-all active:opacity-80">
<span className="material-symbols-outlined" data-icon="local_fire_department">local_fire_department</span>
</button>
<button className="p-2 text-on-surface-variant hover:text-primary transition-all active:opacity-80">
<span className="material-symbols-outlined" data-icon="stars">stars</span>
</button>
<button className="p-2 text-on-surface-variant hover:text-primary transition-all active:opacity-80 relative">
<span className="material-symbols-outlined" data-icon="notifications">notifications</span>
<span className="absolute top-1 right-1 w-2 h-2 bg-error rounded-full"></span>
</button>
<div className="w-8 h-8 rounded-full bg-surface-container-highest overflow-hidden border border-outline-variant cursor-pointer">
<img alt="User avatar" className="w-full h-full object-cover" data-alt="A small, professional portrait photo of a user for an avatar. Bright lighting, clean minimal background, signaling a modern tech-savvy learner. High quality, crisp resolution." src="https://lh3.googleusercontent.com/aida-public/AB6AXuBAKm3kK6vmMOl1eMqOvzpqJ8e3b_dUNVplNGcl8pQ3qqOAvsSqHsgQ1qT33VUs8O3UlWgjVRt0Q_Cxry53Do6L-fQckhxVhixbDgxRzvGyAIxD1T32O8wKhsSpOs9AGnVErfMnTXXNNZ7yZwhtodkaDTlCDHVfTfJxuy2a6HcB1SY1AlW3J4yV8xW4VZONrwtnhbTTBoJKgtg96GR3CHppKc2Ou8Xr7aX6-IyARYg1fp07hXh3shJAvw"/>
</div>
</div>
</header>

<main className="flex-1 p-margin-mobile md:p-margin-desktop max-w-container-max mx-auto w-full flex flex-col gap-stack-lg">

<div>
<h1 className="font-headline-lg md:font-headline-xl text-headline-lg-mobile md:text-headline-xl text-on-surface mb-2">Notes &amp; Documents</h1>
<p className="font-body-lg text-body-lg text-on-surface-variant">Upload your study materials to instantly generate quizzes, summaries, and chat with your content.</p>
</div>

<section className="upload-zone w-full h-48 flex flex-col items-center justify-center gap-3 cursor-pointer group bg-[radial-gradient(circle_at_center,_var(--tw-gradient-from)_0%,_transparent_70%)] from-primary-container/5" id="drop-zone">
<div className="w-12 h-12 rounded-full bg-surface-container flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
<span className="material-symbols-outlined text-[28px]" data-icon="cloud_upload">cloud_upload</span>
</div>
<div className="text-center">
<p className="font-label-md text-label-md text-on-surface mb-1">Drag and drop your files here</p>
<p className="font-body-md text-body-md text-on-surface-variant text-sm">or click to browse PDFs, Docs, or Images (Max 50MB)</p>
</div>
<input accept=".pdf,.doc,.docx,.txt" className="hidden" id="file-input" multiple type="file"/>
</section>

<section className="flex-1 flex flex-col gap-4">
<div className="flex justify-between items-end mb-2 border-b border-outline-variant pb-2">
<h2 className="font-headline-md text-headline-md text-on-surface">Recent Documents</h2>
<span className="font-caption text-caption text-on-surface-variant">2 files</span>
</div>

<div className="flex flex-col gap-4" id="document-list">

<div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-stack-md flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-[0_4px_12px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)] hover:-translate-y-[2px] transition-all duration-300 bg-gradient-to-r from-surface-container-lowest to-surface-container-low/30">
<div className="flex items-start gap-4">
<div className="w-10 h-10 rounded bg-error-container text-on-error-container flex items-center justify-center shrink-0">
<span className="material-symbols-outlined" data-icon="picture_as_pdf">picture_as_pdf</span>
</div>
<div>
<h3 className="font-label-md text-label-md text-on-surface font-semibold mb-1">History_Notes.pdf</h3>
<div className="flex items-center gap-2 font-caption text-caption text-on-surface-variant">
<span className="">Uploaded Today</span>
<span className="">•</span>
<span className="">2.4 MB</span>
<span className="">•</span>
<span className="px-2 py-0.5 rounded-full bg-surface-container text-on-surface-variant text-[10px]">Processed</span>
</div>
</div>
</div>
<div className="flex flex-wrap gap-2 md:gap-3">
<button className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-surface-container-low text-primary hover:bg-primary-container/10 font-label-md text-[13px] action-btn border border-primary-container/10">
<span className="material-symbols-outlined text-[16px]" data-icon="summarize">summarize</span>
                                Summarize
                            </button>
<button className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-surface-container-low text-primary hover:bg-primary-container/10 font-label-md text-[13px] action-btn border border-primary-container/10">
<span className="material-symbols-outlined text-[16px]" data-icon="psychology">psychology</span>
                                Quiz Me
                            </button>
<button className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-primary text-on-primary hover:bg-surface-tint font-label-md text-[13px] action-btn border-b-2 border-[#1e11a6]">
<span className="material-symbols-outlined text-[16px]" data-icon="forum">forum</span>
                                Chat with Doc
                            </button>
</div>
</div>

<div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-stack-md flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-[0_4px_12px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)] hover:-translate-y-[2px] transition-all duration-300 bg-gradient-to-r from-surface-container-lowest to-surface-container-low/30">
<div className="flex items-start gap-4">
<div className="w-10 h-10 rounded bg-error-container text-on-error-container flex items-center justify-center shrink-0">
<span className="material-symbols-outlined" data-icon="picture_as_pdf">picture_as_pdf</span>
</div>
<div>
<h3 className="font-label-md text-label-md text-on-surface font-semibold mb-1">Lecture_3_Bio.pdf</h3>
<div className="flex items-center gap-2 font-caption text-caption text-on-surface-variant">
<span className="">Oct 24, 2023</span>
<span className="">•</span>
<span className="">5.1 MB</span>
<span className="">•</span>
<span className="px-2 py-0.5 rounded-full bg-surface-container text-on-surface-variant text-[10px]">Processed</span>
</div>
</div>
</div>
<div className="flex flex-wrap gap-2 md:gap-3">
<button className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-surface-container-low text-primary hover:bg-primary-container/10 font-label-md text-[13px] action-btn border border-primary-container/10">
<span className="material-symbols-outlined text-[16px]" data-icon="summarize">summarize</span>
                                Summarize
                            </button>
<button className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-surface-container-low text-primary hover:bg-primary-container/10 font-label-md text-[13px] action-btn border border-primary-container/10">
<span className="material-symbols-outlined text-[16px]" data-icon="psychology">psychology</span>
                                Quiz Me
                            </button>
<button className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-primary text-on-primary hover:bg-surface-tint font-label-md text-[13px] action-btn border-b-2 border-[#1e11a6]">
<span className="material-symbols-outlined text-[16px]" data-icon="forum">forum</span>
                                Chat with Doc
                            </button>
</div>
</div>

<div className="hidden flex-col items-center justify-center py-12 px-4 text-center border-2 border-dashed border-outline-variant rounded-xl bg-surface-container-lowest/50" id="empty-state">
<div className="w-16 h-16 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant mb-4">
<span className="material-symbols-outlined text-[32px]" data-icon="folder_off">folder_off</span>
</div>
<h3 className="font-headline-md text-headline-md text-on-surface mb-2">No documents yet</h3>
<p className="font-body-md text-body-md text-on-surface-variant max-w-md">No documents uploaded yet. Upload a PDF to start generating study materials and learning faster.</p>
</div>
</div>
</section>
</main>
</div>
 Bottom Nav for Mobile 
<nav className="md:hidden fixed bottom-0 w-full bg-surface border-t border-outline-variant flex justify-around items-center py-3 px-2 z-50 shadow-[0_-4px_12px_rgba(0,0,0,0.05)] pb-safe">
<a className="flex flex-col items-center gap-1 text-on-surface-variant hover:text-primary w-16 group" href="#">
<span className="material-symbols-outlined text-[24px] group-hover:scale-110 transition-transform" data-icon="home">home</span>
<span className="font-caption text-[10px]">Home</span>
</a>
<a className="flex flex-col items-center gap-1 text-primary font-bold w-16 group" href="#">
<div className="px-4 py-1 rounded-full bg-primary-container/10 mb-0.5">
<span className="material-symbols-outlined text-[24px]" data-icon="description" data-weight="fill">description</span>
</div>
<span className="font-caption text-[10px]">Notes</span>
</a>
<a className="flex flex-col items-center gap-1 text-on-surface-variant hover:text-primary w-16 group" href="#">
<span className="material-symbols-outlined text-[24px] group-hover:scale-110 transition-transform" data-icon="chat">chat</span>
<span className="font-caption text-[10px]">Chat</span>
</a>
<a className="flex flex-col items-center gap-1 text-on-surface-variant hover:text-primary w-16 group" href="#">
<span className="material-symbols-outlined text-[24px] group-hover:scale-110 transition-transform" data-icon="style">style</span>
<span className="font-caption text-[10px]">Cards</span>
</a>
<a className="flex flex-col items-center gap-1 text-on-surface-variant hover:text-primary w-16 group" href="#">
<span className="material-symbols-outlined text-[24px] group-hover:scale-110 transition-transform" data-icon="person">person</span>
<span className="font-caption text-[10px]">Profile</span>
</a>
</nav>


    </>
  );
}
