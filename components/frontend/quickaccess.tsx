import React from 'react';
import { TrendingUp, MessageCircle, BookOpen, Award, Leaf } from 'lucide-react';

function QuickAccess() {
  return (
    <div className="bg-gradient-to-b from-green-50 to-white">
      {/* Hero Section with Background */}
      <div 
        className="h-64 bg-cover bg-center"
        style={{
          backgroundImage: 'url("https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80")',
          backgroundBlendMode: 'overlay',
          backgroundColor: 'rgba(0, 0, 0, 0.4)'
        }}
      >
        <div className="h-full flex items-center justify-center">
          <div className="text-center text-white">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Leaf className="w-8 h-8" />
              <h1 className="text-4xl font-bold">Dont be left out, Join Now</h1>
            </div>
            <p className="text-xl">Growing Knowledge, Harvesting Success</p>
          </div>
        </div>
      </div>

      {/* Featured Content Section */}
    </div>
  );
}

export default QuickAccess;