

import { colors } from './colors';

export const gradients = {
  background: {
    main: `linear-gradient(135deg, #f8fafc 0%, #e0e7ff 50%, #f0f9ff 100%)`,
    primary: `linear-gradient(135deg, #f8fafc 0%, #e0e7ff 100%)`,
    light: `linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)`,
    vertical: `linear-gradient(180deg, #f8fafc 0%, #e0e7ff 100%)`,
    mesh: `radial-gradient(at 40% 20%, hsla(240, 100%, 97%, 1) 0px, transparent 50%),
           radial-gradient(at 80% 0%, hsla(189, 100%, 97%, 1) 0px, transparent 50%),
           radial-gradient(at 0% 50%, hsla(280, 100%, 97%, 1) 0px, transparent 50%),
           radial-gradient(at 80% 50%, hsla(340, 100%, 97%, 1) 0px, transparent 50%),
           radial-gradient(at 0% 100%, hsla(210, 100%, 97%, 1) 0px, transparent 50%)`,
  },
  primary: {
    main: `linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)`,
    light: `linear-gradient(135deg, #818cf8 0%, #6366f1 100%)`,
    vertical: `linear-gradient(180deg, #6366f1 0%, #4f46e5 100%)`,
  },
  button: {
    primary: `linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)`,
    hover: `linear-gradient(135deg, #4f46e5 0%, #4338ca 100%)`,
    secondary: `linear-gradient(135deg, #a5b4fc 0%, #818cf8 100%)`,
  },
  header: {
    main: `linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)`,
    light: `linear-gradient(135deg, #818cf8 0%, #a78bfa 100%)`,
  },
  overlay: {
    light: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.85) 100%)',
    medium: 'linear-gradient(135deg, rgba(255, 255, 255, 0.8) 0%, rgba(255, 255, 255, 0.6) 100%)',
  },
  card: {
    indigo: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
    emerald: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
    amber: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
    rose: 'linear-gradient(135deg, #f43f5e 0%, #e11d48 100%)',
    violet: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
    cyan: 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)',
    orange: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)',
    pink: 'linear-gradient(135deg, #ec4899 0%, #db2777 100%)',
    blue: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
    teal: 'linear-gradient(135deg, #14b8a6 0%, #0d9488 100%)',
  },
};

export default gradients;
