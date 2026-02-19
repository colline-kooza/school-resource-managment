import React from 'react';
import { TrendingUp, MessageCircle, BookOpen, GraduationCap, School } from 'lucide-react';

export default function PreHero() {
  return (
    <div className="px-4 md:px-12 bg-white pt-16">
      <div className="max-w-7xl mx-auto">
        {/* Banner Section */}
        <div 
          className="h-64 rounded-3xl overflow-hidden relative shadow-lg mb-20"
          style={{
            backgroundImage: 'url("https://images.unsplash.com/photo-1541339907198-e08756ebafe1?auto=format&fit=crop&q=80")',
            backgroundPosition: 'center',
            backgroundSize: 'cover'
          }}
        >
          <div className="absolute inset-0 bg-[#163360CC] flex items-center justify-center text-center px-4">
            <div className="text-white">
              <div className="flex items-center justify-center gap-3 mb-2">
                <School className="w-10 h-10 text-[#F4A800]" />
                <h2 className="text-4xl font-bold">BusiLearn</h2>
              </div>
              <p className="text-xl text-blue-100 italic">Academic Hub</p>
            </div>
          </div>
        </div>

        {/* Featured Content Section */}
        <div className="pb-20">
          <div className="flex items-center gap-3 mb-12">
            <div className="h-8 w-2 bg-[#F4A800] rounded-full" />
            <h2 className="text-3xl font-bold text-[#163360]">Trending Content</h2>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Trending Questions */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 hover:shadow-md transition-shadow group">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-orange-50 rounded-xl group-hover:bg-orange-100 transition-colors">
                  <TrendingUp className="w-6 h-6 text-orange-600" />
                </div>
                <h3 className="text-xl font-bold text-[#163360]">Questions</h3>
              </div>
              <ul className="space-y-4">
                <li className="text-slate-600 text-sm flex items-start gap-2 hover:text-[#163360] cursor-pointer font-medium">
                  <span className="text-orange-400">•</span> GPA calculation for year 1?
                </li>
                <li className="text-slate-600 text-sm flex items-start gap-2 hover:text-[#163360] cursor-pointer font-medium">
                  <span className="text-orange-400">•</span> Best Elective for 2nd Sem?
                </li>
                <li className="text-slate-600 text-sm flex items-start gap-2 hover:text-[#163360] cursor-pointer font-medium">
                  <span className="text-orange-400">•</span> Internship portal issues?
                </li>
              </ul>
            </div>

            {/* Top Discussions */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 hover:shadow-md transition-shadow group">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-blue-50 rounded-xl group-hover:bg-blue-100 transition-colors">
                  <MessageCircle className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-[#163360]">Discussions</h3>
              </div>
              <ul className="space-y-4">
                <li className="text-slate-600 text-sm flex items-start gap-2 hover:text-[#163360] cursor-pointer font-medium">
                  <span className="text-blue-400">•</span> 2025 Guild Elections
                </li>
                <li className="text-slate-600 text-sm flex items-start gap-2 hover:text-[#163360] cursor-pointer font-medium">
                  <span className="text-blue-400">•</span> Arapai Hostel reviews
                </li>
                <li className="text-slate-600 text-sm flex items-start gap-2 hover:text-[#163360] cursor-pointer font-medium">
                  <span className="text-blue-400">•</span> Campus Wi-Fi upgrades
                </li>
              </ul>
            </div>

            {/* Featured Resources */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 hover:shadow-md transition-shadow group">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-blue-50 rounded-xl group-hover:bg-blue-100 transition-colors">
                  <BookOpen className="w-6 h-6 text-[#163360]" />
                </div>
                <h3 className="text-xl font-bold text-[#163360]">Resources</h3>
              </div>
              <ul className="space-y-4">
                <li className="text-slate-600 text-sm flex items-start gap-2 hover:text-[#163360] cursor-pointer font-medium">
                  <span className="text-blue-400">•</span> Calc I Past Papers 2024
                </li>
                <li className="text-slate-600 text-sm flex items-start gap-2 hover:text-[#163360] cursor-pointer font-medium">
                  <span className="text-blue-400">•</span> Intro to Agri. Notes
                </li>
                <li className="text-slate-600 text-sm flex items-start gap-2 hover:text-[#163360] cursor-pointer font-medium">
                  <span className="text-blue-400">•</span> Study Guide: Midterms
                </li>
              </ul>
            </div>

            {/* Faculty Spotlight */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 hover:shadow-md transition-shadow group">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-purple-50 rounded-xl group-hover:bg-purple-100 transition-colors">
                  <GraduationCap className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="text-xl font-bold text-[#163360]">Faculties</h3>
              </div>
              <ul className="space-y-4">
                <li className="text-slate-600 text-sm flex items-start gap-2 hover:text-[#163360] cursor-pointer font-medium">
                  <span className="text-purple-400">•</span> Faculty of Agriculture
                </li>
                <li className="text-slate-600 text-sm flex items-start gap-2 hover:text-[#163360] cursor-pointer font-medium">
                  <span className="text-purple-400">•</span> Faculty of Science
                </li>
                <li className="text-slate-600 text-sm flex items-start gap-2 hover:text-[#163360] cursor-pointer font-medium">
                  <span className="text-purple-400">•</span> Education & Languages
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
