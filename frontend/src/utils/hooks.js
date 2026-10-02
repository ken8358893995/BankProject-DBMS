import { useEffect, useState } from 'react';

// Returns "Good Morning", "Good Afternoon", or "Good Evening"
export function useTimeGreeting() {
  const [greeting, setGreeting] = useState('');

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('☀️ Good Morning');
    else if (hour < 17) setGreeting('🌤️ Good Afternoon');
    else setGreeting('🌙 Good Evening');
  }, []);

  return greeting;
}

// Returns a countdown timer string from tokenExpiration in localStorage
export function useSessionTimer() {
  const [timeLeft, setTimeLeft] = useState('');

  useEffect(() => {
    const interval = setInterval(() => {
      const exp = localStorage.getItem('tokenExpiration');
      if (!exp) { setTimeLeft(''); return; }
      const diff = Math.max(0, parseInt(exp) - Date.now());
      const minutes = Math.floor(diff / 60000);
      const seconds = Math.floor((diff % 60000) / 1000);
      setTimeLeft(`${minutes}:${seconds.toString().padStart(2, '0')}`);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return timeLeft;
}
