# Sacred Buddha Pendant 3D Viewer

A beautiful, interactive 3D web viewer for your Buddha pendant with sacred lighting and spiritual atmosphere.

## Features

- **Sacred Spinning Animation**: Smooth rotation showcasing the pendant from all angles
- **Holy Atmosphere**: Golden lighting with particle effects creating a reverent mood
- **Multiple Lighting Modes**: 
  - Sacred (Golden divine light)
  - Warm (Temple candlelight)
  - Mystical (Ethereal blue glow)
- **Interactive Controls**: 
  - Play/Pause rotation
  - Reset view
  - Mouse orbit controls
- **Responsive Design**: Works on desktop and mobile devices

## Quick Start

1. **Start the local server**:
   ```bash
   npm start
   ```
   or
   ```bash
   python3 -m http.server 8000
   ```

2. **Open your browser** and navigate to:
   ```
   http://localhost:8000
   ```

3. **Enjoy the sacred experience** of your Buddha pendant!

## Controls

- **Mouse**: Click and drag to orbit around the pendant
- **Scroll**: Zoom in/out
- **Play/Pause Button**: Toggle the spinning animation
- **Reset Button**: Return to the original view
- **Lighting Button**: Cycle through different lighting atmospheres

## Technical Details

- Built with **Three.js** for 3D rendering
- Uses **GLTFLoader** for .glb model loading
- Implements **PBR materials** for realistic lighting
- Features **particle systems** for atmospheric effects
- **Shadow mapping** for depth and realism

## File Structure

```
├── index.html          # Main HTML file with sacred styling
├── script.js           # Three.js scene setup and animation
├── package.json        # Project configuration
├── README.md          # This file
└── pra1_Model_4_0000000.glb  # Your Buddha pendant model
```

## Customization

You can modify the spiritual experience by editing `script.js`:
- Adjust rotation speed
- Change lighting colors
- Add more particle effects
- Modify the sacred atmosphere

---

*May this digital shrine bring peace and mindfulness to all who view it* 🙏
