import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const API_CONFIG = {
  headers: {
    accept: "application/json",
    Authorization:
      "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJkZmMwZTViODZkMjZiNjYzZjMwZGI4Njg1ZDgwYjUxYiIsInN1YiI6IjYzZjIzYzBkYTI0YzUwMDBhMTNkMDhjZCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.V0LM3lbW5-j0xG2HQYYR2kYltowJK7fNSEcwnLy22Kc",
  },
};

const fetchTrendingMovies = async () => {
  try {
    const url = `https://api.themoviedb.org/3/trending/all/day?language=en-US`;
    const response = await axios.get(url, API_CONFIG);
    return response.data; 
  } catch (error: any) {
    console.error(
      "Error fetching trending movies:",
      error.response?.data || error.message
    );
    throw error; 
  }
};

export const useTrendingMovies = () => {
  return useQuery({
    queryKey: ["trendingMovies"],
    queryFn: fetchTrendingMovies,
  });
};

const fetchTrendingMoviesByDays = async ({ queryKey }: { queryKey: any }) => {
  try {
    const [, dayWeek] = queryKey; 
    const url = `https://api.themoviedb.org/3/trending/movie/${dayWeek}?language=en-US`;
    const response = await axios.get(url, API_CONFIG);
    return response.data.results;
  } catch (error: any) {
    console.error(
      "Error fetching trending movies:",
      error.response?.data || error.message
    );
    throw error; // React Query error handle karega
  }
};

export const useTrendingMoviesByDays = (dayWeek:any) => {
  return useQuery({
    queryKey: ["trendingMoviesByDays", dayWeek],
    queryFn: fetchTrendingMoviesByDays,
  });
};
const fetchTrendingTvByDays = async ({ queryKey }: { queryKey: any }) => {
  try {
    const [, dayWeek] = queryKey; 
    const url = `https://api.themoviedb.org/3/trending/tv/${dayWeek}?language=en-US`;
    const response = await axios.get(url, API_CONFIG);
    return response.data.results;
  } catch (error: any) {
    console.error(
      "Error fetching trending movies:",
      error.response?.data || error.message
    );
    throw error; 
  }
};

export const useTrendingTvByDays = (dayWeek:any) => {
  return useQuery({
    queryKey: ["trendingTvByDays", dayWeek],
    queryFn: fetchTrendingTvByDays,
  });
};
