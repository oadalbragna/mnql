
import React from 'react';
import { CategoryId } from '../types';
import { CATEGORIES } from '../constants';
import * as Icons from 'lucide-react';

interface CategoryNavProps {
    selectedCategory: CategoryId;
    onSelectCategory: (id: CategoryId) => void;
}

const CategoryNav: React.FC<CategoryNavProps> = ({ selectedCategory, onSelectCategory }) => {
    return (
        <div className="w-full overflow-x-auto no-scrollbar py-1">
            <div className="flex items-center gap-3 min-w-max px-1">
                {CATEGORIES.map((cat) => {
                    // @ts-ignore
                    const IconComponent = Icons[cat.icon] || Icons.Circle;
                    const isSelected = selectedCategory === cat.id;

                    return (
                        <button
                            key={cat.id}
                            onClick={() => onSelectCategory(cat.id)}
                            className={`flex items-center gap-2 px-4 py-2.5 rounded-[18px] transition-all duration-300 font-black text-[10px] md:text-xs whitespace-nowrap border-2 ${
                                isSelected
                                    ? 'bg-slate-900 border-slate-900 text-white shadow-xl scale-105'
                                    : 'bg-white border-slate-100 text-slate-500 hover:border-primary/20 hover:bg-slate-50'
                            }`}
                        >
                            <div className={`transition-all duration-300 ${isSelected ? 'scale-110' : 'text-slate-300'}`}>
                                <IconComponent size={14} strokeWidth={isSelected ? 3 : 2} />
                            </div>
                            {cat.name}
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

export default CategoryNav;
