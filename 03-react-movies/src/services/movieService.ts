import axios from "axios";
import type { AxiosResponse } from "axios";

import type { Movie } from "../types/movie";

const TMDB = axios.create({
  baseURL: "https://api.themoviedb.org/3",
  headers: {
    Authorization: `Bearer ${import.meta.env.VITE_TMDB_TOKEN}`,
  },
});

interface SearchMoviesResponse {
  page: number;
  results: Movie[];
  total_pages: number;
  total_results: number;
}

export async function fetchMovies(
  query: string,
  page: number = 1
): Promise<SearchMoviesResponse> {
  const response: AxiosResponse<SearchMoviesResponse> = await TMDB.get(
    "/search/movie",
    {
      params: {
        query,
        include_adult: false,
        language: "en-US",
        page,
      },
    }
  );
  return response.data;
}
