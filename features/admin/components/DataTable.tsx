
import React from 'react';

interface Column {
    key: string;
    label: string;
    render?: (value: any, item: any) => React.ReactNode;
}

interface DataTableProps {
    columns: Column[];
    data: any[];
    emptyMessage?: string;
}

export const DataTable: React.FC<DataTableProps> = ({ columns, data, emptyMessage = 'لا توجد بيانات' }) => {
    return (
        <div className="bg-white rounded-[24px] overflow-hidden border border-slate-100 shadow-sm">
            <div className="overflow-x-auto">
                <table className="w-full text-right whitespace-nowrap">
                    <thead className="bg-slate-50 border-b border-slate-100">
                        <tr>
                            {columns.map(col => (
                                <th key={col.key} className="p-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                    {col.label}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                        {data.length > 0 ? data.map((item, index) => (
                            <tr key={item.id || index} className="hover:bg-slate-50/50 transition-all">
                                {columns.map(col => (
                                    <td key={col.key} className="p-4">
                                        {col.render ? col.render(item[col.key], item) : <span className="text-sm font-bold text-slate-700">{item[col.key]}</span>}
                                    </td>
                                ))}
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan={columns.length} className="p-12 text-center text-slate-400 font-black">
                                    {emptyMessage}
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
