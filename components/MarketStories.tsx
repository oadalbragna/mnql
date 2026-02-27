
import React, { useState } from 'react';
import { MOCK_STORIES } from '../constants';
import { Plus, Sparkles } from 'lucide-react';
import StoryViewer from './StoryViewer';

const MarketStories: React.FC = () => {
    const [selectedStoryIndex, setSelectedStoryIndex] = useState<number | null>(null);

    return (
        <div className="w-full">
            <div className="flex items-center justify-between mb-3 px-2">
                <h3 className="text-[9px] font-black text-slate-800 uppercase tracking-widest flex items-center gap-1.5">
                    <Sparkles size={12} className="text-primary" />
                    تجارب حية من السوق
                </h3>
                <div className="h-[1px] flex-1 bg-slate-100 mx-4"></div>
            </div>
            
            <div className="w-full overflow-x-auto no-scrollbar pb-1">
                <div className="flex gap-4 min-w-max px-2">
                    {/* Add Story Button - Compact & Bold */}
                    <div className="flex flex-col items-center gap-1.5 cursor-pointer group">
                        <div className="w-14 h-14 rounded-[20px] bg-white border-[3px] border-dashed border-slate-300 flex items-center justify-center text-slate-500 hover:border-primary hover:text-primary transition-all shadow-sm active:scale-90">
                            <Plus size={24} strokeWidth={3} className="group-hover:scale-110 transition-transform" />
                        </div>
                        <span className="text-[8px] font-black text-slate-900 leading-none">شاركنا</span>
                    </div>

                    {/* Seller Stories - Small Thumbnails with Thick Borders */}
                    {MOCK_STORIES.map((story, index) => (
                        <div 
                            key={story.id} 
                            onClick={() => setSelectedStoryIndex(index)}
                            className="flex flex-col items-center gap-1.5 cursor-pointer group"
                        >
                            <div className="relative p-[2px] rounded-[22px] border-[3px] border-primary/80 shadow-md transition-all active:scale-90 group-hover:rotate-3">
                                <div className="w-14 h-14 rounded-[18px] overflow-hidden border-2 border-white bg-slate-100">
                                    <img 
                                        src={story.imageUrl} 
                                        alt={story.sellerName} 
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                                    />
                                </div>
                                {story.hasOffer && (
                                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 border-2 border-white rounded-full"></div>
                                )}
                            </div>
                            <span className="text-[8px] font-black text-slate-900 truncate max-w-[60px] leading-none text-center">
                                {(story.sellerName || '').split(' ')[0]}
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            {selectedStoryIndex !== null && (
                <StoryViewer 
                    stories={MOCK_STORIES} 
                    initialIndex={selectedStoryIndex} 
                    onClose={() => setSelectedStoryIndex(null)} 
                />
            )}
        </div>
    );
};

export default MarketStories;
