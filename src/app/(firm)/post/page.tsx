'use client';

import React, { useState } from 'react';
import axios from 'axios';
import Link from 'next/link';
import { ArrowLeft, ReceiptIndianRupee } from 'lucide-react';
import { Menu , Home,  Building2, MapPin, DollarSign, FileText, CheckCircle, Mail, Eye, Edit3 } from 'lucide-react';

export default function PostPage(){
  const [form, setForm] = useState({ 
    title:'', 
    firmName:'', 
    location:'', 
    stipend:'', 
    roleDescription:'', 
    requirements:'', 
    responsibilities:'', 
    contactEmail:'' 
  });
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);

  function update(k:string, v:any){ 
    setForm(prev=>({ ...prev, [k]: v })); 
  }

  async function submit(e:React.FormEvent){
    e.preventDefault();
    setSaving(true);
    try{
      const payload = { 
        ...form, 
        requirements: form.requirements.split('\n').filter(Boolean), 
        responsibilities: form.responsibilities.split('\n').filter(Boolean) 
      };
      await axios.post('/api/internships', payload);
      setMsg('Created');
      setForm({ title:'', firmName:'', location:'', stipend:'', roleDescription:'', requirements:'', responsibilities:'', contactEmail:'' });
    }catch(err:any){ 
      setMsg(err?.response?.data?.error || 'Failed'); 
    }
    setSaving(false);
  }

  const requirementsList = form.requirements.split('\n').filter(Boolean);
  const responsibilitiesList = form.responsibilities.split('\n').filter(Boolean);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-lg bg-white/90 border-b border-gray-200/50 shadow-lg shadow-gray-900/5">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-between items-center h-18">
            {/* Logo + Brand */}
            <div className="flex items-center">
                <div className="relative">
                  <img
                    src="/images/logobg1.png"
                    alt="LEXHAVEN"
                    className="h-38 w-auto object-contain transition-all duration-300 group-hover:scale-85"
                  />
                </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3">
              {/* User Actions */}
              <div className="flex items-center gap-2">
                <a href="/">
                  <button className="p-2 text-gray-600 hover:text-blue-700 hover:bg-amber-50 rounded-lg transition-colors duration-200">
                    <Home className="h-5 w-5" />
                  </button>
                </a>
              </div>

              {/* Mobile Menu */}
              <button className="lg:hidden p-2 text-gray-600 hover:text-amber-700 hover:bg-amber-50 rounded-lg transition-colors duration-200">
                <Menu className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </header>
      <div className="h-18"></div>

      <div className="max-w-7xl mx-auto px-6 py-8">
         <div className="mb-6">
                <Link 
                  href="/dashboard/firm"
                  className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium transition-colors"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back to Dashboard
                </Link>
              </div>
        <div className="grid lg:grid-cols-2 gap-8">
         
          
          {/* Form Section */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-lg border border-slate-200">
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 rounded-t-xl">
                <div className="flex items-center gap-3">
                  <Edit3 className="h-6 w-6" />
                  <h2 className="text-xl font-semibold">Create Internship Posting</h2>
                </div>
                <p className="text-blue-100 mt-2">Fill out the details for your legal internship position</p>
              </div>

              <form onSubmit={submit} className="p-6 space-y-6">
                {/* Position Details */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-slate-800 border-b border-slate-200 pb-2">Position Details</h3>
                  
                  <div className="space-y-3">
                    <label className="block text-sm font-medium text-slate-700">Position Title *</label>
                    <div className="relative">
                      <FileText className="absolute left-3 top-3.5 h-4 w-4 text-slate-400" />
                      <input 
                        value={form.title} 
                        onChange={e=>update('title', e.target.value)} 
                        placeholder="e.g., Legal Research Intern, Corporate Law Intern"
                        className="w-full pl-10 pr-4 py-3 text-slate-900 bg-white border-2 border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 placeholder-slate-400"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="block text-sm font-medium text-slate-700">Law Firm / Organization Name *</label>
                    <div className="relative">
                      <Building2 className="absolute left-3 top-3.5 h-4 w-4 text-slate-400" />
                      <input 
                        value={form.firmName} 
                        onChange={e=>update('firmName', e.target.value)} 
                        placeholder="Enter your firm's name"
                        className="w-full pl-10 pr-4 py-3 text-slate-900 bg-white border-2 border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 placeholder-slate-400"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <label className="block text-sm font-medium text-slate-700">Location *</label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-3.5 h-4 w-4 text-slate-400" />
                        <input 
                          value={form.location} 
                          onChange={e=>update('location', e.target.value)} 
                          placeholder="City, State"
                          className="w-full pl-10 pr-4 py-3 text-slate-900 bg-white border-2 border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 placeholder-slate-400"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-3">
                      <label className="block text-sm font-medium text-slate-700">Stipend</label>
                      <div className="relative">
                        <ReceiptIndianRupee className="absolute left-3 top-3.5 h-4 w-4 text-slate-400" />
                        <input 
                          value={form.stipend} 
                          onChange={e=>update('stipend', e.target.value)} 
                          placeholder="e.g., $15/hour, $3000/month"
                          className="w-full pl-10 pr-4 py-3 text-slate-900 bg-white border-2 border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 placeholder-slate-400"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Role Description */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-slate-800 border-b border-slate-200 pb-2">Role Description</h3>
                  <div className="space-y-3">
                    <label className="block text-sm font-medium text-slate-700">Position Overview *</label>
                    <textarea 
                      value={form.roleDescription} 
                      onChange={e=>update('roleDescription', e.target.value)} 
                      placeholder="Provide a comprehensive description of the internship role, including the type of legal work, practice areas, and learning opportunities..."
                      rows={5}
                      className="w-full px-4 py-3 text-slate-900 bg-white border-2 border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 resize-none placeholder-slate-400"
                      required
                    />
                  </div>
                </div>

                {/* Requirements */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-slate-800 border-b border-slate-200 pb-2">Requirements</h3>
                  <div className="space-y-3">
                    <label className="block text-sm font-medium text-slate-700">Candidate Requirements *</label>
                    <div className="relative">
                      <div className="absolute left-3 top-3 text-xs text-slate-500 bg-white px-1">Enter one per line</div>
                      <textarea 
                        value={form.requirements} 
                        onChange={e=>update('requirements', e.target.value)} 
                        placeholder="Current law student (2L/3L preferred)&#10;Strong research and writing skills&#10;Interest in corporate law&#10;Minimum GPA of 3.5&#10;Proficiency in legal databases"
                        rows={6}
                        className="w-full px-4 pt-8 pb-3 text-slate-900 bg-white border-2 border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 resize-none placeholder-slate-400"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Responsibilities */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-slate-800 border-b border-slate-200 pb-2">Responsibilities</h3>
                  <div className="space-y-3">
                    <label className="block text-sm font-medium text-slate-700">Key Responsibilities *</label>
                    <div className="relative">
                      <div className="absolute left-3 top-3 text-xs text-slate-500 bg-white px-1">Enter one per line</div>
                      <textarea 
                        value={form.responsibilities} 
                        onChange={e=>update('responsibilities', e.target.value)} 
                        placeholder="Conduct legal research and analysis&#10;Draft memoranda and briefs&#10;Assist with case preparation&#10;Support attorneys in client meetings&#10;Review and organize case documents"
                        rows={6}
                        className="w-full px-4 pt-8 pb-3 text-slate-900 bg-white border-2 border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 resize-none placeholder-slate-400"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Contact Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-slate-800 border-b border-slate-200 pb-2">Contact Information</h3>
                  <div className="space-y-3">
                    <label className="block text-sm font-medium text-slate-700">Application Email *</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3.5 h-4 w-4 text-slate-400" />
                      <input 
                        value={form.contactEmail} 
                        onChange={e=>update('contactEmail', e.target.value)} 
                        placeholder="hr@lawfirm.com"
                        type="email"
                        className="w-full pl-10 pr-4 py-3 text-slate-900 bg-white border-2 border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 placeholder-slate-400"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="flex gap-3 pt-4">
                  <button 
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 px-6 rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2"
                    disabled={saving}
                  >
                    {saving ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                        Creating...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="h-4 w-4" />
                        Publish Posting
                      </>
                    )}
                  </button>
                  
                  <button 
                    type="button"
                    onClick={() => setShowPreview(!showPreview)}
                    className="bg-slate-100 text-slate-700 py-3 px-6 rounded-lg font-semibold hover:bg-slate-200 transition-all duration-200 flex items-center gap-2"
                  >
                    <Eye className="h-4 w-4" />
                    {showPreview ? 'Hide' : 'Preview'}
                  </button>
                </div>

                {/* Success/Error Message */}
                {msg && (
                  <div className={`p-4 rounded-lg ${msg.includes('Created') ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'}`}>
                    <div className="flex items-center gap-2">
                      {msg.includes('Created') ? (
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      ) : (
                        <div className="h-5 w-5 rounded-full bg-red-600 flex items-center justify-center">
                          <span className="text-white text-xs font-bold">!</span>
                        </div>
                      )}
                      {msg}
                    </div>
                  </div>
                )}
              </form>
            </div>
          </div>

          {/* Preview Section */}
          <div className={`space-y-6 ${showPreview ? 'block' : 'hidden lg:block'}`}>
            <div className="bg-white rounded-xl shadow-lg border border-slate-200 sticky top-6">
              <div className="bg-gradient-to-r from-slate-700 to-slate-800 text-white p-6 rounded-t-xl">
                <div className="flex items-center gap-3">
                  <Eye className="h-6 w-6" />
                  <h2 className="text-xl font-semibold">Live Preview</h2>
                </div>
                <p className="text-slate-300 mt-2">See how your posting will appear to candidates</p>
              </div>

              <div className="p-6">
                {form.title || form.firmName || form.location ? (
                  <div className="space-y-6">
                    {/* Header */}
                    <div className="border-b border-slate-200 pb-6">
                      <h1 className="text-2xl font-bold text-slate-800 mb-2">
                        {form.title || 'Position Title'}
                      </h1>
                      <div className="flex flex-wrap gap-4 text-slate-600">
                        <div className="flex items-center gap-2">
                          <Building2 className="h-4 w-4" />
                          <span>{form.firmName || 'Law Firm Name'}</span>
                        </div>
                        {form.location && (
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4" />
                            <span>{form.location}</span>
                          </div>
                        )}
                        {form.stipend && (
                          <div className="flex items-center gap-2">
                            <DollarSign className="h-4 w-4" />
                            <span>{form.stipend}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Role Description */}
                    {form.roleDescription && (
                      <div>
                        <h3 className="text-lg font-semibold text-slate-800 mb-3">Position Overview</h3>
                        <p className="text-slate-600 leading-relaxed whitespace-pre-line">{form.roleDescription}</p>
                      </div>
                    )}

                    {/* Requirements */}
                    {requirementsList.length > 0 && (
                      <div>
                        <h3 className="text-lg font-semibold text-slate-800 mb-3">Requirements</h3>
                        <ul className="space-y-2">
                          {requirementsList.map((req, i) => (
                            <li key={i} className="flex items-start gap-2">
                              <CheckCircle className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                              <span className="text-slate-600">{req}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Responsibilities */}
                    {responsibilitiesList.length > 0 && (
                      <div>
                        <h3 className="text-lg font-semibold text-slate-800 mb-3">Key Responsibilities</h3>
                        <ul className="space-y-2">
                          {responsibilitiesList.map((resp, i) => (
                            <li key={i} className="flex items-start gap-2">
                              <div className="h-2 w-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                              <span className="text-slate-600">{resp}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Contact */}
                    {form.contactEmail && (
                      <div className="border-t border-slate-200 pt-6">
                        <h3 className="text-lg font-semibold text-slate-800 mb-3">Application Instructions</h3>
                        <div className="bg-blue-50 p-4 rounded-lg">
                          <p className="text-slate-700 mb-2">To apply, please send your resume and cover letter to:</p>
                          <div className="flex items-center gap-2 text-blue-700 font-medium">
                            <Mail className="h-4 w-4" />
                            <a href={`mailto:${form.contactEmail}`} className="hover:underline">
                              {form.contactEmail}
                            </a>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-12 text-slate-400">
                    <FileText className="h-12 w-12 mx-auto mb-4" />
                    <p>Start filling out the form to see your posting preview</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}