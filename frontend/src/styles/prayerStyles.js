import { colors, gradients, shadows } from './index';


export const prayerStyles = {
  container: {
    background: gradients.background.primary,
    minHeight: '100vh',
    py: 4
  },
  header: {
    card: {
      background: 'rgba(255, 255, 255, 0.75)',
      backdropFilter: 'blur(8px)',
      border: `2px solid ${colors.border.main}`,
      borderRadius: 2,
      boxShadow: shadows.card.default,
      mb: 4
    }
  },
  statsCard: {
    prayers: {
      background: `linear-gradient(135deg, ${colors.primary.main}, ${colors.primary.dark})`,
      color: 'white',
      boxShadow: shadows.card.default,
      transition: 'all 0.3s ease',
      '&:hover': {
        transform: 'translateY(-4px)',
        boxShadow: shadows.large
      }
    },
    streak: {
      background: 'linear-gradient(135deg, #f59e0b, #d97706)',
      color: 'white',
      boxShadow: shadows.card.default,
      transition: 'all 0.3s ease',
      '&:hover': {
        transform: 'translateY(-4px)',
        boxShadow: shadows.large
      }
    },
    weekly: {
      background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
      color: 'white',
      boxShadow: shadows.card.default,
      transition: 'all 0.3s ease',
      '&:hover': {
        transform: 'translateY(-4px)',
        boxShadow: shadows.large
      }
    },
    level: {
      background: 'linear-gradient(135deg, #06b6d4, #0891b2)',
      color: 'white',
      boxShadow: shadows.card.default,
      transition: 'all 0.3s ease',
      '&:hover': {
        transform: 'translateY(-4px)',
        boxShadow: shadows.large
      }
    }
  },
  prayerCard: {
    base: {
      transition: 'all 0.3s ease',
      cursor: 'pointer',
      borderRadius: 2
    },
    completed: (color) => ({
      border: `2px solid ${color}`,
      backgroundColor: `${color}15`,
      '&:hover': {
        transform: 'none',
        boxShadow: 'none'
      }
    }),
    incomplete: (color) => ({
      border: '2px solid #e5e7eb',
      backgroundColor: 'white',
      '&:hover': {
        transform: 'translateY(-2px)',
        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
        borderColor: color
      }
    }),
    avatar: {
      completed: (color) => ({
        backgroundColor: color,
        color: 'white',
        width: 60,
        height: 60,
        fontSize: '24px',
        mx: 'auto',
        mb: 2
      }),
      incomplete: (color) => ({
        backgroundColor: '#f3f4f6',
        color: color,
        width: 60,
        height: 60,
        fontSize: '24px',
        mx: 'auto',
        mb: 2
      })
    },
    optionalChip: {
      backgroundColor: '#fef3c7',
      color: '#92400e',
      fontSize: '0.75rem'
    }
  },
  progressCard: {
    base: {
      background: 'rgba(255, 255, 255, 0.75)',
      backdropFilter: 'blur(8px)',
      border: `1px solid ${colors.border.light}`,
      borderRadius: 2,
      boxShadow: shadows.card.default
    },
    circularProgress: {
      color: colors.primary.main
    }
  },
  badgeChip: {
    backgroundColor: '#fef3c7',
    color: '#92400e',
    '& .MuiChip-icon': { 
      color: '#f59e0b' 
    }
  },
  statsRow: {
    display: 'flex',
    justifyContent: 'space-between',
    mb: 2
  },
  button: {
    refresh: {
      borderColor: colors.primary.main,
      color: colors.primary.main,
      borderWidth: 2,
      '&:hover': {
        borderColor: colors.primary.dark,
        backgroundColor: `${colors.primary.main}10`,
        borderWidth: 2
      }
    },
    create: {
      backgroundColor: colors.primary.main,
      color: 'white',
      px: 3,
      py: 1.5,
      borderRadius: 2,
      fontWeight: 600,
      boxShadow: shadows.medium,
      '&:hover': {
        backgroundColor: colors.primary.dark,
        transform: 'translateY(-2px)',
        boxShadow: shadows.large
      },
      transition: 'all 0.3s ease'
    }
  },
  emptyState: {
    container: {
      textAlign: 'center',
      py: 4
    },
    icon: {
      fontSize: 64,
      color: colors.text.secondary,
      mb: 2
    }
  },
  loading: {
    container: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: 400
    },
    spinner: {
      color: colors.primary.main,
      mb: 2
    }
  },
  prayerColors: {
    'Fajar': { color: '#6366f1', icon: '🌅', time: 'Dawn' },
    'Dhuhr': { color: '#eab308', icon: '☀️', time: 'Noon' },
    'Asr': { color: '#f97316', icon: '🌤️', time: 'Afternoon' },
    'Maghrib': { color: '#ec4899', icon: '🌅', time: 'Sunset' },
    'Isha': { color: '#6366f1', icon: '🌙', time: 'Night' },
    'Tahajjud': { color: '#8b5cf6', icon: '⭐', time: 'Pre-Dawn' }
  }
};

export default prayerStyles;
