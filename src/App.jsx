// App.jsx
import React, { useState, useEffect, useRef } from "react";
import ClockComponent from "./components/Clock";
import AlarmComponent from "./components/Alarm";
import StopwatchComponent from "./components/Stopwatch";
import TimerComponent from "./components/Timer";
import Navbar from "./components/Navbar";
import { loadAlarms, saveAlarms } from "./services/alarmService";

const App = () => {
  const [current, setCurrent] = useState("clock");

  // alarms state with persistence
  const [alarms, setAlarms] = useState(loadAlarms);
  const [ringingAlarm, setRingingAlarm] = useState(null);

  const audioRef = useRef(null);

  // persist alarms whenever they change
  useEffect(() => {
    saveAlarms(alarms);
  }, [alarms]);

  const renderComponent = () => {
    switch (current) {
      case "clock":
        return <ClockComponent />;
      case "alarm":
        return (
          <AlarmComponent
            alarms={alarms}
            setAlarms={setAlarms}
            ringingAlarm={ringingAlarm}
            setRingingAlarm={setRingingAlarm}
            audioRef={audioRef}
          />
        );
      case "stopwatch":
        return <StopwatchComponent />;
      case "timer":
        return <TimerComponent />;
      default:
        return <ClockComponent />;
    }
  };

  return (
      <div className="flex items-center justify-center min-h-screen p-4 relative"
      style={{
        backgroundImage: "url('/rose-pattern.svg'), linear-gradient(to bottom right, #ffe4e6, #fff1f2)",
        backgroundRepeat: "repeat",
        backgroundSize: "150px"
      }}>

      <div className="w-80 h-[600px] bg-white bg-opacity-20 backdrop-blur-xl rounded-3xl shadow-xl overflow-hidden border border-white border-opacity-20">
        {/* Hidden audio element for alarms */}
        <audio ref={audioRef} src="/alarm.mp3" preload="auto" />

        <div className="h-[calc(100%-70px)]">{renderComponent()}</div>
        <Navbar current={current} setCurrent={setCurrent} />
      </div>
    </div>
  );
};

export default App;
