import React from 'react';
import { Database, HardDrive, ShieldCheck } from 'lucide-react';

interface StorageBadgeProps {
  isServerSynced?: boolean;
  className?: string;
}

export const StorageBadge: React.FC<StorageBadgeProps> = ({ isServerSynced = false, className = '' }) => {
  return (
    <div 
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-mono border select-none transition-colors ${
        isServerSynced
          ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
          : 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400'
      } ${className}`}
      title={
        isServerSynced
          ? 'Progress and quiz scores are cryptographically verified by the backend server.'
          : 'Progress is stored safely in your browser (device-local). It will not sync across different browsers or devices.'
      }
      role="status"
      aria-label={isServerSynced ? 'Storage mode: Server Verified' : 'Storage mode: Device Local'}
    >
      {isServerSynced ? (
        <>
          <ShieldCheck className="w-3 h-3 text-emerald-400" />
          <span>SERVER-SYNCED</span>
        </>
      ) : (
        <>
          <HardDrive className="w-3 h-3 text-cyan-400" />
          <span>DEVICE-LOCAL</span>
        </>
      )}
    </div>
  );
};
