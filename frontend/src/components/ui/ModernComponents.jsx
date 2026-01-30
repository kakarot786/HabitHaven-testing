import React from 'react';
import { Box, Typography, keyframes } from '@mui/material';
import {
  Flame,
  Trophy,
  Target,
  Zap,
  TrendingUp,
  Star,
  CheckCircle2,
  Clock,
  Calendar,
  Sparkles,
  Award,
  Crown,
  Heart,
  Moon,
  Sun,
  Sunrise,
  Sunset,
  CloudSun
} from 'lucide-react';

// Animation keyframes
const pulse = keyframes`
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
`;

const shimmer = keyframes`
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
`;

const float = keyframes`
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-5px); }
`;

const glow = keyframes`
  0%, 100% { box-shadow: 0 0 5px rgba(99, 102, 241, 0.5), 0 0 10px rgba(99, 102, 241, 0.3); }
  50% { box-shadow: 0 0 20px rgba(99, 102, 241, 0.8), 0 0 30px rgba(99, 102, 241, 0.5); }
`;

// Circular Progress Ring Component
export const CircularProgress = ({ 
  value = 0, 
  size = 120, 
  strokeWidth = 8, 
  color = '#6366f1',
  bgColor = '#e2e8f0',
  children,
  showPercentage = true,
  animated = true
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (value / 100) * circumference;

  return (
    <Box sx={{ position: 'relative', width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={bgColor}
          strokeWidth={strokeWidth}
        />
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={`url(#gradient-${color.replace('#', '')})`}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{
            transition: animated ? 'stroke-dashoffset 1s ease-out' : 'none',
          }}
        />
        {/* Gradient definition */}
        <defs>
          <linearGradient id={`gradient-${color.replace('#', '')}`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={color} />
            <stop offset="100%" stopColor={color + 'cc'} />
          </linearGradient>
        </defs>
      </svg>
      {/* Center content */}
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          textAlign: 'center',
        }}
      >
        {children || (showPercentage && (
          <Typography 
            variant="h4" 
            sx={{ 
              fontWeight: 700, 
              color: color,
              fontSize: size * 0.2,
            }}
          >
            {Math.round(value)}%
          </Typography>
        ))}
      </Box>
    </Box>
  );
};

// Animated Streak Fire Icon
export const StreakFire = ({ count = 0, size = 'medium' }) => {
  const sizeMap = {
    small: { icon: 24, text: '1rem', container: 48 },
    medium: { icon: 32, text: '1.25rem', container: 64 },
    large: { icon: 48, text: '1.75rem', container: 80 },
  };
  
  const s = sizeMap[size] || sizeMap.medium;
  const isActive = count > 0;

  return (
    <Box
      sx={{
        position: 'relative',
        width: s.container,
        height: s.container,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: '50%',
        background: isActive 
          ? 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)'
          : '#f1f5f9',
        animation: isActive ? `${float} 3s ease-in-out infinite` : 'none',
      }}
    >
      <Flame 
        size={s.icon} 
        color={isActive ? '#f97316' : '#94a3b8'}
        fill={isActive ? '#fdba74' : 'transparent'}
        style={{
          filter: isActive ? 'drop-shadow(0 0 8px rgba(249, 115, 22, 0.5))' : 'none',
        }}
      />
      {count > 0 && (
        <Box
          sx={{
            position: 'absolute',
            bottom: -4,
            right: -4,
            backgroundColor: '#f97316',
            color: 'white',
            borderRadius: '10px',
            padding: '2px 8px',
            fontSize: '0.75rem',
            fontWeight: 700,
            boxShadow: '0 2px 8px rgba(249, 115, 22, 0.4)',
          }}
        >
          {count}
        </Box>
      )}
    </Box>
  );
};

// Modern Stat Card
export const StatCard = ({
  title,
  value,
  subtitle,
  icon: Icon,
  gradient = 'indigo',
  trend,
  trendValue,
}) => {
  const gradientMap = {
    indigo: { bg: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)', light: '#e0e7ff' },
    emerald: { bg: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', light: '#d1fae5' },
    amber: { bg: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)', light: '#fef3c7' },
    rose: { bg: 'linear-gradient(135deg, #f43f5e 0%, #e11d48 100%)', light: '#ffe4e6' },
    violet: { bg: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)', light: '#ede9fe' },
    cyan: { bg: 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)', light: '#cffafe' },
    orange: { bg: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)', light: '#ffedd5' },
    blue: { bg: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)', light: '#dbeafe' },
  };

  const g = gradientMap[gradient] || gradientMap.indigo;

  return (
    <Box
      sx={{
        position: 'relative',
        backgroundColor: 'white',
        borderRadius: 4,
        padding: 3,
        overflow: 'hidden',
        boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        border: '1px solid #f1f5f9',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
        },
      }}
    >
      {/* Decorative gradient bar */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: 4,
          background: g.bg,
          borderRadius: '16px 16px 0 0',
        }}
      />
      
      <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <Box>
          <Typography 
            variant="body2" 
            sx={{ 
              color: '#64748b', 
              fontWeight: 500,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              fontSize: '0.75rem',
              mb: 1,
            }}
          >
            {title}
          </Typography>
          <Typography 
            variant="h3" 
            sx={{ 
              fontWeight: 700, 
              color: '#1e293b',
              lineHeight: 1,
              mb: 0.5,
            }}
          >
            {value}
          </Typography>
          {subtitle && (
            <Typography 
              variant="body2" 
              sx={{ 
                color: '#94a3b8',
                fontSize: '0.875rem',
              }}
            >
              {subtitle}
            </Typography>
          )}
          {trend && (
            <Box sx={{ display: 'flex', alignItems: 'center', mt: 1, gap: 0.5 }}>
              <TrendingUp size={14} color={trend === 'up' ? '#10b981' : '#ef4444'} />
              <Typography 
                variant="caption" 
                sx={{ 
                  color: trend === 'up' ? '#10b981' : '#ef4444',
                  fontWeight: 600,
                }}
              >
                {trendValue}
              </Typography>
            </Box>
          )}
        </Box>
        
        {/* Icon container */}
        <Box
          sx={{
            width: 48,
            height: 48,
            borderRadius: 3,
            background: g.bg,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: `0 4px 14px ${g.light}`,
          }}
        >
          {Icon && <Icon size={24} color="white" />}
        </Box>
      </Box>
    </Box>
  );
};

// Achievement Badge
export const AchievementBadge = ({ 
  icon: Icon = Award, 
  title, 
  unlocked = false,
  color = '#6366f1'
}) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 1,
        opacity: unlocked ? 1 : 0.4,
        filter: unlocked ? 'none' : 'grayscale(100%)',
        transition: 'all 0.3s ease',
      }}
    >
      <Box
        sx={{
          width: 56,
          height: 56,
          borderRadius: '50%',
          background: unlocked 
            ? `linear-gradient(135deg, ${color} 0%, ${color}cc 100%)`
            : '#e2e8f0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: unlocked 
            ? `0 4px 14px ${color}40`
            : 'none',
          animation: unlocked ? `${pulse} 2s ease-in-out infinite` : 'none',
        }}
      >
        <Icon size={28} color={unlocked ? 'white' : '#94a3b8'} />
      </Box>
      <Typography 
        variant="caption" 
        sx={{ 
          fontWeight: 500, 
          color: unlocked ? '#1e293b' : '#94a3b8',
          textAlign: 'center',
        }}
      >
        {title}
      </Typography>
    </Box>
  );
};

// XP Progress Bar
export const XPProgressBar = ({ current, max, level }) => {
  const percentage = (current / max) * 100;
  
  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Sparkles size={16} color="#8b5cf6" />
          <Typography variant="body2" sx={{ fontWeight: 600, color: '#1e293b' }}>
            Level {level}
          </Typography>
        </Box>
        <Typography variant="caption" sx={{ color: '#64748b' }}>
          {current} / {max} XP
        </Typography>
      </Box>
      <Box
        sx={{
          height: 8,
          borderRadius: 4,
          backgroundColor: '#e2e8f0',
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        <Box
          sx={{
            height: '100%',
            width: `${percentage}%`,
            borderRadius: 4,
            background: 'linear-gradient(90deg, #8b5cf6 0%, #6366f1 50%, #a78bfa 100%)',
            backgroundSize: '200% 100%',
            animation: `${shimmer} 2s linear infinite`,
            transition: 'width 0.5s ease-out',
          }}
        />
      </Box>
    </Box>
  );
};

// Prayer Time Icon mapping
export const getPrayerIcon = (prayerName) => {
  const iconMap = {
    'Fajar': Sunrise,
    'Fajr': Sunrise,
    'Dhuhr': Sun,
    'Asr': CloudSun,
    'Maghrib': Sunset,
    'Isha': Moon,
    'Tahajjud': Star,
  };
  return iconMap[prayerName] || Sun;
};

// Prayer colors mapping
export const getPrayerColor = (prayerName) => {
  const colorMap = {
    'Fajar': { main: '#6366f1', light: '#e0e7ff', gradient: 'linear-gradient(135deg, #6366f1 0%, #818cf8 100%)' },
    'Fajr': { main: '#6366f1', light: '#e0e7ff', gradient: 'linear-gradient(135deg, #6366f1 0%, #818cf8 100%)' },
    'Dhuhr': { main: '#f59e0b', light: '#fef3c7', gradient: 'linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%)' },
    'Asr': { main: '#f97316', light: '#ffedd5', gradient: 'linear-gradient(135deg, #f97316 0%, #fb923c 100%)' },
    'Maghrib': { main: '#ec4899', light: '#fce7f3', gradient: 'linear-gradient(135deg, #ec4899 0%, #f472b6 100%)' },
    'Isha': { main: '#6366f1', light: '#e0e7ff', gradient: 'linear-gradient(135deg, #4f46e5 0%, #6366f1 100%)' },
    'Tahajjud': { main: '#8b5cf6', light: '#ede9fe', gradient: 'linear-gradient(135deg, #8b5cf6 0%, #a78bfa 100%)' },
  };
  return colorMap[prayerName] || colorMap['Dhuhr'];
};

// Modern Checkbox/Toggle for prayers
export const PrayerCheckbox = ({ checked, onChange, prayerName }) => {
  const colors = getPrayerColor(prayerName);
  
  return (
    <Box
      onClick={onChange}
      sx={{
        width: 28,
        height: 28,
        borderRadius: '50%',
        border: `2px solid ${checked ? colors.main : '#e2e8f0'}`,
        backgroundColor: checked ? colors.main : 'transparent',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        '&:hover': {
          borderColor: colors.main,
          transform: 'scale(1.1)',
        },
      }}
    >
      {checked && <CheckCircle2 size={18} color="white" />}
    </Box>
  );
};

export default {
  CircularProgress,
  StreakFire,
  StatCard,
  AchievementBadge,
  XPProgressBar,
  getPrayerIcon,
  getPrayerColor,
  PrayerCheckbox,
};
