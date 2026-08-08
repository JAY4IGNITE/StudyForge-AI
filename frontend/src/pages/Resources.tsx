import React, { useEffect, useState } from 'react';
import { apiClient } from '../lib/axios';
import { useAuth } from '../app/AuthProvider';
import { Link } from 'react-router-dom';
import { Layout } from '../components/layout/Layout';

export function Resources() {
  const { user } = useAuth();
  const [resources, setResources] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResources = async () => {
      try {
        const res = await apiClient.get('/resources');
        setResources(res.data);
      } catch (err) {
        console.error('Failed to fetch resources', err);
      } finally {
        setLoading(false);
      }
    };
    fetchResources();
  }, []);
  return (
    <Layout>
      <div className="max-w-container-max mx-auto w-full flex flex-col gap-stack-lg">

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
<span className="font-caption text-caption text-on-surface-variant">{resources?.length || 0} files</span>
</div>

<div className="flex flex-col gap-4" id="document-list">

{loading ? (
  <div className="p-8 text-center text-on-surface-variant">Loading documents...</div>
) : resources?.length > 0 ? (
  resources.map((r, idx) => (
<div key={idx} className="bg-surface-container-lowest border border-outline-variant rounded-xl p-stack-md flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-[0_4px_12px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)] hover:-translate-y-[2px] transition-all duration-300 bg-gradient-to-r from-surface-container-lowest to-surface-container-low/30">
<div className="flex items-start gap-4">
<div className="w-10 h-10 rounded bg-error-container text-on-error-container flex items-center justify-center shrink-0">
<span className="material-symbols-outlined" data-icon="picture_as_pdf">picture_as_pdf</span>
</div>
<div>
<h3 className="font-label-md text-label-md text-on-surface font-semibold mb-1">{r.title}</h3>
<div className="flex items-center gap-2 font-caption text-caption text-on-surface-variant">
<span className="">{r.description || 'Uploaded'}</span>
<span className="">•</span>
<span className="px-2 py-0.5 rounded-full bg-surface-container text-on-surface-variant text-[10px] uppercase">{r.difficulty || 'Processed'}</span>
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
<a href={r.url} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-primary text-on-primary hover:bg-surface-tint font-label-md text-[13px] action-btn border-b-2 border-[#1e11a6]">
<span className="material-symbols-outlined text-[16px]" data-icon="forum">forum</span>
                                View Resource
                            </a>
</div>
</div>
  ))
) : (
<div className="flex-col items-center justify-center py-12 px-4 text-center border-2 border-dashed border-outline-variant rounded-xl bg-surface-container-lowest/50" id="empty-state">
<div className="w-16 h-16 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant mb-4 mx-auto">
<span className="material-symbols-outlined text-[32px]" data-icon="folder_off">folder_off</span>
</div>
<h3 className="font-headline-md text-headline-md text-on-surface mb-2">No documents yet</h3>
<p className="font-body-md text-body-md text-on-surface-variant max-w-md mx-auto">No documents uploaded yet. Upload a PDF to start generating study materials and learning faster.</p>
</div>
)}
</div>
</section>
</div>
    </Layout>
  );
}
