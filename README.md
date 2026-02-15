# Love Passport ❤️

A digital passport for couples to collect memories, redeem stamps, and share moments.

## Features
- **Couple Bonding**: Create a couple profile or join your partner.
- **Digital Stamps**: Collect and redeem stamps for completing couple activities (e.g., "Honmei Chocolate Night").
- **Memory Storage**: Upload photos for each stamp to keep your memories safe.
- **Real-time Updates**: Powered by Convex for instant data syncing.

## Tech Stack
- **Frontend**: React Native (Expo)
- **Backend**: Convex
- **Language**: TypeScript

## Prerequisites
- Node.js (v18 or later recommended)
- npm or yarn

## Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/SpyBeast07/love-passport.git
cd love-passport
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Start the Backend (Convex)
Open a terminal and run:
```bash
npx convex dev
```
This will set up your backend, provision a database, and generate necessary types.  
*Note: You may need to log in to Convex if this is your first time.*

### 4. Start the Frontend (Expo)
Open a **new** terminal window (keep the backend running) and run:
```bash
npx expo start
```
- Press `i` to run on an iOS simulator.
- Press `a` to run on an Android emulator.
- Scan the QR code with the Expo Go app on your physical device.

## Project Structure
- `convex/`: Backend functions (database queries, mutations, schema).
- `app/`: Frontend screens and layout (Expo Router).
- `components/`: Reusable UI components.

## Troubleshooting
- **Build Errors**: If you encounter issues, try deleting `node_modules` and running `npm install` again.
- **Convex Issues**: Ensure `npx convex dev` is running and showing "Convex functions ready".
