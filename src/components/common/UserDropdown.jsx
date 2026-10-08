'use client';

import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { logoutAdmin } from '@/store/slices/adminAuthSlice';
import { FiLogOut } from 'react-icons/fi';

export default function UserDropdown() {
  const router = useRouter();
  const dispatch = useDispatch();

  const { isLoading } = useSelector((state) => state.adminAuth);
  const token = useSelector((state) => state.adminAuth.token);

  const handleLogout = async () => {
    try {
      const result = dispatch(logoutAdmin(token));

      result
        .then(() => {
          // Successfully logged out, redirect to login
          router.push('/login');
        })
        .catch((error) => {
          // Log error silently
          // Don't show alert, just log to console
        });
    } catch (error) {
      // Silently fail
    }
  };

  return (
    <div
      className="
        bg-white
        border border-gray-200
        rounded-lg shadow-md
        w-36
        z-50
        animate-in fade-in slide-in-from-top-2
        duration-200
        overflow-hidden
      "
      role="menu"
      aria-orientation="vertical"
    >
      {/* Logout Button */}
      <button
        onClick={handleLogout}
        disabled={isLoading}
        className="
          w-full px-4 py-3 text-left
          text-sm text-red-600
          hover:bg-red-50
          active:bg-red-100
          transition-colors duration-150
          flex items-center gap-3
          disabled:opacity-50 disabled:cursor-not-allowed
          focus:outline-none
        "
        role="menuitem"
      >
        <FiLogOut size={16} className="flex-shrink-0" />
        <span className="font-medium">{isLoading ? 'Logging out...' : 'Logout'}</span>
      </button>
    </div>
  );
}
