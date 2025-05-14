import { useEffect } from 'react';
import { I18nManager } from 'react-native';
import * as Updates from 'expo-updates';

export function useDirectionalLayout() {
  useEffect(() => {
    // This hook handles RTL configuration and reloading
    // It's needed because RTL changes require app reload
    async function handleDirectionChange() {
      // Check if reload is needed after RTL changes
      if (I18nManager.isRTL !== I18nManager.getConstants().isRTL) {
        try {
          // Only reload in production environment
          if (!__DEV__) {
            await Updates.reloadAsync();
          }
        } catch (error) {
          console.error('Failed to reload app after RTL change:', error);
        }
      }
    }

    handleDirectionChange();
  }, []);
}