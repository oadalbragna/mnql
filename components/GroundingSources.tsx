
import React from 'react';
import { ExternalLink, Globe, MapPin, Link as LinkIcon } from 'lucide-react';

interface Source {
    title: string;
    uri: string;
    type?: 'web' | 'maps';
}

interface GroundingSourcesProps {
    sources: Source[];
}

const GroundingSources: React.FC<GroundingSourcesProps> = ({ sources }) => {
    if (!sources || sources.length === 0) return null;

    return (
        <div className="mt-6 border-t border-slate-100 pt-6 animate-fade-in">
            <div className="flex items-center gap-2 mb-4">
                <LinkIcon size={12} className="text-primary" />
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">المصادر الموثقة</span>
            </div>
            <div className="flex flex-wrap gap-2">
                {sources.map((source, idx) => (
                    <a
                        key={idx}
                        href={source.uri}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 bg-white border border-slate-100 px-4 py-2 rounded-xl text-[10px] font-bold text-slate-600 hover:text-primary hover:border-primary hover:shadow-md transition-all group"
                    >
                        {source.type === 'maps' ? (
                            <MapPin size={12} className="text-emerald-500" />
                        ) : (
                            <Globe size={12} className="text-blue-500" />
                        )}
                        <span className="truncate max-w-[120px]">{source.title}</span>
                        <ExternalLink size={10} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                    </a>
                ))}
            </div>
        </div>
    );
};

export default GroundingSources;
