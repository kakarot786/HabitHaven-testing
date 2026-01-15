import { colors, gradients, shadows } from './index';


export const taskStyles = {
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
    base: {
      background: 'rgba(255, 255, 255, 0.75)',
      backdropFilter: 'blur(8px)',
      borderRadius: 2,
      boxShadow: shadows.card.default,
      transition: 'all 0.3s ease',
      '&:hover': {
        transform: 'translateY(-4px)',
        boxShadow: shadows.large
      }
    },
    total: {
      border: `2px solid ${colors.border.main}`,
      iconBg: `linear-gradient(135deg, ${colors.primary.main}, ${colors.primary.dark})`
    },
    completed: {
      border: '2px solid #86efac',
      iconBg: 'linear-gradient(135deg, #22c55e, #16a34a)'
    },
    pending: {
      border: '2px solid #fcd34d',
      iconBg: 'linear-gradient(135deg, #f59e0b, #d97706)'
    },
    today: {
      border: '2px solid #93c5fd',
      iconBg: 'linear-gradient(135deg, #3b82f6, #2563eb)'
    }
  },
  taskCard: {
    base: {
      background: 'rgba(255, 255, 255, 0.75)',
      backdropFilter: 'blur(8px)',
      borderRadius: 2,
      border: `2px solid ${colors.border.light}`,
      transition: 'all 0.2s ease',
      '&:hover': {
        borderColor: colors.primary.main,
        boxShadow: shadows.medium,
        transform: 'translateY(-2px)'
      }
    },
    completed: {
      border: '2px solid #86efac',
      backgroundColor: 'rgba(240, 253, 244, 0.5)'
    },
    incomplete: {
      border: `2px solid ${colors.border.light}`,
    }
  },
  button: {
    primary: {
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
    },
    outlined: {
      borderColor: colors.primary.main,
      color: colors.primary.main,
      borderWidth: 2,
      '&:hover': {
        borderColor: colors.primary.dark,
        backgroundColor: `${colors.primary.main}10`,
        borderWidth: 2
      }
    },
    delete: {
      color: '#dc2626',
      '&:hover': {
        backgroundColor: 'rgba(239, 68, 68, 0.1)'
      }
    }
  },
  filter: {
    select: {
      backgroundColor: 'rgba(255, 255, 255, 0.9)',
      borderRadius: 2,
      '& .MuiOutlinedInput-notchedOutline': {
        borderColor: colors.border.main,
        borderWidth: 2
      },
      '&:hover .MuiOutlinedInput-notchedOutline': {
        borderColor: colors.primary.main
      },
      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
        borderColor: colors.primary.main,
        borderWidth: 2
      }
    }
  },
  dialog: {
    paper: {
      borderRadius: 3,
      background: 'rgba(255, 255, 255, 0.95)',
      backdropFilter: 'blur(10px)'
    },
    textField: {
      '& .MuiOutlinedInput-root': {
        borderRadius: 2,
        '& fieldset': {
          borderColor: colors.border.main,
          borderWidth: 2
        },
        '&:hover fieldset': {
          borderColor: colors.border.main
        },
        '&.Mui-focused fieldset': {
          borderColor: colors.primary.main,
          borderWidth: 2
        }
      }
    }
  },
  emptyState: {
    container: {
      textAlign: 'center',
      py: 8
    },
    icon: {
      fontSize: 80,
      color: colors.text.secondary,
      opacity: 0.5,
      mb: 2
    }
  },
  loading: {
    container: {
      minHeight: 400,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }
  }
};

export default taskStyles;
