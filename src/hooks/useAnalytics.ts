import { useEffect, useRef, useCallback } from 'react';

const ANALYTICS_API_URL = import.meta.env.VITE_ANALYTICS_API_URL || 'https://your-bot-server.com';
const HEARTBEAT_INTERVAL = 30000; // 30 seconds

let sessionId = localStorage.getItem('sp_session_id');
if (!sessionId) {
  sessionId = 'sess_' + Math.random().toString(36).substring(2, 15) + Date.now().toString(36);
  localStorage.setItem('sp_session_id', sessionId);
}

/**
 * useAnalytics hook
 * 
 * Sends heartbeat pings to the analytics server so the admin dashboard
 * can show "who's online" on the web app.
 * 
 * Usage: Call at the app root (e.g. in Layout or App component)
 */
export function useAnalytics(userId?: string, userName?: string) {
  const heartbeatRef = useRef<ReturnType<typeof setInterval> | undefined>(undefined);
  const pageRef = useRef<string>(window.location.pathname);

  const sendHeartbeat = useCallback(() => {
    const page = window.location.hash.replace('#', '') || '/';
    pageRef.current = page;

    fetch(`${ANALYTICS_API_URL}/api/analytics/heartbeat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sessionId,
        userId: userId || null,
        userName: userName || null,
        page
      }),
      keepalive: true
    }).catch(() => {
      // Silent fail - analytics should never break the app
    });
  }, [userId, userName]);

  const logActivity = useCallback((action: string, details?: Record<string, unknown>) => {
    fetch(`${ANALYTICS_API_URL}/api/analytics/activity`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        source: 'web',
        userId: userId || null,
        userName: userName || null,
        action,
        details: details || {}
      }),
      keepalive: true
    }).catch(() => {
      // Silent fail
    });
  }, [userId, userName]);

  useEffect(() => {
    // Send initial heartbeat
    sendHeartbeat();

    // Set up interval
    heartbeatRef.current = setInterval(sendHeartbeat, HEARTBEAT_INTERVAL);

    // Send heartbeat on page visibility change (user returns to tab)
    const handleVisible = () => {
      if (!document.hidden) sendHeartbeat();
    };
    document.addEventListener('visibilitychange', handleVisible);

    return () => {
      if (heartbeatRef.current) clearInterval(heartbeatRef.current);
      document.removeEventListener('visibilitychange', handleVisible);
    };
  }, [sendHeartbeat]);

  return { sessionId, logActivity, sendHeartbeat };
}

/**
 * Standalone function to log a one-off activity event
 */
export function logAnalyticsActivity(action: string, details?: Record<string, unknown>) {
  const sid = localStorage.getItem('sp_session_id');
  fetch(`${ANALYTICS_API_URL}/api/analytics/activity`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      source: 'web',
      sessionId: sid,
      action,
      details: details || {}
    }),
    keepalive: true
  }).catch(() => {});
}
