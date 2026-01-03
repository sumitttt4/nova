# 🎯 Bazuroo Admin Panel

A comprehensive, modern admin dashboard for managing a food delivery platform. Built with Next.js 16, React 19, and TypeScript.

## ✨ Features

### 📊 Dashboard
- Real-time metrics and analytics
- Live order tracking
- Revenue and performance charts
- Quick action tiles

### 👥 User Management
- User list with advanced filtering
- User details and activity tracking
- Warn/Ban functionality
- Feedback management

### 🏪 Store & Merchant Management
- Store listings and verification
- Product validation workflow
- KYC document review (Aadhar, PAN, FSSAI, etc.)
- Merchant application approval process
- Store feedback and ratings

### 🚴 Rider Management
- Rider onboarding and KYC verification
- Performance tracking and payouts
- Rider feedback and reviews
- Document verification (Aadhar, PAN, DL, Live Selfie)

### 📦 Order Management
- Live order tracking
- Order issues and dispute resolution
- Order history and analytics

### 💰 Finance & Settlements
- Payment tracking
- Settlement engine
- Wallet and ledger management
- Tax and compliance tracking

### ⚙️ Advanced Features
- Global search across all entities
- Advanced filtering system
- Export functionality (Excel)
- Responsive design for all devices
- Dark mode support (via themes)

## 🚀 Getting Started

### Prerequisites
- Node.js 18 or higher
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Bazuroo-AdminPanel-2
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run development server**
   ```bash
   npm run dev
   ```

4. **Open in browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Build for Production

```bash
npm run build
npm start
```

## 📁 Project Structure

```
Bazuroo-AdminPanel-2/
├── app/                    # Next.js app directory
│   └── (admin)/           # Admin routes
│       ├── dashboard/     # Dashboard page
│       ├── users/         # User management
│       ├── stores/        # Store management
│       ├── merchants/     # Merchant management
│       ├── riders/        # Rider management
│       ├── orders/        # Order tracking
│       └── finance/       # Finance & settlements
├── components/            # Reusable components
│   ├── ui/               # UI primitives (shadcn/ui)
│   ├── dashboard/        # Dashboard-specific components
│   ├── filters/          # Filter components
│   └── ...
├── contexts/             # React contexts
│   └── MockDataContext.tsx  # Mock data provider
├── lib/                  # Utility functions
│   └── dummy-data.ts     # Mock data generation
├── config/               # Configuration files
│   └── sidebar.json      # Sidebar navigation
└── public/              # Static assets
```

## 🛠️ Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **UI Components**: shadcn/ui (Radix UI)
- **Icons**: Lucide React
- **Charts**: Recharts
- **Forms**: React Hook Form + Zod
- **State Management**: React Context + Zustand
- **Date Handling**: date-fns
- **Data Export**: xlsx, file-saver

## 🎨 Design System

- **Color Palette**: Professional admin theme with brand accent (#2BD67C)
- **Typography**: System fonts with proper hierarchy
- **Components**: Consistent design language using shadcn/ui
- **Responsive**: Mobile-first approach
- **Animations**: Smooth transitions and loading states

## 📊 Mock Data System

The application uses a comprehensive mock data system that simulates a real backend:

- **Data Persistence**: Uses localStorage for data persistence
- **Realistic Data**: Generated using @faker-js/faker
- **CRUD Operations**: Full create, read, update, delete support
- **Relationships**: Proper data relationships between entities
- **Version Control**: Data versioning for cache invalidation

## 🔑 Key Pages

- `/dashboard` - Main analytics dashboard
- `/users` - User management
- `/stores` - Store listings and management
- `/stores/kyc` - Store KYC verification
- `/merchants/applications` - Merchant approvals
- `/riders/kyc` - Rider KYC verification
- `/orders` - Order tracking
- `/finance/settlements` - Settlement management

## 🚀 Deployment

### Vercel (Recommended)
1. Push code to GitHub
2. Import project in Vercel
3. Deploy automatically

### Other Platforms
The app can be deployed to any platform supporting Next.js:
- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

## 📝 Notes

- **No Backend Required**: Fully functional with mock data
- **No Environment Variables**: No external API keys needed
- **Browser Compatibility**: Chrome, Edge, Firefox, Safari (latest versions)
- **Development Port**: Runs on port 3000 by default

## 🤝 Support

For questions or issues, please contact the development team.

## 📄 License

Proprietary - All rights reserved
