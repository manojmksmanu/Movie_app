
export interface MovieApiResponse {
  page: number;
  results: Movie[];
  total_pages: number;
  total_results: number;
}

export interface FetchMoviesResponse {
  results: Movie[];
  nextPage: number;
  totalPages: number;
}

// types/movie.ts
export interface Movie {
  id: number;
  title: string;
  tagline: string;
  poster_path: string;
  overview: string;
  runtime: number;
  release_date: string;
  vote_average: number;
  genres: { id: number; name: string }[];
}

export interface CastMember {
  id: number;
  name: string;
  character: string;
  profile_path: string | null;
}

export interface Video {
  id: string;
  key: string;
  name: string;
  site: string;
  type: string;
}

export interface FetchMoviesResponse {
  results: Movie[];
  nextPage: number;
  totalPages: number;
}