import { colors, gradients, shadows } from './index';


export const groupStyles = {
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
  groupCard: {
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
    header: {
      background: `linear-gradient(135deg, ${colors.primary.main}, ${colors.primary.dark})`,
      color: 'white',
      p: 3,
      borderTopLeftRadius: 8,
      borderTopRightRadius: 8
    },
    avatar: {
      width: 64,
      height: 64,
      background: 'rgba(255, 255, 255, 0.2)',
      backdropFilter: 'blur(10px)',
      border: '3px solid rgba(255, 255, 255, 0.3)',
      fontSize: '2rem',
      fontWeight: 'bold',
      mx: 'auto',
      mb: 2
    },
    memberBadge: {
      backgroundColor: 'rgba(255, 255, 255, 0.2)',
      color: 'white',
      fontWeight: 600,
      px: 2,
      py: 0.5,
      borderRadius: 2
    }
  },
  searchBar: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 3,
    '& .MuiOutlinedInput-root': {
      '& fieldset': {
        borderColor: colors.border.main,
        borderWidth: 2
      },
      '&:hover fieldset': {
        borderColor: colors.primary.main
      },
      '&.Mui-focused fieldset': {
        borderColor: colors.primary.main,
        borderWidth: 2
      }
    }
  },
  button: {
    join: {
      backgroundColor: colors.primary.main,
      color: 'white',
      fontWeight: 600,
      px: 3,
      py: 1,
      borderRadius: 2,
      boxShadow: shadows.medium,
      '&:hover': {
        backgroundColor: colors.primary.dark,
        transform: 'translateY(-2px)',
        boxShadow: shadows.large
      },
      transition: 'all 0.3s ease'
    },
    joined: {
      backgroundColor: '#22c55e',
      color: 'white',
      fontWeight: 600,
      px: 3,
      py: 1,
      borderRadius: 2,
      '&:hover': {
        backgroundColor: '#16a34a'
      }
    },
    create: {
      position: 'fixed',
      bottom: 24,
      right: 24,
      background: `linear-gradient(135deg, ${colors.primary.main}, ${colors.primary.dark})`,
      color: 'white',
      boxShadow: shadows.large,
      '&:hover': {
        background: `linear-gradient(135deg, ${colors.primary.dark}, ${colors.primary.main})`,
        transform: 'scale(1.1)',
        boxShadow: shadows.large
      },
      transition: 'all 0.3s ease'
    }
  },
  dialog: {
    paper: {
      borderRadius: 3,
      background: 'rgba(255, 255, 255, 0.95)',
      backdropFilter: 'blur(10px)',
      minWidth: 500
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
  statsChip: {
    created: {
      backgroundColor: '#dbeafe',
      color: '#1e40af',
      fontWeight: 600,
      fontSize: '0.875rem'
    },
    admin: {
      backgroundColor: '#fef3c7',
      color: '#92400e',
      fontWeight: 600,
      fontSize: '0.875rem'
    }
  }
};

export default groupStyles;
