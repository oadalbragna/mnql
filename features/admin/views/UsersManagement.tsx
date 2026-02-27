
import React, { useState, useEffect } from 'react';
import { Search, Shield, Ban, CheckCircle, Edit } from 'lucide-react';
import { DataTable } from '../components/DataTable';
import { ConfirmModal } from '../components/ConfirmModal';
import { UserProfile } from '../../../types';
import { AuthService } from '../../../services/authService';

export const UsersManagement: React.FC = () => {
    const [users, setUsers] = useState<UserProfile[]>([]);
    const [search, setSearch] = useState('');
    const [selectedRole, setSelectedRole] = useState('all');
    
    // Modal state
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [targetUser, setTargetUser] = useState<UserProfile | null>(null);

    useEffect(() => {
        loadUsers();
    }, []);

    const loadUsers = async () => {
        const allUsers = await AuthService.getAllUsers();
        setUsers(allUsers);
    };

    const handleRoleChange = async (phone: string, newRole: any) => {
        await AuthService.updateUserRole(phone, newRole);
        loadUsers();
    };

    const confirmAction = (user: UserProfile) => {
        setTargetUser(user);
        setIsModalOpen(true);
    };

    const executeAction = () => {
        // Here we would implement suspend logic (e.g. setting status = 'suspended' in DB)
        alert(`تم تجميد حساب: ${targetUser?.fullName}`);
        setIsModalOpen(false);
    };

    const filteredUsers = users.filter(u => {
        const matchesSearch = u.fullName.includes(search) || u.emailOrPhone.includes(search);
        const matchesRole = selectedRole === 'all' || u.role === selectedRole;
        return matchesSearch && matchesRole;
    });

    const columns = [
        {
            key: 'user', label: 'المستخدم', render: (_: any, user: UserProfile) => (
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center font-black text-slate-500">{user.fullName[0]}</div>
                    <div>
                        <p className="font-black text-slate-800 text-sm">{user.fullName}</p>
                        <p className="text-[10px] text-slate-400 font-bold">{user.emailOrPhone}</p>
                    </div>
                </div>
            )
        },
        {
            key: 'role', label: 'الدور / الصلاحية', render: (_: any, user: UserProfile) => (
                <select 
                    value={user.role} 
                    onChange={(e) => handleRoleChange(user.emailOrPhone, e.target.value)}
                    className="bg-slate-50 border-none px-4 py-2 rounded-xl text-xs font-black text-slate-700 focus:ring-2 focus:ring-primary/20 cursor-pointer"
                >
                    <option value="user">مستخدم عادي</option>
                    <option value="trader">تاجر (Trader)</option>
                    <option value="admin">مدير (Admin)</option>
                </select>
            )
        },
        { key: 'createdAt', label: 'تاريخ الانضمام', render: (val: string) => <span className="text-xs text-slate-500 font-bold">{new Date(val).toLocaleDateString('ar-SA')}</span> },
        {
            key: 'actions', label: 'إجراءات', render: (_: any, user: UserProfile) => (
                <button onClick={() => confirmAction(user)} className="px-4 py-2 bg-red-50 text-red-600 rounded-xl text-[10px] font-black hover:bg-red-100 transition-all flex items-center gap-1">
                    <Ban size={14} /> تجميد الحساب
                </button>
            )
        }
    ];

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex gap-4">
                <div className="flex-1 relative">
                    <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                    <input 
                        type="text" placeholder="ابحث بالاسم أو الرقم..." 
                        value={search} onChange={e => setSearch(e.target.value)}
                        className="w-full bg-white border-none rounded-2xl py-4 pr-12 pl-6 font-bold text-slate-700 shadow-sm focus:ring-4 focus:ring-primary/10 transition-all"
                    />
                </div>
                <select value={selectedRole} onChange={e => setSelectedRole(e.target.value)} className="bg-white border-none rounded-2xl px-6 py-4 font-bold text-slate-700 shadow-sm appearance-none cursor-pointer">
                    <option value="all">كل الأدوار</option>
                    <option value="user">المستخدمين</option>
                    <option value="trader">التجار</option>
                    <option value="admin">المديرين</option>
                </select>
            </div>

            <DataTable columns={columns} data={filteredUsers} emptyMessage="لا توجد نتائج مطابقة" />

            <ConfirmModal 
                isOpen={isModalOpen}
                title="تأكيد التجميد"
                message={`هل أنت متأكد من رغبتك في تجميد حساب "${targetUser?.fullName}"؟ لن يتمكن من تسجيل الدخول أو استخدام التطبيق.`}
                onConfirm={executeAction}
                onCancel={() => setIsModalOpen(false)}
                isDestructive={true}
                confirmText="نعم، قم بالتجميد"
            />
        </div>
    );
};
