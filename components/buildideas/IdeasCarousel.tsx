'use client';

import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { BuildIdea } from '@/lib/store/app';
import IdeaCard from './IdeaCard';

interface IdeasCarouselProps {
  ideas: BuildIdea[];
}

export default function IdeasCarousel({ ideas }: IdeasCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (!scrollRef.current) return;
    const scrollAmount = 280;
    scrollRef.current.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    });
  };

  return (
    <div className="relative">
      {/* Navigation Buttons */}
      <button
        onClick={() => scroll('left')}
        className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 w-10 h-10 rounded-full bg-white shadow-lg border-2 border-gray-100 flex items-center justify-center text-gray-600 hover:bg-lego-yellow hover:text-lego-dark hover:border-lego-yellow transition-all"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>

      <button
        onClick={() => scroll('right')}
        className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 w-10 h-10 rounded-full bg-white shadow-lg border-2 border-gray-100 flex items-center justify-center text-gray-600 hover:bg-lego-yellow hover:text-lego-dark hover:border-lego-yellow transition-all"
      >
        <ChevronRight className="w-5 h-5" />
      </button>

      {/* Carousel Track */}
      <div
        ref={scrollRef}
        className="flex gap-5 overflow-x-auto pb-4 scroll-snap-x px-1"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {ideas.map((idea, index) => (
          <div key={idea.id} className="flex-shrink-0 w-72 scroll-snap-start">
            <IdeaCard idea={idea} index={index} />
          </div>
        ))}
      </div>
    </div>
  );
}
