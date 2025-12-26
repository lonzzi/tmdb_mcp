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

export const searchMovies = async (apiKey: string, query: string): Promise<string> => {
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

    const movies: TmdbMovie[] = response.data.results.slice(0, 5); // Limit to top 5 results

    if (movies.length === 0) {
      return `No movies found for query: "${query}"`;
    }

    const formattedResults = movies
      .map(
        (movie) =>
          `Title: ${movie.title}\nID: ${movie.id}\nURL: https://www.themoviedb.org/movie/${movie.id}\nRelease Date: ${movie.release_date}\nRating: ${movie.vote_average}\nOverview: ${movie.overview}\n---`
      )
      .join("\n");

    return formattedResults;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(`TMDB API Error: ${error.message}`);
    }
    throw error;
  }
};

export const searchTvShows = async (apiKey: string, query: string): Promise<string> => {
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

    const tvShows: TmdbTvShow[] = response.data.results.slice(0, 5);

    if (tvShows.length === 0) {
      return `No TV shows found for query: "${query}"`;
    }

    const formattedResults = tvShows
      .map(
        (show) =>
          `Name: ${show.name}\nID: ${show.id}\nURL: https://www.themoviedb.org/tv/${show.id}\nFirst Air Date: ${show.first_air_date}\nRating: ${show.vote_average}\nOverview: ${show.overview}\n---`
      )
      .join("\n");
    return formattedResults;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(`TMDB API Error: ${error.message}`);
    }
    throw error;
  }
};
