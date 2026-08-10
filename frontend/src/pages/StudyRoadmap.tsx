import React, { useEffect, useState } from 'react';
import { apiClient } from '../lib/axios';
import { Layout } from '../components/layout/Layout';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Checkbox } from '../components/ui/checkbox';
import { Skeleton } from '../components/ui/skeleton';
import { TemperBar } from '../components/ui/temper-gauge';
import { CalendarDays, RotateCw } from 'lucide-react';

export function StudyRoadmap() {
  const [roadmap, setRoadmap] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRoadmap = async () => {
      try {
        const res = await apiClient.get('/roadmap');
        setRoadmap(res.data);
      } catch (err) {
        console.error('Failed to load roadmap', err);
      } finally {
        setLoading(false);
      }
    };
    fetchRoadmap();
  }, []);

  return (
    <Layout>
      <div className="mx-auto max-w-5xl">
        <div className="mb-6 flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
          <div>
            <h2 className="font-display text-3xl font-medium tracking-tight text-foreground text-balance">
              {roadmap?.target_role || 'Personalized Learning Roadmap'}
            </h2>
            <p className="mt-2 flex items-center gap-2 text-secondary">
              <CalendarDays className="h-4 w-4 text-secondary" />
              {roadmap?.steps?.length || 0} steps remaining
            </p>
          </div>
          <Button className="gap-2">
            <RotateCw className="h-4 w-4" />
            Regenerate roadmap
          </Button>
        </div>

        <Card className="mb-8 p-6">
          <div className="mb-4 flex items-center justify-between">
            <span className="font-mono text-xs uppercase tracking-wider text-secondary">
              Overall progress
            </span>
            <span className="font-mono text-sm font-semibold text-ember">4 / 7 days complete</span>
          </div>
          <TemperBar value={57} showValue={false} />
        </Card>

        <div className="relative grid grid-cols-1 gap-6">
          <div className="absolute bottom-0 left-4 top-0 hidden w-px bg-border md:block" />

          {loading ? (
            <>
              <Skeleton className="h-32 w-full rounded-xl" />
              <Skeleton className="h-32 w-full rounded-xl" />
            </>
          ) : (
            roadmap?.steps?.map((step: any, idx: number) => (
              <div key={idx} className="group flex flex-col gap-4 md:flex-row">
                <div className="z-10 hidden shrink-0 flex-col items-center md:flex md:w-16">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full border-4 border-background bg-ember-gradient text-sm font-bold text-ember-foreground shadow-md">
                    {step.step_number}
                  </div>
                </div>
                <Card className="flex-1 border-2 p-6 transition-colors hover:border-ember/40 hover:shadow-[0_12px_28px_-18px_hsl(var(--ember)/0.4)]">
                  <div className="mb-4 flex items-start justify-between">
                    <div>
                      <h3 className="font-display text-lg font-semibold text-foreground">{step.topic_name}</h3>
                      <Badge variant="ember" className="mt-2 rounded-full font-sans">
                        {step.estimated_hours} hours
                      </Badge>
                    </div>
                    <Checkbox />
                  </div>
                  <p className="text-secondary">{step.reason}</p>
                </Card>
              </div>
            ))
          )}
        </div>
      </div>
    </Layout>
  );
}
