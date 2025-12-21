# Truth Label - Frontend 🏷️

A web application frontend that combats greenwashing and healthwashing through verification of sustainability claims on food products. Uses barcode scanning technology and Open Food Facts data to provide transparent information to consumers.

## 📋 About

Truth Label is an open-source initiative dedicated to honesty in the aisles. We use barcode scanning technology to verify sustainability claims, ensuring that "eco-friendly" or "healthy" products you choose actually live up to their promises.

**Developed by:** Cláudia Rodrigues  
**Context:** MVP Project for Post-Graduate Software Engineering - PUC-Rio

## ✨ Features

- 📷 **Barcode Scanning** via device camera (using Quagga.js)
- 🔍 **Search by Name or Barcode** for products
- 📊 **Real-time Score Display** (0-100% sustainability rating)
- 🏆 **Certification Verification** display (Organic, Fair Trade, Vegan, etc.)
- 📝 **Product History** with past scans
- 💬 **Interactive Product Cards** with detailed information
- 🌐 **Responsive Design** with dark mode theme

## 🎨 Design

Modern dark mode interface with neon green accents, creating a visual identity aligned with sustainability principles.

### Color Palette
- **Background:** `#121212` (Main dark background)
- **Text:** `#E0E0E0` (Light text)
- **Primary Accent:** `#00FF7F` (Neon green for interactions)
- **Success:** `#4CAF50` (High scores)
- **Warning:** `#F44336` (Low scores)
- **Secondary Background:** `#1A1A1A` (Cards and blocks)

### Typography
- **Headings:** Noto Sans JP (900 weight)
- **Body:** Open Sans (300-800 weight range)

## 🏗️ Project Structure

```
frontend/
├── assets/                 # Product images and icons
│   ├── sabao_eco_green.png
│   └── esponja_eco.jpg
├── scripts/
│   └── script.js          # Main application logic
├── style/
│   └── style.css          # Stylesheet with dark theme
└── index.html             # Main interface
```

## 🚀 Installation and Setup

### Prerequisites
- Modern web browser (Chrome, Firefox, Safari, Edge)
- Live Server extension (VS Code) or HTTP server
- Backend API running at `http://127.0.0.1:5000`

### Setup

1. Clone the frontend repository:
```bash
git clone <frontend-repo-url>
cd truth-label-frontend
```

2. Open with Live Server (VS Code) or serve via HTTP:
```bash
# Using Python
python -m http.server 5500

# Or using Node.js
npx http-server -p 5500
```

3. Access the application:
```
http://127.0.0.1:5500
```

### Configuration

The frontend expects the backend API to be running at:
```javascript
const SCAN_URL = 'http://127.0.0.1:5000/product/scan';
const SEARCH_URL = 'http://127.0.0.1:5000/product/';
```

If your backend runs on a different port or host, update these constants in `scripts/script.js`.

## 📱 How to Use

### Scanning a Product

1. Click the **"Search / Scan"** button without entering any text
2. Allow camera access when prompted
3. Point the camera at a product barcode
4. The app will automatically detect and process the barcode

### Searching by Name or Barcode

1. Type the product name or barcode in the search field
2. Click **"Search / Scan"**
3. View the product details and sustainability score

### Interpreting the Score

- **90-100%:** Highly reliable - Excellent sustainability credentials
- **70-89%:** Good - Solid sustainability features
- **50-69%:** Moderate - Some concerns present
- **0-49%:** Low reliability - Significant sustainability issues

## 🛠️ Technologies Used

### Core
- **HTML5** - Semantic markup
- **CSS3** - Styling with custom properties (CSS variables)
- **Vanilla JavaScript** - No frameworks, pure JS

### Libraries
- **Quagga.js 0.12.1** - Barcode reading (EAN-13, EAN-8, UPC)
- **Google Fonts** - Noto Sans JP & Open Sans typography

### API Integration
- **Fetch API** - HTTP requests to backend
- **JSON** - Data exchange format

## 📄 Main Files

### `index.html`
Main HTML structure containing:
- Header with navigation
- Search interface with input field and scan button
- Scanner container (hidden until activated)
- Product display card
- Product history table
- Information sections about the project and Open Food Facts

### `scripts/script.js`
Core JavaScript functionality:
- `handleAction()` - Main button handler (search/scan decision)
- `startScanner()` - Initializes Quagga.js camera
- `fetchData()` - Unified API communication function
- `displayProduct()` - Renders product data on the page

### `style/style.css`
Complete styling including:
- CSS custom properties for theming
- Responsive layout with flexbox/grid
- Dark mode design system
- Interactive button states
- Card-based product display
- Mobile-responsive media queries

## 🔄 API Communication Flow

```
User Action → handleAction()
    ↓
Empty input? → startScanner() → Quagga detection
    ↓
Numbers only? → POST /product/scan (barcode)
    ↓
Has letters? → GET /product?name=... (search)
    ↓
fetchData() → Backend API
    ↓
Response → displayProduct() → UI Update
```

## 🎯 Key Features Explained

### Barcode Scanner
Uses Quagga.js to read EAN-13, EAN-8, and UPC codes directly from the device camera. The scanner automatically:
- Detects barcodes in the video stream
- Stops scanning after successful detection
- Populates the search field with the detected code
- Triggers automatic product lookup

### Smart Search
The application intelligently determines search type:
- **Empty input:** Offers camera scan
- **Numeric input:** Treats as barcode (POST request)
- **Text input:** Treats as product name (GET request)

### Product Display
Dynamic rendering of product information including:
- Product image with fallback
- Product name
- Sustainability score with color coding
- Summary with NOVA group and additives count
- Automatic score styling (green for high, red for low)

## 📱 Responsive Design

The interface adapts to different screen sizes:

```css
@media (max-width: 768px) {
  - Stacked navigation
  - Full-width search input
  - Vertical product card layout
  - Centered content
}
```

## 🔒 Security Considerations

- Camera access requires user permission
- All API calls use proper CORS headers
- Input validation before API requests
- Error handling for failed requests

## 🐛 Troubleshooting

### Camera Not Working
- Check browser permissions for camera access
- Ensure HTTPS (required for camera API on non-localhost)
- Try a different browser

### API Connection Issues
- Verify backend is running on port 5000
- Check CORS configuration in backend
- Review browser console for detailed errors

### Barcode Not Detected
- Ensure good lighting conditions
- Hold barcode steady and parallel to camera
- Try different distances from camera
- Clean camera lens

## 🤝 Contributing

Contributions are welcome! To contribute:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/NewFeature`)
3. Commit your changes (`git commit -m 'Add new feature'`)
4. Push to the branch (`git push origin feature/NewFeature`)
5. Open a Pull Request

## 📝 License

This project is open-source and available under the MIT License.

## 🔗 Related Repositories

- **Backend Repository:** [Link to backend repo]
- **API Documentation:** `http://127.0.0.1:5000/apidocs/`

## 📧 Contact

**Cláudia Rodrigues**  
Post-Graduate Software Engineering Student - PUC-Rio

## 🙏 Acknowledgments

- **Quagga.js** for barcode scanning capabilities
- **Open Food Facts** for the comprehensive product database
- **Google Fonts** for typography
- **PUC-Rio** for academic support

---

⭐ If this project was useful to you, consider giving it a star!
