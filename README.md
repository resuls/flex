# Reviews Dashboard

A comprehensive review management system for property managers to analyze guest feedback, manage public reviews, and track property performance across multiple platforms.

## Features

- **Review Management**: Approve/reject reviews for public display
- **Multi-Platform Integration**: Hostaway API with Google Reviews support
- **Analytics Dashboard**: Rating distributions, category performance, and trends
- **Property Performance**: Compare properties and identify improvement areas
- **Public Review Display**: Professional property pages with approved reviews
- **Real-time Sync**: Live data updates with optimistic UI

## Tech Stack

- **Frontend**: Next.js 15, TypeScript, Tailwind CSS, Shadcn/ui
- **Backend**: Next.js API Routes, Prisma ORM
- **Database**: SQLite
- **State Management**: React Query, Zustand
- **Charts**: Recharts
- **Maps**: Google Maps API

## Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn
- Git

### Local Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd reviews-dashboard
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment setup**
   Create a `.env` file in the root directory:
   ```env
   # Database
   DATABASE_URL="file:./dev.db"
   
   # Hostaway API (Required)
   HOSTAWAY_API_KEY="your_hostaway_api_key"
   HOSTAWAY_ACCOUNT_ID="your_account_id"
   HOSTAWAY_BASE_URL="https://api.hostaway.com/v1"
   
   # Google APIs (Optional)
   NEXT_PUBLIC_GOOGLE_MAPS_API_KEY="your_google_maps_api_key"
   GOOGLE_PLACES_API_KEY="your_google_places_api_key"
   
   # Development flags
   USE_MOCK_DATA="false"
   NODE_ENV="development"
   ```

4. **Database setup**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. **Start development server**
   ```bash
   npm run dev
   ```

6. **Access the application**
   - Homepage: http://localhost:3000
   - Manager Dashboard: http://localhost:3000/dashboard

### Docker Deployment

```bash
# Build the image
docker build -t reviews-dashboard .

# Run with SQLite (simpler setup)
docker run -d \
  --name reviews-dashboard \
  -p 3000:3000 \
  -e DATABASE_URL="file:./dev.db" \
  -e HOSTAWAY_API_KEY="your_api_key" \
  -e HOSTAWAY_ACCOUNT_ID="your_account_id" \
  -e HOSTAWAY_BASE_URL="https://api.hostaway.com/v1" \
  -v $(pwd)/data:/app/data \
  reviews-dashboard
```

## API Configuration

### Hostaway Integration

Required for fetching property reviews:

1. **Get API credentials** from your Hostaway account
2. **Set environment variables**:
   - `HOSTAWAY_API_KEY`: Your API key
   - `HOSTAWAY_ACCOUNT_ID`: Your account ID
   - `HOSTAWAY_BASE_URL`: API base URL (usually https://api.hostaway.com/v1)

### Google APIs Setup

Optional but recommended for maps and additional reviews:

1. **Create Google Cloud Project**
   - Go to [Google Cloud Console](https://console.cloud.google.com)
   - Create new project or select existing one
   - Enable billing (required for production usage)

2. **Enable Required APIs**
   - Maps JavaScript API (for property maps)
   - Places API (for Google Reviews)

3. **Create API Keys**
   - Go to APIs & Services > Credentials
   - Create API key for Maps JavaScript API
   - Create separate API key for Places API
   - Restrict keys to your domain for security

4. **Set Environment Variables**
   ```env
   NEXT_PUBLIC_GOOGLE_MAPS_API_KEY="your_maps_api_key"
   GOOGLE_PLACES_API_KEY="your_places_api_key"
   ```

## Google Reviews Limitations

### Current Implementation Status

The Google Reviews integration is **fully implemented** but has significant limitations due to Google's API restrictions:

### ⚠️ **Major Limitations**

#### **1. Rate Limits**
- **Free Tier**: 1,000 requests per day
- **Cost**: $0.017 per request after free tier
- **Impact**: Limited review syncing frequency

#### **2. Review Access Restrictions**
- **Maximum 5 reviews** per location from Places API
- **Public reviews only** - no private business insights
- **No real-time updates** - reviews are cached by Google
- **No category ratings** - only overall ratings available

#### **3. Place ID Requirements**
- Each property needs a **Google Place ID**
- Manual mapping required for each property
- Place IDs must be discovered through search or manual lookup

#### **4. Business Verification Limitations**
Without Google My Business verification:
- Cannot respond to reviews programmatically
- No access to business analytics
- Limited review management capabilities
- No webhook notifications for new reviews

#### **5. Data Freshness**
- Google caches review data
- Updates may be delayed by hours or days
- Manual sync required to get latest reviews
- Not suitable for real-time review monitoring

### **Recommended Approach**

1. **Primary Source**: Use Hostaway as the main review source
2. **Google as Secondary**: Use Google Reviews for additional context
3. **Manual Approval**: All Google reviews require manager approval
4. **Periodic Sync**: Sync Google reviews weekly rather than daily
5. **Monitor Costs**: Set up billing alerts in Google Cloud Console

### **Alternative Solutions**

For better Google Reviews integration, consider:
- **Google My Business API** (requires business verification)
- **Third-party services** like ReviewTrackers or Podium
- **Web scraping solutions** (check Google's terms of service)

## Database Management

### Development (SQLite)
```bash
# View database in browser
npx prisma studio

# Reset database
npx prisma db push --force-reset

# Generate Prisma client
npx prisma generate
```

### Production
```bash
# Run migrations
npx prisma db push
```

## Monitoring and Maintenance

### Health Checks
- Application: http://localhost:3000/api/health
- Database: Check connection in Prisma Studio
- APIs: Monitor API response times and error rates

### Log Monitoring
```bash
# Docker logs
docker-compose logs -f app

# Application logs
tail -f logs/app.log
```

### Performance Optimization
- Enable Redis for caching (optional)
- Configure CDN for static assets
- Monitor database query performance
- Set up application monitoring (e.g., Sentry)

## Troubleshooting

### Common Issues

**Database Connection Errors**
```bash
# Check database URL
echo $DATABASE_URL

# Regenerate Prisma client
npx prisma generate
```

**API Rate Limits**
- Enable mock data: `USE_MOCK_DATA="true"`
- Check API quotas in respective consoles
- Implement request caching

**Build Failures**
```bash
# Clear Next.js cache
rm -rf .next

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

## Support

For technical issues:
1. Check application logs
2. Verify environment variables
3. Test API endpoints individually
4. Check database connectivity

## License

Built for property management - Reviews Dashboard System
