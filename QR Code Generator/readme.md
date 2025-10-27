# 📱 QR Code Generator

A minimal, responsive QR code generator with history tracking and dark mode support.

![Status](https://img.shields.io/badge/Status-Active-success)
![Version](https://img.shields.io/badge/Version-1.0.0-blue)

## ✨ Features

- 🔲 **Generate QR Codes** from any text or URL
- 💾 **Download as PNG** - Save QR codes to your device
- 📝 **History Tracking** - All generated QR codes saved locally
- 🌓 **Light/Dark Mode** - Toggle between themes
- 📱 **Fully Responsive** - Works on all devices
- 🎨 **Minimal Design** - Clean, distraction-free interface
- 💨 **No Dependencies** - Pure vanilla JavaScript
- 🔒 **Privacy First** - Everything stored locally

## 🚀 Quick Start

1. Open `index.html` in your browser
2. Enter text or URL in the textarea
3. QR will automatically appear
4. Download or save to history

## 💡 Usage

### Generate QR Code
- Enter any text, URL, or data in the input field
- QR code appears instantly

### Download
- Click "Download PNG" to save the QR code
- File is saved as `qrcode-[timestamp].png`

### History
- Click the 📋 icon to view all generated QR codes
- Regenerate any previous QR code
- Delete individual items
- Clear all history

### Theme Toggle
- Click 🌙/☀️ icon to switch themes
- Preference is saved automatically

## 🛠️ Technologies

- HTML5
- CSS3 (CSS Variables, Flexbox, Grid)
- Vanilla JavaScript (ES6+)
- LocalStorage API
- Canvas API

## 📁 Project Structure

```
├── index.html    # Main HTML structure
├── style.css     # Minimal styling with themes
├── script.js     # QR generation & logic
└── readme.md     # Documentation
```

## 🎨 Features Detail

### QR Code Generation
- Custom algorithm for QR matrix creation
- Finder patterns (corner squares)
- Timing patterns
- Data encoding based on input text
- 256x256px output resolution

### LocalStorage
- Theme preference
- QR code history (last 50 items)
- Timestamps for each generation

### Responsive Design
- Mobile-first approach
- Breakpoint at 640px
- Touch-friendly buttons
- Adaptive layouts

## ⌨️ Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `Enter` | Generate QR code |
| `Shift + Enter` | New line in textarea |

## 🌐 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## 📝 License

MIT License - feel free to use for any purpose

## 🤝 Contributing

Contributions welcome! Feel free to submit issues or PRs.

---

Made with ❤️ for simplicity
