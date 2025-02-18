# TMDB Movie App

A React Native mobile application built with Expo that allows users to browse movies, search for specific titles, and create a shortlist of favorites using The Movie Database (TMDB) API.

## Features

- Browse popular movies
- Search movies by title
- View detailed movie information
- Shortlist favorite movies
- Infinite scroll pagination
- Responsive design for both mobile and web platforms

## Prerequisites

Before you begin, ensure you have the following installed:
- [Node.js](https://nodejs.org/) (v14 or higher)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- [Expo CLI](https://docs.expo.dev/get-started/installation/)
- [Git](https://git-scm.com/)

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd project
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Create a `.env` file in the root directory and add your TMDB API key:
```env
TMDB_API_KEY=your_api_key_here
```

4. Start the development server:
```bash
npx expo start
```

## Running the App

After starting the development server, you have several options to run the app:

- **iOS Simulator**: Press `i` in the terminal
- **Android Emulator**: Press `a` in the terminal
- **Web Browser**: Press `w` in the terminal
- **Physical Device**: Scan the QR code using the Expo Go app
  - [Expo Go for iOS](https://apps.apple.com/app/expo-go/id982107779)
  - [Expo Go for Android](https://play.google.com/store/apps/details?id=host.exp.exponent)

## Project Structure

```
project/
├── app/
│   └── (tabs)/
│       ├── index.tsx       # Home screen with movie list
│       └── shortlist.tsx   # Shortlisted movies screen
├── components/
│   └── MovieCard.tsx       # Reusable movie card component
├── services/
│   └── movieApi.ts         # API service functions
├── store/
│   ├── movieSlice.ts       # Redux slice for movies
│   └── store.ts           # Redux store configuration
└── types/
    └── movie.ts           # TypeScript interfaces
```

## Built With

- [Expo](https://expo.dev/)
- [React Native](https://reactnative.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Redux Toolkit](https://redux-toolkit.js.org/)
- [React Query](https://tanstack.com/query/latest)
- [TMDB API](https://www.themoviedb.org/documentation/api)

## Getting a TMDB API Key

1. Visit [TMDB Website](https://www.themoviedb.org/)
2. Create an account or log in
3. Go to Settings -> API
4. Request an API key (choose "Developer" option)
5. Fill in the required information
6. Copy your API key and add it to the `.env` file

## Available Scripts

```bash
# Start the development server
npx expo start

# Start with cleared cache
npx expo start --clear

# Run on iOS simulator
npx expo run:ios

# Run on Android emulator
npx expo run:android

# Run on web browser
npx expo start:web
```

## Features in Detail

### Home Screen
- Browse popular movies
- Search functionality with debounce
- Infinite scroll for movie list
- Responsive grid layout

### Movie Details
- View comprehensive movie information
- See movie poster and backdrop
- Check ratings and release date
- Read movie overview

### Shortlist Feature
- Add/remove movies to shortlist
- Persistent storage of shortlisted movies
- Quick access to favorite movies

## Troubleshooting

Common issues and solutions:

1. **Metro bundler issues**
```bash
# Clear metro cache
npx expo start --clear
```

2. **Environment variables not working**
- Ensure `.env` file is in root directory
- Restart the development server

3. **API Key issues**
- Verify API key is correctly added to `.env`
- Check if API key is active on TMDB dashboard

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.