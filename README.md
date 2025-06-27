# Sacred Buddha Pendant

A visually rich, sacred Buddha pendant web application with dynamic background effects, divine light animations, decorative Oriental wood frame, and background chanting audio. Fully responsive design optimized for mobile devices.

## 🗂️ Project Structure

```
labs-rolling-obj/
├── index.html                 # Original monolithic HTML file
├── index-refactored.html      # New organized HTML file
├── package.json              # Project configuration
├── README.md                 # Project documentation
│
├── assets/                   # Static assets directory
│   ├── audio/               # Audio files
│   │   ├── thaiBlessingChanting.mp3
│   │   ├── thaiBlessingChanting.ogg
│   │   └── thaiBlessingChanting.wav
│   └── models/              # 3D model files
│       └── pra1_Model_4_0000000.glb
│
├── css/                     # Stylesheets
│   └── styles.css          # Main CSS file (extracted from HTML)
│
└── js/                      # JavaScript modules
    ├── audio-control.js     # Audio control functionality
    ├── lava-background.js   # Shader-based background effects
    └── scene.js            # Main Three.js scene setup
```

## 🚀 Features

### Visual Effects
- **Divine Light Effects**: Animated glowing title with color-cycling text
- **Lava Background**: Shader-based dynamic background animation
- **Oriental Wood Frame**: CSS-based decorative frame with gold inlays
- **Sacred Animations**: Rotating divine rings and glow effects

### Audio
- **Background Chanting**: Looping Thai blessing chanting audio
- **Smart Audio Control**: Handles browser autoplay restrictions
- **Multiple Formats**: MP3, OGG, and WAV support for compatibility

### Responsive Design
- **Mobile-First**: Optimized for mobile devices with touch controls
- **Safe Area Support**: Handles mobile browser toolbars and notches
- **Dynamic Viewport**: Adapts to browser toolbar show/hide animations
- **Breakpoint System**: Responsive design for phones, tablets, and desktop

### Content
- **Historical Information**: Compact info card with Buddha pendant history
- **Sacred Blessings**: Traditional Thai blessing text
- **Interactive Elements**: Scrollable content with custom styling

## 🛠️ Technical Stack

- **Three.js**: 3D graphics and model rendering
- **WebGL Shaders**: Custom lava background effects
- **CSS Grid/Flexbox**: Responsive layout system
- **Web Audio API**: Background chanting control
- **CSS Custom Properties**: Dynamic styling and theming

## 📱 Mobile Optimization

### Viewport Handling
- Uses `viewport-fit=cover` for full-screen experience
- Implements `env(safe-area-inset-*)` for safe area compatibility
- Dynamic viewport height (`100dvh`) with fallbacks

### Performance
- Optimized asset loading with preload directives
- Efficient CSS with mobile-first methodology
- Touch-friendly controls with proper hit targets

### Browser Compatibility
- Handles mobile browser toolbar variations
- Graceful fallbacks for unsupported features
- Cross-browser audio handling

## 🎨 Styling Architecture

### CSS Organization
- Modular CSS structure with logical sections
- Mobile-first responsive design approach
- CSS custom properties for theming
- Keyframe animations for divine effects

### Color Scheme
- **Primary**: Golden (#ffcc00, #ffd700)
- **Background**: Dark brown gradients (#3d2b00 to #0d0704)
- **Accent**: Sacred purple (#6102a1)
- **Text**: White with golden glows

## 🔧 Development

### File Structure Benefits
1. **Separation of Concerns**: HTML, CSS, and JS in separate files
2. **Maintainability**: Easier to update and debug individual components
3. **Reusability**: Modular JavaScript components
4. **Organization**: Logical asset organization in directories
5. **Performance**: Better caching and load optimization

### Getting Started
1. Use a local server to serve the files (due to CORS restrictions)
2. Open `index-refactored.html` in your browser
3. Ensure audio files are in the `assets/audio/` directory
4. Place the 3D model in `assets/models/` directory

### Development Server
```bash
# Using Python 3
python -m http.server 8000

# Using Node.js
npx serve .

# Using PHP
php -S localhost:8000
```

## 🎭 Features in Detail

### Audio System
- **Auto-detection**: Detects user interaction for autoplay
- **Fallback Handling**: Graceful degradation for restricted browsers
- **Volume Control**: Pre-set volume levels for comfortable listening
- **Error Handling**: Displays appropriate messages for audio issues

### Frame System
- **CSS-Only**: No external images required
- **Responsive**: Adapts to different screen sizes
- **Gold Inlays**: Decorative elements with gradient effects
- **Safe Areas**: Respects mobile device safe areas

### Info Card
- **Compact Design**: Minimal space usage
- **Scrollable Content**: Handles overflow gracefully
- **Custom Scrollbars**: Styled to match theme
- **Responsive Text**: Adapts sizing for different devices

## 🐛 Known Issues & Solutions

### Mobile Browser Compatibility
- **Issue**: Browser toolbars covering content
- **Solution**: Dynamic viewport height with JavaScript
- **Implementation**: CSS custom properties with resize listeners

### Audio Autoplay Restrictions
- **Issue**: Browsers blocking autoplay
- **Solution**: User interaction detection
- **Implementation**: Click event listeners with delayed autoplay

## 🔮 Future Enhancements

- [ ] Add PWA (Progressive Web App) support
- [ ] Implement service worker for offline functionality
- [ ] Add more 3D model variations
- [ ] Create animation presets
- [ ] Add multilingual support
- [ ] Implement user preferences storage

## 📄 License

This project is for educational and demonstration purposes.

---

*May wisdom and compassion guide your development journey* 🙏
