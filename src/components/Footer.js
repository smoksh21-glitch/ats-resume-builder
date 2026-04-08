import Link from 'next/link';
import { FileText, Mail, Shield, CreditCard } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-white" />
              </div>
              <span className="font-display font-bold text-lg text-white">
                Resume<span className="text-primary-400">ATS</span> Pro
              </span>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed">
              Build ATS-friendly resumes that get you hired. AI-powered, recruiter-approved.
            </p>
          </div>

          {/* Product */}
          <div>
            <h4 className="font-semibold text-white mb-4 text-sm uppercase tracking-wider">Product</h4>
            <ul className="space-y-3 text-sm">
              <li><Link href="/score-checker" className="hover:text-primary-400 transition-colors">ATS Score Checker</Link></li>
              <li><Link href="/builder" className="hover:text-primary-400 transition-colors">Resume Builder</Link></li>
              <li><Link href="/templates" className="hover:text-primary-400 transition-colors">Templates</Link></li>
              <li><Link href="/#pricing" className="hover:text-primary-400 transition-colors">Pricing</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-semibold text-white mb-4 text-sm uppercase tracking-wider">Support</h4>
            <ul className="space-y-3 text-sm">
              <li><Link href="/contact" className="hover:text-primary-400 transition-colors">Contact Us</Link></li>
              <li><Link href="/faq" className="hover:text-primary-400 transition-colors">FAQ</Link></li>
              <li><Link href="/privacy" className="hover:text-primary-400 transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-primary-400 transition-colors">Terms of Service</Link></li>
            </ul>
          </div>

          {/* Trust Badges */}
          <div>
            <h4 className="font-semibold text-white mb-4 text-sm uppercase tracking-wider">Trust & Security</h4>
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm">
                <Shield className="w-4 h-4 text-accent-500" />
                <span>SSL Encrypted</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <CreditCard className="w-4 h-4 text-accent-500" />
                <span>Razorpay Certified</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Mail className="w-4 h-4 text-accent-500" />
                <span>support@resumeatspro.com</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8 text-center text-sm text-gray-500">
          <p>&copy; {new Date().getFullYear()} ResumeATS Pro. All rights reserved. Built with AI.</p>
        </div>
      </div>
    </footer>
  );
}
