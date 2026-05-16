'use client';

import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Plus, CheckCircle, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useBrickBoxStore, type OwnedSet } from '@/lib/store/brickbox';

interface SearchResult {
  setNum: string;
  name: string;
  year: number;
  numParts: number;
  imageUrl: string;
  theme?: string;
}

const DEMO_RESULTS: SearchResult[] = [
  {
    setNum: '10497-1',
    name: 'Galaxy Explorer',
    year: 2022,
    numParts: 1254,
    imageUrl: '',
    theme: 'Classic',
  },
  {
    setNum: '60316-1',
    name: 'City Police Station',
    year: 2022,
    numParts: 668,
    imageUrl: '',
    theme: 'City',
  },
  {
    setNum: '42108-1',
    name: 'Mobile Crane MK II',
    year: 2020,
    numParts: 1292,
    imageUrl: '',
    theme: 'Technic',
  },
  {
    setNum: '75341-1',
    name: "The Mandalorian's N-1 Starfighter",
    year: 2022,
    numParts: 1023,
    imageUrl: '',
    theme: 'Star Wars',
  },
  {
    setNum: '21052-1',
    name: 'Dubai Architecture',
    year: 2020,
    numParts: 740,
    imageUrl: '',
    theme: 'Architecture',
  },
];

export default function SetSearch() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [addingSet, setAddingSet] = useState<string | null>(null);
  const { addSet, ownedSets } = useBrickBoxStore();

  const isOwned = (setNum: string) => ownedSets.some((s) => s.setNum === setNum);

  const handleSearch = useCallback(async () => {
    if (!query.trim()) return;

    setIsSearching(true);
    try {
      const response = await fetch(`/api/lego/sets?q=${encodeURIComponent(query)}`);
      if (!response.ok) throw new Error('Search failed');
      const data = await response.json();
      setResults(data.sets || []);
    } catch {
      // Fallback to demo data
      const filtered = DEMO_RESULTS.filter((s) =>
        s.name.toLowerCase().includes(query.toLowerCase()) ||
        s.setNum.includes(query)
      );
      setResults(filtered);
    } finally {
      setIsSearching(false);
    }
  }, [query]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSearch();
  };

  const handleAddSet = async (result: SearchResult) => {
    setAddingSet(result.setNum);

    const newSet: OwnedSet = {
      setNum: result.setNum,
      name: result.name,
      year: result.year,
      theme: result.theme || 'Other',
      numParts: result.numParts,
      imageUrl: result.imageUrl,
      addedAt: new Date().toISOString(),
    };

    // Simulate a delay for "loading bricks"
    await new Promise((r) => setTimeout(r, 800));
    addSet(newSet);
    setAddingSet(null);
  };

  const THEME_EMOJIS: Record<string, string> = {
    Classic: '🧱',
    City: '🏙️',
    Technic: '⚙️',
    'Star Wars': '🚀',
    Architecture: '🏛️',
    Other: '📦',
  };

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search LEGO sets (e.g. 'space', 'city', set number...)"
            className="pl-12 h-12 rounded-2xl text-base"
          />
        </div>
        <Button
          onClick={handleSearch}
          disabled={isSearching || !query.trim()}
          size="lg"
          className="px-6"
        >
          {isSearching ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <>
              <Search className="w-5 h-5" />
              Search
            </>
          )}
        </Button>
      </div>

      {/* Results */}
      <AnimatePresence>
        {results.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-white rounded-3xl border-2 border-gray-100 shadow-lg overflow-hidden"
          >
            <div className="p-4 border-b border-gray-100">
              <p className="font-body text-sm text-gray-500 font-semibold">
                Found {results.length} sets
              </p>
            </div>
            <div className="divide-y divide-gray-50">
              {results.map((result, index) => {
                const owned = isOwned(result.setNum);
                const adding = addingSet === result.setNum;

                return (
                  <motion.div
                    key={result.setNum}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors"
                  >
                    {/* Set thumbnail */}
                    <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0"
                      style={{ background: '#FFF8E7' }}>
                      {THEME_EMOJIS[result.theme || 'Other'] || '🧱'}
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="font-heading text-lego-dark text-base leading-tight">{result.name}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs font-body text-gray-400">{result.setNum}</span>
                        <span className="text-xs text-gray-300">·</span>
                        <span className="text-xs font-body text-gray-400">{result.year}</span>
                        <span className="text-xs text-gray-300">·</span>
                        <span className="text-xs font-body font-bold text-lego-blue">{result.numParts} pieces</span>
                      </div>
                      {result.theme && (
                        <span className="inline-block mt-1 text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-500 font-body font-semibold">
                          {result.theme}
                        </span>
                      )}
                    </div>

                    {owned ? (
                      <div className="flex items-center gap-1.5 text-lego-green font-bold text-sm font-body flex-shrink-0">
                        <CheckCircle className="w-5 h-5" />
                        Owned!
                      </div>
                    ) : (
                      <Button
                        onClick={() => handleAddSet(result)}
                        disabled={adding}
                        size="sm"
                        variant="secondary"
                        className="flex-shrink-0"
                      >
                        {adding ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <>
                            <Plus className="w-4 h-4" />
                            Add Set
                          </>
                        )}
                      </Button>
                    )}
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {results.length === 0 && !isSearching && query && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-8 text-gray-400"
        >
          <p className="text-4xl mb-2">🔍</p>
          <p className="font-body">No sets found. Try a different search!</p>
        </motion.div>
      )}
    </div>
  );
}
