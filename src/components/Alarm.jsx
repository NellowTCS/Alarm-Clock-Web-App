import React, { useState, useEffect, useRef } from "react";
import { Plus, Trash2, Repeat, Clock } from "lucide-react";
import BackgroundBlob from "./BackgroundBlob";
import {
  getMinuteKey,
  formatDisplayTime,
  shouldTriggerToday,
  triggerAlarm,
  stopAlarm,
  snoozeAlarm,
  loadAlarms,
  saveAlarms,
} from "../services/alarmService";

const padId = (prefix = "a") =>
  `${prefix}${Date.now()}${Math.floor(Math.random() * 1000)}`;
const formatTimeToHHMM = (date) => {
  const hh = String(date.getHours()).padStart(2, "0");
  const mm = String(date.getMinutes()).padStart(2, "0");
  return `${hh}:${mm}`;
};

const Alarm = () => {
  const [alarms, setAlarms] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [newAlarm, setNewAlarm] = useState({
    time: "07:00",
    label: "",
    repeat: "",
    enabled: true,
  });
  const [ringingAlarm, setRingingAlarm] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const audioRef = useRef(null);

  /** Load alarms from localStorage on mount */
  useEffect(() => {
    const stored = loadAlarms();
    if (stored.length > 0) {
      setAlarms(stored);
    } else {
      // fallback demo alarms
      setAlarms([
        {
          id: "a1",
          time: "06:00",
          label: "Wake up",
          repeat: "Everyday",
          enabled: true,
          lastTriggeredAt: null,
          snoozedUntil: null,
        },
        {
          id: "a2",
          time: "09:00",
          label: "Office Work",
          repeat: "Mon–Fri",
          enabled: true,
          lastTriggeredAt: null,
          snoozedUntil: null,
        },
        {
          id: "a3",
          time: "13:00",
          label: "Meal Prep",
          repeat: "Sat–Sun",
          enabled: true,
          lastTriggeredAt: null,
          snoozedUntil: null,
        },
      ]);
    }
  }, []);

  /** Persist alarms whenever they change */
  useEffect(() => {
    if (alarms.length > 0) {
      saveAlarms(alarms);
    }
  }, [alarms]);

  // Live ticking + alarm checks
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      setCurrentTime(now);
      const nowStr = formatTimeToHHMM(now);
      const minuteKey = getMinuteKey(now);

      for (const alarm of alarms) {
        if (!alarm.enabled) continue;
        let shouldTrigger = false;

        if (alarm.snoozedUntil) {
          const snoozeDate = new Date(alarm.snoozedUntil);
          if (now >= snoozeDate && now - snoozeDate < 2 * 60 * 1000)
            shouldTrigger = true;
        } else if (alarm.time === nowStr && shouldTriggerToday(alarm.repeat, now)) {
          shouldTrigger = true;
        }

        if (
          shouldTrigger &&
          alarm.lastTriggeredAt !== minuteKey &&
          !ringingAlarm
        ) {
          triggerAlarm(alarm, audioRef, setAlarms, setRingingAlarm);
          break;
        }
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [alarms, ringingAlarm]);

  const toggleAlarm = (id) =>
    setAlarms((prev) =>
      prev.map((a) => (a.id === id ? { ...a, enabled: !a.enabled } : a))
    );

  const addAlarm = () => {
    if (!newAlarm.time) return;
    const alarmObj = {
      id: padId("a"),
      ...newAlarm,
      label: newAlarm.label.trim(),
      repeat: newAlarm.repeat.trim(),
      lastTriggeredAt: null,
      snoozedUntil: null,
    };
    setAlarms((prev) => [...prev, alarmObj]);
    setNewAlarm({ time: "07:00", label: "", repeat: "", enabled: true });
    setShowForm(false);
  };

  const deleteAlarm = (id) => {
    setAlarms((prev) => prev.filter((a) => a.id !== id));
    if (ringingAlarm?.id === id)
      stopAlarm(ringingAlarm, audioRef, setAlarms, setRingingAlarm);
  };

  const getTimeUntil = (alarm) => {
    const now = currentTime;
    let target;

    if (alarm.snoozedUntil) {
      target = new Date(alarm.snoozedUntil);
    } else {
      const [h, m] = alarm.time.split(":").map(Number);
      target = new Date(now);
      target.setHours(h, m, 0, 0);

      if (target <= now || !shouldTriggerToday(alarm.repeat, now)) {
        let nextValid = new Date(now);
        for (let i = 0; i < 7; i++) {
          nextValid.setDate(nextValid.getDate() + 1);
          if (shouldTriggerToday(alarm.repeat, nextValid)) break;
        }
        target = new Date(nextValid);
        target.setHours(h, m, 0, 0);
      }
    }

    const diff = Math.max(0, target - now);
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    return `${hours}h ${minutes}m ${seconds}s`;
  };

  useEffect(() => {
    if ("Notification" in window && Notification.permission === "default")
      Notification.requestPermission();
  }, []);

  return (
    <div className="relative w-full h-full bg-white/30 backdrop-blur-2xl rounded-3xl p-6 shadow-xl border border-white/20 overflow-hidden">
      <BackgroundBlob />
      <div className="relative z-10 flex flex-col h-full">
        <h2
          className="text-gray-700 text-lg md:text-xl font-semibold mb-6 tracking-wide flex flex-col items-center"
          style={{ fontFamily: "Georgia, serif" }}
        >
          Alarms
        </h2>

        {/* Scrollable Alarm List */}
        <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-4 mb-6">
          {alarms.map((alarm) => {
            const displayTime = formatDisplayTime(alarm.time);
            return (
              <div
                key={alarm.id}
                className="flex items-center justify-between p-3 bg-white/70 rounded-2xl shadow-sm hover:shadow-md transition"
              >
                <div className="flex-1">
                  <div className="flex items-baseline">
                    <span
                      className={`text-3xl font-light ${
                        alarm.enabled ? "text-gray-900" : "text-gray-400"
                      }`}
                    >
                      {displayTime.time}
                    </span>
                    <span className="text-sm text-gray-400 ml-2">
                      {displayTime.ampm}
                    </span>
                  </div>
                  {alarm.label && (
                    <div className="text-sm text-gray-500 mt-1">
                      {alarm.label}
                    </div>
                  )}
                  {alarm.repeat && (
                    <div className="mt-1 flex items-center text-xs text-pink-600">
                      <Repeat size={14} className="mr-1" /> {alarm.repeat}
                    </div>
                  )}
                  <div className="mt-1 flex items-center text-xs text-pink-600">
                    <Clock size={12} className="mr-1" />
                    {alarm.snoozedUntil ? "Snoozed — rings in" : "Rings in"}{" "}
                    {getTimeUntil(alarm)}
                  </div>
                </div>

                {/* Controls */}
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => deleteAlarm(alarm.id)}
                    className="p-1.5 rounded-full hover:bg-red-100 transition"
                    title="Delete"
                  >
                    <Trash2 size={18} className="text-red-500" />
                  </button>

                  <button
                    onClick={() => toggleAlarm(alarm.id)}
                    className={`relative w-12 h-6 rounded-full transition-colors ${
                      alarm.enabled ? "bg-pink-500" : "bg-gray-300"
                    }`}
                    aria-pressed={alarm.enabled}
                  >
                    <span
                      className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                        alarm.enabled ? "translate-x-6" : ""
                      }`}
                    />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Add Alarm Button */}
        <button
          onClick={() => setShowForm(true)}
          className="w-full py-3 flex items-center justify-center bg-pink-500 hover:bg-pink-600 text-white rounded-full font-medium shadow-md transition"
        >
          <Plus size={18} className="mr-2" /> Add Alarm
        </button>

        {/* New Alarm Form */}
        {showForm && (
          <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-20">
            <div className="w-80 p-6 bg-white/90 backdrop-blur-xl rounded-2xl shadow-xl">
              <h3 className="text-gray-700 mb-4 text-lg font-semibold">
                New Alarm
              </h3>
              <div className="space-y-4">
                <input
                  type="time"
                  value={newAlarm.time}
                  onChange={(e) =>
                    setNewAlarm({ ...newAlarm, time: e.target.value })
                  }
                  className="w-full p-3 rounded-xl border border-gray-300 text-gray-800 focus:outline-none focus:ring-2 focus:ring-pink-200 transition"
                />
                <input
                  type="text"
                  placeholder="Label"
                  value={newAlarm.label}
                  onChange={(e) =>
                    setNewAlarm({ ...newAlarm, label: e.target.value })
                  }
                  className="w-full p-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-200 transition"
                />
                <input
                  type="text"
                  placeholder="Repeat (e.g., Mon–Fri, Everyday, Sat–Sun)"
                  value={newAlarm.repeat}
                  onChange={(e) =>
                    setNewAlarm({ ...newAlarm, repeat: e.target.value })
                  }
                  className="w-full p-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-200 transition"
                />
                <div className="flex space-x-3 mt-2">
                  <button
                    onClick={addAlarm}
                    className="flex-1 py-2 bg-pink-100 text-black font-medium rounded-xl shadow hover:bg-pink-200 active:scale-95 transition transform duration-150"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setShowForm(false)}
                    className="flex-1 py-2 bg-gray-200 text-gray-800 font-medium rounded-xl shadow hover:bg-gray-300 active:scale-95 transition transform duration-150"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Alarm Ringing Modal */}
        {ringingAlarm && (
          <div className="fixed inset-0 bg-gradient-to-br from-white/20 via-pink-100/20 to-transparent backdrop-blur-md flex items-center justify-center z-20">
            <div className="w-96 max-w-[90%] p-6 bg-white/80 backdrop-blur-3xl rounded-3xl shadow-2xl border border-white/20">
              <h2 className="text-2xl font-bold text-gray-900 text-center">
                Alarm Ringing!
              </h2>
              <p className="mt-2 text-gray-600 text-sm text-center">
                {ringingAlarm.label || "No Label"}
              </p>
              <p className="mt-1 text-xl font-semibold text-pink-600 text-center">
                {formatDisplayTime(ringingAlarm.time).time}{" "}
                {formatDisplayTime(ringingAlarm.time).ampm}
              </p>
              <div className="my-5 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent" />
              <div className="flex space-x-4 justify-center">
                <button
                  onClick={() =>
                    stopAlarm(ringingAlarm, audioRef, setAlarms, setRingingAlarm)
                  }
                  className="flex-1 py-3 rounded-full bg-gradient-to-r from-red-500 to-red-600 text-white font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-150"
                >
                  Stop
                </button>
                <button
                  onClick={() =>
                    snoozeAlarm(
                      ringingAlarm,
                      audioRef,
                      setAlarms,
                      setRingingAlarm,
                      5
                    )
                  }
                  className="flex-1 py-3 rounded-full bg-gradient-to-r from-yellow-400 to-yellow-500 text-gray-900 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-150"
                >
                  Snooze 5m
                </button>
              </div>
              <div className="mt-4 text-xs text-gray-600 text-center">
                Stop silences the alarm. Snooze will reschedule it +5 minutes.
              </div>
            </div>
          </div>
        )}
      </div>

      <audio ref={audioRef} src="/alarm.mp3" preload="auto" />
    </div>
  );
};

export default Alarm;
