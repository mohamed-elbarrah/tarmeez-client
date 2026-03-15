'use client';

import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

export interface CountdownTimerProps {
  targetDate: string;
  title: string;
  expiredMessage: string;
  showDays: boolean;
  showHours: boolean;
  showMinutes: boolean;
  showSeconds: boolean;
  align: 'right' | 'center' | 'left';
  size: 'sm' | 'md' | 'lg';
}

interface TimeRemaining {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  expired: boolean;
}

export const CountdownTimer = ({
  targetDate,
  title,
  expiredMessage,
  showDays,
  showHours,
  showMinutes,
  showSeconds,
  align,
  size,
}: CountdownTimerProps) => {
  const [timeLeft, setTimeLeft] = useState<TimeRemaining>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    expired: false,
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = +new Date(targetDate) - +new Date();
      
      if (difference <= 0) {
        return { days: 0, hours: 0, minutes: 0, seconds: 0, expired: true };
      }

      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
        expired: false,
      };
    };

    setTimeLeft(calculateTimeLeft());
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  const alignClass = {
    right: 'justify-end text-right',
    center: 'justify-center text-center',
    left: 'justify-start text-left',
  }[align];

  const sizeClass = {
    sm: 'text-xl w-12 h-12',
    md: 'text-3xl w-20 h-20',
    lg: 'text-5xl w-28 h-28',
  }[size];

  const labelClass = {
    sm: 'text-[10px]',
    md: 'text-xs',
    lg: 'text-sm',
  }[size];

  if (timeLeft.expired) {
    return (
      <div className={cn('flex flex-col gap-4', alignClass)}>
        <p className="text-2xl font-bold text-[var(--p-color)]">{expiredMessage}</p>
      </div>
    );
  }

  const TimeBox = ({ value, label }: { value: number; label: string }) => (
    <div className="flex flex-col items-center gap-2">
      <div
        className={cn(
          'flex items-center justify-center bg-[var(--p-color)] text-white rounded-2xl shadow-lg font-mono font-bold',
          sizeClass
        )}
      >
        {String(value).padStart(2, '0')}
      </div>
      <span className={cn('font-bold text-[var(--t-color)] opacity-60 uppercase tracking-wider', labelClass)}>
        {label}
      </span>
    </div>
  );

  return (
    <div className={cn('flex flex-col gap-6', alignClass === 'justify-center text-center' ? 'items-center' : '')}>
      {title && <h3 className="text-xl md:text-2xl font-bold text-[var(--h-color)]">{title}</h3>}
      <div className={cn('flex flex-row-reverse gap-4', alignClass)}>
        {showDays && <TimeBox value={timeLeft.days} label="أيام" />}
        {showHours && <TimeBox value={timeLeft.hours} label="ساعة" />}
        {showMinutes && <TimeBox value={timeLeft.minutes} label="دقيقة" />}
        {showSeconds && <TimeBox value={timeLeft.seconds} label="ثانية" />}
      </div>
    </div>
  );
};

CountdownTimer.defaultProps = {
  targetDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
  title: 'ينتهي العرض خلال',
  expiredMessage: 'انتهى العرض',
  showDays: true,
  showHours: true,
  showMinutes: true,
  showSeconds: true,
  align: 'center',
  size: 'md',
};

export default CountdownTimer;
