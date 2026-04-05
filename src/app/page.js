'use client';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { AuthProvider } from '@/context/AuthContext';
import {
  FileText, Upload, Sparkles, Download, CheckCircle, ArrowRight,
  Shield, Zap, Target, BarChart3, Star, Users, Clock, CreditCard
} from 'lucide-react';

function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary-50 via-white to-primary-50">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiM0QTkwRTIiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-50"></div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32 relative">
        <div className="text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-primary-100 text-primary-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Sparkles className="w-4 h-4" />
            AI-Powered ATS Resume Builder
          </div>
          <h1 className="font-display text-4xl md:text-6xl lg:text-7xl font-bold text-gray-900 leading-tight">
            Build ATS-Friendly Resumes
            <span className="text-primary-500 block mt-2">That Get You Hired</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-500 mt-6 max-w-2xl mx-auto leading-relaxed">
            Upload your resume, check your ATS score, and get AI-powered suggestions to reach 75+ score. Land more interviews with recruiter-approved resumes.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-10">
            <Link href="/score-checker" className="btn-primary text-lg !px-8 !py-4 flex items-center justify-center gap-2">
              <Upload className="w-5 h-5" />
              Check Your ATS Score — Free
            </Link>
            <Link href="/builder" className="btn-secondary text-lg !px-8 !py-4 flex items-center justify-center gap-2">
              Build Resume
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
          <div className="flex items-center justify-center gap-6 mt-8 text-sm text-gray-400">
            <span className="flex items-center gap-1"><CheckCircle className="w-4 h-4 text-accent-500" /> Free Score Check</span>
            <span className="flex items-center gap-1"><CheckCircle className="w-4 h-4 text-accent-500" /> AI-Powered</span>
            <span className="flex items-center gap-1"><CheckCircle className="w-4 h-4 text-accent-500" /> ATS Optimized</span>
          </div>
        </div>

        {/* Hero Visual */}
        <div className="mt-16 max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">
            <div className="bg-gray-50 px-6 py-3 flex items-center gap-2 border-b">
              <div className="w-3 h-3 rounded-full bg-red-400"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
              <div className="w-3 h-3 rounded-full bg-green-400"></div>
              <span className="ml-4 text-xs text-gray-400">resumeatspro.com/builder</span>
            </div>
            <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div className="h-4 bg-primary-100 rounded w-3/4"></div>
                <div className="h-3 bg-gray-100 rounded w-full"></div>
                <div className="h-3 bg-gray-100 rounded w-5/6"></div>
                <div className="h-8 bg-primary-50 rounded w-full mt-4"></div>
                <div className="h-3 bg-gray-100 rounded w-full"></div>
                <div className="h-3 bg-gray-100 rounded w-4/5"></div>
                <div className="h-3 bg-gray-100 rounded w-full"></div>
                <div className="h-8 bg-primary-50 rounded w-full mt-4"></div>
                <div className="h-3 bg-gray-100 rounded w-3/4"></div>
                <div className="h-3 bg-gray-100 rounded w-5/6"></div>
              </div>
              <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-semibold text-gray-700">ATS Score</span>
                  <span className="text-2xl font-bold text-accent-500">87/100</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div className="bg-accent-500 h-3 rounded-full" style={{ width: '87%' }}></div>
                </div>
                <div className="mt-6 space-y-3">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-accent-500" />
                    <span className="text-sm text-gray-600">Clean formatting</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-accent-500" />
                    <span className="text-sm text-gray-600">Keywords optimized</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-accent-500" />
                    <span className="text-sm text-gray-600">ATS-friendly layout</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function FeaturesSection() {
  const features = [
    {
      icon: <Target className="w-6 h-6" />,
      title: 'ATS Score Checker',
      description: 'Upload your resume and get an instant ATS compatibility score. Know exactly where you stand before applying.',
    },
    {
      icon: <Sparkles className="w-6 h-6" />,
      title: 'AI-Powered Suggestions',
      description: 'Get intelligent recommendations to improve your resume content, keywords, and formatting for maximum ATS compatibility.',
    },
    {
      icon: <BarChart3 className="w-6 h-6" />,
      title: 'Score 75+ Guarantee',
      description: 'Our AI ensures your resume reaches a minimum 75 ATS score — the threshold most companies use to filter candidates.',
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: 'Ready in 5 Minutes',
      description: 'No complicated forms. Upload, enhance, download. Our streamlined process gets your polished resume ready fast.',
    },
    {
      icon: <FileText className="w-6 h-6" />,
      title: 'ATS-Friendly Templates',
      description: 'Clean, minimal templates designed specifically to pass ATS scanners while still looking professional to human recruiters.',
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: 'Secure & Private',
      description: 'Your data is encrypted and never shared. We take your privacy seriously — your resume content stays yours.',
    },
  ];

  return (
    <section id="features" className="py-20 md:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="section-title">Everything You Need to Beat ATS</h2>
          <p className="section-subtitle">Most resumes get rejected by ATS before a human ever sees them. We fix that.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="card hover:shadow-lg transition-shadow duration-300 group">
              <div className="w-12 h-12 bg-primary-50 rounded-xl flex items-center justify-center text-primary-500 mb-4 group-hover:bg-primary-500 group-hover:text-white transition-all duration-300">
                {feature.icon}
              </div>
              <h3 className="font-display font-semibold text-lg text-gray-900 mb-2">{feature.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function HowItWorksSection() {
  const steps = [
    {
      step: '01',
      icon: <Upload className="w-8 h-8" />,
      title: 'Upload Your Resume',
      description: 'Upload your existing resume in PDF or DOCX format. Our AI analyzes it instantly against ATS standards.',
    },
    {
      step: '02',
      icon: <Sparkles className="w-8 h-8" />,
      title: 'Get Your ATS Score & Fixes',
      description: 'See your score out of 100 with detailed suggestions. Our AI tells you exactly what to fix to reach 75+.',
    },
    {
      step: '03',
      icon: <Download className="w-8 h-8" />,
      title: 'Download & Apply',
      description: 'Pay ₹120 for 2 AI-enhanced resume edits. Download your optimized, ATS-friendly resume and start applying.',
    },
  ];

  return (
    <section id="how-it-works" className="py-20 md:py-28 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="section-title">How It Works</h2>
          <p className="section-subtitle">Three simple steps to an ATS-optimized resume</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((item, index) => (
            <div key={index} className="relative text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-primary-500 rounded-2xl text-white mb-6 shadow-lg shadow-primary-200">
                {item.icon}
              </div>
              <div className="text-xs font-bold text-primary-500 mb-2">STEP {item.step}</div>
              <h3 className="font-display font-semibold text-xl text-gray-900 mb-3">{item.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed max-w-xs mx-auto">{item.description}</p>
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-10 right-0 translate-x-1/2">
                  <ArrowRight className="w-6 h-6 text-primary-300" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function PricingSection() {
  return (
    <section id="pricing" className="py-20 md:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="section-title">Simple, Transparent Pricing</h2>
          <p className="section-subtitle">Check your ATS score free. Pay only when you want AI-powered edits.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Free Tier */}
          <div className="card border-2 border-gray-200">
            <div className="text-center">
              <h3 className="font-display font-bold text-xl text-gray-900 mb-2">Free</h3>
              <div className="text-4xl font-bold text-gray-900 mb-1">₹0</div>
              <p className="text-gray-400 text-sm">No credit card required</p>
            </div>
            <ul className="mt-8 space-y-4">
              <li className="flex items-center gap-3 text-sm text-gray-600">
                <CheckCircle className="w-5 h-5 text-accent-500 flex-shrink-0" />
                Upload resume & check ATS score
              </li>
              <li className="flex items-center gap-3 text-sm text-gray-600">
                <CheckCircle className="w-5 h-5 text-accent-500 flex-shrink-0" />
                See detailed improvement suggestions
              </li>
              <li className="flex items-center gap-3 text-sm text-gray-600">
                <CheckCircle className="w-5 h-5 text-accent-500 flex-shrink-0" />
                View ATS-friendly templates
              </li>
            </ul>
            <Link href="/score-checker" className="btn-secondary w-full text-center mt-8 block">
              Check Score Free
            </Link>
          </div>

          {/* Pro Tier */}
          <div className="card border-2 border-primary-500 relative">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary-500 text-white px-4 py-1 rounded-full text-xs font-bold">
              MOST POPULAR
            </div>
            <div className="text-center">
              <h3 className="font-display font-bold text-xl text-gray-900 mb-2">Pro</h3>
              <div className="text-4xl font-bold text-primary-500 mb-1">₹120 <span className="text-lg text-gray-400 font-normal">/ ~$1.50</span></div>
              <p className="text-gray-400 text-sm">Per package of 2 edits</p>
            </div>
            <ul className="mt-8 space-y-4">
              <li className="flex items-center gap-3 text-sm text-gray-600">
                <CheckCircle className="w-5 h-5 text-accent-500 flex-shrink-0" />
                Everything in Free
              </li>
              <li className="flex items-center gap-3 text-sm text-gray-600">
                <CheckCircle className="w-5 h-5 text-accent-500 flex-shrink-0" />
                2 AI-powered resume edits
              </li>
              <li className="flex items-center gap-3 text-sm text-gray-600">
                <CheckCircle className="w-5 h-5 text-accent-500 flex-shrink-0" />
                AI summary & bullet point enhancer
              </li>
              <li className="flex items-center gap-3 text-sm text-gray-600">
                <CheckCircle className="w-5 h-5 text-accent-500 flex-shrink-0" />
                ATS keyword optimization
              </li>
              <li className="flex items-center gap-3 text-sm text-gray-600">
                <CheckCircle className="w-5 h-5 text-accent-500 flex-shrink-0" />
                Download as PDF
              </li>
              <li className="flex items-center gap-3 text-sm text-gray-600">
                <CheckCircle className="w-5 h-5 text-accent-500 flex-shrink-0" />
                Need more? Buy another pack for ₹120
              </li>
            </ul>
            <Link href="/signup" className="btn-primary w-full text-center mt-8 block">
              Get Started
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

function StatsSection() {
  return (
    <section className="py-16 bg-primary-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center text-white">
          <div>
            <div className="text-3xl md:text-4xl font-bold">10,000+</div>
            <div className="text-primary-200 text-sm mt-1">Resumes Optimized</div>
          </div>
          <div>
            <div className="text-3xl md:text-4xl font-bold">85%</div>
            <div className="text-primary-200 text-sm mt-1">Interview Rate</div>
          </div>
          <div>
            <div className="text-3xl md:text-4xl font-bold">75+</div>
            <div className="text-primary-200 text-sm mt-1">Avg ATS Score</div>
          </div>
          <div>
            <div className="text-3xl md:text-4xl font-bold">5 min</div>
            <div className="text-primary-200 text-sm mt-1">Average Time</div>
          </div>
        </div>
      </div>
    </section>
  );
}

function TestimonialsSection() {
  const testimonials = [
    {
      name: 'Priya Sharma',
      role: 'Software Engineer, Bengaluru',
      text: 'My resume score went from 42 to 89 in minutes. Got 3 interview calls within a week of using the optimized resume!',
      rating: 5,
    },
    {
      name: 'Rahul Verma',
      role: 'Marketing Manager, Mumbai',
      text: 'The ATS score checker showed me exactly what was wrong with my resume. The AI suggestions were spot-on. Worth every rupee!',
      rating: 5,
    },
    {
      name: 'Ananya Patel',
      role: 'Fresh Graduate, Delhi',
      text: 'As a fresher, I had no idea about ATS. This tool helped me create a professional resume that actually gets past the filters.',
      rating: 5,
    },
  ];

  return (
    <section className="py-20 md:py-28 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="section-title">Loved by Job Seekers</h2>
          <p className="section-subtitle">See what our users say about their experience</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((item, index) => (
            <div key={index} className="card">
              <div className="flex gap-1 mb-4">
                {[...Array(item.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="text-gray-600 text-sm leading-relaxed mb-6">&ldquo;{item.text}&rdquo;</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                  <Users className="w-5 h-5 text-primary-500" />
                </div>
                <div>
                  <div className="font-semibold text-sm text-gray-900">{item.name}</div>
                  <div className="text-xs text-gray-400">{item.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CTASection() {
  return (
    <section className="py-20 md:py-28 bg-gradient-to-br from-primary-500 to-primary-700">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="font-display text-3xl md:text-5xl font-bold text-white mb-6">
          Stop Getting Rejected by ATS
        </h2>
        <p className="text-primary-100 text-lg mb-10 max-w-2xl mx-auto">
          Upload your resume now and find out your ATS score in seconds. It&apos;s free — `no signup required.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/score-checker" className="bg-white text-primary-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-50 transition-all shadow-lg flex items-center justify-center gap-2">
            <Upload className="w-5 h-5" />
            Check Your Score Free
          </Link>
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <AuthProvider>
      <Navbar />
      <main>
        <HeroSection />
        <FeaturesSection />
        <HowItWorksSection />
        <StatsSection />
        <PricingSection />
        <TestimonialsSection />
        <CTASection />
      </main>
      <Footer />
    </AuthProvider>
  );
}
