import { colors, gradients, shadows } from './index';

export const challengeStyles = {
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
  tabButton: {
    active: {
      backgroundColor: colors.primary.main,
      color: 'white',
      px: 4,
      py: 1.5,
      borderRadius: 2,
      fontWeight: 600,
      boxShadow: shadows.medium,
      '&:hover': {
        backgroundColor: colors.primary.dark
      }
    },
    inactive: {
      backgroundColor: 'rgba(255, 255, 255, 0.75)',
      color: colors.text.primary,
      px: 4,
      py: 1.5,
      borderRadius: 2,
      border: `2px solid ${colors.border.main}`,
      fontWeight: 500,
      '&:hover': {
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        borderColor: colors.primary.main
      }
    }
  },
  challengeCard: {
    base: {
      background: 'rgba(255, 255, 255, 0.75)',
      backdropFilter: 'blur(8px)',
      borderRadius: 2,
      border: `2px solid ${colors.border.light}`,
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      transition: 'all 0.3s ease',
      '&:hover': {
        transform: 'translateY(-6px)',
        boxShadow: shadows.large,
        borderColor: colors.primary.main
      }
    },
    active: {
      borderColor: '#4caf50',
      borderWidth: 2
    },
    completed: {
      borderColor: '#2196f3',
      borderWidth: 2,
      background: 'rgba(33, 150, 243, 0.05)'
    },
    expired: {
      borderColor: '#9e9e9e',
      borderWidth: 2,
      opacity: 0.7
    },
    header: {
      background: `linear-gradient(135deg, ${colors.primary.main}, ${colors.primary.dark})`,
      color: 'white',
      p: 3,
      borderTopLeftRadius: 8,
      borderTopRightRadius: 8
    }
  },
  progressBar: {
    container: {
      width: '100%',
      height: 8,
      backgroundColor: colors.background.secondary,
      borderRadius: 4,
      overflow: 'hidden',
      mb: 2
    },
    fill: {
      height: '100%',
      background: `linear-gradient(90deg, ${colors.primary.main}, ${colors.primary.light})`,
      transition: 'width 0.3s ease',
      borderRadius: 4
    }
  },
  statsCard: {
    base: {
      background: 'rgba(255, 255, 255, 0.75)',
      backdropFilter: 'blur(8px)',
      border: `2px solid ${colors.border.light}`,
      borderRadius: 2,
      p: 3,
      transition: 'all 0.3s ease',
      '&:hover': {
        transform: 'translateY(-4px)',
        boxShadow: shadows.large
      }
    }
  },
  createDialog: {
    content: {
      pt: 2
    },
    textField: {
      mb: 2,
      '& .MuiOutlinedInput-root': {
        '&:hover fieldset': {
          borderColor: colors.primary.main
        },
        '&.Mui-focused fieldset': {
          borderColor: colors.primary.main,
          borderWidth: 2
        }
      }
    }
  },
  statusChip: {
    active: {
      backgroundColor: '#e8f5e9',
      color: '#2e7d32',
      fontWeight: 600,
      fontSize: '0.875rem'
    },
    completed: {
      backgroundColor: '#e3f2fd',
      color: '#1565c0',
      fontWeight: 600,
      fontSize: '0.875rem'
    },
    expired: {
      backgroundColor: '#f5f5f5',
      color: '#616161',
      fontWeight: 600,
      fontSize: '0.875rem'
    }
  },
  emptyState: {
    container: {
      textAlign: 'center',
      py: 8,
      px: 4
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
  },
  dayIndicator: {
    container: {
      display: 'flex',
      alignItems: 'center',
      gap: 1,
      mb: 2
    },
    text: {
      fontSize: '1.25rem',
      fontWeight: 'bold',
      color: colors.text.primary
    }
  },
  participantsList: {
    container: {
      maxHeight: 300,
      overflowY: 'auto',
      '&::-webkit-scrollbar': {
        width: 8
      },
      '&::-webkit-scrollbar-thumb': {
        background: colors.primary.main,
        borderRadius: 4
      }
    }
  }
};

export default challengeStyles;
