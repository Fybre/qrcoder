# QR Code Generator

A simple web application for generating QR codes from text or URLs.

## Features

- **Real-time QR Code Generation**: Enter text and see the QR code update instantly
- **Multiple Size Options**: Choose from Small (150px), Medium (250px), Large (350px), or Extra Large (500px)
- **Download Functionality**: Save your QR code as a PNG image
- **Responsive Design**: Works on desktop and mobile devices
- **Dark Mode**: Toggle between light and dark themes with preference saving
- **Smooth Animations**: Beautiful transitions for size changes and theme switching

## How to Use

1. **Enter Text**: Type or paste any text/URL into the input field
2. **Select Size**: Choose your preferred QR code size from the dropdown (Small, Medium, Large, or Extra Large)
3. **Toggle Dark Mode**: Click the 🌙/☀️ button in the top right to switch themes
4. **Download**: Click the "Download QR Code" button to save as PNG

## Dark Mode Features

- **Persistent Preference**: Your theme choice is saved in localStorage
- **Smooth Transitions**: All color changes animate beautifully
- **Complete Styling**: All UI elements adapt to the dark theme
- **Accessible**: Maintains good contrast ratios for readability

## Size Options

- **Small (150px)**: Perfect for quick digital use
- **Medium (250px)**: Default size, great balance
- **Large (350px)**: Better visibility and scannability
- **Extra Large (500px)**: High-resolution for printing and presentations

## Technical Details

- **Library**: Uses [QRCode.js](https://github.com/davidshimjs/qrcodejs) for QR code generation
- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **No Backend Required**: Works entirely client-side

## File Structure

```
qrcoder/
├── index.html          # Main HTML file
├── style.css           # CSS styling
├── script.js           # JavaScript functionality
└── README.md           # Project documentation
```

## Browser Compatibility

Works in all modern browsers that support:

- ES6 JavaScript
- HTML5 Canvas
- CSS3 Flexbox

## Development

To modify or extend this project:

1. Clone or download the repository
2. Open `index.html` in your browser
3. Make changes to the HTML, CSS, or JavaScript files
4. Refresh your browser to see changes

## License

This project is open source and free to use.
