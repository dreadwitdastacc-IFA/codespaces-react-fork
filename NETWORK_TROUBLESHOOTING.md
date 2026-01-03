# Network and Firewall Troubleshooting

This document provides guidance for resolving network connectivity and firewall issues when running the React application.

## Overview

This application fetches data from external APIs that may be blocked by corporate firewalls, network security policies, or restricted environments:

1. **CoinGecko API** (`https://api.coingecko.com`) - Provides real-time Litecoin price data
2. **Mempool.space API** (`https://mempool.space`) - Provides Litecoin mempool transaction data

## Firewall/Network Issues

### Symptoms

- "Failed to fetch" errors in browser console
- Components showing fallback/cached data with warning messages
- Yellow warning banners indicating "API unreachable - may be blocked by firewall"

### Common Causes

1. **Corporate Firewall Rules** - Your organization may block access to cryptocurrency-related domains
2. **Network Security Policies** - Security software may prevent connections to certain APIs
3. **CORS Restrictions** - Browser security policies preventing cross-origin requests
4. **Geographic Restrictions** - Some APIs may be unavailable in certain regions
5. **Rate Limiting** - Too many requests to the API

## Solutions

### Option 1: Use Environment Variables to Configure Alternative Endpoints

If you have access to alternative API endpoints or proxy servers, you can configure them using environment variables:

1. Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

2. Edit `.env.local` and uncomment/modify the API URLs:
   ```
   VITE_COINGECKO_API_URL=https://your-proxy.com/coingecko
   VITE_MEMPOOL_API_URL=https://your-proxy.com/mempool
   ```

3. Restart the development server:
   ```bash
   npm start
   ```

### Option 2: Set Up a CORS Proxy

If CORS is the issue, you can use a CORS proxy server:

**Using Public CORS Proxy (Development Only):**
```
VITE_COINGECKO_API_URL=https://cors-anywhere.herokuapp.com/https://api.coingecko.com/api/v3/simple/price?ids=litecoin&vs_currencies=usd
```

⚠️ **Warning:** Public CORS proxies should NOT be used in production. They can be unreliable and pose security risks.

**Setting Up Your Own CORS Proxy:**

For production use, set up your own proxy server:

1. Simple Node.js proxy example:
```javascript
const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');

const app = express();
app.use(cors());

app.get('/api/coingecko', async (req, res) => {
  const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=litecoin&vs_currencies=usd');
  const data = await response.json();
  res.json(data);
});

app.get('/api/mempool', async (req, res) => {
  const response = await fetch('https://mempool.space/api/litecoin/txs/mempool');
  const data = await response.json();
  res.json(data);
});

app.listen(3001, () => console.log('Proxy running on port 3001'));
```

2. Configure your `.env.local`:
```
VITE_COINGECKO_API_URL=http://localhost:3001/api/coingecko
VITE_MEMPOOL_API_URL=http://localhost:3001/api/mempool
```

### Option 3: Work with IT/Network Administration

If you're in a corporate environment:

1. Request that your IT department whitelist the following domains:
   - `api.coingecko.com`
   - `mempool.space`

2. Provide them with this documentation explaining why these domains are needed

3. If whitelisting is not possible, work with them to set up an approved proxy server

### Option 4: Use Fallback Data (Already Implemented)

The application now includes fallback data that automatically activates when APIs are unreachable:

- **LitecoinPriceBot**: Shows a cached/approximate price when CoinGecko is blocked
- **LitecoinMempoolTransactions**: Shows sample transaction data when Mempool.space is blocked

Components display a yellow warning banner when using fallback data, so you'll always know when you're not seeing live data.

## Testing Connectivity

### Test API Endpoints

You can test if the APIs are accessible from your network using curl:

```bash
# Test CoinGecko API
curl https://api.coingecko.com/api/v3/simple/price?ids=litecoin&vs_currencies=usd

# Test Mempool.space API
curl https://mempool.space/api/litecoin/txs/mempool
```

If these commands fail or timeout, the APIs are likely blocked by your firewall.

### Browser Developer Tools

1. Open your browser's Developer Tools (F12)
2. Go to the **Network** tab
3. Reload the application
4. Look for failed requests to `api.coingecko.com` or `mempool.space`
5. Check the error messages (e.g., "net::ERR_BLOCKED_BY_CLIENT", "CORS error", "Failed to fetch")

## Security Considerations

When working around firewall restrictions:

1. **Never** expose API keys or sensitive credentials in environment variables that are committed to git
2. **Always** use `.env.local` for local overrides (it's already in `.gitignore`)
3. **Prefer** backend proxy solutions over public CORS proxies for production
4. **Consider** the security implications of bypassing your organization's firewall policies
5. **Comply** with your organization's security policies and obtain necessary approvals

## GitHub Codespaces Specific Issues

If you're using GitHub Codespaces and experiencing connectivity issues:

1. Codespaces generally has good outbound connectivity, but some regions may have restrictions
2. Port forwarding should work automatically for the development server (port 3000)
3. If you need to set up a proxy, it will run inside your codespace and should be accessible

## Additional Resources

- [Vite Environment Variables Documentation](https://vitejs.dev/guide/env-and-mode.html)
- [MDN: CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS)
- [GitHub Codespaces Networking](https://docs.github.com/en/codespaces/developing-in-codespaces/forwarding-ports-in-your-codespace)

## Getting Help

If you continue to experience issues:

1. Check the browser console for specific error messages
2. Review your network security policies
3. Contact your IT/network administration team
4. Open an issue in the repository with details about your environment and error messages
