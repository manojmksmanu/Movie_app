import { configureStore } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import movieReducer from './movieSlice';

// Load persisted state from AsyncStorage
const loadState = async () => {
  try {
    const serializedState = await AsyncStorage.getItem('movieState');
    if (serializedState === null) {
      return undefined;
    }
    return JSON.parse(serializedState);
  } catch (err) {
    return undefined;
  }
};

// Save state to AsyncStorage
const saveState = async (state: any) => {
  try {
    const serializedState = JSON.stringify(state);
    await AsyncStorage.setItem('movieState', serializedState);
  } catch (err) {
   
  }
};

// Initialize store with empty state first
export const store = configureStore({
  reducer: {
    movies: movieReducer,
  },
});

// Load the persisted state and update the store
loadState().then((state) => {
  if (state) {
    store.dispatch({ type: 'movies/setState', payload: state.movies });
  }
});

// Subscribe to store changes and save to AsyncStorage
store.subscribe(() => {
  const state = store.getState();
  saveState({
    movies: state.movies,
  });
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;