
import React, { useState, useEffect } from 'react';
import { Sprout, Search, Filter, Trash2, Eye, ExternalLink, Clock, AlertTriangle } from 'lucide-react';
import { DataTable } from '../components/DataTable';
import { ConfirmModal } from '../components/ConfirmModal';
import { AgriDiagnosis } from '../../../types';
import { db } from '../../../firebase';
import { ref, onValue, remove } from 'firebase/database';

export const AIConsultationsManagement: React.FC = () => {
    const [consultations, setConsultations] = useState<AgriDiagnosis[]>([]);
    const [search, setSearch] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [targetId, setTargetId] = useState<{ userId: string, diagId: string } | null>(null);

    useEffect(() => {
        // Fetch all diagnoses across all users
        const diagRef = ref(db, 'Mangal-Shop/agri_diagnoses');
        onValue(diagRef, (snap) => {
            if (snap.exists()) {
                const allData: AgriDiagnosis[] = [];
                const usersData = snap.val();
                
                // Flatten the nested structure { userId: { diagId: diagData } }
                Object.keys(usersData).forEach(userId => {
                    Object.keys(usersData[userId]).forEach(diagId => {
                        allData.push({
                            ...usersData[userId][diagId],
                            id: diagId // Ensure we have the unique ID for actions
                        });
                    });
                });
                
                setConsultations(allData.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()));
            } else {
                setConsultations([]);
            }
        });
    }, []);

    const confirmDelete = (userId: string, diagId: string) => {
        setTargetId({ userId, diagId });
        setIsModalOpen(true);
    };

    const executeDelete = async () => {
        if (targetId) {
            await remove(ref(db, `Mangal-Shop/agri_diagnoses/${targetId.userId}/${targetId.diagId}`));
            setIsModalOpen(false);
            setTargetId(null);
        }
    };

    const filteredConsultations = consultations.filter(c => 
        c.issue.toLowerCase().includes(search.toLowerCase()) || 
        c.userId.includes(search)
    );

    const columns = [
        {
            key: 'image', label: 'صورة المحصول', render: (val: string) => (
                <div className="relative w-12 h-12 rounded-lg overflow-hidden border border-slate-100 shadow-sm group">
                    <img src={val} className="w-full h-full object-cover transition-transform group-hover:scale-110" alt="Crop" />
                </div>
            )
        },
        {
            key: 'details', label: 'التشخيص', render: (_: any, item: AgriDiagnosis) => (
                <div className="text-right">
                    <p className="font-black text-slate-800 text-sm truncate max-w-[200px]">{item.issue}</p>
                    <p className="text-[10px] text-slate-400 font-bold mt-0.5">{item.userId}</p>
                </div>
            )
        },
        {
            key: 'urgency', label: 'الخطورة', render: (val: string) => (
                <span className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase inline-flex items-center gap-1.5 ${
                    val === 'high' ? 'bg-red-50 text-red-600 border border-red-100' :
                    val === 'medium' ? 'bg-amber-50 text-amber-600 border border-amber-100' :
                    'bg-emerald-50 text-emerald-600 border border-emerald-100'
                }`}>
                    <AlertTriangle size={10} />
                    {val === 'high' ? 'عالية' : val === 'medium' ? 'متوسطة' : 'منخفضة'}
                </span>
            )
        },
        {
            key: 'timestamp', label: 'الوقت', render: (val: string) => (
                <div className="flex items-center gap-2 text-slate-400 font-bold text-xs">
                    <Clock size={12} /> {new Date(val).toLocaleDateString('ar-SA')}
                </div>
            )
        },
        {
            key: 'actions', label: 'إجراءات', render: (_: any, item: AgriDiagnosis) => (
                <div className="flex gap-2">
                    <button onClick={() => window.open(item.imageUrl, '_blank')} className="p-2 bg-slate-50 text-slate-400 hover:text-primary rounded-lg transition-all"><Eye size={16}/></button>
                    <button onClick={() => confirmDelete(item.userId, item.id!)} className="p-2 bg-red-50 text-red-500 hover:bg-red-500 hover:text-white rounded-lg transition-all"><Trash2 size={16}/></button>
                </div>
            )
        }
    ];

    return (
        <div className="space-y-6 animate-fade-in">
            {/* KPI Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-[28px] border border-slate-100 shadow-sm flex items-center justify-between">
                    <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase mb-1">إجمالي التشخيصات</p>
                        <h4 className="text-2xl font-black text-slate-900">{consultations.length}</h4>
                    </div>
                    <div className="w-12 h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center"><Sprout size={24}/></div>
                </div>
                <div className="bg-white p-6 rounded-[28px] border border-slate-100 shadow-sm flex items-center justify-between">
                    <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase mb-1">حالات حرجة</p>
                        <h4 className="text-2xl font-black text-red-500">{consultations.filter(c => c.urgency === 'high').length}</h4>
                    </div>
                    <div className="w-12 h-12 bg-red-50 text-red-500 rounded-xl flex items-center justify-center"><AlertTriangle size={24}/></div>
                </div>
                <div className="bg-white p-6 rounded-[28px] border border-slate-100 shadow-sm flex items-center justify-between">
                    <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase mb-1">دقة الذكاء الاصطناعي</p>
                        <h4 className="text-2xl font-black text-emerald-500">94.2%</h4>
                    </div>
                    <div className="w-12 h-12 bg-emerald-50 text-emerald-500 rounded-xl flex items-center justify-center"><Filter size={24}/></div>
                </div>
            </div>

            <div className="flex gap-4">
                <div className="flex-1 relative">
                    <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                    <input 
                        type="text" placeholder="البحث في سجل الاستشارات..." 
                        value={search} onChange={e => setSearch(e.target.value)}
                        className="w-full bg-white border-none rounded-2xl py-4 pr-12 pl-6 font-bold text-slate-700 shadow-sm focus:ring-4 focus:ring-primary/10 transition-all"
                    />
                </div>
            </div>

            <DataTable columns={columns} data={filteredConsultations} emptyMessage="لا يوجد سجل استشارات بعد" />

            <ConfirmModal 
                isOpen={isModalOpen}
                title="حذف استشارة"
                message="هل أنت متأكد من حذف هذا السجل؟ سيتم مسح الصورة والنتائج نهائياً من قاعدة بيانات الإدارة والمستخدم."
                onConfirm={executeDelete}
                onCancel={() => setIsModalOpen(false)}
                isDestructive={true}
                confirmText="تأكيد الحذف"
            />
        </div>
    );
};
