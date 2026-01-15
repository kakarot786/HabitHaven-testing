

import { colors } from './colors';

export const gradients = {
  background: {
    main: `linear-gradient(to bottom right, ${colors.background.gradient.start} 0%, ${colors.background.gradient.end} 100%)`,
    primary: `linear-gradient(to bottom right, #e0f2fe 0%, #bae6fd 100%)`, // sky-100 to sky-200
    light: `linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)`, // sky-50 to sky-100
    vertical: `linear-gradient(to bottom, ${colors.background.gradient.start}, ${colors.background.gradient.end})`,
  },
  primary: {
    main: `linear-gradient(135deg, ${colors.primary.main} 0%, ${colors.primary.dark} 100%)`,
    light: `linear-gradient(135deg, ${colors.primary.light} 0%, ${colors.primary.main} 100%)`,
    vertical: `linear-gradient(to bottom, ${colors.primary.main}, ${colors.primary.dark})`,
  },
  button: {
    primary: `linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)`, // sky-500 to sky-600 (lighter)
    hover: `linear-gradient(135deg, #0284c7 0%, #0369a1 100%)`, // sky-600 to sky-700
    secondary: `linear-gradient(135deg, #7dd3fc 0%, #38bdf8 100%)`, // sky-300 to sky-400
  },
  header: {
    main: `linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)`, // sky-500 to sky-600
    light: `linear-gradient(135deg, #38bdf8 0%, #0ea5e9 100%)`, // sky-400 to sky-500
  },
  overlay: {
    light: 'linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(255, 255, 255, 0.7) 100%)',
    medium: 'linear-gradient(135deg, rgba(255, 255, 255, 0.7) 0%, rgba(255, 255, 255, 0.5) 100%)',
  },
};

export default gradients;
