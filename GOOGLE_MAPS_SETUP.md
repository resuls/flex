# Google Maps Integration Setup

This document explains how to set up Google Maps integration for the property location display.

## Prerequisites

1. A Google Cloud Platform account
2. A Google Cloud project with billing enabled

## Setup Steps

### 1. Enable Google Maps JavaScript API

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project or create a new one
3. Navigate to "APIs & Services" > "Library"
4. Search for "Maps JavaScript API"
5. Click on it and press "Enable"

### 2. Create API Key

1. Go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "API Key"
3. Copy the generated API key
4. (Optional) Restrict the API key to your domain for security

### 3. Configure Environment Variables

Create a `.env` file in your project root and add:

```env
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_actual_api_key_here
```

Replace `your_actual_api_key_here` with the API key you generated in step 2.

### 4. Restart Development Server

After adding the environment variable, restart your development server:

```bash
npm run dev
```

## Features

Once configured, the property pages will display:

- **Interactive Google Maps**: Full-featured map with zoom, street view, and satellite view
- **Property Marker**: Custom marker showing the exact property location
- **Nearby Amenities**: List of nearby attractions, transport links, and services
- **Transport Information**: Underground, bus, and road access details

## Fallback Behavior

If no Google Maps API key is provided, the system will display:
- A placeholder map with setup instructions
- Static location information
- Nearby amenities list (without interactive map)

## Security Notes

- Never commit your API key to version control
- Use environment variables for all API keys
- Consider restricting your API key to specific domains in production
- Monitor your API usage in the Google Cloud Console

## Cost Considerations

- Google Maps JavaScript API has usage-based pricing
- First $200/month is free for most users
- Monitor usage in the Google Cloud Console
- Set up billing alerts to avoid unexpected charges
