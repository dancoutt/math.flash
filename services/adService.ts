/**
 * Math Flash Pro - Ad Management Service
 * Refined for Google Play / TWA deployment.
 */

export const AD_INFO = {
  APP_ID: 'ca-app-pub-2481591040076861~5475293075',
};

export const AD_UNITS = {
  REWARDED_REVIVE: 'ca-app-pub-2481591040076861/8450964293',
  BANNER_MENU: 'ca-app-pub-2481591040076861/placeholder-banner',
  INTERSTITIAL_GAMEOVER: 'ca-app-pub-2481591040076861/placeholder-interstitial'
};

/**
 * Detects if the app is running in Standalone (Installed) mode
 */
export const isStandalone = () => {
  return (window.matchMedia('(display-mode: standalone)').matches) || 
         ((window.navigator as any).standalone) || 
         document.referrer.includes('android-app://');
};

export const showRewardedAd = async (): Promise<boolean> => {
  const context = isStandalone() ? 'TWA' : 'WEB';
  console.log(`[${context}] Starting Rewarded Flow:`, AD_UNITS.REWARDED_REVIVE);
  
  return new Promise((resolve) => {
    // In TWA mode, we simulate the H5 SDK reward flow
    // If you integrate Capacitor AdMob, this is where the plugin call would go
    setTimeout(() => {
      console.log('Reward Issued.');
      resolve(true); 
    }, 2500);
  });
};

export const showInterstitialAd = () => {
  console.log('Requesting Interstitial Ad');
};