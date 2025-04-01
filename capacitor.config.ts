
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.ecbd0082827a43119ef955a979fd5921',
  appName: 'taskify-dojo',
  webDir: 'dist',
  server: {
    url: 'https://ecbd0082-827a-4311-9ef9-55a979fd5921.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 0
    }
  }
};

export default config;
