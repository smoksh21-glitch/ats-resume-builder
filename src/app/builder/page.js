'use client';
import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ProtectedRoute from '@/components/ProtectedRoute';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import {
  User, Briefcase, GraduationCap, Wrench, FileText,
  Plus, Trash2, Sparkles, Download, Loader2, ChevronDown,
  ChevronUp, Save, CreditCard
} from 'lucide-react';
import toast from 'react-hot-toast';

const EMPTY_EXPERIENCE = { company: '', role: '', startDate: '', endDate: '', bullets: [''] };
const EMPTY_EDUCATION = { institution: '', degree: '', field: '', year: '' };

function BuilderContent() {
  const { user, userProfile } = useAuth();
  const [activeSection, setActiveSection] = useState('personal');
  const [saving, setSaving] = useState(false);
  const [enhancing, setEnhancing] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [targetRole, setTargetRole] = useState('');
  const previewRef = useRef(null);

  const [resumeData, setResumeData] = useState({
    personalInfo: {
      name: user?.displayName || '',
      email: user?.email || '',
      phone: '',
      location: '',
      linkedin: '',
    },
    summary: '',
    experience: [{ ...EMPTY_EXPERIENCE }],
    education: [{ ...EMPTY_EDUCATION }],
    skills: {
      technical: [],
      soft: [],
      tools: [],
    },
    skillInput: { technical: '', soft: '', tools: '' },
  });

  // Update personal info
  const updatePersonal = (field, value) => {
    setResumeData(prev => ({
      ...prev,
      personalInfo: { ...prev.personalInfo, [field]: value },
    }));
  };

  // Experience handlers
  const addExperience = () => {
    setResumeData(prev => ({
      ...prev,
      experience: [...prev.experience, { ...EMPTY_EXPERIENCE }],
    }));
  };

  const updateExperience = (index, field, value) => {
    setResumeData(prev => {
      const exp = [...prev.experience];
      exp[index] = { ...exp[index], [field]: value };
      return { ...prev, experience: exp };
    });
  };

  const removeExperience = (index) => {
    if (resumeData.experience.length <= 1) return;
    setResumeData(prev => ({
      ...prev,
      experience: prev.experience.filter((_, i) => i !== index),
    }));
  };

  const addBullet = (expIndex) => {
    setResumeData(prev => {
      const exp = [...prev.experience];
      exp[expIndex] = { ...exp[expIndex], bullets: [...exp[expIndex].bullets, ''] };
      return { ...prev, experience: exp };
    });
  };

  const updateBullet = (expIndex, bulletIndex, value) => {
    setResumeData(prev => {
      const exp = [...prev.experience];
      const bullets = [...exp[expIndex].bullets];
      bullets[bulletIndex] = value;
      exp[expIndex] = { ...exp[expIndex], bullets };
      return { ...prev, experience: exp };
    });
  };

  const removeBullet = (expIndex, bulletIndex) => {
    setResumeData(prev => {
      const exp = [...prev.experience];
      if (exp[expIndex].bullets.length <= 1) return prev;
      exp[expIndex] = {
        ...exp[expIndex],
        bullets: exp[expIndex].bullets.filter((_, i) => i !== bulletIndex),
      };
      return { ...prev, experience: exp };
    });
  };

  // Education handlers
  const addEducation = () => {
    setResumeData(prev => ({
      ...prev,
      education: [...prev.education, { ...EMPTY_EDUCATION }],
    }));
  };

  const updateEducation = (index, field, value) => {
    setResumeData(prev => {
      const edu = [...prev.education];
      edu[index] = { ...edu[index], [field]: value };
      return { ...prev, education: edu };
    });
  };

  const removeEducation = (index) => {
    if (resumeData.education.length <= 1) return;
    setResumeData(prev => ({
      ...prev,
      education: prev.education.filter((_, i) => i !== index),
    }));
  };

  // Skills handlers
  const addSkill = (category) => {
    const value = resumeData.skillInput[category].trim();
    if (!value) return;
    setResumeData(prev => ({
      ...prev,
      skills: { ...prev.skills, [category]: [...prev.skills[category], value] },
      skillInput: { ...prev.skillInput, [category]: '' },
    }));
  };

  const removeSkill = (category, index) => {
    setResumeData(prev => ({
      ...prev,
      skills: {
        ...prev.skills,
        [category]: prev.skills[category].filter((_, i) => i !== index),
      },
    }));
  };

  // AI Enhancement
  const enhanceWithAI = async (type) => {
    setEnhancing(true);
    try {
      const response = await fetch('/api/enhance-resume', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          resumeData,
          enhancementType: type,
          targetRole,
        }),
      });

      if (!response.ok) throw new Error('Enhancement failed');
      const data = await response.json();

      if (type === 'summary' && data.enhancedSummary) {
        setResumeData(prev => ({ ...prev, summary: data.enhancedSummary }));
        toast.success('Summary enhanced with AI!');
      } else if (type === 'bullets' && data.enhancedExperience) {
        setResumeData(prev => ({ ...prev, experience: data.enhancedExperience }));
        toast.success('Experience bullets enhanced!');
      } else if (type === 'full') {
        if (data.summary) setResumeData(prev => ({ ...prev, summary: data.summary }));
        if (data.experience) setResumeData(prev => ({ ...prev, experience: data.experience }));
        if (data.skills) setResumeData(prev => ({ ...prev, skills: data.skills }));
        if (data.personalInfo) setResumeData(prev => ({ ...prev, personalInfo: { ...prev.personalInfo, ...data.personalInfo } }));
        toast.success('Full resume optimized!');
      }
    } catch (error) {
      toast.error('Enhancement failed. Please try again.');
    }
    setEnhancing(false);
  };

  // Download as PDF
  const downloadPDF = async () => {
    setDownloading(true);
    try {
      const html2canvas = (await import('html2canvas')).default;
      const jsPDF = (await import('jspdf')).default;

      const element = previewRef.current;
      if (!element) throw new Error('Preview not found');

      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff',
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`${resumeData.personalInfo.name || 'resume'}_ATS_Resume.pdf`);
      toast.success('Resume downloaded!');
    } catch (error) {
      toast.error('Download failed. Please try again.');
      console.error(error);
    }
    setDownloading(false);
  };

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
          // Verify payment
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
          } else {
            toast.error('Payment verification failed.');
          }
        },
        prefill: {
          email: user.email,
          name: user.displayName,
        },
        theme: { color: '#4A90E2' },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      toast.error('Payment failed. Please try again.');
    }
  };

  const sections = [
    { id: 'personal', label: 'Personal Info', icon: <User className="w-4 h-4" /> },
    { id: 'summary', label: 'Summary', icon: <FileText className="w-4 h-4" /> },
    { id: 'experience', label: 'Experience', icon: <Briefcase className="w-4 h-4" /> },
    { id: 'education', label: 'Education', icon: <GraduationCap className="w-4 h-4" /> },
    { id: 'skills', label: 'Skills', icon: <Wrench className="w-4 h-4" /> },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Razorpay Script */}
      <script src="https://checkout.razorpay.com/v1/checkout.js" async />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Top Bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="font-display font-bold text-2xl text-gray-900">Resume Builder</h1>
            <p className="text-gray-500 text-sm mt-1">Build your ATS-optimized resume step by step</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <label className="text-sm text-gray-600">Target Role:</label>
              <input
                type="text"
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
                placeholder="e.g. Software Engineer"
                className="input-field !py-2 !px-3 text-sm w-48"
              />
            </div>
            <button onClick={handlePayment} className="btn-accent flex items-center gap-2 text-sm !py-2">
              <CreditCard className="w-4 h-4" />
              Buy 2 Edits — ₹120
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* LEFT: Form */}
          <div className="space-y-4">
            {/* Section Tabs */}
            <div className="flex flex-wrap gap-2 mb-4">
              {sections.map((s) => (
                <button
                  key={s.id}
                  onClick={() => setActiveSection(s.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    activeSection === s.id
                      ? 'bg-primary-500 text-white'
                      : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                  }`}
                >
                  {s.icon}
                  {s.label}
                </button>
              ))}
            </div>

            {/* Personal Info Section */}
            {activeSection === 'personal' && (
              <div className="card space-y-4">
                <h2 className="font-display font-semibold text-lg">Personal Information</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                    <input type="text" className="input-field" value={resumeData.personalInfo.name} onChange={(e) => updatePersonal('name', e.target.value)} placeholder="John Doe" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input type="email" className="input-field" value={resumeData.personalInfo.email} onChange={(e) => updatePersonal('email', e.target.value)} placeholder="john@example.com" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                    <input type="tel" className="input-field" value={resumeData.personalInfo.phone} onChange={(e) => updatePersonal('phone', e.target.value)} placeholder="+91 98765 43210" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                    <input type="text" className="input-field" value={resumeData.personalInfo.location} onChange={(e) => updatePersonal('location', e.target.value)} placeholder="Mumbai, India" />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">LinkedIn URL</label>
                    <input type="url" className="input-field" value={resumeData.personalInfo.linkedin} onChange={(e) => updatePersonal('linkedin', e.target.value)} placeholder="https://linkedin.com/in/johndoe" />
                  </div>
                </div>
              </div>
            )}

            {/* Summary Section */}
            {activeSection === 'summary' && (
              <div className="card space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="font-display font-semibold text-lg">Professional Summary</h2>
                  <button
                    onClick={() => enhanceWithAI('summary')}
                    disabled={enhancing}
                    className="flex items-center gap-1 text-sm text-primary-500 hover:text-primary-700 font-medium"
                  >
                    {enhancing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                    AI Generate
                  </button>
                </div>
                <textarea
                  rows={5}
                  className="input-field resize-none"
                  value={resumeData.summary}
                  onChange={(e) => setResumeData(prev => ({ ...prev, summary: e.target.value }))}
                  placeholder="Experienced software engineer with 5+ years of expertise in building scalable web applications..."
                />
              </div>
            )}

            {/* Experience Section */}
            {activeSection === 'experience' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="font-display font-semibold text-lg">Work Experience</h2>
                  <div className="flex gap-2">
                    <button
                      onClick={() => enhanceWithAI('bullets')}
                      disabled={enhancing}
                      className="flex items-center gap-1 text-sm text-primary-500 hover:text-primary-700 font-medium"
                    >
                      {enhancing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                      Enhance Bullets
                    </button>
                  </div>
                </div>
                {resumeData.experience.map((exp, expIndex) => (
                  <div key={expIndex} className="card space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-500">Position {expIndex + 1}</span>
                      {resumeData.experience.length > 1 && (
                        <button onClick={() => removeExperience(expIndex)} className="text-red-400 hover:text-red-600">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Company</label>
                        <input type="text" className="input-field" value={exp.company} onChange={(e) => updateExperience(expIndex, 'company', e.target.value)} placeholder="Google" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                        <input type="text" className="input-field" value={exp.role} onChange={(e) => updateExperience(expIndex, 'role', e.target.value)} placeholder="Software Engineer" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                        <input type="text" className="input-field" value={exp.startDate} onChange={(e) => updateExperience(expIndex, 'startDate', e.target.value)} placeholder="Jan 2022" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                        <input type="text" className="input-field" value={exp.endDate} onChange={(e) => updateExperience(expIndex, 'endDate', e.target.value)} placeholder="Present" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Key Achievements</label>
                      {exp.bullets.map((bullet, bIndex) => (
                        <div key={bIndex} className="flex gap-2 mb-2">
                          <span className="text-gray-400 mt-3">•</span>
                          <input
                            type="text"
                            className="input-field flex-1"
                            value={bullet}
                            onChange={(e) => updateBullet(expIndex, bIndex, e.target.value)}
                            placeholder="Led team of 5 engineers to deliver feature that increased revenue by 20%"
                          />
                          {exp.bullets.length > 1 && (
                            <button onClick={() => removeBullet(expIndex, bIndex)} className="text-red-400 hover:text-red-600 mt-3">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      ))}
                      <button
                        onClick={() => addBullet(expIndex)}
                        className="flex items-center gap-1 text-sm text-primary-500 hover:text-primary-700 mt-2"
                      >
                        <Plus className="w-4 h-4" /> Add bullet
                      </button>
                    </div>
                  </div>
                ))}
                <button onClick={addExperience} className="btn-secondary w-full flex items-center justify-center gap-2">
                  <Plus className="w-4 h-4" /> Add Experience
                </button>
              </div>
            )}

            {/* Education Section */}
            {activeSection === 'education' && (
              <div className="space-y-4">
                <h2 className="font-display font-semibold text-lg">Education</h2>
                {resumeData.education.map((edu, index) => (
                  <div key={index} className="card space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-500">Education {index + 1}</span>
                      {resumeData.education.length > 1 && (
                        <button onClick={() => removeEducation(index)} className="text-red-400 hover:text-red-600">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Institution</label>
                        <input type="text" className="input-field" value={edu.institution} onChange={(e) => updateEducation(index, 'institution', e.target.value)} placeholder="IIT Delhi" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Degree</label>
                        <input type="text" className="input-field" value={edu.degree} onChange={(e) => updateEducation(index, 'degree', e.target.value)} placeholder="B.Tech" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Field of Study</label>
                        <input type="text" className="input-field" value={edu.field} onChange={(e) => updateEducation(index, 'field', e.target.value)} placeholder="Computer Science" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
                        <input type="text" className="input-field" value={edu.year} onChange={(e) => updateEducation(index, 'year', e.target.value)} placeholder="2022" />
                      </div>
                    </div>
                  </div>
                ))}
                <button onClick={addEducation} className="btn-secondary w-full flex items-center justify-center gap-2">
                  <Plus className="w-4 h-4" /> Add Education
                </button>
              </div>
            )}

            {/* Skills Section */}
            {activeSection === 'skills' && (
              <div className="card space-y-6">
                <h2 className="font-display font-semibold text-lg">Skills</h2>
                {['technical', 'soft', 'tools'].map((category) => (
                  <div key={category}>
                    <label className="block text-sm font-medium text-gray-700 mb-2 capitalize">
                      {category === 'tools' ? 'Tools & Technologies' : `${category} Skills`}
                    </label>
                    <div className="flex gap-2 mb-2">
                      <input
                        type="text"
                        className="input-field flex-1"
                        value={resumeData.skillInput[category]}
                        onChange={(e) => setResumeData(prev => ({
                          ...prev,
                          skillInput: { ...prev.skillInput, [category]: e.target.value },
                        }))}
                        onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill(category))}
                        placeholder={`Add ${category} skill and press Enter`}
                      />
                      <button onClick={() => addSkill(category)} className="btn-primary !py-2 !px-4">
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {resumeData.skills[category].map((skill, index) => (
                        <span key={index} className="inline-flex items-center gap-1 bg-primary-50 text-primary-700 px-3 py-1 rounded-full text-sm">
                          {skill}
                          <button onClick={() => removeSkill(category, index)} className="hover:text-red-500">
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* AI Actions */}
            <div className="card bg-gradient-to-r from-primary-50 to-primary-100">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-gray-900">AI Full Optimization</h3>
                  <p className="text-sm text-gray-500 mt-1">Let AI rewrite your entire resume for maximum ATS score</p>
                </div>
                <button
                  onClick={() => enhanceWithAI('full')}
                  disabled={enhancing}
                  className="btn-primary flex items-center gap-2 text-sm"
                >
                  {enhancing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                  Optimize All
                </button>
              </div>
            </div>
          </div>

          {/* RIGHT: Live Preview */}
          <div className="lg:sticky lg:top-24 lg:self-start">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display font-semibold text-lg text-gray-900">Live Preview</h2>
              <button
                onClick={downloadPDF}
                disabled={downloading}
                className="btn-primary flex items-center gap-2 text-sm !py-2"
              >
                {downloading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                Download PDF
              </button>
            </div>
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
              <div ref={previewRef} className="p-8 min-h-[700px]" style={{ fontFamily: 'Georgia, serif', fontSize: '11px', lineHeight: '1.5' }}>
                {/* Resume Preview */}
                {resumeData.personalInfo.name && (
                  <div className="text-center mb-4 pb-3 border-b-2 border-gray-800">
                    <h1 style={{ fontSize: '22px', fontWeight: 'bold', letterSpacing: '1px', marginBottom: '4px' }}>
                      {resumeData.personalInfo.name.toUpperCase()}
                    </h1>
                    <div className="flex items-center justify-center gap-3 text-gray-600 flex-wrap" style={{ fontSize: '10px' }}>
                      {resumeData.personalInfo.email && <span>{resumeData.personalInfo.email}</span>}
                      {resumeData.personalInfo.phone && <span>| {resumeData.personalInfo.phone}</span>}
                      {resumeData.personalInfo.location && <span>| {resumeData.personalInfo.location}</span>}
                      {resumeData.personalInfo.linkedin && <span>| {resumeData.personalInfo.linkedin}</span>}
                    </div>
                  </div>
                )}

                {resumeData.summary && (
                  <div className="mb-4">
                    <h2 style={{ fontSize: '13px', fontWeight: 'bold', textTransform: 'uppercase', borderBottom: '1px solid #333', paddingBottom: '2px', marginBottom: '4px' }}>
                      Professional Summary
                    </h2>
                    <p className="text-gray-700">{resumeData.summary}</p>
                  </div>
                )}

                {resumeData.experience.some(e => e.company || e.role) && (
                  <div className="mb-4">
                    <h2 style={{ fontSize: '13px', fontWeight: 'bold', textTransform: 'uppercase', borderBottom: '1px solid #333', paddingBottom: '2px', marginBottom: '4px' }}>
                      Experience
                    </h2>
                    {resumeData.experience.map((exp, i) => (
                      (exp.company || exp.role) && (
                        <div key={i} className="mb-3">
                          <div className="flex justify-between items-baseline">
                            <div>
                              <span style={{ fontWeight: 'bold' }}>{exp.role}</span>
                              {exp.company && <span className="text-gray-600"> | {exp.company}</span>}
                            </div>
                            {(exp.startDate || exp.endDate) && (
                              <span className="text-gray-500" style={{ fontSize: '10px' }}>
                                {exp.startDate} — {exp.endDate}
                              </span>
                            )}
                          </div>
                          <ul className="mt-1 ml-4" style={{ listStyleType: 'disc' }}>
                            {exp.bullets.filter(b => b).map((bullet, j) => (
                              <li key={j} className="text-gray-700">{bullet}</li>
                            ))}
                          </ul>
                        </div>
                      )
                    ))}
                  </div>
                )}

                {resumeData.education.some(e => e.institution || e.degree) && (
                  <div className="mb-4">
                    <h2 style={{ fontSize: '13px', fontWeight: 'bold', textTransform: 'uppercase', borderBottom: '1px solid #333', paddingBottom: '2px', marginBottom: '4px' }}>
                      Education
                    </h2>
                    {resumeData.education.map((edu, i) => (
                      (edu.institution || edu.degree) && (
                        <div key={i} className="mb-2">
                          <div className="flex justify-between items-baseline">
                            <div>
                              <span style={{ fontWeight: 'bold' }}>{edu.degree} {edu.field && `in ${edu.field}`}</span>
                              {edu.institution && <span className="text-gray-600"> | {edu.institution}</span>}
                            </div>
                            {edu.year && <span className="text-gray-500" style={{ fontSize: '10px' }}>{edu.year}</span>}
                          </div>
                        </div>
                      )
                    ))}
                  </div>
                )}

                {(resumeData.skills.technical.length > 0 || resumeData.skills.soft.length > 0 || resumeData.skills.tools.length > 0) && (
                  <div className="mb-4">
                    <h2 style={{ fontSize: '13px', fontWeight: 'bold', textTransform: 'uppercase', borderBottom: '1px solid #333', paddingBottom: '2px', marginBottom: '4px' }}>
                      Skills
                    </h2>
                    {resumeData.skills.technical.length > 0 && (
                      <p><span style={{ fontWeight: 'bold' }}>Technical:</span> {resumeData.skills.technical.join(', ')}</p>
                    )}
                    {resumeData.skills.soft.length > 0 && (
                      <p><span style={{ fontWeight: 'bold' }}>Soft Skills:</span> {resumeData.skills.soft.join(', ')}</p>
                    )}
                    {resumeData.skills.tools.length > 0 && (
                      <p><span style={{ fontWeight: 'bold' }}>Tools:</span> {resumeData.skills.tools.join(', ')}</p>
                    )}
                  </div>
                )}

                {/* Placeholder when empty */}
                {!resumeData.personalInfo.name && !resumeData.summary && (
                  <div className="flex flex-col items-center justify-center h-full text-gray-300 py-20">
                    <FileText className="w-16 h-16 mb-4" />
                    <p className="text-lg font-medium">Start filling in your details</p>
                    <p className="text-sm">Your resume preview will appear here</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default function BuilderPage() {
  return (
    <AuthProvider>
      <ProtectedRoute>
        <BuilderContent />
      </ProtectedRoute>
    </AuthProvider>
  );
}
