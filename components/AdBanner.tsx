
import React, { useEffect } from 'react';
import { AD_UNITS } from '../services/adService';

const AdBanner: React.FC = () => {
  useEffect(() => {
    try {
      // Standard Google AdSense/AdMob push initialization for the banner unit
      // @ts-ignore
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (e) {
      console.warn('AdMob/AdSense initialization deferred or failed:', e);
    }
  }, []);

  // Extract publisher ID and slot ID from the constant
  // Format: ca-app-pub-2481591040076861/placeholder-banner
  const fullId = AD_UNITS.BANNER_MENU;
  const parts = fullId.split('/');
  
  // The client ID usually starts with ca-pub- for the adsbygoogle tag
  const clientId = parts[0].replace('ca-app-', 'ca-');
  const slotId = parts[1];

  return (
    <div className="flex flex-col items-center justify-center w-full min-h-[60px] bg-black/20 border-t border-white/5 py-2">
      <span className="text-[8px] font-black uppercase tracking-[0.4em] text-white/10 mb-1">Advertisement</span>
      <div className="ad-container overflow-hidden w-full flex justify-center">
        <ins className="adsbygoogle"
             style={{ display: 'inline-block', width: '320px', height: '50px' }}
             data-ad-client={clientId}
             data-ad-slot={slotId}
             data-full-width-responsive="false"></ins>
      </div>
    </div>
  );
};

export default AdBanner;
