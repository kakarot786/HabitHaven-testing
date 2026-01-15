import { colors, gradients, shadows } from './index';


export const dashboardStyles = {
  statsCard: {
    frostedGlass: {
      background: 'rgba(255, 255, 255, 0.75)',
      backdropFilter: 'blur(8px)',
      borderRadius: 2,
      boxShadow: shadows.card.default,
      '&:hover': {
        transform: 'translateY(-4px)',
        boxShadow: shadows.large,
        transition: 'all 0.3s ease'
      }
    },
    prayers: {
      border: `2px solid ${colors.border.main}`,
    },
    tasks: {
      border: `2px solid #93c5fd`,
    },
    streak: {
      border: `2px solid #fcd34d`,
    },
    level: {
      border: `2px solid #c4b5fd`,
    }
  },
  iconContainer: {
    prayers: {
      width: 56,
      height: 56,
      borderRadius: 2,
      background: `linear-gradient(135deg, ${colors.primary.main}, ${colors.primary.dark})`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      boxShadow: shadows.medium
    },
    tasks: {
      width: 56,
      height: 56,
      borderRadius: 2,
      background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)'
    },
    streak: {
      width: 56,
      height: 56,
      borderRadius: 2,
      background: 'linear-gradient(135deg, #f59e0b, #d97706)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      boxShadow: '0 4px 12px rgba(245, 158, 11, 0.3)'
    },
    level: {
      width: 56,
      height: 56,
      borderRadius: 2,
      background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      boxShadow: '0 4px 12px rgba(139, 92, 246, 0.3)'
    }
  },
  progressBar: {
    mt: 2,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.background.secondary,
    '& .MuiLinearProgress-bar': { 
      backgroundColor: colors.primary.main,
      borderRadius: 4
    }
  },
  activityCard: {
    prayer: {
      p: 2,
      backgroundColor: '#f0fdf4',
      border: '1px solid #bbf7d0',
      borderRadius: 2,
      '&:hover': {
        boxShadow: shadows.medium,
        transform: 'translateY(-2px)',
        transition: 'all 0.2s ease'
      }
    },
    task: {
      p: 2,
      backgroundColor: '#eff6ff',
      border: '1px solid #bfdbfe',
      borderRadius: 2,
      '&:hover': {
        boxShadow: shadows.medium,
        transform: 'translateY(-2px)',
        transition: 'all 0.2s ease'
      }
    }
  },
  drawer: {
    width: 280,
    paper: {
      backgroundColor: 'rgba(248, 250, 252, 0.98)',
      backdropFilter: 'blur(10px)',
      borderRight: `1px solid ${colors.border.light}`
    },
    logoContainer: {
      width: 64,
      height: 64,
      background: `linear-gradient(135deg, ${colors.primary.main}, ${colors.primary.dark})`,
      borderRadius: 3,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      boxShadow: shadows.medium,
      border: `2px solid ${colors.border.main}`
    },
    menuItem: {
      borderRadius: 2,
      mb: 0.5,
      '&:hover': {
        transform: 'translateX(4px)',
        transition: 'all 0.2s ease'
      }
    },
    menuItemActive: {
      backgroundColor: `${colors.primary.main}15`,
      border: `2px solid ${colors.primary.main}`,
    },
    menuItemInactive: {
      border: '2px solid transparent',
      backgroundColor: 'transparent',
      '&:hover': {
        backgroundColor: 'rgba(0, 0, 0, 0.04)',
      }
    },
    logoutButton: {
      borderColor: 'rgba(239, 68, 68, 0.4)',
      color: '#dc2626',
      borderWidth: 2,
      py: 1.5,
      '&:hover': {
        borderColor: '#dc2626',
        backgroundColor: 'rgba(239, 68, 68, 0.05)',
        borderWidth: 2
      }
    }
  },
  appBar: {
    backgroundColor: 'rgba(248, 250, 252, 0.95)',
    backdropFilter: 'blur(10px)',
    color: colors.text.primary,
    boxShadow: shadows.small,
    borderBottom: `1px solid ${colors.border.light}`
  },
  loadingScreen: {
    container: {
      minHeight: '100vh',
      background: gradients.background.primary,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    },
    logoBox: {
      width: 80,
      height: 80,
      background: 'rgba(255, 255, 255, 0.75)',
      borderRadius: 3,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      mx: 'auto',
      mb: 3,
      boxShadow: shadows.avatar,
      border: `1px solid ${colors.border.main}`,
      backdropFilter: 'blur(8px)'
    }
  },
  comingSoon: {
    card: {
      background: 'rgba(255, 255, 255, 0.75)',
      backdropFilter: 'blur(8px)',
      p: 4,
      textAlign: 'center',
      borderRadius: 2,
      border: `1px solid ${colors.border.light}`,
      boxShadow: shadows.card.default
    }
  }
};

export default dashboardStyles;
