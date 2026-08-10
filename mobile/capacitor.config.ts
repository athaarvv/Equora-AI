import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'ai.equora.app',
  appName: 'EQUORA AI',
  webDir: '../frontend/dist',
  server: {
    androidScheme: 'https'
  }
};

export default config;
