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
    return response.data; // Axios returns data directly
  } catch (error: any) {
    console.error(
      "Error fetching trending movies:",
      error.response?.data || error.message
    );
    throw error; // React Query ko error pass karenge taaki wo bhi handle kare
  }
};

export const useTrendingMovies = () => {
  return useQuery({
    queryKey: ["trendingMovies"],
    queryFn: fetchTrendingMovies,
  });
};

const fetchTrendingMoviesByDays = async ({ queryKey }) => {
  try {
    const [, dayWeek] = queryKey; // Query key se `dayWeek` extract karenge
    const url = `https://api.themoviedb.org/3/trending/all/${dayWeek}?language=en-US`;
    const response = await axios.get(url, API_CONFIG);
    return response.data.results;
  } catch (error:any) {
    console.error(
      "Error fetching trending movies:",
      error.response?.data || error.message
    );
    throw error; // React Query error handle karega
  }
};

export const useTrendingMoviesByDays = (dayWeek:any) => {
  return useQuery({
    queryKey: ["trendingMoviesByDays", dayWeek], // Query key dynamic hai
    queryFn: fetchTrendingMoviesByDays,
  });
};
