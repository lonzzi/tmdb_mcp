import axios from "axios";

export interface TmdbMovie {
  id: number;
  title: string;
  overview: string;
  release_date: string;
  vote_average: number;
}

export interface TmdbTvShow {
  id: number;
  name: string;
  overview: string;
  first_air_date: string;
  vote_average: number;
}

export const searchMovies = async (apiKey: string, query: string): Promise<TmdbMovie[]> => {
  if (!query) {
    throw new Error("Query argument is required");
  }

  try {
    const response = await axios.get("https://api.themoviedb.org/3/search/movie", {
      params: {
        api_key: apiKey,
        query: query,
        language: "en-US",
        page: 1,
      },
    });

    return response.data.results.slice(0, 5); // Limit to top 5 results
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(`TMDB API Error: ${error.message}`);
    }
    throw error;
  }
};

export const searchTvShows = async (apiKey: string, query: string): Promise<TmdbTvShow[]> => {
  if (!query) {
    throw new Error("Query argument is required");
  }

  try {
    const response = await axios.get("https://api.themoviedb.org/3/search/tv", {
      params: {
        api_key: apiKey,
        query: query,
        language: "en-US",
        page: 1,
      },
    });

    return response.data.results.slice(0, 5);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(`TMDB API Error: ${error.message}`);
    }
    throw error;
  }
};
