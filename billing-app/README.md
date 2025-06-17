# Product Management & WhatsApp Integration

A mobile-optimized Next.js web application for managing product prices and generating customer bills with seamless WhatsApp integration. Designed specifically for iPhone 13 viewport (390px wide).

## ✨ Features

### 📦 Product Management
- **Add Products**: Create new products with name and price
- **Edit Products**: Update existing product details
- **Delete Products**: Remove products from inventory
- **Persistent Storage**: All data saved in localStorage
- **Mobile-Optimized UI**: Responsive design for iPhone 13

### 🧮 Bill Generator
- **Add to Bill**: Select products and quantities
- **Real-time Calculations**: Auto-calculate subtotals and totals
- **Quantity Controls**: Easy +/- buttons for quantity adjustment
- **Bill Summary**: Clear overview of all items and total
- **WhatsApp Integration**: Share bills directly via WhatsApp

### 📱 WhatsApp Integration
- **Pre-formatted Messages**: Professional bill format
- **Direct Sharing**: One-click WhatsApp redirection
- **Mobile-Friendly**: Optimized for mobile sharing

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone or navigate to the project**
   ```bash
   cd billing-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📱 How to Use

### 1. Product Management
1. **Add Products**: 
   - Enter product name and price
   - Click "Add Product"
   - Products are automatically saved

2. **Edit Products**:
   - Click "Edit" on any product
   - Modify name or price
   - Click "Update Product"

3. **Delete Products**:
   - Click "Delete" to remove products

### 2. Bill Generation
1. **Add Items to Bill**:
   - Select a product from dropdown
   - Set quantity
   - Click "Add to Bill"

2. **Manage Bill Items**:
   - Use +/- buttons to adjust quantities
   - Click "✕" to remove items
   - View real-time subtotals

3. **Share Bill**:
   - Review bill summary
   - Click "Share on WhatsApp"
   - Bill opens in WhatsApp with pre-filled message

## 🎨 WhatsApp Message Format

The app generates bills in this format:
```
🧾 Bill Details:
1. Apple x2 - ₹200
2. Banana x3 - ₹90

Total: ₹290
Thank you! 🙏
```

## 🛠️ Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: React Hooks
- **Storage**: localStorage
- **Mobile Optimization**: iPhone 13 viewport (390px)

## 📁 Project Structure

```
billing-app/
├── src/
│   ├── app/
│   │   ├── layout.tsx          # Root layout with mobile optimization
│   │   ├── page.tsx            # Main page with navigation
│   │   └── globals.css         # Global styles and mobile utilities
│   ├── components/
│   │   ├── ProductManagement.tsx  # Product CRUD operations
│   │   └── BillGenerator.tsx      # Bill creation and WhatsApp sharing
│   └── types/
│       └── index.ts            # Shared TypeScript interfaces
├── public/                     # Static assets
└── package.json               # Dependencies and scripts
```

## 🎯 Mobile Optimization

- **Viewport**: Optimized for iPhone 13 (390px width)
- **Touch-Friendly**: Large buttons and touch targets
- **Responsive Design**: Adapts to different screen sizes
- **Mobile-First**: Designed primarily for mobile use

## 🔧 Customization

### Adding New Features
- **Payment Integration**: Add payment gateway integration
- **Customer Management**: Store customer information
- **Invoice Templates**: Customize bill formatting
- **Data Export**: Export bills to PDF or Excel

### Styling Changes
- Modify `globals.css` for custom styles
- Update Tailwind classes in components
- Adjust mobile container width in CSS

## 📝 Development

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Key Components
- **ProductManagement**: Handles product CRUD operations
- **BillGenerator**: Manages bill creation and WhatsApp sharing
- **Shared Types**: TypeScript interfaces for type safety

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly on mobile devices
5. Submit a pull request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

**Built with ❤️ for mobile-first billing solutions**
