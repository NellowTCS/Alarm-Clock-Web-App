Modern Alarm Clock Web App

A beautiful, responsive alarm clock web application built with React and Tailwind CSS, featuring a glassmorphism design with soft pink aesthetics.

## Live Demo

🚀 **[View Live Demo](https://your-demo-url.vercel.app)** 

*Note: Enable browser notifications and audio for the full alarm experience*

## Features

### 🕐 Clock
- Real-time analog and digital clock display
- 12-hour format with AM/PM indicator
- Smooth second hand animation
- Beautiful gradient clock face

### ⏰ Alarm
- Multiple alarm support
- Custom labels and repeat patterns
- Smart repeat options (Everyday, Mon-Fri, Sat-Sun, custom ranges)
- Snooze functionality (5-minute intervals)
- Browser notifications
- Persistent storage using localStorage
- Visual countdown timer showing time until next alarm

### ⏱️ Stopwatch
- Precision timing with HH:MM:SS format
- Circular progress indicator (60-second cycle)
- Start, stop, and reset functionality
- Smooth animations during operation

### ⌛ Timer
- Countdown timer with custom hour/minute/second input
- Color-coded progress ring (green → yellow → red)
- Audio notification when time expires
- Pause and resume functionality

## Design Features

- **Glassmorphism UI**: Modern frosted glass aesthetic with backdrop blur effects
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Organic Blob Backgrounds**: Subtle animated background elements
- **Pink Color Palette**: Soft, calming pink tones throughout
- **Smooth Animations**: Micro-interactions and transitions enhance user experience

## Tech Stack

- **React** - Frontend framework with hooks
- **Vite** - Fast build tool and development server
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Production-ready motion library for animations
- **Lucide React** - Beautiful icon library
- **HTML5 Audio API** - For alarm sounds
- **Web Notifications API** - Browser notifications
- **localStorage** - Data persistence

## Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/pinkclock.git
cd pinkclock
```

2. Install dependencies:
```bash
npm install
```

If you're using Vite, you can also create a new project:
```bash
npm create vite@latest pinkclock -- --template react
cd pinkclock
npm install
# Then copy the project files into your new Vite project
```

3. Add alarm sound file:
   - Place your alarm sound file as `public/alarm.mp3`
   - Ensure it's in MP3 format for browser compatibility

4. Start the development server:
```bash
# For standard React setup
npm start

# For Vite setup
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## File Structure

```
src/
├── components/
│   ├── Alarm.jsx          # Alarm management component
│   ├── BackgroundBlob.jsx # Decorative background elements
│   ├── Clock.jsx          # Analog/digital clock display
│   ├── Navbar.jsx         # Navigation between features
│   ├── Stopwatch.jsx      # Stopwatch functionality
│   └── Timer.jsx          # Countdown timer
├── services/
│   └── alarmService.js    # Alarm logic and persistence
├── App.jsx               # Main application component
└── index.css            # Global styles
```

## Usage

### Setting Alarms
1. Navigate to the Alarm tab
2. Click "Add Alarm"
3. Set time, label, and repeat pattern
4. Toggle alarms on/off with the switch
5. Delete unwanted alarms with the trash icon

### Repeat Patterns
- `Everyday` or `Daily` - Every day
- `Mon-Fri` or `Weekday` - Weekdays only
- `Sat-Sun` or `Weekend` - Weekends only
- `Mon-Wed` - Custom day ranges
- Leave empty for one-time alarm

### Browser Permissions
The app will request permissions for:
- **Notifications** - Desktop alarm alerts
- **Audio** - Alarm sound playback

## Customization

### Changing Colors
The app uses a pink color scheme defined in Tailwind classes:
- Primary: `pink-500`, `pink-600`
- Accent: `pink-100`, `pink-200`
- Backgrounds: `pink-50`, `white/opacity`

### Adding Custom Alarm Sounds
Replace `public/alarm.mp3` with your preferred sound file. Ensure it's web-compatible (MP3, WAV, or OGG).

### Modifying Snooze Duration
Edit the snooze duration in `Alarm.jsx`:
```javascript
snoozeAlarm(ringingAlarm, audioRef, setAlarms, setRingingAlarm, 10) // 10 minutes
```

## Browser Compatibility

- **Chrome/Edge**: Full support
- **Firefox**: Full support
- **Safari**: Full support (iOS 14.5+ for notifications)
- **Mobile browsers**: Responsive design works on all modern mobile browsers

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit changes: `git commit -am 'Add feature'`
4. Push to branch: `git push origin feature-name`
5. Submit a pull request

## Known Issues

- Audio autoplay may be blocked by browser policies
- Notifications require user interaction to enable
- Background tabs may have reduced timer accuracy

## Author

**Sagarika** - *Full Stack Developer*

- GitHub: [@yourusername](https://github.com/Sagarika311)
- Email: sagarikabhagat311@gmail.com

## License

MIT License - feel free to use this project for personal or commercial purposes.

## Credits

- Icons by [Lucide](https://lucide.dev/)
- Font: Poppins from Google Fonts
- Animations powered by [Framer Motion](https://framer.com/motion/)"# Alarm-Clock-Web-App" 
