import { Toaster, toast } from 'sonner-native';
import { useTheme } from '../../theme';

export function ToastProvider() {
  const { isDark } = useTheme();

  return (
    <Toaster
      position="bottom-center"
      offset={100}
      duration={3000}
      visibleToasts={2}
      toastOptions={{
        style: {
          backgroundColor: isDark ? '#F0F0F0' : '#1A1A1A',
          borderRadius: 8,
        },
        titleStyle: {
          color: isDark ? '#1A1A1A' : '#F0F0F0',
          fontFamily: 'Inter_500Medium',
          fontSize: 14,
        },
      }}
    />
  );
}

export const showToast = {
  success: (msg: string) => toast.success(msg),
  error: (msg: string, retry?: () => void) =>
    toast.error(msg, {
      action: retry
        ? { label: 'Retry', onClick: retry }
        : undefined,
      duration: 5000,
    }),
  info: (msg: string) => toast(msg),
};
