import React, { useEffect, useState } from 'react';
import { apiClient } from '../lib/axios';
import { Layout } from '../components/layout/Layout';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Skeleton } from '../components/ui/skeleton';
import { UploadCloud, FileText, ScrollText, Brain, MessageSquare, FolderX } from 'lucide-react';

export function Resources() {
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
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8">
        <div>
          <h1 className="font-display text-3xl font-medium tracking-tight text-foreground text-balance">
            Notes &amp; Documents
          </h1>
          <p className="mt-1 text-secondary">
            Upload your study materials to instantly generate quizzes, summaries, and chat with your content.
          </p>
        </div>

        {/* Upload zone */}
        <label
          htmlFor="file-input"
          className="bg-forge-glow group flex h-48 w-full cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-border transition-colors hover:border-ember/40"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary text-ember transition-transform group-hover:scale-110">
            <UploadCloud className="h-6 w-6" />
          </div>
          <div className="text-center">
            <p className="mb-1 font-medium text-foreground">Drag and drop your files here</p>
            <p className="text-sm text-secondary">or click to browse PDFs, Docs, or Images (Max 50MB)</p>
          </div>
          <input accept=".pdf,.doc,.docx,.txt" className="hidden" id="file-input" multiple type="file" />
        </label>

        {/* Document list */}
        <section className="flex flex-1 flex-col gap-4">
          <div className="mb-2 flex items-end justify-between border-b border-border pb-2">
            <h2 className="font-display text-xl font-medium text-foreground">Recent Documents</h2>
            <span className="font-mono text-xs text-secondary">{resources?.length || 0} files</span>
          </div>

          <div className="flex flex-col gap-4">
            {loading ? (
              <>
                <Skeleton className="h-24 w-full rounded-xl" />
                <Skeleton className="h-24 w-full rounded-xl" />
              </>
            ) : resources?.length > 0 ? (
              resources.map((r, idx) => (
                <Card
                  key={idx}
                  className="flex flex-col justify-between gap-4 p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-ember/30 hover:shadow-[0_12px_28px_-16px_hsl(var(--ember)/0.3)] md:flex-row md:items-center"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded bg-destructive/10 text-destructive">
                      <FileText className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="mb-1 font-medium text-foreground">{r.title}</h3>
                      <div className="flex items-center gap-2 text-xs text-secondary">
                        <span>{r.description || 'Uploaded'}</span>
                        <span>•</span>
                        <Badge variant="secondary" className="rounded-full font-sans text-[10px] uppercase">
                          {r.difficulty || 'Processed'}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Button variant="outline" size="sm" className="gap-1.5 border-ember/20 text-ember hover:bg-ember/10 hover:text-ember">
                      <ScrollText className="h-3.5 w-3.5" />
                      Summarize
                    </Button>
                    <Button variant="outline" size="sm" className="gap-1.5 border-ember/20 text-ember hover:bg-ember/10 hover:text-ember">
                      <Brain className="h-3.5 w-3.5" />
                      Quiz me
                    </Button>
                    <Button asChild size="sm" className="gap-1.5">
                      <a href={r.url} target="_blank" rel="noreferrer">
                        <MessageSquare className="h-3.5 w-3.5" />
                        View resource
                      </a>
                    </Button>
                  </div>
                </Card>
              ))
            ) : (
              <Card className="flex flex-col items-center justify-center border-2 border-dashed border-border bg-secondary/10 px-4 py-12 text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-secondary text-secondary">
                  <FolderX className="h-8 w-8" />
                </div>
                <h3 className="mb-2 font-display text-xl font-medium text-foreground">No documents yet</h3>
                <p className="mx-auto max-w-md text-secondary">
                  No documents uploaded yet. Upload a PDF to start generating study materials and learning faster.
                </p>
              </Card>
            )}
          </div>
        </section>
      </div>
    </Layout>
  );
}
