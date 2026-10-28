import React, { useEffect, useState, useMemo } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  Users,
  ShieldCheck,
  Calendar,
  Activity,
  Search,
  X,
  ShieldAlert,
  Edit,
  Trash2,
  UserCheck,
  UserX,
  Filter,
  ArrowUpDown,
  Sprout,
  Radio,
  CheckCircle,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  Eye,
  Download,
  Building2,
  Cpu,
  Shield
} from 'lucide-react';

const AdminDashboardView = () => {
  const {
    user: currentUser,
    subscribeToAllUsers,
    updateUserRole,
    toggleUserStatus,
    deleteUserRecord,
    updateUserProfileData
  } = useAuth();

  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);

  // Search, Filters & Sorting
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Bulk Selection State
  const [selectedUids, setSelectedUids] = useState(new Set());

  // Slide-Over Detail Drawer
  const [drawerUser, setDrawerUser] = useState(null);
  const [drawerTab, setDrawerTab] = useState('overview');

  // Action Modals & Toasts
  const [editingUser, setEditingUser] = useState(null);
  const [editFormData, setEditFormData] = useState({ name: '', email: '', phone: '' });
  const [deletingUser, setDeletingUser] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [notification, setNotification] = useState(null);

  // Real-time synchronization subscription
  useEffect(() => {
    const unsubscribe = subscribeToAllUsers(
      (usersList) => {
        setUsers(usersList);
      },
      (err) => {
        console.error("User subscription error:", err);
        setError(err.message || "Failed to establish real-time connection to users collection.");
      }
    );

    return () => {
      if (typeof unsubscribe === 'function') {
        unsubscribe();
      }
    };
  }, [subscribeToAllUsers]);

  // Show temporary toast notification
  const showToast = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3500);
  };

  // Helper functions
  const getInitials = (name) => {
    if (!name) return 'US';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  const parseTimestamp = (val) => {
    if (!val) return 0;
    if (typeof val?.toDate === 'function') return val.toDate().getTime();
    if (val?.seconds) return val.seconds * 1000;
    const d = new Date(val);
    return isNaN(d.getTime()) ? 0 : d.getTime();
  };

  const formatDate = (val) => {
    if (!val) return 'N/A';
    try {
      const ms = parseTimestamp(val);
      if (!ms) return 'N/A';
      const date = new Date(ms);
      return date.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      });
    } catch {
      return 'N/A';
    }
  };

  const formatTime = (val) => {
    if (!val) return '';
    try {
      const ms = parseTimestamp(val);
      if (!ms) return '';
      const date = new Date(ms);
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch {
      return '';
    }
  };

  // Avatar color generator based on user email/name hash
  const getAvatarBg = (identifier = '') => {
    const colors = [
      'from-emerald-600 to-teal-700 text-emerald-200 border-emerald-500/40',
      'from-blue-600 to-indigo-700 text-blue-200 border-blue-500/40',
      'from-purple-600 to-violet-700 text-purple-200 border-purple-500/40',
      'from-amber-600 to-orange-700 text-amber-200 border-amber-500/40',
      'from-rose-600 to-pink-700 text-rose-200 border-rose-500/40',
      'from-cyan-600 to-blue-700 text-cyan-200 border-cyan-500/40'
    ];
    let hash = 0;
    for (let i = 0; i < identifier.length; i++) {
      hash = identifier.charCodeAt(i) + ((hash << 5) - hash);
    }
    const index = Math.abs(hash) % colors.length;
    return colors[index];
  };

  // Action handlers
  const handleRoleChange = async (targetUser) => {
    if (currentUser?.uid === targetUser.uid) {
      showToast("Security Policy: You cannot change your own admin role.", "error");
      return;
    }

    if (targetUser.role !== 'admin') {
      showToast("Single Admin Policy: Only the primary system account holds full Admin privileges.", "error");
      return;
    }

    const newRole = 'user';
    setActionLoading(true);
    try {
      await updateUserRole(targetUser.uid, newRole);
      showToast(`User ${targetUser.name || targetUser.email} role updated to Crop Operator.`);
      if (drawerUser && drawerUser.uid === targetUser.uid) {
        setDrawerUser((prev) => prev ? { ...prev, role: newRole } : null);
      }
    } catch (err) {
      console.error("Role update error:", err);
      showToast(err.message || "Failed to change user role.", "error");
    } finally {
      setActionLoading(false);
    }
  };

  const handleToggleStatus = async (targetUser) => {
    if (currentUser?.uid === targetUser.uid) {
      showToast("Security Policy: You cannot disable your own account.", "error");
      return;
    }

    const currentStatus = targetUser.status || 'active';
    setActionLoading(true);
    try {
      await toggleUserStatus(targetUser.uid, currentStatus);
      const newStatus = currentStatus === 'disabled' ? 'active' : 'disabled';
      showToast(`User ${targetUser.name || targetUser.email} status changed to ${newStatus === 'active' ? 'Active' : 'Disabled'}.`);
      if (drawerUser && drawerUser.uid === targetUser.uid) {
        setDrawerUser((prev) => prev ? { ...prev, status: newStatus } : null);
      }
    } catch (err) {
      console.error("Status toggle error:", err);
      showToast(err.message || "Failed to change account status.", "error");
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deletingUser) return;
    if (currentUser?.uid === deletingUser.uid) {
      showToast("Security Policy: You cannot delete your own account.", "error");
      setDeletingUser(null);
      return;
    }

    setActionLoading(true);
    try {
      await deleteUserRecord(deletingUser.uid);
      showToast(`User account ${deletingUser.email} successfully deleted.`);
      if (drawerUser && drawerUser.uid === deletingUser.uid) {
        setDrawerUser(null);
      }
      setDeletingUser(null);
    } catch (err) {
      console.error("Delete error:", err);
      showToast(err.message || "Failed to delete user document.", "error");
    } finally {
      setActionLoading(false);
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!editingUser) return;

    setActionLoading(true);
    try {
      await updateUserProfileData(editingUser.uid, editFormData);
      showToast(`User details for ${editFormData.name} updated successfully.`);
      if (drawerUser && drawerUser.uid === editingUser.uid) {
        setDrawerUser((prev) => prev ? { ...prev, ...editFormData } : null);
      }
      setEditingUser(null);
    } catch (err) {
      console.error("Update profile error:", err);
      showToast(err.message || "Failed to update profile.", "error");
    } finally {
      setActionLoading(false);
    }
  };

  // Filtered & Sorted Users
  const filteredUsers = useMemo(() => {
    return users
      .filter((u) => {
        const term = searchQuery.toLowerCase().trim();
        const matchesSearch =
          !term ||
          (u.name || '').toLowerCase().includes(term) ||
          (u.email || '').toLowerCase().includes(term) ||
          (u.phone || '').toLowerCase().includes(term) ||
          (u.role || '').toLowerCase().includes(term) ||
          (u.uid || '').toLowerCase().includes(term);

        const matchesRole =
          roleFilter === 'all' ||
          (roleFilter === 'admin' && u.role === 'admin') ||
          (roleFilter === 'user' && (u.role === 'user' || u.role === 'operator' || !u.role)) ||
          (roleFilter === 'viewer' && u.role === 'viewer');

        const matchesStatus =
          statusFilter === 'all' ||
          (statusFilter === 'active' && u.status !== 'disabled' && u.status !== 'pending') ||
          (statusFilter === 'disabled' && u.status === 'disabled') ||
          (statusFilter === 'pending' && u.status === 'pending');

        return matchesSearch && matchesRole && matchesStatus;
      })
      .sort((a, b) => {
        if (sortBy === 'newest') {
          return parseTimestamp(b.createdAt) - parseTimestamp(a.createdAt);
        } else if (sortBy === 'oldest') {
          return parseTimestamp(a.createdAt) - parseTimestamp(b.createdAt);
        } else if (sortBy === 'name') {
          return (a.name || '').localeCompare(b.name || '');
        } else if (sortBy === 'lastLogin') {
          return parseTimestamp(b.lastLogin) - parseTimestamp(a.lastLogin);
        }
        return 0;
      });
  }, [users, searchQuery, roleFilter, statusFilter, sortBy]);

  // Paginated Users Slice
  const totalUsersCount = users.length;
  const filteredCount = filteredUsers.length;
  const totalPages = Math.ceil(filteredCount / pageSize) || 1;
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedUsers = useMemo(() => {
    return filteredUsers.slice(startIndex, startIndex + pageSize);
  }, [filteredUsers, startIndex, pageSize]);

  // Stats Counters
  const adminCount = users.filter((u) => u.role === 'admin').length;
  const activeCount = users.filter((u) => u.status !== 'disabled').length;
  const disabledCount = users.filter((u) => u.status === 'disabled').length;
  const newUsersCount = users.filter((u) => {
    if (!u.createdAt) return false;
    const diff = Math.abs(new Date() - new Date(u.createdAt));
    return diff <= 7 * 24 * 60 * 60 * 1000;
  }).length;
  const onlineCount = users.filter((u) => {
    if (!u.lastLogin) return u.status !== 'disabled';
    const diff = Math.abs(new Date() - new Date(u.lastLogin));
    return diff <= 24 * 60 * 60 * 1000;
  }).length;

  // Checkbox Selection Logic
  const isAllSelected = paginatedUsers.length > 0 && paginatedUsers.every((u) => selectedUids.has(u.uid));

  const handleSelectAll = () => {
    if (isAllSelected) {
      const next = new Set(selectedUids);
      paginatedUsers.forEach((u) => next.delete(u.uid));
      setSelectedUids(next);
    } else {
      const next = new Set(selectedUids);
      paginatedUsers.forEach((u) => next.add(u.uid));
      setSelectedUids(next);
    }
  };

  const handleSelectRow = (uid) => {
    const next = new Set(selectedUids);
    if (next.has(uid)) {
      next.delete(uid);
    } else {
      next.add(uid);
    }
    setSelectedUids(next);
  };

  // Bulk Actions
  const handleBulkDisable = async () => {
    const uidsToDisable = Array.from(selectedUids).filter((uid) => uid !== currentUser?.uid);
    if (uidsToDisable.length === 0) {
      showToast("Security Policy: Cannot disable your own account.", "error");
      return;
    }
    setActionLoading(true);
    try {
      await Promise.all(uidsToDisable.map((uid) => toggleUserStatus(uid, 'active')));
      showToast(`Bulk disable updated ${uidsToDisable.length} user accounts.`);
      setSelectedUids(new Set());
    } catch (err) {
      showToast(err.message || "Failed bulk disable operation.", "error");
    } finally {
      setActionLoading(false);
    }
  };

  const handleBulkEnable = async () => {
    const uidsToEnable = Array.from(selectedUids);
    setActionLoading(true);
    try {
      await Promise.all(uidsToEnable.map((uid) => toggleUserStatus(uid, 'disabled')));
      showToast(`Bulk enable updated ${uidsToEnable.length} user accounts.`);
      setSelectedUids(new Set());
    } catch (err) {
      showToast(err.message || "Failed bulk enable operation.", "error");
    } finally {
      setActionLoading(false);
    }
  };

  const handleBulkExportCSV = () => {
    const selectedList = users.filter((u) => selectedUids.has(u.uid));
    if (selectedList.length === 0) return;

    const headers = "UID,Name,Email,Phone,Role,Status,Created At,Last Login\n";
    const rows = selectedList
      .map(u => `"${u.uid}","${u.name || ''}","${u.email || ''}","${u.phone || ''}","${u.role || 'user'}","${u.status || 'active'}","${u.createdAt || ''}","${u.lastLogin || ''}"`)
      .join('\n');

    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `user_management_export_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast(`Exported ${selectedList.length} users to CSV.`);
  };

  return (
    <main className="p-6 md:p-8 space-y-8 flex-1 max-w-7xl w-full mx-auto select-none">
      {/* Toast Notification */}
      {notification && (
        <div
          className={`fixed top-5 right-5 z-50 px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3 border text-sm font-semibold animate-in fade-in slide-in-from-top-3 duration-200 ${notification.type === 'error'
              ? 'bg-rose-500/20 border-rose-500/40 text-rose-300'
              : 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300'
            }`}
        >
          {notification.type === 'error' ? (
            <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0" />
          ) : (
            <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />
          )}
          <span>{notification.message}</span>
        </div>
      )}

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-sans">
              Admin User Management Console
            </h1>
            <span className="px-2.5 py-0.5 rounded-md bg-[#00ff88]/10 text-[#00ff88] border border-[#00ff88]/30 text-xs font-bold font-mono">
              v2.4 Enterprise
            </span>
          </div>
          <p className="text-gray-400 text-xs sm:text-sm mt-1 max-w-3xl leading-relaxed">
            Manage system access credentials, role-based security policies, grow room allocations, and operational telemetry permissions.
          </p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <span className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 px-3.5 py-2 rounded-xl text-xs font-semibold">
            <Radio className="w-3.5 h-3.5 animate-pulse text-emerald-400" /> Real-Time Sync Active
          </span>
        </div>
      </div>

      {/* Top Statistics Matrix (4 Uniform High-Density Cards) */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#131c2e] border border-slate-800/80 p-5 rounded-2xl flex flex-col justify-between h-full transition-all hover:border-slate-700/80 shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-gray-400 font-bold uppercase tracking-wider">Total Users</span>
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <p className="text-2xl font-extrabold text-white font-mono leading-none">{totalUsersCount}</p>
            <p className="text-[10px] text-gray-400 mt-1 font-medium">Directory Records</p>
          </div>
        </div>

        <div className="bg-[#131c2e] border border-slate-800/80 p-5 rounded-2xl flex flex-col justify-between h-full transition-all hover:border-slate-700/80 shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-gray-400 font-bold uppercase tracking-wider">Admins</span>
            <div className="p-2 rounded-lg bg-[#00ff88]/10 text-[#00ff88] border border-[#00ff88]/20">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <p className="text-2xl font-extrabold text-white font-mono leading-none">{adminCount}</p>
            <p className="text-[10px] text-gray-400 mt-1 font-medium">Full Privileges</p>
          </div>
        </div>

        <div className="bg-[#131c2e] border border-slate-800/80 p-5 rounded-2xl flex flex-col justify-between h-full transition-all hover:border-slate-700/80 shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-gray-400 font-bold uppercase tracking-wider">Active</span>
            <div className="p-2 rounded-lg bg-teal-500/10 text-teal-400 border border-teal-500/20">
              <UserCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <p className="text-2xl font-extrabold text-white font-mono leading-none">{activeCount}</p>
            <p className="text-[10px] text-gray-400 mt-1 font-medium">Operational Status</p>
          </div>
        </div>

        <div className="bg-[#131c2e] border border-slate-800/80 p-5 rounded-2xl flex flex-col justify-between h-full transition-all hover:border-slate-700/80 shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-gray-400 font-bold uppercase tracking-wider">Disabled</span>
            <div className="p-2 rounded-lg bg-rose-500/10 text-rose-400 border border-rose-500/20">
              <UserX className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <p className="text-2xl font-extrabold text-white font-mono leading-none">{disabledCount}</p>
            <p className="text-[10px] text-gray-400 mt-1 font-medium">Restricted Access</p>
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-rose-500/10 border border-rose-500/30 p-5 rounded-2xl flex items-start gap-3">
          <div className="p-2 rounded-xl bg-rose-500/20 text-rose-400 mt-0.5 shrink-0">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-white text-sm">Database Synchronization Notice</h4>
            <p className="text-xs text-gray-300 mt-1">{error}</p>
          </div>
        </div>
      )}

      {/* Main Enterprise Data Console Card */}
      <div className="bg-[#131c2e] border border-slate-800/80 rounded-2xl shadow-xl overflow-hidden flex flex-col">

        {/* Single Aligned Toolbar (Search, Filters, Sort, Actions) */}
        <div className="p-5 border-b border-slate-800/80 flex flex-col lg:flex-row gap-4 items-stretch lg:items-center justify-between bg-[#0d1424]/60">

          {/* Left: Search Bar */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search user name, email, phone, role, UID..."
              className="w-full pl-10 pr-9 py-2.5 bg-[#0a0f1a] border border-slate-800 rounded-xl text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#00ff88]/50 focus:ring-1 focus:ring-[#00ff88]/30 transition-all font-sans"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Right: Controls & Filters Strip */}
          <div className="flex flex-wrap items-center gap-3 shrink-0">

            {/* Role Filter */}
            <div className="flex items-center gap-1.5 bg-[#0a0f1a] px-3 py-1.5 rounded-xl border border-slate-800 text-xs">
              <Filter className="w-3.5 h-3.5 text-gray-400 shrink-0" />
              <select
                value={roleFilter}
                onChange={(e) => {
                  setRoleFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="bg-transparent text-white font-medium focus:outline-none cursor-pointer text-xs"
              >
                <option value="all" className="bg-[#0d1424]">All Roles</option>
                <option value="admin" className="bg-[#0d1424]">System Admin</option>
                <option value="user" className="bg-[#0d1424]">Crop Operator</option>
                <option value="viewer" className="bg-[#0d1424]">Viewer</option>
              </select>
            </div>

            {/* Status Filter */}
            <div className="flex items-center gap-1.5 bg-[#0a0f1a] px-3 py-1.5 rounded-xl border border-slate-800 text-xs">
              <span className="w-2 h-2 rounded-full bg-[#00ff88]"></span>
              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="bg-transparent text-white font-medium focus:outline-none cursor-pointer text-xs"
              >
                <option value="all" className="bg-[#0d1424]">All Statuses</option>
                <option value="active" className="bg-[#0d1424]">Active</option>
                <option value="disabled" className="bg-[#0d1424]">Disabled</option>
                <option value="pending" className="bg-[#0d1424]">Pending</option>
              </select>
            </div>

            {/* Sort Selector */}
            <div className="flex items-center gap-1.5 bg-[#0a0f1a] px-3 py-1.5 rounded-xl border border-slate-800 text-xs">
              <ArrowUpDown className="w-3.5 h-3.5 text-gray-400 shrink-0" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-transparent text-white font-medium focus:outline-none cursor-pointer text-xs"
              >
                <option value="newest" className="bg-[#0d1424]">Sort: Newest</option>
                <option value="oldest" className="bg-[#0d1424]">Sort: Oldest</option>
                <option value="name" className="bg-[#0d1424]">Sort: Name (A-Z)</option>
                <option value="lastLogin" className="bg-[#0d1424]">Sort: Last Login</option>
              </select>
            </div>

            {/* CSV Export Button */}
            <button
              onClick={handleBulkExportCSV}
              className="flex items-center gap-1.5 px-3 py-2 bg-[#0a0f1a] hover:bg-slate-800 text-gray-300 hover:text-white rounded-xl border border-slate-800 transition-colors text-xs font-semibold cursor-pointer"
              title="Export filtered directory to CSV"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Export CSV</span>
            </button>
          </div>
        </div>

        {/* Bulk Action Header Bar (Appears when 1+ rows selected) */}
        {selectedUids.size > 0 && (
          <div className="bg-[#00ff88]/10 border-b border-[#00ff88]/30 px-6 py-3 flex items-center justify-between gap-4 animate-in fade-in duration-150">
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-[#00ff88] font-mono">
                {selectedUids.size} user{selectedUids.size > 1 ? 's' : ''} selected
              </span>
              <button
                onClick={() => setSelectedUids(new Set())}
                className="text-[11px] text-gray-400 hover:text-white underline cursor-pointer"
              >
                Clear selection
              </button>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleBulkEnable}
                className="px-3 py-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 text-xs font-semibold transition-colors cursor-pointer"
              >
                Enable Selected
              </button>
              <button
                onClick={handleBulkDisable}
                className="px-3 py-1.5 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 text-xs font-semibold transition-colors cursor-pointer"
              >
                Disable Selected
              </button>
              <button
                onClick={handleBulkExportCSV}
                className="px-3 py-1.5 rounded-lg bg-[#0a0f1a] hover:bg-slate-800 text-white border border-slate-700 text-xs font-semibold transition-colors cursor-pointer"
              >
                Export Selected
              </button>
            </div>
          </div>
        )}

        {/* 12-Column High-Density Enterprise Data Table */}
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse min-w-[1100px]">
            {/* Sticky Table Header */}
            <thead>
              <tr className="bg-[#0a0f1a] border-b border-slate-800 text-[11px] font-bold text-gray-400 uppercase tracking-wider sticky top-0 z-10 select-none">
                <th className="py-3.5 px-4 w-12 text-center">
                  <input
                    type="checkbox"
                    checked={isAllSelected}
                    onChange={handleSelectAll}
                    className="w-4 h-4 rounded border-slate-700 bg-[#131c2e] text-[#00ff88] focus:ring-0 focus:ring-offset-0 cursor-pointer"
                  />
                </th>
                <th className="py-3.5 px-3 w-14">Avatar</th>
                <th className="py-3.5 px-4 min-w-[180px]">User Name</th>
                <th className="py-3.5 px-4 min-w-[200px]">Email Address</th>
                <th className="py-3.5 px-4 min-w-[140px]">Phone</th>
                <th className="py-3.5 px-4 min-w-[130px]">Role</th>
                <th className="py-3.5 px-4 min-w-[110px]">Status</th>
                <th className="py-3.5 px-4 text-center w-28">Grow Rooms</th>
                <th className="py-3.5 px-4 text-center w-24">Sensors</th>
                <th className="py-3.5 px-4 min-w-[130px]">Registered</th>
                <th className="py-3.5 px-4 min-w-[130px]">Last Login</th>
                <th className="py-3.5 px-4 text-right min-w-[120px]">Actions</th>
              </tr>
            </thead>

            {/* Table Body */}
            <tbody className="divide-y divide-slate-800/60 text-xs">
              {paginatedUsers.length > 0 ? (
                paginatedUsers.map((userItem) => {
                  const isCurrentUser = currentUser?.uid === userItem.uid;
                  const isSelected = selectedUids.has(userItem.uid);
                  const avatarBg = getAvatarBg(userItem.email || userItem.name);
                  const isUserDisabled = userItem.status === 'disabled';
                  const isAdminRole = userItem.role === 'admin';

                  const assignedRoomsCount = Array.isArray(userItem.assignedGrowRooms)
                    ? userItem.assignedGrowRooms.length
                    : (userItem.growRoomsCount || (isAdminRole ? 4 : 1));

                  const assignedSensorsCount = userItem.sensorsCount || (isAdminRole ? 48 : 12);

                  return (
                    <tr
                      key={userItem.uid}
                      onClick={() => setDrawerUser(userItem)}
                      className={`group cursor-pointer transition-colors ${isSelected
                          ? 'bg-[#00ff88]/5 hover:bg-[#00ff88]/10'
                          : 'hover:bg-[#0d1424]/80'
                        }`}
                    >
                      {/* Checkbox */}
                      <td className="py-3.5 px-4 text-center" onClick={(e) => e.stopPropagation()}>
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleSelectRow(userItem.uid)}
                          className="w-4 h-4 rounded border-slate-700 bg-[#0a0f1a] text-[#00ff88] focus:ring-0 focus:ring-offset-0 cursor-pointer"
                        />
                      </td>

                      {/* Avatar */}
                      <td className="py-3.5 px-3">
                        {userItem.photoURL ? (
                          <img
                            src={userItem.photoURL}
                            alt={userItem.name || 'User'}
                            className="w-9 h-9 rounded-xl object-cover border border-slate-700 shrink-0"
                          />
                        ) : (
                          <div className={`w-9 h-9 rounded-xl bg-gradient-to-tr ${avatarBg} border flex items-center justify-center font-bold text-xs font-mono shadow-sm shrink-0`}>
                            {getInitials(userItem.name || userItem.email)}
                          </div>
                        )}
                      </td>

                      {/* User Name & UID */}
                      <td className="py-3.5 px-4 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-white group-hover:text-[#00ff88] transition-colors truncate">
                            {userItem.name || 'Unnamed User'}
                          </span>
                          {isCurrentUser && (
                            <span className="px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30 text-[10px] font-bold shrink-0">
                              You
                            </span>
                          )}
                        </div>
                        <span className="text-[10px] font-mono text-gray-500 truncate block mt-0.5">
                          ID: {userItem.uid.substring(0, 12)}...
                        </span>
                      </td>

                      {/* Email */}
                      <td className="py-3.5 px-4 font-mono text-gray-300 whitespace-nowrap">
                        {userItem.email || 'N/A'}
                      </td>

                      {/* Phone */}
                      <td className="py-3.5 px-4 font-mono text-gray-400 whitespace-nowrap">
                        {userItem.phone || 'N/A'}
                      </td>

                      {/* Role Badge */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-bold border ${isAdminRole
                              ? 'bg-rose-500/10 text-rose-300 border-rose-500/30'
                              : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                            }`}
                        >
                          {isAdminRole ? <ShieldCheck className="w-3 h-3" /> : <Sprout className="w-3 h-3" />}
                          {isAdminRole ? 'System Admin' : 'Crop Operator'}
                        </span>
                      </td>

                      {/* Status Badge */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold border ${isUserDisabled
                              ? 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                              : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                            }`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${isUserDisabled ? 'bg-rose-500' : 'bg-[#00ff88] animate-pulse'}`}></span>
                          {isUserDisabled ? 'Disabled' : 'Active'}
                        </span>
                      </td>

                      {/* Grow Rooms Count Badge */}
                      <td className="py-3.5 px-4 text-center">
                        <span className="inline-flex items-center justify-center px-2.5 py-0.5 rounded-md bg-[#0a0f1a] border border-slate-800 text-xs font-mono font-bold text-gray-200">
                          {assignedRoomsCount}
                        </span>
                      </td>

                      {/* Sensors Count Badge */}
                      <td className="py-3.5 px-4 text-center">
                        <span className="inline-flex items-center justify-center px-2.5 py-0.5 rounded-md bg-[#0a0f1a] border border-slate-800 text-xs font-mono font-bold text-gray-300">
                          {assignedSensorsCount}
                        </span>
                      </td>

                      {/* Registration Date & Time */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="text-gray-300 font-medium">{formatDate(userItem.createdAt)}</div>
                        <div className="text-[10px] text-gray-500 font-mono">{formatTime(userItem.createdAt)}</div>
                      </td>

                      {/* Last Login Date & Time */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="text-gray-300 font-medium">{formatDate(userItem.lastLogin)}</div>
                        <div className="text-[10px] text-gray-500 font-mono">{formatTime(userItem.lastLogin)}</div>
                      </td>

                      {/* Actions Toolbar */}
                      <td className="py-3.5 px-4 text-right whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-1">
                          {/* View Drawer */}
                          <button
                            onClick={() => setDrawerUser(userItem)}
                            className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-slate-800 transition-colors"
                            title="View Full Profile Drawer"
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          {/* Edit Modal */}
                          <button
                            onClick={() => {
                              setEditingUser(userItem);
                              setEditFormData({
                                name: userItem.name || '',
                                email: userItem.email || '',
                                phone: userItem.phone || ''
                              });
                            }}
                            className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-slate-800 transition-colors"
                            title="Edit User Profile"
                          >
                            <Edit className="w-4 h-4" />
                          </button>

                          {/* Change Role */}
                          <button
                            onClick={() => handleRoleChange(userItem)}
                            disabled={actionLoading || isCurrentUser}
                            className={`p-1.5 rounded-lg transition-colors ${isCurrentUser
                                ? 'text-gray-600 cursor-not-allowed'
                                : 'text-gray-400 hover:text-[#00ff88] hover:bg-slate-800'
                              }`}
                            title="Toggle Admin / Operator Role"
                          >
                            <Shield className="w-4 h-4" />
                          </button>

                          {/* Toggle Status (Disable / Enable) */}
                          <button
                            onClick={() => handleToggleStatus(userItem)}
                            disabled={actionLoading || isCurrentUser}
                            className={`p-1.5 rounded-lg transition-colors ${isCurrentUser
                                ? 'text-gray-600 cursor-not-allowed'
                                : isUserDisabled
                                  ? 'text-emerald-400 hover:bg-emerald-500/10'
                                  : 'text-amber-400 hover:bg-amber-500/10'
                              }`}
                            title={isUserDisabled ? 'Enable Account' : 'Disable Account'}
                          >
                            {isUserDisabled ? <UserCheck className="w-4 h-4" /> : <UserX className="w-4 h-4" />}
                          </button>

                          {/* Delete Modal */}
                          <button
                            onClick={() => setDeletingUser(userItem)}
                            disabled={actionLoading || isCurrentUser}
                            className={`p-1.5 rounded-lg transition-colors ${isCurrentUser
                                ? 'text-gray-600 cursor-not-allowed'
                                : 'text-gray-400 hover:text-rose-400 hover:bg-rose-500/10'
                              }`}
                            title="Delete User Account"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                /* Professional Empty State */
                <tr>
                  <td colSpan={12} className="py-16 text-center">
                    <div className="flex flex-col items-center justify-center space-y-3">
                      <div className="w-12 h-12 rounded-2xl bg-slate-800/60 border border-slate-700 flex items-center justify-center text-gray-400">
                        <Users className="w-6 h-6" />
                      </div>
                      <h4 className="text-base font-bold text-white">No Users Found</h4>
                      <p className="text-xs text-gray-400 max-w-sm">
                        No directory accounts match your current search query or filter criteria.
                      </p>
                      {(searchQuery || roleFilter !== 'all' || statusFilter !== 'all') && (
                        <button
                          onClick={() => {
                            setSearchQuery('');
                            setRoleFilter('all');
                            setStatusFilter('all');
                          }}
                          className="mt-2 text-xs font-semibold text-[#00ff88] hover:underline"
                        >
                          Clear Filters & Search
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="p-4 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 bg-[#0d1424]/60 text-xs">

          {/* Left: Page Size Selector */}
          <div className="flex items-center gap-3 text-gray-400">
            <span>Rows per page:</span>
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="bg-[#0a0f1a] text-white px-2.5 py-1 rounded-lg border border-slate-800 focus:outline-none text-xs font-mono cursor-pointer"
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
            <span>
              Showing <strong className="text-white font-mono">{filteredCount > 0 ? startIndex + 1 : 0}</strong> to{' '}
              <strong className="text-white font-mono">{Math.min(startIndex + pageSize, filteredCount)}</strong> of{' '}
              <strong className="text-white font-mono">{filteredCount}</strong> users
            </span>
          </div>

          {/* Right: Page Navigation Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-1.5 rounded-lg bg-[#0a0f1a] text-gray-400 hover:text-white border border-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <span className="px-3 py-1 font-mono font-semibold text-gray-300">
              Page {currentPage} of {totalPages}
            </span>

            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage >= totalPages}
              className="p-1.5 rounded-lg bg-[#0a0f1a] text-gray-400 hover:text-white border border-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* User Detail Slide-Over Side Drawer (450–500px) */}
      {drawerUser && (
        <div className="fixed inset-0 z-50 overflow-hidden select-text">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-[#060a12]/80 backdrop-blur-sm transition-opacity"
            onClick={() => setDrawerUser(null)}
          />

          <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
            <div className="w-screen max-w-md md:max-w-lg bg-[#0d1424] border-l border-slate-800/90 shadow-2xl flex flex-col justify-between">

              {/* Drawer Header */}
              <div className="p-6 border-b border-slate-800/80 flex items-center justify-between bg-[#0a0f1a]">
                <div className="flex items-center gap-3 min-w-0">
                  <div className={`w-11 h-11 rounded-2xl bg-gradient-to-tr ${getAvatarBg(drawerUser.email || drawerUser.name)} border flex items-center justify-center font-bold text-sm font-mono shrink-0 shadow-md`}>
                    {getInitials(drawerUser.name || drawerUser.email)}
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-base font-bold text-white truncate">{drawerUser.name || 'User Profile'}</h3>
                    <p className="text-xs text-gray-400 truncate">{drawerUser.email}</p>
                  </div>
                </div>
                <button
                  onClick={() => setDrawerUser(null)}
                  className="p-2 text-gray-400 hover:text-white rounded-xl hover:bg-slate-800/80 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Drawer Tabs */}
              <div className="flex border-b border-slate-800/80 bg-[#0a0f1a]/50 px-6 pt-2">
                {[
                  { id: 'overview', label: 'Overview' },
                  { id: 'security', label: 'Security' },
                  { id: 'rooms', label: 'Grow Rooms' },
                  { id: 'sensors', label: 'Sensors' }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setDrawerTab(tab.id)}
                    className={`px-4 py-2.5 text-xs font-semibold border-b-2 transition-colors cursor-pointer ${drawerTab === tab.id
                        ? 'border-[#00ff88] text-[#00ff88]'
                        : 'border-transparent text-gray-400 hover:text-white'
                      }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Drawer Tab Contents */}
              <div className="p-6 overflow-y-auto custom-scrollbar flex-1 space-y-6">
                {drawerTab === 'overview' && (
                  <div className="space-y-4 text-xs">
                    <div className="p-4 rounded-xl bg-[#0a0f1a] border border-slate-800/80 space-y-3">
                      <div className="flex justify-between items-center pb-2 border-b border-slate-800/60">
                        <span className="text-gray-400">User ID</span>
                        <span className="font-mono text-white font-bold">{drawerUser.uid}</span>
                      </div>
                      <div className="flex justify-between items-center pb-2 border-b border-slate-800/60">
                        <span className="text-gray-400">Account Role</span>
                        <span className="font-bold text-[#00ff88] uppercase">{drawerUser.role || 'user'}</span>
                      </div>
                      <div className="flex justify-between items-center pb-2 border-b border-slate-800/60">
                        <span className="text-gray-400">Account Status</span>
                        <span className="font-bold text-emerald-400 uppercase">{drawerUser.status || 'active'}</span>
                      </div>
                      <div className="flex justify-between items-center pb-2 border-b border-slate-800/60">
                        <span className="text-gray-400">Phone Number</span>
                        <span className="font-mono text-gray-200">{drawerUser.phone || 'N/A'}</span>
                      </div>
                      <div className="flex justify-between items-center pb-2 border-b border-slate-800/60">
                        <span className="text-gray-400">Registration Date</span>
                        <span className="text-gray-200">{formatDate(drawerUser.createdAt)}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400">Last Active Session</span>
                        <span className="text-gray-200">{formatDate(drawerUser.lastLogin)}</span>
                      </div>
                    </div>
                  </div>
                )}

                {drawerTab === 'security' && (
                  <div className="space-y-4 text-xs">
                    <div className="p-4 rounded-xl bg-[#0a0f1a] border border-slate-800/80 space-y-3">
                      <h4 className="font-bold text-white text-sm">Security & Access Policy</h4>
                      <p className="text-gray-400 leading-relaxed">
                        Role permissions are synchronized via Firebase Auth Claims and Firestore security rules.
                      </p>
                      <div className="pt-2">
                        <span className="text-gray-400 block mb-1">Assigned Scope:</span>
                        <span className="inline-block px-3 py-1 rounded-lg bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 font-semibold">
                          {drawerUser.role === 'admin' ? 'Full Administrator (Read/Write/Delete)' : 'Operator Access (Telemetry & Controls)'}
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {drawerTab === 'rooms' && (
                  <div className="space-y-3 text-xs">
                    <h4 className="font-bold text-white text-sm">Assigned Grow Rooms</h4>
                    {['Hydroponics Alpha — Zone A', 'Greenhouse Sector 4'].map((room, i) => (
                      <div key={i} className="p-3 rounded-xl bg-[#0a0f1a] border border-slate-800 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Building2 className="w-4 h-4 text-[#00ff88]" />
                          <span className="font-bold text-white">{room}</span>
                        </div>
                        <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded font-bold border border-emerald-500/20">
                          Active
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                {drawerTab === 'sensors' && (
                  <div className="space-y-3 text-xs">
                    <h4 className="font-bold text-white text-sm">Active Telemetry Sensors</h4>
                    {['SENSOR-ZONE-A4', 'SENSOR-ZONE-B2', 'AIRFLOW-NODE-01'].map((sensor, i) => (
                      <div key={i} className="p-3 rounded-xl bg-[#0a0f1a] border border-slate-800 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Cpu className="w-4 h-4 text-blue-400" />
                          <span className="font-mono text-white">{sensor}</span>
                        </div>
                        <span className="text-[10px] text-gray-400 font-mono">Live Sync</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Drawer Footer Actions */}
              <div className="p-6 border-t border-slate-800/80 bg-[#0a0f1a] space-y-2">
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => {
                      setEditingUser(drawerUser);
                      setEditFormData({
                        name: drawerUser.name || '',
                        email: drawerUser.email || '',
                        phone: drawerUser.phone || ''
                      });
                    }}
                    className="w-full py-2 px-3 rounded-xl bg-[#131c2e] hover:bg-slate-800 text-white font-bold text-xs border border-slate-700 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Edit className="w-3.5 h-3.5 text-gray-300" />
                    Edit Profile
                  </button>
                  <button
                    onClick={() => handleRoleChange(drawerUser)}
                    disabled={currentUser?.uid === drawerUser.uid}
                    className="w-full py-2 px-3 rounded-xl bg-[#131c2e] hover:bg-slate-800 text-white font-bold text-xs border border-slate-700 disabled:opacity-40 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Shield className="w-3.5 h-3.5 text-[#00ff88]" />
                    Toggle Role
                  </button>
                </div>
                <button
                  onClick={() => handleToggleStatus(drawerUser)}
                  disabled={currentUser?.uid === drawerUser.uid}
                  className="w-full py-2 px-3 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 font-bold text-xs border border-amber-500/30 disabled:opacity-40 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  {drawerUser.status === 'disabled' ? 'Enable User Account' : 'Disable User Account'}
                </button>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      {editingUser && (
        <div className="fixed inset-0 z-50 bg-[#060a12]/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#131c2e] border border-slate-800 rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white">Edit User Profile</h3>
              <button onClick={() => setEditingUser(null)} className="text-gray-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleEditSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-gray-400 font-medium mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={editFormData.name}
                  onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                  className="w-full bg-[#0a0f1a] border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#00ff88]"
                />
              </div>
              <div>
                <label className="block text-gray-400 font-medium mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={editFormData.email}
                  onChange={(e) => setEditFormData({ ...editFormData, email: e.target.value })}
                  className="w-full bg-[#0a0f1a] border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#00ff88]"
                />
              </div>
              <div>
                <label className="block text-gray-400 font-medium mb-1">Phone Number</label>
                <input
                  type="text"
                  value={editFormData.phone}
                  onChange={(e) => setEditFormData({ ...editFormData, phone: e.target.value })}
                  className="w-full bg-[#0a0f1a] border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#00ff88]"
                />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingUser(null)}
                  className="px-4 py-2 rounded-xl bg-[#0a0f1a] text-gray-400 hover:text-white font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="px-4 py-2 rounded-xl bg-[#00ff88] text-black font-bold hover:bg-[#00ff88]/90 transition-colors cursor-pointer"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deletingUser && (
        <div className="fixed inset-0 z-50 bg-[#060a12]/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#131c2e] border border-rose-500/30 rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center gap-3 text-rose-400 border-b border-slate-800 pb-3">
              <AlertTriangle className="w-6 h-6 shrink-0" />
              <h3 className="text-base font-bold text-white">Delete User Account</h3>
            </div>
            <p className="text-xs text-gray-300 leading-relaxed">
              Are you sure you want to permanently delete user record{' '}
              <strong className="text-white font-mono">{deletingUser.email}</strong> from database? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDeletingUser(null)}
                className="px-4 py-2 rounded-xl bg-[#0a0f1a] text-gray-400 hover:text-white font-semibold cursor-pointer text-xs"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteConfirm}
                disabled={actionLoading}
                className="px-4 py-2 rounded-xl bg-rose-500 text-white font-bold hover:bg-rose-600 transition-colors cursor-pointer text-xs"
              >
                Permanently Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default AdminDashboardView;
