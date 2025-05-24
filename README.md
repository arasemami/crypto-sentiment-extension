
# Crypto Sentiment Chrome Extension

A simple Chrome extension built with React, TypeScript, and Tailwind CSS that displays whether the crypto market sentiment is **Long** or **Short**.

---

## Features

- Shows current market sentiment (Long / Short) with colored text
- Responsive design with Tailwind CSS
- Built with React + TypeScript for type safety and modern development
- Easy to build and load locally as a Chrome extension

---

## Getting Started

### Prerequisites

- Node.js (v16+ recommended)
- npm or yarn
- Google Chrome browser

### Installation

1. Clone the repo:

   ```bash
   git clone https://github.com/yourusername/crypto-sentiment-extension.git
   cd crypto-sentiment-extension
   ```

2. Install dependencies:

   ```bash
   npm install
   # or
   yarn install
   ```

3. Build the project:

   ```bash
   npm run build
   # or
   yarn build
   ```

---

## Running Locally

To test the extension during development, run:

```bash
npm run dev
# or
yarn dev
```

---

## Loading the Extension in Chrome

1. Open Chrome and navigate to `chrome://extensions/`
2. Enable **Developer mode** (top-right toggle)
3. Click **Load unpacked**
4. Select the `dist` folder inside the project directory
5. The extension icon should appear in the toolbar — click to open and see the market sentiment

---

## Adding Your Own Market Sentiment Data

Replace the placeholder sentiment data in `src/App.tsx` with your own API calls or logic to fetch real-time crypto market sentiment.

---

## Technologies Used

- React
- TypeScript
- Tailwind CSS
- Vite (build tool)

---

## Troubleshooting

- If the extension icon or popup doesn’t appear, make sure your `manifest.json` and icons are correctly placed in the `public` folder.
- Check Chrome’s extension page console (`chrome://extensions/` → **Inspect views**) for errors.

---

## License

This project is licensed under the MIT License.

---

## Contact

For questions or suggestions, feel free to open an issue or contact me at [aras.armani2014@gmail.com].
