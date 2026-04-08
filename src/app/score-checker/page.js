'use client';
import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ScoreGauge from '@/components/ScoreGauge';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import {
  Upload, FileText, CheckCircle, XCircle, AlertTriangle,
  ArrowRight, Sparkles, RefreshCw, Loader2
} from 'lucide-react';
import toast from 'react-hot-toast';

function ScoreCheckerContent() {
  const [file, setFile] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState(null);
  const { user } = useAuth();

  const onDrop = useCallback((acceptedFiles) => {
    const uploadedFile = acceptedFiles[0];
    if (uploadedFile) {
      const validTypes = [
        'application/pdf',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/msword',
      ];
      if (!validTypes.includes(uploadedFile.type)) {
        toast.error('Please upload a PDF or DOCX file');
        return;
      }
      if (uploadedFile.size > 5 * 1024 * 1024) {
        toast.error('File size must be under 5MB');
        return;
      }
      setFile(uploadedFile);
      setResult(null);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
    },
    maxFiles: 1,
  });

  const analyzeResume = async () => {
    if (!file) {
      toast.error('Please upload a resume first');
      return;
    }

    setAnalyzing(true);
    try {
      const formData = new FormData();
      formData.append('resume', file);

      const response = await fetch('/api/analyze-resume', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Analysis failed');
      }

      const data = await response.json();
      setResult(data);
    } catch (error) {
      toast.error('Failed to analyze resume. Please try again.');
      console.error('Analysis error:', error);
    }
    setAnalyzing(false);
  };

  const resetChecker = () => {
    setFile(null);
    setResult(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="section-title">ATS Resume Score Checker</h1>
          <p className="section-subtitle">
            Upload your resume and get an instant ATS compatibility score with detailed improvement suggestions
          </p>
        </div>

        {!result ? (
          /* Upload Section */
          <div className="max-w-2xl mx-auto">
            <div className="card">
              {/* Dropzone */}
              <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-all duration-200 ${
                  isDragActive
                    ? 'border-primary-500 bg-primary-50'
                    : file
                    ? 'border-accent-500 bg-accent-50'
                    : 'border-gray-300 hover:border-primary-400 hover:bg-gray-50'
                }`}
              >
                <input {...getInputProps()} />
                {file ? (
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-16 h-16 bg-accent-100 rounded-full flex items-center justify-center">
                      <FileText className="w-8 h-8 text-accent-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{file.name}</p>
                      <p className="text-sm text-gray-400">
                        {(file.size / 1024).toFixed(1)} KB
                      </p>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setFile(null);
                      }}
                      className="text-sm text-red-500 hover:underline"
                    >
                      Remove and upload different file
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-16 h-16 bg-primary-50 rounded-full flex items-center justify-center">
                      <Upload className="w-8 h-8 text-primary-500" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">
                        {isDragActive ? 'Drop your resume here' : 'Drag & drop your resume here'}
                      </p>
                      <p className="text-sm text-gray-400 mt-1">
                        or click to browse — PDF or DOCX, max 5MB
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Analyze Button */}
              <button
                onClick={analyzeResume}
                disabled={!file || analyzing}
                className={`w-full mt-6 flex items-center justify-center gap-2 py-4 rounded-xl font-semibold text-lg transition-all ${
                  file && !analyzing
                    ? 'btn-primary'
                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                }`}
              >
                {analyzing ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Analyzing your resume with AI...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    Check ATS Score — Free
                  </>
                )}
              </button>

              {/* Info */}
              <div className="mt-6 flex items-start gap-3 p-4 bg-blue-50 rounded-lg">
                <AlertTriangle className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-blue-700">
                  <p className="font-medium">How ATS scoring works</p>
                  <p className="mt-1 text-blue-600">
                    We analyze your resume against 50+ ATS criteria including formatting,
                    keywords, section structure, and readability. A score of 75+ means your
                    resume will pass most ATS systems.
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Results Section */
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Score Card */}
            <div className="lg:col-span-1">
              <div className="card text-center sticky top-24">
                <h2 className="font-display font-bold text-lg text-gray-900 mb-6">Your ATS Score</h2>
                <ScoreGauge score={result.score} size={180} />

                <div className="mt-6 space-y-2">
                  {result.score >= 75 ? (
                    <div className="flex items-center justify-center gap-2 text-accent-600 font-medium">
                      <CheckCircle className="w-5 h-5" />
                      Your resume is ATS-ready!
                    </div>
                  ) : (
                    <div className="flex items-center justify-center gap-2 text-amber-600 font-medium">
                      <AlertTriangle className="w-5 h-5" />
                      Needs improvement to pass ATS
                    </div>
                  )}
                </div>

                <div className="mt-6 space-y-3">
                  {result.score < 75 && (
                    <Link
                      href={user ? '/builder' : '/signup'}
                      className="btn-primary w-full flex items-center justify-center gap-2"
                    >
                      <Sparkles className="w-4 h-4" />
                      Fix My Resume — ₹120
                    </Link>
                  )}
                  <button
                    onClick={resetChecker}
                    className="btn-secondary w-full flex items-center justify-center gap-2"
                  >
                    <RefreshCw className="w-4 h-4" />
                    Check Another Resume
                  </button>
                </div>
              </div>
            </div>

            {/* Detailed Results */}
            <div className="lg:col-span-2 space-y-6">
              {/* Category Scores */}
              <div className="card">
                <h3 className="font-display font-semibold text-lg text-gray-900 mb-4">Score Breakdown</h3>
                <div className="space-y-4">
                  {result.categories && result.categories.map((cat, index) => (
                    <div key={index}>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm font-medium text-gray-700">{cat.name}</span>
                        <span className={`text-sm font-bold ${
                          cat.score >= 75 ? 'text-accent-600' : cat.score >= 50 ? 'text-amber-600' : 'text-red-500'
                        }`}>
                          {cat.score}/100
                        </span>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full transition-all duration-500 ${
                            cat.score >= 75 ? 'bg-accent-500' : cat.score >= 50 ? 'bg-amber-500' : 'bg-red-500'
                          }`}
                          style={{ width: `${cat.score}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Issues Found */}
              {result.issues && result.issues.length > 0 && (
                <div className="card">
                  <h3 className="font-display font-semibold text-lg text-gray-900 mb-4">
                    Issues Found ({result.issues.length})
                  </h3>
                  <div className="space-y-3">
                    {result.issues.map((issue, index) => (
                      <div key={index} className={`flex items-start gap-3 p-3 rounded-lg ${
                        issue.severity === 'critical' ? 'bg-red-50' : issue.severity === 'warning' ? 'bg-amber-50' : 'bg-blue-50'
                      }`}>
                        {issue.severity === 'critical' ? (
                          <XCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                        ) : issue.severity === 'warning' ? (
                          <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                        ) : (
                          <AlertTriangle className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                        )}
                        <div>
                          <p className="font-medium text-sm text-gray-900">{issue.title}</p>
                          <p className="text-sm text-gray-600 mt-0.5">{issue.description}</p>
                          {issue.fix && (
                            <p className="text-sm text-primary-600 mt-1 font-medium">Fix: {issue.fix}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Suggestions */}
              {result.suggestions && result.suggestions.length > 0 && (
                <div className="card">
                  <h3 className="font-display font-semibold text-lg text-gray-900 mb-4">
                    AI Suggestions to Reach 75+
                  </h3>
                  <div className="space-y-3">
                    {result.suggestions.map((suggestion, index) => (
                      <div key={index} className="flex items-start gap-3 p-3 bg-primary-50 rounded-lg">
                        <Sparkles className="w-5 h-5 text-primary-500 flex-shrink-0 mt-0.5" />
                        <p className="text-sm text-gray-700">{suggestion}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* CTA */}
              {result.score < 75 && (
                <div className="card bg-gradient-to-r from-primary-500 to-primary-600 text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-display font-bold text-lg">Want to fix all these issues?</h3>
                      <p className="text-primary-100 text-sm mt-1">
                        Get 2 AI-powered resume edits for just ₹120 (~$1.50)
                      </p>
                    </div>
                    <Link
                      href={user ? '/builder' : '/signup'}
                      className="bg-white text-primary-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors flex items-center gap-2 flex-shrink-0"
                    >
                      Fix Now
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

export default function ScoreCheckerPage() {
  return (
    <AuthProvider>
      <ScoreCheckerContent />
    </AuthProvider>
  );
}
