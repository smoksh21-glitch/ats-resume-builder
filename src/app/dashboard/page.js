'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ProtectedRoute from '@/components/ProtectedRoute';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import { db } from '@/lib/firebase';
import { doc, getDoc, collection, query, where, orderBy, getDocs } from 'firebase/firestore';
import {
  LayoutDashboard, FileText, Upload, CreditCard, Sparkles,
  Clock, CheckCircle, ArrowRight, BarChart3, Plus, Eye,
  Download, TrendingUp, User, Star
} from 'lucide-react';
import toast from 'react-hot-toast';

function DashboardContent() {
  const { user, userProfile } = useAuth();
  const [stats, setStats] = useState({
    resumesChecked: 0,
    editsUsed: 0,
    editsAvailable: 0,
    avgScore: 0,
  });
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!user) return;

      try {
        // Fetch user profile for stats
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          const data = userDoc.data();
          setStats({
            resumesChecked: data.resumesChecked || 0,
            editsUsed: data.freeEditsUsed || 0,
            editsAvailable: data.totalEditsAvailable || 0,
            avgScore: data.avgScore || 0,
          });
        }

        // Fetch recent resumes
        try {
          const resumesRef = collection(db, 'resumes');
          const q = query(
            resumesRef,
            where('userId', '==', user.uid),
            orderBy('createdAt', 'desc')
          );
          const querySnapshot = await getDocs(q);
          const resumes = [];
          querySnapshot.forEach((doc) => {
            resumes.push({ id: doc.id, ...doc.data() });
          });
          setRecentActivity(resumes.slice(0, 5));
        } catch (e) {
          // Collection may not exist yet
          setRecentActivity([]);
        }
      } catch (error) {
        console.error('Dashboard data error:', error);
      }
      setLoading(false);
    };

    fetchDashboardData();
  }, [user]);

  // Payment handler
  const handlePayment = async () => {
    try {
      const response = await fetch('/api/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.uid,
          email: user.email,
        }),
      });

      if (!response.ok) throw new Error('Order creation failed');
      const data = await response.json();

      const options = {
        key: data.keyId,
        amount: data.amount,
        currency: data.currency,
        name: 'ResumeATS Pro',
        description: '2 AI-Powered Resume Edits',
        order_id: data.orderId,
        handler: async function (response) {
          const verifyRes = await fetch('/api/verify-payment', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              userId: user.uid,
            }),
          });
          const verifyData = await verifyRes.json();
          if (verifyData.success) {
            toast.success('Payment successful! 2 edits added.');
            setStats(prev => ({ ...prev, editsAvailable: prev.editsAvailable + 2 }));
          }
        },
        prefill: { email: user.email, name: user.displayName },
        theme: { color: '#4A90E2' },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      toast.error('Payment failed. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <script src="https://checkout.razorpay.com/v1/checkout.js" async />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="font-display font-bold text-2xl text-gray-900">
              Welcome back, {user?.displayName?.split(' ')[0] || 'there'}!
            </h1>
            <p className="text-gray-500 text-sm mt-1">Here&apos;s your resume optimization overview</p>
          </div>
          <div className="flex gap-3">
            <Link href="/score-checker" className="btn-secondary flex items-center gap-2 text-sm !py-2">
              <Upload className="w-4 h-4" />
              Check Score
            </Link>
            <Link href="/builder" className="btn-primary flex items-center gap-2 text-sm !py-2">
              <Plus className="w-4 h-4" />
              Build Resume
            </Link>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Resumes Checked</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{stats.resumesChecked}</p>
              </div>
              <div className="w-12 h-12 bg-primary-50 rounded-xl flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-primary-500" />
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Avg ATS Score</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{stats.avgScore || '—'}</p>
              </div>
              <div className="w-12 h-12 bg-accent-50 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-accent-500" />
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Edits Used</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{stats.editsUsed}</p>
              </div>
              <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-purple-500" />
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Edits Available</p>
                <p className="text-3xl font-bold text-primary-500 mt-1">{stats.editsAvailable}</p>
              </div>
              <div className="w-12 h-12 bg-primary-50 rounded-xl flex items-center justify-center">
                <CreditCard className="w-6 h-6 text-primary-500" />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Quick Actions */}
            <div className="card">
              <h2 className="font-display font-semibold text-lg text-gray-900 mb-4">Quick Actions</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Link
                  href="/score-checker"
                  className="flex flex-col items-center gap-3 p-4 rounded-xl border-2 border-gray-100 hover:border-primary-200 hover:bg-primary-50 transition-all group"
                >
                  <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center group-hover:bg-primary-500 group-hover:text-white transition-all">
                    <Upload className="w-6 h-6 text-primary-500 group-hover:text-white" />
                  </div>
                  <span className="text-sm font-medium text-gray-700">Check ATS Score</span>
                </Link>

                <Link
                  href="/builder"
                  className="flex flex-col items-center gap-3 p-4 rounded-xl border-2 border-gray-100 hover:border-primary-200 hover:bg-primary-50 transition-all group"
                >
                  <div className="w-12 h-12 bg-accent-100 rounded-xl flex items-center justify-center group-hover:bg-accent-500 group-hover:text-white transition-all">
                    <FileText className="w-6 h-6 text-accent-500 group-hover:text-white" />
                  </div>
                  <span className="text-sm font-medium text-gray-700">Build Resume</span>
                </Link>

                <Link
                  href="/templates"
                  className="flex flex-col items-center gap-3 p-4 rounded-xl border-2 border-gray-100 hover:border-primary-200 hover:bg-primary-50 transition-all group"
                >
                  <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center group-hover:bg-purple-500 group-hover:text-white transition-all">
                    <Eye className="w-6 h-6 text-purple-500 group-hover:text-white" />
                  </div>
                  <span className="text-sm font-medium text-gray-700">View Templates</span>
                </Link>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="card">
              <h2 className="font-display font-semibold text-lg text-gray-900 mb-4">Recent Activity</h2>
              {recentActivity.length > 0 ? (
                <div className="space-y-3">
                  {recentActivity.map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                          <FileText className="w-5 h-5 text-primary-500" />
                        </div>
                        <div>
                          <p className="font-medium text-sm text-gray-900">{item.fileName || 'Resume'}</p>
                          <p className="text-xs text-gray-400">
                            Score: {item.score || 'N/A'} | {item.createdAt?.toDate?.()?.toLocaleDateString() || 'Recently'}
                          </p>
                        </div>
                      </div>
                      <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                        (item.score || 0) >= 75
                          ? 'bg-accent-100 text-accent-700'
                          : 'bg-amber-100 text-amber-700'
                      }`}>
                        {(item.score || 0) >= 75 ? 'ATS Ready' : 'Needs Work'}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <FileText className="w-12 h-12 text-gray-200 mx-auto mb-3" />
                  <p className="text-gray-400 text-sm">No resumes checked yet</p>
                  <Link href="/score-checker" className="text-primary-500 text-sm font-medium hover:underline mt-2 inline-block">
                    Check your first resume
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Profile Card */}
            <div className="card">
              <div className="text-center">
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <User className="w-8 h-8 text-primary-500" />
                </div>
                <h3 className="font-semibold text-gray-900">{user?.displayName || 'User'}</h3>
                <p className="text-sm text-gray-400">{user?.email}</p>
              </div>
            </div>

            {/* Buy Edits */}
            <div className="card bg-gradient-to-br from-primary-500 to-primary-600 text-white">
              <h3 className="font-display font-bold text-lg mb-2">Need More Edits?</h3>
              <p className="text-primary-100 text-sm mb-4">
                Get 2 AI-powered resume edits to boost your ATS score above 75.
              </p>
              <div className="text-3xl font-bold mb-4">
                ₹120 <span className="text-sm font-normal text-primary-200">/ 2 edits</span>
              </div>
              <button
                onClick={handlePayment}
                className="w-full bg-white text-primary-600 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
              >
                <CreditCard className="w-4 h-4" />
                Buy Now
              </button>
            </div>

            {/* Tips */}
            <div className="card">
              <h3 className="font-display font-semibold text-gray-900 mb-3">ATS Tips</h3>
              <div className="space-y-3">
                <div className="flex items-start gap-2">
                  <Star className="w-4 h-4 text-yellow-500 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-gray-600">Use standard section headings like &ldquo;Experience&rdquo; and &ldquo;Education&rdquo;</p>
                </div>
                <div className="flex items-start gap-2">
                  <Star className="w-4 h-4 text-yellow-500 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-gray-600">Include keywords from the job description</p>
                </div>
                <div className="flex items-start gap-2">
                  <Star className="w-4 h-4 text-yellow-500 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-gray-600">Avoid tables, images, and fancy formatting</p>
                </div>
                <div className="flex items-start gap-2">
                  <Star className="w-4 h-4 text-yellow-500 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-gray-600">Quantify achievements with numbers and percentages</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default function DashboardPage() {
  return (
    <AuthProvider>
      <ProtectedRoute>
        <DashboardContent />
      </ProtectedRoute>
    </AuthProvider>
  );
}
