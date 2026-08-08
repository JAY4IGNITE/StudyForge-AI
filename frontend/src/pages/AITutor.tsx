import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export function AITutor() {
  const [inputText, setInputText] = useState('');
  const [messages, setMessages] = useState([
    { role: 'tutor', content: 'Welcome back to Calculus! We were looking at Integration by Parts. To refresh, the formula is:\n\n∫ u dv = uv - ∫ v du\n\nAre you ready to try a practice problem with x * cos(x), or would you like me to explain the "LIATE" rule first?' },
    { role: 'user', content: 'Can you break down how to solve ∫ x * cos(x) dx step-by-step? I always get confused picking \'u\' and \'dv\'. Explain it simply.' },
    { role: 'tutor', content: 'Absolutely! Think of Integration by Parts as a tactical trade. We want to trade a hard integral for an easier one.\n\nStep 1: The LIATE Rule\nTo pick u, we use LIATE to find what comes first in this list:\n- Logarithmic\n- Inverse Trig\n- Algebraic\n- Trigonometric\n- Exponential' }
  ]);
  const [isTyping, setIsTyping] = useState(false);

  const handleSend = () => {
    if (!inputText.trim()) return;
    setMessages(prev => [...prev, { role: 'user', content: inputText }]);
    setInputText('');
    setIsTyping(true);
    
    setTimeout(() => {
      setMessages(prev => [...prev, { role: 'tutor', content: 'That is an interesting point! This is a mock response from StudyForge Tutor to keep your studies moving forward.' }]);
      setIsTyping(false);
    }, 1500);
  };
  return (
    <>
      
 SideNavBar (Shared Component Blueprint) 
<nav className="fixed left-0 top-0 h-full flex flex-col py-stack-md bg-surface shadow-sm w-64 border-r border-outline-variant z-50 transition-all duration-300 bg-gradient-to-b from-surface to-surface-container-low">

<div className="px-6 mb-8 flex flex-col gap-4">
<div className="flex items-center gap-3">
<img alt="User profile avatar" className="w-10 h-10 rounded-xl object-cover shadow-sm bg-surface-container" data-alt="A modern, highly detailed minimalist 3D rendering of an abstract glowing forge anvil in vibrant indigo and cyan colors on a clean white background. Soft studio lighting, highly polished surfaces, premium tech aesthetic." src="https://lh3.googleusercontent.com/aida-public/AB6AXuB9zKvaOvF0cmgQ0HJ_ljd8xb5Lib_Neq6RDwOSPtuZmWGZNuaktnNvDG0knFXybTsE2LWFoRlHoqteUL7B1JhaXW6JqwCmiQkvwVVYiQ13BR4OAOdmUKv2AVPeBcDOHWKOacIZQjdJLfYqdAYeum4acbvY_qcECQt1e5zQ0WPqZBokG60eFKa9Vqrhpb4Zni5bI4-4SSd0W4tv60d5UstuaFX7garjYkrTguDjWj_51SHHamBVwei1pA"/>
<div>
<h1 className="font-headline-md text-headline-md font-bold text-primary">StudyForge AI</h1>
<p className="font-caption text-caption text-on-surface-variant">Level 12 Focus Master</p>
</div>
</div>
</div>

<div className="flex flex-col flex-1 px-4 gap-2 overflow-y-auto scrollbar-hide">
<Link to="/dashboard" className="flex items-center gap-3 px-4 py-3 rounded-lg text-on-surface-variant hover:text-primary hover:bg-surface-container-high transition-colors duration-200 active:scale-95 transition-transform group">
<span className="material-symbols-outlined text-[20px] group-hover:scale-110 transition-transform">home</span>
<span className="font-label-md text-label-md">Home</span>
</Link>

<Link to="/ai-tutor" className="flex items-center gap-3 px-4 py-3 rounded-lg text-primary font-bold border-r-4 border-primary bg-primary-container/10 active:scale-95 transition-transform relative bg-gradient-to-r from-primary-container/20 to-transparent">
<span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: '"FILL" 1' }}>chat</span>
<span className="font-label-md text-label-md">Chat</span>
</Link>

<Link to="/flashcards" className="flex items-center gap-3 px-4 py-3 rounded-lg text-on-surface-variant hover:text-primary hover:bg-surface-container-high transition-colors duration-200 active:scale-95 transition-transform group">
<span className="material-symbols-outlined text-[20px] group-hover:scale-110 transition-transform">style</span>
<span className="font-label-md text-label-md">Flashcards</span>
</Link>

<Link to="/practice" className="flex items-center gap-3 px-4 py-3 rounded-lg text-on-surface-variant hover:text-primary hover:bg-surface-container-high transition-colors duration-200 active:scale-95 transition-transform group">
<span className="material-symbols-outlined text-[20px] group-hover:scale-110 transition-transform">quiz</span>
<span className="font-label-md text-label-md">Quiz</span>
</Link>

<Link to="/roadmap" className="flex items-center gap-3 px-4 py-3 rounded-lg text-on-surface-variant hover:text-primary hover:bg-surface-container-high transition-colors duration-200 active:scale-95 transition-transform group">
<span className="material-symbols-outlined text-[20px] group-hover:scale-110 transition-transform">map</span>
<span className="font-label-md text-label-md">Roadmap</span>
</Link>

<Link to="/profile" className="flex items-center gap-3 px-4 py-3 rounded-lg text-on-surface-variant hover:text-primary hover:bg-surface-container-high transition-colors duration-200 active:scale-95 transition-transform group mt-auto">
<span className="material-symbols-outlined text-[20px] group-hover:scale-110 transition-transform">person</span>
<span className="font-label-md text-label-md">Profile</span>
</Link>
</div>

<div className="px-4 mt-6">
<button className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-surface-container text-primary font-label-md text-label-md hover:bg-primary hover:text-on-primary transition-colors duration-200 border-b-2 border-primary/20 hover:border-primary/40 active:border-b-0 active:translate-y-[2px]">
<span className="material-symbols-outlined text-[18px]">workspace_premium</span>
                Upgrade to Pro
            </button>
</div>
</nav>
 Main Application Canvas 
<main className="flex-1 flex flex-col ml-64 h-screen bg-background relative overflow-hidden">

<header className="flex justify-between items-center w-full px-margin-desktop h-16 docked full-width top-0 z-40 bg-surface/80 backdrop-blur-md border-b border-outline-variant">

<div className="flex items-center gap-4">

</div>

<div className="flex items-center gap-4">

<div className="relative hidden md:flex items-center">
<span className="material-symbols-outlined absolute left-3 text-outline text-[20px]">search</span>
<input className="pl-10 pr-4 py-2 w-64 rounded-full bg-surface-container-low border border-outline-variant text-on-surface placeholder:text-outline focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all font-body-md text-body-md" placeholder="Search resources..." type="text"/>
</div>

<button className="p-2 rounded-full text-on-surface-variant hover:text-primary hover:bg-surface-container transition-all active:opacity-80 relative group">
<span className="material-symbols-outlined">local_fire_department</span>

<span className="absolute top-0 right-0 w-4 h-4 bg-secondary-container text-on-secondary-container rounded-full flex items-center justify-center font-caption text-[10px] font-bold shadow-sm">3</span>
</button>
<button className="p-2 rounded-full text-on-surface-variant hover:text-primary hover:bg-surface-container transition-all active:opacity-80">
<span className="material-symbols-outlined">stars</span>
</button>
<button className="p-2 rounded-full text-on-surface-variant hover:text-primary hover:bg-surface-container transition-all active:opacity-80 relative">
<span className="material-symbols-outlined">notifications</span>
<span className="absolute top-1 right-1 w-2 h-2 bg-error rounded-full"></span>
</button>
</div>
</header>

<div className="flex flex-1 overflow-hidden">

<aside className="w-64 border-r border-outline-variant bg-surface-bright flex flex-col hidden lg:flex flex-shrink-0 z-10">
<div className="p-4 border-b border-outline-variant/50 flex justify-between items-center">
<h2 className="font-label-md text-label-md text-on-surface">Conversations</h2>
<button className="w-8 h-8 flex items-center justify-center rounded-md text-primary hover:bg-primary-container/10 transition-colors">
<span className="material-symbols-outlined text-[20px]">edit_square</span>
</button>
</div>
<div className="flex-1 overflow-y-auto p-3 space-y-6">

<div>
<h3 className="font-caption text-caption text-outline uppercase tracking-wider mb-2 px-2">Calculus 101</h3>
<div className="space-y-1">
<button className="w-full text-left px-3 py-2 rounded-lg bg-surface-container text-primary font-body-md text-body-md text-sm truncate border border-primary/20 shadow-sm transition-all">
                                Integration by Parts rules
                            </button>
<button className="w-full text-left px-3 py-2 rounded-lg text-on-surface-variant hover:bg-surface-container-low font-body-md text-body-md text-sm truncate transition-colors">
                                Limits approaching infinity
                            </button>
</div>
</div>

<div>
<h3 className="font-caption text-caption text-outline uppercase tracking-wider mb-2 px-2">Ancient Rome</h3>
<div className="space-y-1">
<button className="w-full text-left px-3 py-2 rounded-lg text-on-surface-variant hover:bg-surface-container-low font-body-md text-body-md text-sm truncate transition-colors">
                                Fall of the Republic causes
                            </button>
<button className="w-full text-left px-3 py-2 rounded-lg text-on-surface-variant hover:bg-surface-container-low font-body-md text-body-md text-sm truncate transition-colors">
                                Punic Wars timeline summary
                            </button>
</div>
</div>
</div>
</aside>

<section className="flex-1 flex flex-col relative bg-background">

<div className="px-6 py-3 border-b border-outline-variant/30 flex justify-between items-center bg-surface/50 backdrop-blur-sm sticky top-0 z-20">

<div className="flex items-center gap-2 overflow-x-auto scrollbar-hide py-1">
<span className="font-caption text-caption text-outline mr-2">Persona:</span>
<button className="px-3 py-1.5 rounded-full bg-surface-container border border-outline-variant text-on-surface font-caption text-caption whitespace-nowrap hover:border-primary transition-colors flex items-center gap-1 bg-gradient-to-t from-surface-container to-surface-bright">
<span className="material-symbols-outlined text-[14px]">psychology</span>
                            Standard Tutor
                        </button>
<button className="px-3 py-1.5 rounded-full bg-primary-container/20 border border-primary text-primary font-caption text-caption whitespace-nowrap font-medium flex items-center gap-1 bg-gradient-to-t from-surface-container to-surface-bright">
<span className="material-symbols-outlined text-[14px]">child_care</span>
                            Explain like I'm 16
                        </button>
<button className="px-3 py-1.5 rounded-full bg-surface-container border border-outline-variant text-on-surface font-caption text-caption whitespace-nowrap hover:border-primary transition-colors flex items-center gap-1 bg-gradient-to-t from-surface-container to-surface-bright">
<span className="material-symbols-outlined text-[14px]">gavel</span>
                            Strict Assessor
                        </button>
</div>

<div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-tertiary-fixed/30 text-on-tertiary-fixed-variant font-caption text-[11px] font-semibold tracking-wide border border-tertiary-fixed/50 flex-shrink-0">
<div className="w-1.5 h-1.5 rounded-full bg-tertiary-fixed-dim animate-pulse"></div>
                        GPT-4o Active
                    </div>
</div>

<div className="flex-1 overflow-y-auto p-6 md:p-8 flex flex-col gap-8 w-full max-w-4xl mx-auto scroll-smooth">

<div className="flex justify-center">
<span className="px-3 py-1 rounded-full bg-surface-container-low text-outline font-caption text-[11px]">Today, 10:42 AM</span>
</div>

{messages.map((msg, idx) => (
  msg.role === 'tutor' ? (
<div key={idx} className="flex gap-4 items-start w-full">
<div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0 mt-1 shadow-sm">
<span className="material-symbols-outlined text-on-primary text-[18px]" style={{ fontVariationSettings: '"FILL" 1' }}>smart_toy</span>
</div>
<div className="flex flex-col gap-2 max-w-[85%]">
<span className="font-label-md text-label-md text-on-surface-variant ml-1">StudyForge Tutor</span>
<div className="bg-surface border border-outline-variant/50 rounded-2xl rounded-tl-sm p-4 text-on-surface font-body-md text-body-md leading-relaxed shadow-[0_4px_12px_rgba(0,0,0,0.03)] bg-gradient-to-b from-surface to-surface-container-lowest whitespace-pre-wrap">
{msg.content}
</div>
</div>
</div>
  ) : (
<div key={idx} className="flex gap-4 items-start justify-end w-full">
<div className="flex flex-col gap-2 max-w-[85%] items-end">
<span className="font-label-md text-label-md text-on-surface-variant mr-1">You</span>
<div className="bg-primary text-on-primary rounded-2xl rounded-tr-sm p-4 font-body-md text-body-md leading-relaxed shadow-[0_4px_12px_rgba(53,37,205,0.15)] bg-gradient-to-br from-primary to-on-primary-fixed-variant whitespace-pre-wrap">
{msg.content}
</div>
</div>
<div className="w-8 h-8 rounded-full bg-secondary text-on-secondary flex items-center justify-center flex-shrink-0 mt-1 shadow-sm font-bold">U</div>
</div>
  )
))}

{isTyping && (
<div className="flex gap-4 items-start w-full">
<div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0 mt-1 shadow-sm relative">
<span className="material-symbols-outlined text-on-primary text-[18px]" style={{ fontVariationSettings: '"FILL" 1' }}>smart_toy</span>
<div className="absolute inset-0 border-2 border-primary border-t-tertiary-fixed rounded-full animate-spin"></div>
</div>
<div className="flex flex-col gap-2 max-w-[85%] w-full">
<div className="flex items-center gap-2 ml-1">
<span className="font-label-md text-label-md text-on-surface-variant">StudyForge Tutor</span>
<span className="font-caption text-caption text-outline flex items-center gap-1">
<span className="w-1.5 h-1.5 bg-tertiary-fixed rounded-full inline-block"></span> Generating
                                </span>
</div>
<div className="bg-surface border border-outline-variant/50 rounded-2xl rounded-tl-sm p-4 text-on-surface font-body-md text-body-md leading-relaxed shadow-[0_4px_12px_rgba(0,0,0,0.03)] w-max bg-gradient-to-b from-surface to-surface-container-lowest">
<div className="flex items-center gap-1 h-6 px-1">
<div className="w-1.5 h-1.5 bg-primary/60 rounded-full animate-bounce"></div>
<div className="w-1.5 h-1.5 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
<div className="w-1.5 h-1.5 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
</div>
</div>
</div>
</div>
)}

<div className="h-4 w-full"></div>
</div>

<div className="p-4 md:px-8 md:py-6 bg-surface-bright border-t border-outline-variant/30 z-20">
<div className="max-w-4xl mx-auto relative group">

<div className="flex items-end gap-2 bg-surface-container-lowest border border-outline rounded-xl p-2 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 shadow-[0_2px_8px_rgba(0,0,0,0.04)] transition-all duration-200">

<button className="p-2.5 rounded-lg text-outline hover:text-primary hover:bg-surface-container transition-colors flex-shrink-0">
<span className="material-symbols-outlined">attach_file</span>
</button>

<textarea value={inputText} onChange={(e) => setInputText(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }} className="flex-1 bg-transparent resize-none h-12 max-h-32 py-3 px-2 outline-none font-body-md text-body-md text-on-surface placeholder:text-outline-variant scrollbar-hide" placeholder="Message StudyForge Tutor (Type '/' for commands)..." style={{ minHeight: '48px' }}></textarea>

<button onClick={handleSend} className="p-2.5 rounded-lg bg-primary text-on-primary hover:bg-surface-tint shadow-sm transition-colors border-b-2 border-on-primary-fixed-variant active:border-b-0 active:translate-y-[2px] flex-shrink-0 flex items-center justify-center">
<span className="material-symbols-outlined" style={{ fontVariationSettings: '"FILL" 1' }}>send</span>
</button>
</div>

<div className="text-center mt-2">
<span className="font-caption text-caption text-outline">AI can make mistakes. Consider verifying important information.</span>
</div>
</div>
</div>
</section>
</div>
</main>

    </>
  );
}
