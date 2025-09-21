/**
 * Helpers for Alarm logic
 */
export const getMinuteKey = (d) =>
  `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}-${d.getHours()}-${d.getMinutes()}`;

export const formatDisplayTime = (time24) => {
  const [hours, minutes] = time24.split(':').map(Number);
  const ampm = hours >= 12 ? 'PM' : 'AM';
  const displayHours = hours % 12 || 12;
  return {
    time: `${displayHours}:${minutes.toString().padStart(2, '0')}`,
    ampm,
  };
};

export const shouldTriggerToday = (repeatPattern, currentDate) => {
  if (!repeatPattern) return true;

  const dayOfWeek = currentDate.getDay();
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const todayName = dayNames[dayOfWeek];
  const pattern = repeatPattern.toLowerCase();

  if (pattern.includes('everyday') || pattern.includes('daily')) return true;
  if (pattern.includes('weekday') || pattern.includes('mon–fri') || pattern.includes('mon-fri')) {
    return dayOfWeek >= 1 && dayOfWeek <= 5;
  }
  if (pattern.includes('weekend') || pattern.includes('sat–sun') || pattern.includes('sat-sun')) {
    return dayOfWeek === 0 || dayOfWeek === 6;
  }
  if (pattern.includes(todayName.toLowerCase())) return true;

  const rangeMatch = pattern.replace(/–/g, '-').match(/([a-z]{3})-([a-z]{3})/);
  if (rangeMatch) {
    const [, startDay, endDay] = rangeMatch;
    const startIndex = dayNames.findIndex((d) => d.toLowerCase() === startDay);
    const endIndex = dayNames.findIndex((d) => d.toLowerCase() === endDay);

    if (startIndex !== -1 && endIndex !== -1) {
      if (startIndex <= endIndex) return dayOfWeek >= startIndex && dayOfWeek <= endIndex;
      return dayOfWeek >= startIndex || dayOfWeek <= endIndex;
    }
  }

  return false;
};

/**
 * Persistence Helpers (localStorage)
 */
const STORAGE_KEY = 'alarms';

export const loadAlarms = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (err) {
    console.warn("Failed to load alarms:", err);
    return [];
  }
};

export const saveAlarms = (alarms) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(alarms));
  } catch (err) {
    console.warn("Failed to save alarms:", err);
  }
};

/**
 * Trigger alarm
 */
export const triggerAlarm = (alarm, audioRef, setAlarms, setRingingAlarm) => {
  const minuteKey = getMinuteKey(new Date());

  setAlarms((prev) => {
    const updated = prev.map((a) =>
      a.id === alarm.id ? { ...a, lastTriggeredAt: minuteKey, snoozedUntil: null } : a
    );
    saveAlarms(updated);
    return updated;
  });

  setRingingAlarm(alarm);

  if (audioRef.current) {
    audioRef.current.loop = true;
    audioRef.current.volume = 0.7;
    audioRef.current.play().catch((err) => console.warn('Audio failed:', err));
  }

  if (navigator.vibrate) navigator.vibrate([400, 200, 400, 200, 400]);

  if ('Notification' in window && Notification.permission === 'granted') {
    new Notification(`Alarm: ${alarm.label || 'Time to wake up!'}`, {
      body: `${formatDisplayTime(alarm.time).time} ${formatDisplayTime(alarm.time).ampm}`,
      icon: '/favicon.ico',
      tag: `alarm-${alarm.id}`,
    });
  }
};

/**
 * Stop alarm
 */
export const stopAlarm = (ringingAlarm, audioRef, setAlarms, setRingingAlarm) => {
  if (!ringingAlarm) return;

  if (audioRef.current) {
    audioRef.current.pause();
    audioRef.current.currentTime = 0;
    audioRef.current.loop = false;
  }

  if (navigator.vibrate) navigator.vibrate(0);

  const minuteKey = getMinuteKey(new Date());
  setAlarms((prev) => {
    const updated = prev.map((a) =>
      a.id === ringingAlarm.id ? { ...a, lastTriggeredAt: minuteKey } : a
    );
    saveAlarms(updated);
    return updated;
  });

  setRingingAlarm(null);
};

/**
 * Snooze alarm
 */
export const snoozeAlarm = (
  ringingAlarm,
  audioRef,
  setAlarms,
  setRingingAlarm,
  snoozeMinutes = 5
) => {
  if (!ringingAlarm) return;

  if (audioRef.current) {
    audioRef.current.pause();
    audioRef.current.currentTime = 0;
    audioRef.current.loop = false;
  }

  if (navigator.vibrate) navigator.vibrate(0);

  const snoozeDate = new Date(Date.now() + snoozeMinutes * 60 * 1000);
  const minuteKeyNow = getMinuteKey(new Date());

  setAlarms((prev) => {
    const updated = prev.map((a) =>
      a.id === ringingAlarm.id
        ? { ...a, snoozedUntil: snoozeDate.toISOString(), lastTriggeredAt: minuteKeyNow }
        : a
    );
    saveAlarms(updated);
    return updated;
  });

  setRingingAlarm(null);
};
