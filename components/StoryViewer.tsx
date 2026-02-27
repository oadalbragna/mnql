
import React, { useState, useEffect } from 'react';
import { X, ChevronRight, ChevronLeft, MessageCircle, ShoppingBag, User } from 'lucide-react';
import { MarketStory } from '../types';

interface StoryViewerProps {
    stories: MarketStory[];
    initialIndex: number;
    onClose: () => void;
}

const StoryViewer: React.FC<StoryViewerProps> = ({ stories, initialIndex, onClose }) => {
    const [currentIndex, setCurrentIndex] = useState(initialIndex);
    const [progress, setProgress] = useState(0);

    const story = stories[currentIndex];

    useEffect(() => {
        setProgress(0);
        const timer = setInterval(() => {
            setProgress((old) => {
                if (old >= 100) {
                    handleNext();
                    return 0;
                }
                return old + 1;
            });
        }, 50);
        return () => clearInterval(timer);
    }, [currentIndex]);

    const handleNext = () => {
        if (currentIndex < stories.length - 1) {
            setCurrentIndex(prev => prev + 1);
        } else {
            onClose();
        }
    };

    const handlePrev = () => {
        if (currentIndex > 0) {
            setCurrentIndex(prev => prev - 1);
        }
    };

    return (
        <div className="fixed inset-0 z-[200] bg-black flex items-center justify-center animate-fade-in">
            <div className="relative w-full max-w-lg h-full md:h-[90vh] md:rounded-[40px] overflow-hidden bg-gray-900 shadow-2xl">
                {/* Progress Bars */}
                <div className="absolute top-4 left-4 right-4 z-30 flex gap-1.5">
                    {stories.map((_, i) => (
                        <div key={i} className="h-1 flex-1 bg-white/20 rounded-full overflow-hidden">
                            <div 
                                className="h-full bg-white transition-all duration-100 ease-linear" 
                                style={{ width: i === currentIndex ? `${progress}%` : i < currentIndex ? '100%' : '0%' }}
                            />
                        </div>
                    ))}
                </div>

                {/* Header */}
                <div className="absolute top-8 left-4 right-4 z-30 flex justify-between items-center text-white">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30 overflow-hidden">
                            <img src={story.imageUrl} alt="" className="w-full h-full object-cover" />
                        </div>
                        <div>
                            <h4 className="text-sm font-black">{story.sellerName}</h4>
                            <p className="text-[10px] font-bold opacity-70">إعلان من {story.category}</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-all">
                        <X size={24} />
                    </button>
                </div>

                {/* Story Image */}
                <img 
                    src={story.imageUrl} 
                    alt="" 
                    className="w-full h-full object-cover"
                />

                {/* Navigation Controls */}
                <div className="absolute inset-0 z-20 flex">
                    <div className="flex-1 h-full cursor-pointer" onClick={handlePrev} />
                    <div className="flex-1 h-full cursor-pointer" onClick={handleNext} />
                </div>

                {/* Footer Actions */}
                <div className="absolute bottom-10 left-6 right-6 z-30 flex gap-3">
                    <button className="flex-1 bg-white text-gray-900 py-4 rounded-2xl font-black text-sm flex items-center justify-center gap-2 shadow-xl">
                        <ShoppingBag size={18} /> اطلب الآن
                    </button>
                    <button className="w-14 h-14 bg-white/20 backdrop-blur-xl text-white rounded-2xl flex items-center justify-center border border-white/30">
                        <MessageCircle size={24} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default StoryViewer;
