# Google Reviews Integration Setup Guide

This guide explains how to set up and configure Google Reviews integration for the Reviews Dashboard.

## Prerequisites

1. **Google Cloud Platform Account** with billing enabled
2. **Google Maps and Places API Keys** (you should have these ready)
3. **Property Place IDs** from Google (see instructions below)

## Step 1: API Configuration

### Add API Keys to Environment Variables

Make sure your `.env` file contains:

```env
# Google Maps API (for interactive maps)
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_api_key

# Google Places API (for reviews)
GOOGLE_PLACES_API_KEY=your_google_places_api_key
```

### Enable Required APIs

In Google Cloud Console, ensure these APIs are enabled:
- **Maps JavaScript API** (for maps)
- **Places API** (for reviews)

## Step 2: Find Place IDs for Your Properties

Each property needs a Google Place ID to fetch reviews. Here's how to find them:

### Method 1: Using Google Place ID Finder
1. Go to [Google Place ID Finder](https://developers.google.com/maps/documentation/places/web-service/place-id)
2. Search for your property address
3. Copy the Place ID

### Method 2: Using the App's Search Function
The app includes a search function that can help find Place IDs:

```bash
# Example API call to search for a place
curl "http://localhost:3333/api/reviews/google" \
  -X POST \
  -H "Content-Type: application/json" \
  -d '{
    "propertyId": "your-property-id",
    "propertyName": "Your Property Name",
    "address": "Full Property Address"
  }'
```

### Method 3: Manual Configuration

Edit `/src/lib/google-places.ts` and update the `PROPERTY_PLACE_IDS` mapping:

```typescript
const PROPERTY_PLACE_IDS: Record<string, string> = {
  'your-property-id-1': 'ChIJd7qhkH8cdkgRActualPlaceID1',
  'your-property-id-2': 'ChIJd7qhkH8cdkgRActualPlaceID2',
  'your-property-id-3': 'ChIJd7qhkH8cdkgRActualPlaceID3',
};
```

## Step 3: Test the Integration

1. **Start the development server**:
   ```bash
   npm run dev
   ```

2. **Go to the Dashboard**: http://localhost:3333/dashboard

3. **Click "Sync Google Reviews"** button

4. **Check the results**:
   - Reviews should appear in the dashboard
   - Filter by "Google Reviews" to see only Google reviews
   - Check property pages for Google reviews display

## Step 4: Understanding the Data Flow

### Review Sync Process
1. **API Call**: App calls Google Places API with Place ID
2. **Data Fetch**: Google returns up to 5 recent reviews
3. **Normalization**: Reviews converted to app's schema
4. **Storage**: Reviews saved to database
5. **Approval**: Reviews require manager approval before public display

### Review Display
- **Dashboard**: All Google reviews (pending/approved)
- **Property Pages**: Only approved Google reviews
- **Filtering**: Filter by source (Hostaway vs Google)

## Limitations and Considerations

### Rate Limits
- **Free Tier**: 1,000 requests per day
- **Cost**: $0.017 per request after free tier
- **Recommendation**: Monitor usage in Google Cloud Console

### Review Limitations
- **Maximum 5 reviews** per place from API
- **Public reviews only** (no business owner insights)
- **No category ratings** (Google doesn't provide detailed breakdowns)
- **Rating scale**: 1-5 (automatically converted to 1-10 for consistency)

### Data Freshness
- **Google caches reviews**: Updates may be delayed
- **Manual sync required**: Reviews don't update automatically
- **Recommendation**: Sync weekly or after significant events

## Troubleshooting

### Common Issues

#### "No Google Reviews Found"
- **Check Place ID**: Ensure Place ID is correct in the mapping
- **Verify API Key**: Ensure Places API key is valid and has sufficient quota
- **Check Property ID**: Ensure property ID matches exactly

#### "API Quota Exceeded"
- **Check Google Cloud Console**: Monitor API usage
- **Fallback Data**: App automatically uses mock data when quota exceeded
- **Increase Quota**: Add billing account or increase limits

#### "Reviews Not Displaying"
- **Manager Approval**: Google reviews require approval before public display
- **Go to Dashboard**: Approve reviews using the toggle switches
- **Check Filters**: Ensure "Google Reviews" filter is not excluding them

### Debug Mode

Enable debug logging by setting:
```env
USE_MOCK_DATA="true"
```

This will use mock Google reviews for testing without consuming API quota.

## Production Considerations

### Security
- **API Key Restrictions**: Restrict API keys to your domain in Google Cloud Console
- **Environment Variables**: Never commit API keys to version control
- **Monitoring**: Set up billing alerts to avoid unexpected charges

### Performance
- **Caching**: Consider implementing review caching to reduce API calls
- **Batch Processing**: Sync reviews during off-peak hours
- **Error Handling**: App includes comprehensive error handling and fallbacks

### Monitoring
- **API Usage**: Monitor in Google Cloud Console
- **Error Logs**: Check server logs for API errors
- **Review Quality**: Monitor review approval rates and quality

## Advanced Configuration

### Custom Place ID Mapping
For dynamic Place ID discovery, you can implement:

```typescript
// In your API endpoint
const placeId = await googlePlacesAPI.findPlaceIdForProperty(
  propertyName, 
  propertyAddress
);
```

### Automated Sync
Consider setting up a cron job to sync reviews automatically:

```typescript
// Example cron job (not implemented)
// Sync Google reviews daily at 2 AM
cron.schedule('0 2 * * *', async () => {
  await fetch('/api/reviews/google');
});
```

## Support

For issues with Google Reviews integration:
1. Check the troubleshooting section above
2. Verify API keys and quotas in Google Cloud Console
3. Check application logs for detailed error messages
4. Test with mock data first to isolate API issues
