import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { HiOutlineSearch, HiOutlineShieldCheck, HiOutlineUser, HiOutlineLockClosed, HiOutlineLockOpen } from 'react-icons/hi';
import { getUsers, updateUserRole, toggleUserStatus } from '../../api/userApi';
import { toast } from 'react-toastify';
import ConfirmModal from '../../components/ConfirmModal';

export default function AdminUsersPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [userToToggle, setUserToToggle] = useState(null);
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 10;

  useEffect(() => {
    const query = searchParams.get('search') || '';
    setSearch(query);
  }, [searchParams]);

  const fetchUsers = useCallback(async () => {
    setIsLoading(true);
    const res = await getUsers(search);
    if (res.success) {
      setUsers(res.users);
      // Reset to page 1 on new search
      if (search) setCurrentPage(1);
    } else {
      toast.error(res.error);
    }
    setIsLoading(false);
  }, [search]);

  useEffect(() => {
    // Debounce search
    const delayDebounceFn = setTimeout(() => {
      fetchUsers();
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [search, fetchUsers]);

  const handleRoleChange = async (userId, newRole) => {
    const res = await updateUserRole(userId, newRole);
    if (res.success) {
      toast.success('User role updated successfully');
      setUsers(users.map(u => u._id === userId ? { ...u, role: newRole } : u));
    } else {
      toast.error(res.error);
    }
  };

  const confirmToggleStatus = async () => {
    if (!userToToggle) return;

    const user = userToToggle;
    const action = user.isActive === false ? 'Enable' : 'Disable';

    const res = await toggleUserStatus(user._id);
    if (res.success) {
      toast.success(`User ${action}d successfully`);
      setUsers(users.map(u => u._id === user._id ? { ...u, isActive: res.user.isActive } : u));
      setUserToToggle(null);
    } else {
      toast.error(res.error);
    }
  };

  // Pagination Logic
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(users.length / usersPerPage);

  const paginate = (pageNumber) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & Search */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">User Management</h1>
          <p className="text-slate-400 text-sm mt-1">Manage system users, roles, and access.</p>
        </div>
        <div className="relative w-full sm:w-72">
          <input
            type="text"
            placeholder="Search users..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setSearchParams(e.target.value ? { search: e.target.value } : {});
            }}
            className="w-full bg-slate-900 border border-slate-700 text-white rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-colors placeholder:text-slate-500"
          />
          <HiOutlineSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl flex flex-col shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="text-xs text-slate-400 uppercase bg-slate-800/50">
              <tr>
                <th className="px-6 py-4 rounded-tl-lg font-semibold tracking-wider">User</th>
                <th className="px-6 py-4 font-semibold tracking-wider">Contact</th>
                <th className="px-6 py-4 font-semibold tracking-wider">Joined Date</th>
                <th className="px-6 py-4 font-semibold tracking-wider">Role</th>
                <th className="px-6 py-4 font-semibold tracking-wider">Status</th>
                <th className="px-6 py-4 rounded-tr-lg font-semibold tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {isLoading ? (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center text-slate-500">
                    <div className="flex justify-center items-center">
                      <div className="w-6 h-6 border-2 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  </td>
                </tr>
              ) : currentUsers.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center text-slate-500">
                    No users found matching your search.
                  </td>
                </tr>
              ) : (
                currentUsers.map(user => (
                  <tr key={user._id} className="hover:bg-slate-800/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center text-white font-bold shrink-0">
                          {user.fullname ? user.fullname.charAt(0).toUpperCase() : '?'}
                        </div>
                        <div>
                          <div className="font-medium text-white">{user.fullname}</div>
                          <div className="text-xs text-slate-500">@{user.username}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-slate-300">{user.email}</div>
                      <div className="text-xs text-slate-500">{user.phoneNumber || 'No phone'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-slate-400">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <select
                        value={user.role}
                        onChange={(e) => handleRoleChange(user._id, e.target.value)}
                        className={`text-xs font-semibold px-2.5 py-1 rounded-full outline-none cursor-pointer border ${
                          user.role === 'admin' 
                            ? 'bg-purple-500/10 text-purple-400 border-purple-500/20 hover:bg-purple-500/20' 
                            : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                        }`}
                      >
                        <option value="customer">Customer</option>
                        <option value="admin">Admin</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${
                        user.isActive !== false 
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                          : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${user.isActive !== false ? 'bg-emerald-400' : 'bg-rose-400'}`}></span>
                        {user.isActive !== false ? 'Active' : 'Disabled'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <button
                        onClick={() => setUserToToggle(user)}
                        title={user.isActive !== false ? "Disable User" : "Enable User"}
                        className={`p-2 rounded-lg transition-colors ${
                          user.isActive !== false
                            ? 'text-rose-400 hover:bg-rose-500/10'
                            : 'text-emerald-400 hover:bg-emerald-500/10'
                        }`}
                      >
                        {user.isActive !== false ? (
                          <HiOutlineLockClosed className="w-5 h-5" />
                        ) : (
                          <HiOutlineLockOpen className="w-5 h-5" />
                        )}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        {users.length > 0 && (
          <div className="p-4 border-t border-slate-800 flex items-center justify-between bg-slate-900/50 rounded-b-xl">
            <span className="text-xs text-slate-500">
              Showing {indexOfFirstUser + 1}-{Math.min(indexOfLastUser, users.length)} of {users.length}
            </span>
            <div className="flex gap-2">
              <button 
                onClick={() => paginate(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-1 text-sm rounded bg-slate-800 border border-slate-700 text-slate-300 hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Previous
              </button>
              <button 
                onClick={() => paginate(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-3 py-1 text-sm rounded bg-slate-800 border border-slate-700 text-slate-300 hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      <ConfirmModal
        isOpen={Boolean(userToToggle)}
        title={`${userToToggle?.isActive === false ? 'Enable' : 'Disable'} user?`}
        message={`${userToToggle?.isActive === false ? 'Enable' : 'Disable'} ${userToToggle?.fullname || 'this user'}'s account access?`}
        confirmText={userToToggle?.isActive === false ? 'Enable' : 'Disable'}
        variant={userToToggle?.isActive === false ? 'warning' : 'danger'}
        onCancel={() => setUserToToggle(null)}
        onConfirm={confirmToggleStatus}
      />
    </div>
  );
}
