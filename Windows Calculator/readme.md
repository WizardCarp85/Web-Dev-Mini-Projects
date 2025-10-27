# 🧮 Advanced Calculator

A modern, feature-rich calculator web application with a clean Windows Calculator-inspired interface. Built with vanilla HTML, CSS, and JavaScript.

![Calculator Preview](https://img.shields.io/badge/Status-Active-success)
![Version](https://img.shields.io/badge/Version-1.0.0-blue)
![License](https://img.shields.io/badge/License-MIT-green)

## ✨ Features

### 🔢 Standard Calculator
- **Basic Operations**: Addition (+), Subtraction (−), Multiplication (×), Division (÷)
- **Advanced Functions**:
  - Percentage (%)
  - Square (x²)
  - Square Root (√x)
  - Inverse (1/x)
  - Negate (±)
- **Expression Display**: Shows calculation history in real-time
- **Decimal Support**: Full decimal number support
- **Clear Functions**: 
  - C (Clear all)
  - CE (Clear entry)
  - ⌫ (Backspace)

### 🔄 Unit Converter
Comprehensive unit conversion support for:
- **Length**: Meter, Kilometer, Centimeter, Millimeter, Mile, Yard, Foot, Inch
- **Weight**: Kilogram, Gram, Milligram, Ton, Pound, Ounce
- **Volume**: Liter, Milliliter, Gallon, Quart, Pint, Cup, Fluid Ounce
- **Temperature**: Celsius, Fahrenheit, Kelvin
- **Area**: Square Meter, Square Kilometer, Square Centimeter, Square Mile, Acre, Hectare, Square Foot, Square Inch
- **Time**: Second, Minute, Hour, Day, Week, Month, Year

### 🎨 User Interface
- **Light/Dark Theme**: Toggle between light and dark modes
- **Windows Calculator Style**: Clean, modern design inspired by Windows 11 Calculator
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Smooth Animations**: Polished transitions and hover effects
- **Keyboard Support**: Full keyboard shortcuts for efficient use

## ⌨️ Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `0-9` | Number input |
| `.` | Decimal point |
| `+` `-` `*` `/` | Operators |
| `Enter` or `=` | Calculate result |
| `Escape` | Clear all |
| `Backspace` | Delete last character |
| `%` | Percentage |

## 🚀 Getting Started

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/Poke-Evo-Chain-Finder.git
```

2. Navigate to the project directory:
```bash
cd Poke-Evo-Chain-Finder
```

3. Open `index.html` in your web browser:
```bash
# On Windows
start index.html

# On macOS
open index.html

# On Linux
xdg-open index.html
```

Or simply drag and drop `index.html` into your browser.

### Usage

#### Calculator Mode
1. Click numbers and operators to build your expression
2. The top display shows your calculation
3. The main display shows the current input or result
4. Press `=` or `Enter` to calculate
5. Use function buttons (%, √x, x², 1/x, ±) for advanced operations

#### Unit Converter Mode
1. Click the "Unit Convert" tab
2. Select conversion type from dropdown
3. Choose source and target units
4. Enter value in the "From" field
5. Result appears automatically in the "To" field
6. Use swap button (⇄) to reverse conversion

## 📁 Project Structure

```
Poke-Evo-Chain-Finder/
├── index.html          # Main HTML structure
├── style.css           # Styling and themes
├── script.js           # Calculator logic and functionality
└── readme.md           # Project documentation
```

## 🎨 Customization

### Changing Theme Colors

Edit the CSS variables in `style.css`:

```css
:root {
    --bg-app: #f3f3f3;
    --bg-calculator: #ffffff;
    --bg-equals: #0078d4;
    --accent: #0078d4;
    /* ... more variables */
}
```

### Adding New Conversion Types

Add to the `conversionData` object in `script.js`:

```javascript
const conversionData = {
    // ...existing types...
    newType: {
        units: ['Unit1', 'Unit2'],
        toBase: {
            'Unit1': 1,
            'Unit2': conversionFactor
        }
    }
};
```

## 🔧 Technologies Used

- **HTML5**: Semantic markup
- **CSS3**: Modern styling with CSS Grid and Flexbox
- **JavaScript (ES6+)**: Vanilla JavaScript, no frameworks
- **LocalStorage**: Theme persistence

## 🌟 Features Highlight

- ✅ No external dependencies
- ✅ Lightweight and fast
- ✅ Offline-ready
- ✅ Accessible design
- ✅ Cross-browser compatible
- ✅ Mobile-responsive

## 📱 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Opera (latest)

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Inspired by Windows 11 Calculator design
- Icons: Unicode characters
- Font: Segoe UI system font

## 📧 Contact

Your Name - [@yourtwitter](https://twitter.com/yourtwitter)

Project Link: [https://github.com/yourusername/Poke-Evo-Chain-Finder](https://github.com/yourusername/Poke-Evo-Chain-Finder)

---

Made with ❤️ by @codesbymustafa
