export const Colors = {
  // Primary Colors (WhatsApp Green)
  primary: '#25D366',
  primaryDark: '#128C7E',
  primaryLight: '#DCF8C6',
  
  // Secondary Colors
  secondary: '#34B7F1',
  accent: '#FF6B6B',
  
  // Status Colors
  success: '#4CAF50',
  warning: '#FF9800',
  error: '#F44336',
  info: '#2196F3',
  
  // Neutral Colors
  white: '#FFFFFF',
  black: '#000000',
  
  // Gray Scale
  gray50: '#FAFAFA',
  gray100: '#F5F5F5',
  gray200: '#EEEEEE',
  gray300: '#E0E0E0',
  gray400: '#BDBDBD',
  gray500: '#9E9E9E',
  gray600: '#757575',
  gray700: '#616161',
  gray800: '#424242',
  gray900: '#212121',
  
  // Text Colors
  textPrimary: '#212121',
  textSecondary: '#757575',
  textDisabled: '#BDBDBD',
  
  // Background Colors
  backgroundPrimary: '#FFFFFF',
  backgroundSecondary: '#F5F5F5',
  backgroundChat: '#E5DDD5',
  
  // Border Colors
  border: '#E0E0E0',
  borderLight: '#F0F0F0',
  
  // Message Bubble Colors
  messageBubbleUser: '#25D366',
  messageBubbleOther: '#FFFFFF',
  
  // Status Indicators
  statusOnline: '#4CAF50',
  statusOffline: '#BDBDBD',
  statusTyping: '#FF9800',
  
  // Dark Theme Colors
  dark: {
    background: '#121212',
    surface: '#1E1E1E',
    primary: '#25D366',
    text: '#FFFFFF',
    textSecondary: '#AAAAAA',
  }
};

export const getStatusColor = (status: 'sent' | 'delivered' | 'read'): string => {
  switch (status) {
    case 'sent':
      return Colors.gray400;
    case 'delivered':
      return Colors.gray600;
    case 'read':
      return Colors.primary;
    default:
      return Colors.gray400;
  }
};