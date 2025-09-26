# Blood - Liquidation Intelligence Platform

> Advanced AI-powered liquidation tracking platform providing real-time intelligence across cryptocurrency markets for modern traders and institutions.

## Overview

Blood is a cutting-edge liquidation tracking platform that monitors liquidation events across all major cryptocurrency exchanges in real-time. Our AI-powered intelligence system helps traders identify market opportunities, understand liquidation patterns, and make informed trading decisions.

## Features

### Core Capabilities

- **Real-Time Liquidation Tracking**: Monitor liquidations across all major exchanges including Binance, OKX, Bybit, BitMEX, and dYdX
- **Advanced Heatmaps**: Visual representation of liquidation clusters and market intensity
- **Multi-Asset Coverage**: Track BTC, ETH, SOL, and 100+ other cryptocurrencies
- **Intelligent Alerts**: AI-powered notifications for significant liquidation events
- **Historical Analysis**: Deep dive into liquidation patterns and market trends
- **API Integration**: RESTful API for institutional clients and developers

### Intelligence Features

- **Liquidation Cascades**: Detect and predict liquidation cascade events
- **Market Sentiment Analysis**: Understand market positioning through liquidation data
- **Risk Assessment**: Evaluate market stress through liquidation volume analysis
- **Position Sizing Intelligence**: Optimize position sizes based on liquidation zones
- **Multi-Timeframe Analysis**: 1H, 4H, 1D, and 7D liquidation tracking

### Supported Exchanges

- Binance
- OKX  
- Bybit
- BitMEX
- dYdX
- And more...

## Quick Start

### Prerequisites

- Modern web browser with JavaScript enabled
- Internet connection for real-time data

### Getting Started

1. Clone the repository:
   ```bash
   git clone https://github.com/juicegodlivin/blood-website.git
   cd blood-website
   ```

2. Install dependencies (for development):
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser to `http://localhost:3000`

### Production Deployment

For production deployment, serve the static files:

```bash
npm run start
```

Or deploy to any static hosting service:
- Vercel
- Netlify  
- GitHub Pages
- AWS S3 + CloudFront
- Your own web server

## Project Structure

```
blood-website/
├── index.html              # Main landing page
├── liquidations.html        # Liquidations dashboard
├── docs.html               # API documentation
├── styles.css              # Main styling
├── liquidations.css        # Dashboard-specific styles
├── script.js               # Application logic
├── Blood Logo.png          # Brand logo
├── Blood Background.mp4    # Video background
├── wallet-auth-system/     # Wallet authentication
└── package.json           # Project configuration
```

## Usage

### Main Dashboard

Visit the liquidations page to access:
- Real-time liquidation data
- Interactive heatmaps
- Exchange-specific breakdowns
- Historical liquidation charts

### API Integration

Access our RESTful API for:
- Real-time liquidation feeds
- Historical data queries
- Custom alert configurations
- Webhook integrations

See the [API Documentation](docs.html) for detailed integration guides.

### Wallet Integration

Connect your wallet to:
- Access premium features
- Set up personalized alerts
- Save custom dashboard configurations
- Export liquidation data

Supported wallets:
- Phantom (Solana)
- Solflare (Solana)
- MetaMask (Ethereum)

## Development

### Available Scripts

- `npm run start` - Start production server
- `npm run dev` - Start development server with live reload
- `npm run lint` - Check code quality
- `npm run lint:fix` - Fix code issues automatically

### Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Technology Stack

- **Frontend**: Vanilla JavaScript, CSS3, HTML5
- **Styling**: CSS Custom Properties, CSS Grid, Flexbox
- **Fonts**: Inter, Space Grotesk, Manrope, Orbitron
- **Data**: Real-time WebSocket connections
- **Authentication**: Web3 wallet integration

## Security & Privacy

- **No Data Storage**: We don't store private keys or personal information
- **Secure Connections**: All data transmitted over HTTPS
- **Privacy-First**: No unnecessary tracking or analytics
- **Web3 Native**: Decentralized authentication through wallet connections

## API Features

### Real-Time Endpoints

- `/api/liquidations/live` - Live liquidation stream
- `/api/liquidations/summary` - Market summary data
- `/api/exchanges/{exchange}` - Exchange-specific data
- `/api/assets/{symbol}` - Asset-specific liquidations

### Historical Data

- `/api/liquidations/history` - Historical liquidation data
- `/api/analytics/trends` - Trend analysis
- `/api/reports/daily` - Daily liquidation reports

## Customization

### Themes

The platform uses CSS custom properties for easy theming:

```css
:root {
  --color-accent: #ff4444;           /* Blood red accent */
  --color-bg-primary: rgba(20, 0, 0, 0.8);  /* Dark background */
  --color-text-primary: #ffffff;     /* Primary text */
}
```

### Dashboard Configuration

Customize your dashboard by:
- Selecting preferred exchanges
- Setting up custom alerts
- Choosing display preferences
- Configuring data refresh rates

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/liquidation-alerts`
3. Make your changes
4. Test thoroughly
5. Commit: `git commit -am 'Add liquidation alerts feature'`
6. Push: `git push origin feature/liquidation-alerts`
7. Create a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support and questions:
- Open an issue on GitHub
- Visit our documentation at [docs.html](docs.html)
- Follow us on [X (Twitter)](https://x.com/erevos_ops)

## Disclaimer

Blood is a financial intelligence tool for educational and informational purposes. Liquidation data should not be considered as financial advice. Users are responsible for their own trading decisions and risk management.

---

**Blood Analytics** - Advanced liquidation intelligence for the modern trader.