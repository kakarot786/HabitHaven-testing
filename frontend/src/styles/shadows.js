

import { colors } from './colors';

export const shadows = {
  // Soft elevation shadows
  sm: `0 1px 2px 0 rgb(0 0 0 / 0.05)`,
  md: `0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)`,
  lg: `0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)`,
  xl: `0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)`,
  '2xl': `0 25px 50px -12px rgb(0 0 0 / 0.25)`,
  
  // Colored glow shadows
  glow: {
    indigo: `0 0 20px rgba(99, 102, 241, 0.3), 0 0 40px rgba(99, 102, 241, 0.15)`,
    emerald: `0 0 20px rgba(16, 185, 129, 0.3), 0 0 40px rgba(16, 185, 129, 0.15)`,
    amber: `0 0 20px rgba(245, 158, 11, 0.3), 0 0 40px rgba(245, 158, 11, 0.15)`,
    rose: `0 0 20px rgba(244, 63, 94, 0.3), 0 0 40px rgba(244, 63, 94, 0.15)`,
    violet: `0 0 20px rgba(139, 92, 246, 0.3), 0 0 40px rgba(139, 92, 246, 0.15)`,
    cyan: `0 0 20px rgba(6, 182, 212, 0.3), 0 0 40px rgba(6, 182, 212, 0.15)`,
  },
  
  button: {
    default: `0 4px 14px rgba(99, 102, 241, 0.25)`,
    hover: `0 8px 25px rgba(99, 102, 241, 0.35)`,
    active: `0 2px 8px rgba(99, 102, 241, 0.2)`,
  },
  card: {
    default: `0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)`,
    hover: `0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)`,
    elevated: `0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)`,
  },
  avatar: `0 8px 24px rgba(99, 102, 241, 0.25)`,
  inner: `inset 0 2px 4px 0 rgb(0 0 0 / 0.05)`,
  none: 'none',
  
  // Legacy aliases
  small: `0 1px 2px 0 rgb(0 0 0 / 0.05)`,
  medium: `0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)`,
  large: `0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)`,
};

export default shadows;
