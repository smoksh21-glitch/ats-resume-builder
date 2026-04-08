'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { Menu, X, FileText, LogOut, LayoutDashboard, User } from 'lucide-react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <nav className="bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center">
              <FileText className="w-5 h-5 text-white" />
            </div>
            <span className="font-display font-bold text-xl text-gray-900">
              Resume<span className="text-primary-500">ATS</span> Pro
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <Link href="/#features" className="text-gray-600 hover:text-primary-500 transition-colors text-sm font-medium">
              Features
            </Link>
            <Link href="/#how-it-works" className="text-gray-600 hover:text-primary-500 transition-colors text-sm font-medium">
              How It Works
            </Link>
            <Link href="/#pricing" className="text-gray-600 hover:text-primary-500 transition-colors text-sm font-medium">
              Pricing
            </Link>
            <Link href="/templates" className="text-gray-600 hover:text-primary-500 transition-colors text-sm font-medium">
              Templates
            </Link>
          </div>

          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-3">
                <Link href="/dashboard" className="flex items-center gap-2 text-gray-600 hover:text-primary-500 transition-colors text-sm font-medium">
                  <LayoutDashboard className="w-4 h-4" />
                  Dashboard
                </Link>
                <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-primary-600" />
                </div>
                <button onClick={handleLogout} className="flex items-center gap-1 text-gray-500 hover:text-red-500 transition-colors text-sm">
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <>
                <Link href="/login" className="text-gray-600 hover:text-primary-500 transition-colors text-sm font-medium">
                  Log in
                </Link>
                <Link href="/signup" className="btn-primary text-sm !py-2 !px-4">
                  Get Started Free
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button className="md:hidden p-2" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden py-4 border-t border-gray-100">
            <div className="flex flex-col gap-3">
              <Link href="/#features" className="text-gray-600 hover:text-primary-500 px-2 py-2 text-sm font-medium" onClick={() => setIsOpen(false)}>
                Features
              </Link>
              <Link href="/#how-it-works" className="text-gray-600 hover:text-primary-500 px-2 py-2 text-sm font-medium" onClick={() => setIsOpen(false)}>
                How It Works
              </Link>
              <Link href="/#pricing" className="text-gray-600 hover:text-primary-500 px-2 py-2 text-sm font-medium" onClick={() => setIsOpen(false)}>
                Pricing
              </Link>
              <Link href="/templates" className="text-gray-600 hover:text-primary-500 px-2 py-2 text-sm font-medium" onClick={() => setIsOpen(false)}>
                Templates
              </Link>
              <hr className="border-gray-100" />
              {user ? (
                <>
                  <Link href="/dashboard" className="text-gray-600 hover:text-primary-500 px-2 py-2 text-sm font-medium" onClick={() => setIsOpen(false)}>
                    Dashboard
                  </Link>
                  <button onClick={handleLogout} className="text-left text-red-500 px-2 py-2 text-sm font-medium">
                    Log out
                  </button>
                </>
              ) : (
                <>
                  <Link href="/login" className="text-gray-600 hover:text-primary-500 px-2 py-2 text-sm font-medium" onClick={() => setIsOpen(false)}>
                    Log in
                  </Link>
                  <Link href="/signup" className="btn-primary text-sm text-center" onClick={() => setIsOpen(false)}>
                    Get Started Free
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
