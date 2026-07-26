import React, { useEffect, useState } from 'react';
import { Layout } from '../../components/layout/Layout';
import { apiClient } from '../../lib/axios';
import { Compass, ExternalLink, Search } from 'lucide-react';

export const ResourceLibrary: React.FC = () => {
  const [resources, setResources] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchResources();
  }, []);

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

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      fetchResources();
      return;
    }
    setLoading(true);
    try {
      const res = await apiClient.post(`/resources/search?query=${encodeURIComponent(searchQuery)}`);
      setResources(res.data);
    } catch (err) {
      console.error('Failed to search resources', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-100">Curated Learning Resources</h1>
          <p className="text-slate-400 mt-1">Search official documentation, tutorials, and RAG-indexed guides</p>
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="flex gap-4 max-w-2xl">
          <div className="relative flex-1">
            <Search className="w-5 h-5 absolute left-4 top-3.5 text-slate-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search topics, concepts, or keywords..."
              className="w-full pl-12 pr-4 py-3 bg-slate-900 border border-slate-800 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none text-slate-100 placeholder-slate-500"
            />
          </div>
          <button
            type="submit"
            className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl transition-all shadow-lg shadow-indigo-600/30"
          >
            Search
          </button>
        </form>

        {/* Resource Cards */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-pulse">
            <div className="h-40 bg-slate-900/60 rounded-2xl"></div>
            <div className="h-40 bg-slate-900/60 rounded-2xl"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {resources.map((r) => (
              <div key={r.id} className="p-6 bg-slate-900/80 border border-slate-800 rounded-2xl backdrop-blur-md flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold text-slate-100">{r.title}</h3>
                    {r.difficulty && (
                      <span className="text-xs px-2.5 py-1 bg-indigo-500/20 text-indigo-300 rounded-full font-medium uppercase">
                        {r.difficulty}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-slate-400 mt-2">{r.description}</p>
                </div>

                <a
                  href={r.url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 text-indigo-400 hover:text-indigo-300 font-medium text-sm"
                >
                  View Resource <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};
