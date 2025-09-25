# Reviews Dashboard for Flex Living

A comprehensive review management system that integrates with Hostaway's API to provide managers with powerful tools for analyzing guest feedback and managing public review displays.

![Reviews Dashboard](https://img.shields.io/badge/Next.js-14+-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5+-blue?logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3+-38bdf8?logo=tailwind-css)

## Features

### 🏢 Manager Dashboard
- **Review Management**: Approve/reject reviews for public display
- **Advanced Filtering**: Search by guest, property, rating, source, and date
- **Analytics Dashboard**: Rating distributions, category performance, and trends
- **Property Performance**: Compare properties and identify improvement areas
- **Real-time Sync**: Connect with Hostaway API for live review data

### 🌟 Public Review Display
- **Flex Living Style**: Professional property page design
- **Approved Reviews Only**: Curated guest feedback display
- **Category Ratings**: Detailed breakdown of cleanliness, location, communication, etc.
- **Responsive Design**: Optimized for all devices

### 🔗 API Integration
- **Hostaway Integration**: Direct connection to review API with fallback to mock data
- **Google Reviews Ready**: Placeholder for future Google Places API integration
- **Data Normalization**: Unified review schema across all sources

## Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

1. **Clone and Install**
   ```bash
   git clone <repository-url>
   cd reviews-dashboard
   npm install
   ```

2. **Environment Setup**
   The `.env` file is already configured with Hostaway credentials:
   ```env
   DATABASE_URL="file:./dev.db"
   HOSTAWAY_API_KEY="f94377ebbbb479490bb3ec364649168dc443dda2e4830facaf5de2e74ccc9152"
   HOSTAWAY_ACCOUNT_ID="61148"
   HOSTAWAY_BASE_URL="https://api.hostaway.com/v1"
   USE_MOCK_DATA="false"
   ```

3. **Database Setup**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

4. **Start Development Server**
   ```bash
   npm run dev
   ```

5. **Access the Application**
   - Main page: [http://localhost:3000](http://localhost:3000)
   - Manager Dashboard: [http://localhost:3000/dashboard](http://localhost:3000/dashboard)

## Usage Guide

### Getting Started
1. **Visit the homepage** to see the overview and demo properties
2. **Click "Open Dashboard"** to access the manager interface
3. **Click "Sync Hostaway Reviews"** to load review data
4. **Explore the tabs**: Reviews Management, Analytics, and Properties

### Managing Reviews
1. **Filter reviews** using the search and filter options
2. **Toggle the "Public" switch** to approve/reject reviews
3. **View analytics** to understand property performance
4. **Click on demo properties** to see public review display

### API Testing
- The system automatically tries the Hostaway API first
- Falls back to comprehensive mock data if API returns no results
- Toggle `USE_MOCK_DATA="true"` in `.env` to force mock data usage

## Tech Stack

- **Frontend**: Next.js 14, TypeScript, Tailwind CSS, Shadcn/ui
- **Backend**: Next.js API Routes, Prisma ORM, SQLite
- **State Management**: React Query, Zustand
- **Charts**: Recharts
- **Icons**: Lucide React

## API Endpoints

- `GET /api/reviews` - Fetch reviews with filtering
- `PATCH /api/reviews` - Update review approval status  
- `GET /api/reviews/hostaway` - Sync Hostaway reviews
- `GET /api/properties` - Get property statistics

## Project Structure

```
src/
├── app/
│   ├── api/              # API routes
│   ├── dashboard/        # Manager dashboard
│   ├── property/[id]/    # Public property pages
│   └── page.tsx          # Homepage
├── components/ui/        # Shadcn/ui components
├── lib/
│   ├── hostaway.ts      # Hostaway API integration
│   ├── prisma.ts        # Database client
│   └── types.ts         # TypeScript definitions
└── prisma/
    └── schema.prisma    # Database schema
```

## Key Features Implemented

✅ **Hostaway API Integration** with provided credentials  
✅ **Manager Dashboard** with filtering and analytics  
✅ **Public Review Display** matching Flex Living style  
✅ **Mock Data Fallback** for development and testing  
✅ **Google Reviews Placeholder** for future integration  
✅ **Responsive Design** for all screen sizes  
✅ **Type-Safe API** with full TypeScript coverage  

## Google Reviews Integration

Currently implemented as a placeholder due to API access requirements. The system is ready for integration when Google Places API access becomes available.

**Placeholder Features:**
- Visual indicator on property pages
- Database schema supports Google reviews
- UI components ready for integration

## Documentation

For detailed technical documentation, see [DOCUMENTATION.md](./DOCUMENTATION.md)

## Demo Properties

The system includes three demo properties with sample reviews:
- **29 Shoreditch Heights** - 2 Bedroom Apartment
- **45 Canary Wharf Tower** - 1 Bedroom Apartment  
- **12 Kings Cross Central** - Studio Apartment

## Development

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Database operations
npx prisma studio    # View database
npx prisma generate  # Regenerate client
npx prisma db push   # Apply schema changes
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

Built for Flex Living - Reviews Dashboard System
