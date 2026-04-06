'use client';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { AuthProvider } from '@/context/AuthContext';
import { CheckCircle, ArrowRight, Star } from 'lucide-react';

const templates = [
  {
    id: 'classic',
    name: 'Classic Professional',
    description: 'Clean, traditional layout trusted by Fortune 500 recruiters. Perfect for experienced professionals.',
    tags: ['ATS Score: 95+', 'Most Popular'],
    color: 'primary',
    preview: {
      headerStyle: 'border-b-2 border-gray-800',
      accentColor: '#1E3A5C',
    },
  },
  {
    id: 'modern',
    name: 'Modern Minimal',
    description: 'Contemporary design with subtle accents. Great for tech, design, and startup roles.',
    tags: ['ATS Score: 92+', 'Tech Friendly'],
    color: 'blue',
    preview: {
      headerStyle: 'border-b-2 border-blue-500',
      accentColor: '#3B82F6',
    },
  },
  {
    id: 'executive',
    name: 'Executive',
    description: 'Authoritative layout for senior leadership and management positions. Commands attention.',
    tags: ['ATS Score: 90+', 'Leadership'],
    color: 'gray',
    preview: {
      headerStyle: 'border-b-4 border-gray-900',
      accentColor: '#111827',
    },
  },
];

function TemplatePreview({ template }) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 h-80 overflow-hidden" style={{ fontSize: '8px', lineHeight: '1.4' }}>
      {/* Mini resume preview */}
      <div className={`text-center pb-2 mb-3 ${template.preview.headerStyle}`}>
        <div style={{ fontSize: '14px', fontWeight: 'bold', letterSpacing: '1px', color: template.preview.accentColor }}>
          JOHN DOE
        </div>
        <div className="text-gray-500 mt-1" style={{ fontSize: '7px' }}>
          john@email.com | +91 98765 43210 | Mumbai, IN | linkedin.com/in/johndoe
        </div>
      </div>

      <div className="mb-2">
        <div style={{ fontSize: '9px', fontWeight: 'bold', textTransform: 'uppercase', color: template.preview.accentColor, borderBottom: '1px solid #e5e7eb', paddingBottom: '2px', marginBottom: '3px' }}>
          Professional Summary
        </div>
        <div className="text-gray-600">
          Results-driven software engineer with 5+ years of experience building scalable web applications. Expert in React, Node.js, and cloud architecture.
        </div>
      </div>

      <div className="mb-2">
        <div style={{ fontSize: '9px', fontWeight: 'bold', textTransform: 'uppercase', color: template.preview.accentColor, borderBottom: '1px solid #e5e7eb', paddingBottom: '2px', marginBottom: '3px' }}>
          Experience
        </div>
        <div>
          <div className="flex justify-between">
            <span style={{ fontWeight: 'bold' }}>Senior Software Engineer | Google</span>
            <span className="text-gray-400">2021 — Present</span>
          </div>
          <ul className="ml-3 text-gray-600" style={{ listStyleType: 'disc' }}>
            <li>Led team of 8 engineers delivering features for 2M+ users</li>
            <li>Reduced API latency by 40% through optimization</li>
          </ul>
        </div>
      </div>

      <div className="mb-2">
        <div style={{ fontSize: '9px', fontWeight: 'bold', textTransform: 'uppercase', color: template.preview.accentColor, borderBottom: '1px solid #e5e7eb', paddingBottom: '2px', marginBottom: '3px' }}>
          Skills
        </div>
        <div className="text-gray-600">
          React, Node.js, Python, AWS, Docker, SQL, TypeScript, REST APIs
        </div>
      </div>
    </div>
  );
}

function TemplatesContent() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="section-title">ATS-Friendly Templates</h1>
          <p className="section-subtitle">
            Every template is designed to score 90+ on ATS systems while looking professional to human recruiters
          </p>
        </div>

        {/* Templates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {templates.map((template) => (
            <div key={template.id} className="group">
              <div className="card hover:shadow-xl transition-all duration-300 overflow-hidden">
                {/* Preview */}
                <TemplatePreview template={template} />

                {/* Info */}
                <div className="mt-6">
                  <div className="flex items-center gap-2 mb-2">
                    {template.tags.map((tag, i) => (
                      <span
                        key={i}
                        className={`text-xs px-2 py-1 rounded-full font-medium ${
                          i === 0 ? 'bg-accent-100 text-accent-700' : 'bg-primary-100 text-primary-700'
                        }`}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <h3 className="font-display font-bold text-lg text-gray-900">{template.name}</h3>
                  <p className="text-sm text-gray-500 mt-1">{template.description}</p>
                </div>

                {/* Action */}
                <Link
                  href="/builder"
                  className="btn-primary w-full text-center mt-4 flex items-center justify-center gap-2"
                >
                  Use This Template
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Why ATS Templates */}
        <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-8 md:p-12">
          <div className="text-center mb-8">
            <h2 className="section-title text-2xl">Why ATS-Friendly Templates Matter</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-accent-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-gray-900 text-sm">75% of resumes are rejected by ATS</p>
                <p className="text-sm text-gray-500 mt-0.5">Our templates ensure you get past the first filter</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-accent-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-gray-900 text-sm">No fancy graphics or columns</p>
                <p className="text-sm text-gray-500 mt-0.5">ATS scanners cannot read images, tables, or multi-column layouts</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-accent-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-gray-900 text-sm">Standard section headings</p>
                <p className="text-sm text-gray-500 mt-0.5">ATS looks for &ldquo;Experience&rdquo;, &ldquo;Education&rdquo;, &ldquo;Skills&rdquo; — not creative alternatives</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-accent-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-gray-900 text-sm">Optimized for all major ATS</p>
                <p className="text-sm text-gray-500 mt-0.5">Tested with Workday, Taleo, Greenhouse, Lever, and more</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default function TemplatesPage() {
  return (
    <AuthProvider>
      <TemplatesContent />
    </AuthProvider>
  );
}
