
import React from 'react';

const Skeleton: React.FC = () => {
  return (
    <div className="bg-gray-800/50 rounded-[48px] overflow-hidden border border-gray-700/50 shadow-2xl flex flex-col relative animate-pulse">
      <div className="h-3 w-full bg-gray-700/50" />
      
      <div className="p-8 lg:p-10 flex-grow flex flex-col">
        <div className="flex justify-between items-start mb-8">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 rounded-[24px] bg-gray-700/50 border border-white/5" />
            <div className="space-y-2">
              <div className="h-2 w-20 bg-gray-700/50 rounded" />
              <div className="h-2 w-12 bg-gray-700/50 rounded" />
            </div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-gray-700/50" />
        </div>

        <div className="space-y-3 mb-8">
          <div className="h-8 w-full bg-gray-700/50 rounded-xl" />
          <div className="h-8 w-3/4 bg-gray-700/50 rounded-xl" />
        </div>

        <div className="bg-gray-900/40 p-8 rounded-[40px] border border-white/[0.05] mb-10 shadow-inner">
            <div className="h-2 w-24 bg-gray-700/50 rounded mb-4" />
            <div className="space-y-2">
              <div className="h-4 w-full bg-gray-700/50 rounded" />
              <div className="h-4 w-5/6 bg-gray-700/50 rounded" />
            </div>
        </div>

        <div className="mb-10">
            <div className="h-2 w-32 bg-gray-700/50 rounded mb-4" />
            <div className="h-4 w-full bg-gray-700/50 rounded" />
        </div>

        <div className="mt-auto h-[74px] w-full bg-gray-900/60 rounded-[32px] border border-gray-700/50" />
      </div>

      <div className="bg-gray-950/60 p-8 border-t border-white/[0.04] flex justify-between items-center h-24" />
    </div>
  );
};

export default Skeleton;
