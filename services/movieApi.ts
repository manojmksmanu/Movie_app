import axios from 'axios';
import { MovieApiResponse, FetchMoviesResponse } from '../types/movie';

const API_CONFIG = {
  headers: {
    accept: 'application/json',
    Authorization:
      'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJkZmMwZTViODZkMjZiNjYzZjMwZGI4Njg1ZDgwYjUxYiIsInN1YiI6IjYzZjIzYzBkYTI0YzUwMDBhMTNkMDhjZCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.V0LM3lbW5-j0xG2HQYYR2kYltowJK7fNSEcwnLy22Kc',
  },
};

export const fetchMoviesPageType = async ({
  pageParam = 1,
  showList = "now_playing", // Default to "now_playing"
}: {
  pageParam?: number;
  showList?: string;
}): Promise<FetchMoviesResponse> => {
  try {
    const url = `https://api.themoviedb.org/3/movie/${showList}?language=en-US&page=${pageParam}`;
    const response = await axios.get<MovieApiResponse>(url, API_CONFIG);
    return {
      results: response.data.results,
      nextPage: pageParam + 1,
      totalPages: response.data.total_pages,
    };
  } catch (error) {
    console.error("Error fetching movies:", error);
    return { results: [], nextPage: undefined as any, totalPages: 0 };
  }
};

export const fetchTVSeriesPage = async ({
  pageParam = 1,
  showList = "airing_today", // Default to "airing_today"
}: {
  pageParam?: number;
  showList?: string;
}): Promise<FetchMoviesResponse> => {
  try {
    const url = `https://api.themoviedb.org/3/tv/${showList}?language=en-US&page=${pageParam}`;
    const response = await axios.get<MovieApiResponse>(url, API_CONFIG);
    return {
      results: response.data.results,
      nextPage: pageParam + 1,
      totalPages: response.data.total_pages,
    };
  } catch (error) {
    console.error("Error fetching TV series:", error);
    return { results: [], nextPage: undefined as any, totalPages: 0 };
  }
};


// Fetch movie details
// export const fetchMovieDetails = async (id) => {
//   try {
//     const url = `https://api.themoviedb.org/3/movie/${id}?language=en-US`;
//     const response = await axios.get(url, API_CONFIG);
//     return response.data;
//   } catch (error) {
//     console.error("Error fetching movie details:", error);
//     return null;
//   }
// };
export const fetchMovieDetails = async (id:any) => {
  try {
    const movieUrl = `https://api.themoviedb.org/3/movie/${id}?language=en-US`;
    const response = await axios.get(movieUrl, API_CONFIG);
    return response.data;
  } catch (movieError) {
    console.warn("Movie API failed, trying TV API...");

    try {
      const tvUrl = `https://api.themoviedb.org/3/tv/${id}?language=en-US`;
      const tvResponse = await axios.get(tvUrl, API_CONFIG);
      return tvResponse.data;
    } catch (tvError) {
      console.error("Error fetching movie or TV details:", tvError);
      return null;
    }
  }
};

// Fetch movie cast
export const fetchMovieCast = async (id:any) => {
  try {
    const movieCastUrl = `https://api.themoviedb.org/3/movie/${id}/credits?language=en-US`;
    const response = await axios.get(movieCastUrl, API_CONFIG);
    return response.data.cast
  } catch (movieError) {
    console.warn("Movie cast API failed, trying TV cast API...");

    try {
      const tvCastUrl = `https://api.themoviedb.org/3/tv/${id}/credits?language=en-US`;
      const tvResponse = await axios.get(tvCastUrl, API_CONFIG);
      return tvResponse.data.cast
    } catch (tvError) {
      console.error("Error fetching cast details:", tvError);
      return [];
    }
  }
};

// Fetch movie videos (trailers)
export const fetchMovieVideos = async (id:any) => {
  try {
    const movieVideoUrl = `https://api.themoviedb.org/3/movie/${id}/videos?language=en-US`;
    const response = await axios.get(movieVideoUrl, API_CONFIG);
    return response.data.results.filter((video:any) => video.site === "YouTube" && video.type === "Trailer");
  } catch (movieError) {
    console.warn("Movie video API failed, trying TV video API...");

    try {
      const tvVideoUrl = `https://api.themoviedb.org/3/tv/${id}/videos?language=en-US`;
      const tvResponse = await axios.get(tvVideoUrl, API_CONFIG);
      return tvResponse.data.results.filter((video:any) => video.site === "YouTube" && video.type === "Trailer");
    } catch (tvError) {
      console.error("Error fetching video details:", tvError);
      return [];
    }
  }
};

// Fetch movie recommendations
export const fetchMovieRecommendations = async (id:any) => {
  try {
    const movieRecommendationUrl = `https://api.themoviedb.org/3/movie/${id}/recommendations?language=en-US&page=1`;
    const response = await axios.get(movieRecommendationUrl, API_CONFIG);
    return response.data.results.slice(0, 10); // Top 10 recommendations
  } catch (movieError) {
    console.warn("Movie recommendation API failed, trying TV recommendation API...");

    try {
      const tvRecommendationUrl = `https://api.themoviedb.org/3/tv/${id}/recommendations?language=en-US&page=1`;
      const tvResponse = await axios.get(tvRecommendationUrl, API_CONFIG);
      return tvResponse.data.results.slice(0, 10);
    } catch (tvError) {
      console.error("Error fetching recommendation details:", tvError);
      return [];
    }
  }
};


export const fetchMoviesPage = async ({
  pageParam = 1,
}): Promise<FetchMoviesResponse> => {
  try {
    const response = await axios.get<MovieApiResponse>(
      `https://api.themoviedb.org/3/movie/now_playing?language=en-US&page=${pageParam}`,
      API_CONFIG
    );
    return {
      results: response.data.results,
      nextPage: pageParam + 1,
      totalPages: response.data.total_pages,
    };
  } catch (error) {
    console.error('Error fetching movies:', error);
    return { results: [], nextPage: undefined as any, totalPages: 0 };
  }
};

export const searchMovies = async (
  query: string,
  page: number
): Promise<FetchMoviesResponse> => {
  try {
    const response = await axios.get<MovieApiResponse>(
      `https://api.themoviedb.org/3/search/movie?query=${query}&language=en-US&page=${page}`,
      API_CONFIG
    );
    return {
      results: response.data.results,
      nextPage: page + 1,
      totalPages: response.data.total_pages,
    };
  } catch (error) {
    console.error('Error searching movies:', error);
    return { results: [], nextPage: undefined as any, totalPages: 0 };
  }
};
