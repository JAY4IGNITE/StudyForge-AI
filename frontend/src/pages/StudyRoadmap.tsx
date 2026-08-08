import React, { useEffect, useState } from 'react';
import { apiClient } from '../lib/axios';
import { useAuth } from '../app/AuthProvider';
import { Link } from 'react-router-dom';
import { Layout } from '../components/layout/Layout';

export function StudyRoadmap() {
  const { user } = useAuth();
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
      <div className="max-w-container-max mx-auto">

<div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-stack-md gap-4">
<div>
<h2 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-surface mb-2">{roadmap?.target_role || 'Personalized Learning Roadmap'}</h2>
<p className="font-body-md text-body-md text-on-surface-variant flex items-center gap-2">
<span className="material-symbols-outlined text-outline" style={{ fontSize: '18px' }}>calendar_month</span>
                            {roadmap?.steps?.length || 0} Steps remaining
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

{loading ? (
<div className="col-span-1 md:col-span-12 p-8 text-center text-on-surface-variant">
  Loading your personalized path...
</div>
) : (
  roadmap?.steps?.map((step: any, idx: number) => (
    <div key={idx} className="col-span-1 md:col-span-12 flex flex-col md:flex-row gap-6 group mt-4">
    <div className="md:w-16 flex flex-col items-center z-10 shrink-0 hidden md:flex">
    <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold font-label-md border-4 border-surface shadow-md">
                                    {step.step_number}
                                </div>
    </div>
    <div className="flex-1 bg-surface-container-lowest border-2 border-outline-variant rounded-xl p-stack-md hover:border-primary transition-colors hover:shadow-[0_8px_24px_rgba(79,70,229,0.1)]">
    <div className="flex justify-between items-start mb-4">
    <div>
    <div className="flex items-center gap-2 mb-1">
    <h3 className="font-headline-md text-headline-md text-on-surface font-bold">{step.topic_name}</h3>
    </div>
    <span className="inline-block px-3 py-1 bg-primary/10 text-primary rounded-full font-caption text-caption mt-2 font-medium">{step.estimated_hours} hours</span>
    </div>
    <div className="w-6 h-6 rounded border-2 border-outline hover:border-primary cursor-pointer transition-colors"></div>
    </div>
    <p className="font-body-md text-body-md text-on-surface-variant mb-4">{step.reason}</p>
    </div>
    </div>
  ))
)}
</div>
      </div>
    </Layout>
  );
}
