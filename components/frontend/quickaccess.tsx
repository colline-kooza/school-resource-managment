import React from 'react';
import { School, GraduationCap, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

function QuickAccess() {
  return (
    <div className="bg-white py-12 px-4 md:px-12">
      <div 
        className="max-w-7xl mx-auto rounded-3xl overflow-hidden relative min-h-[300px] flex items-center shadow-xl"
        style={{
          backgroundImage: 'url("https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&q=80")',
          backgroundPosition: 'center',
          backgroundSize: 'cover'
        }}
      >
        <div className="absolute inset-0" style={{ backgroundImage: "linear-gradient(to right, #163360EE, #16336088)" }} />
        
        <div className="relative z-10 px-8 md:px-16 w-full py-12">
          <div className="max-w-2xl">
            <div className="flex items-center gap-3 mb-6">
              <School className="w-8 h-8 text-[#F4A800]" />
              <h1 className="text-2xl md:text-3xl font-extrabold text-white">
                Ready to Excel?
              </h1>
            </div>
            <p className="text-base text-blue-100 mb-8 max-w-lg">
              Don&apos;t be left out. Join thousands of students using BusiLearn: Academic Hub to succeed.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/register">
                <Button size="lg" className="bg-[#F4A800] hover:bg-[#d99700] text-[#163360] font-bold h-12 px-8">
                  Create Account Now <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default QuickAccess;
