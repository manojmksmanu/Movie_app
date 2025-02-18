import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Movie } from '../types/movie';

interface MovieState {
  shortlistedMovies: Movie[];
}

const initialState: MovieState = {
  shortlistedMovies: [],
};

const movieSlice = createSlice({
  name: 'movies',
  initialState,
  reducers: {
    toggleShortlist: (state, action: PayloadAction<Movie>) => {
      const movie = action.payload;
      const exists = state.shortlistedMovies.some((m) => m.id === movie.id);
      
      if (exists) {
        state.shortlistedMovies = state.shortlistedMovies.filter(
          (m) => m.id !== movie.id
        );
      } else {
        state.shortlistedMovies.push(movie);
      }
    },
    setState: (state, action: PayloadAction<MovieState>) => {
      return action.payload;
    },
  },
});

export const { toggleShortlist, setState } = movieSlice.actions;
export default movieSlice.reducer;