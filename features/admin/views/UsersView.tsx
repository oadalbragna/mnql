
import React, { useState } from 'react';
import { Search, Shield, User, XCircle, MoreVertical, Edit2 } from 'lucide-react';
import { UserProfile } from '../../../types';

interface UsersViewProps {
    users: UserProfile[];
    onRoleChange: (phone: string, role: string) => void;
}

export const UsersView: React.FC<UsersViewProps> = ({ users, onRoleChange }) => {
    const [searchQuery, setSearchQuery] = useState('');

    const filteredUsers = users.filter(u => 
        u.fullName.toLowerCase().includes(searchQuery.toLowerCase()) || 
        u.emailOrPhone.includes(searchQuery)
    );

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex gap-4 bg-white p-4 rounded-[28px] shadow-sm border border-slate-100">
                <div className="flex-1 relative">
                    <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                    <input 
                        type="text" 
                        placeholder="البحث عن مستخدم بالاسم أو رقم الهاتف..." 
                        className="w-full bg-slate-50 border-none rounded-2xl py-4 pr-12 pl-4 text-sm font-bold shadow-inner"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            <div className="bg-white rounded-[32px] overflow-hidden border border-slate-100 shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-right whitespace-nowrap">
                        <thead className="bg-slate-50 border-b border-slate-100">
                            <tr>
                                <th className="p-5 text-[10px] font-black text-slate-400 uppercase">المستخدم</th>
                                <th className="p-5 text-[10px] font-black text-slate-400 uppercase">الدور الحالي</th>
                                <th className="p-5 text-[10px] font-black text-slate-400 uppercase">تاريخ الانضمام</th>
                                <th className="p-5 text-[10px] font-black text-slate-400 uppercase">تغيير الصلاحية</th>
                                <th className="p-5 text-[10px] font-black text-slate-400 uppercase">الإجراءات</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {filteredUsers.map(u => (
                                <tr key={u.id} className="hover:bg-slate-50/50 transition-all">
                                    <td className="p-5">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center text-slate-400 font-black text-lg">{u.fullName[0]}</div>
                                            <div>
                                                <p className="font-black text-slate-800 text-sm">{u.fullName}</p>
                                                <p className="text-[10px] text-slate-400 font-bold mt-0.5">{u.emailOrPhone}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-5">
                                        <span className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase inline-flex items-center gap-1.5 ${
                                            u.role === 'admin' ? 'bg-red-50 text-red-600 border border-red-100' :
                                            u.role === 'trader' ? 'bg-primary/10 text-primary border border-primary/20' : 'bg-slate-100 text-slate-500 border border-slate-200'
                                        }`}>
                                            {u.role === 'admin' && <Shield size={10} />}
                                            {u.role === 'trader' && <User size={10} />}
                                            {u.role === 'admin' ? 'مدير' : u.role === 'trader' ? 'تاجر' : u.role === 'worker' ? 'عامل' : 'مستخدم'}
                                        </span>
                                    </td>
                                    <td className="p-5 text-xs text-slate-500 font-bold">
                                        {new Date(u.createdAt).toLocaleDateString('ar-SA')}
                                    </td>
                                    <td className="p-5">
                                        <select 
                                            value={u.role}
                                            onChange={(e) => onRoleChange(u.emailOrPhone, e.target.value)}
                                            className="bg-slate-50 border-none rounded-xl px-4 py-2 text-[10px] font-black text-slate-600 outline-none cursor-pointer focus:ring-2 focus:ring-primary/20"
                                        >
                                            <option value="user">مستخدم عادي</option>
                                            <option value="trader">تاجر معتمد</option>
                                            <option value="worker">عامل/موظف</option>
                                            <option value="admin">مدير نظام</option>
                                        </select>
                                    </td>
                                    <td className="p-5">
                                        <div className="flex gap-2">
                                            <button className="p-2 bg-slate-50 text-slate-400 hover:text-primary rounded-lg transition-all"><Edit2 size={16}/></button>
                                            <button className="p-2 bg-red-50 text-red-400 hover:text-red-600 hover:bg-red-100 rounded-lg transition-all"><XCircle size={16}/></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {filteredUsers.length === 0 && (
                        <div className="p-12 text-center text-slate-400 font-black">
                            لا يوجد مستخدمين مطابقين للبحث.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};