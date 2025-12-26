import axios from "axios";
import { searchMovies, searchTvShows } from "./tmdb";

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe("searchMovies", () => {
  const apiKey = "test-api-key";

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return formatted movie results when movies are found", async () => {
    const mockResponse = {
      data: {
        results: [
          {
            id: 603,
            title: "The Matrix",
            overview: "Set in the 22nd century...",
            release_date: "1999-03-30",
            vote_average: 8.2,
          },
          {
            id: 604,
            title: "The Matrix Reloaded",
            overview: "Six months after the events...",
            release_date: "2003-05-15",
            vote_average: 7.0,
          },
        ],
      },
    };
    mockedAxios.get.mockResolvedValue(mockResponse);

    const result = await searchMovies(apiKey, "The Matrix");

    expect(result).toContain("ID: 603");
    expect(result).toContain("URL: https://www.themoviedb.org/movie/603");
    expect(result).toContain("ID: 604");
    expect(result).toContain("URL: https://www.themoviedb.org/movie/604");
    expect(mockedAxios.get).toHaveBeenCalledWith(
      "https://api.themoviedb.org/3/search/movie",
      {
        params: {
          api_key: apiKey,
          query: "The Matrix",
          language: "en-US",
          page: 1,
        },
      }
    );
  });

  it("should return Inception when searching for it", async () => {
    const mockResponse = {
      data: {
        results: [
          {
            id: 27205,
            title: "Inception",
            overview: "Cobb, a skilled thief...",
            release_date: "2010-07-15",
            vote_average: 8.4,
          },
        ],
      },
    };
    mockedAxios.get.mockResolvedValue(mockResponse);

    const result = await searchMovies(apiKey, "Inception");

    expect(result).toContain("ID: 27205");
    expect(result).toContain("URL: https://www.themoviedb.org/movie/27205");
  });

  it("should return a 'no movies found' message when result list is empty", async () => {
    mockedAxios.get.mockResolvedValue({
      data: {
        results: [],
      },
    });

    const result = await searchMovies(apiKey, "Nonexistent Movie");

    expect(result).toBe('No movies found for query: "Nonexistent Movie"');
  });

  it("should throw an error if the query is empty", async () => {
    await expect(searchMovies(apiKey, "")).rejects.toThrow(
      "Query argument is required"
    );
  });

  it("should handle API errors", async () => {
    const errorMessage = "Network Error";
    mockedAxios.get.mockRejectedValue({
      isAxiosError: true,
      message: errorMessage,
    });
    // We need to mock isAxiosError since we are using it in the catch block
    (axios.isAxiosError as unknown) = jest.fn().mockReturnValue(true);

    await expect(searchMovies(apiKey, "Error Movie")).rejects.toThrow(
      `TMDB API Error: ${errorMessage}`
    );
  });
});

describe("searchTvShows", () => {
  const apiKey = "test-api-key";

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return One Punch Man when searching for it", async () => {
    const mockResponse = {
      data: {
        results: [
          {
            id: 63926,
            name: "One Punch Man",
            overview: "The story of Saitama...",
            first_air_date: "2015-10-05",
            vote_average: 8.4,
          },
        ],
      },
    };
    mockedAxios.get.mockResolvedValue(mockResponse);

    const result = await searchTvShows(apiKey, "One Punch Man");

    expect(result).toContain("ID: 63926");
    expect(result).toContain("URL: https://www.themoviedb.org/tv/63926");
  });

  it("should return Breaking Bad when searching for it", async () => {
    const mockResponse = {
      data: {
        results: [
          {
            id: 1396,
            name: "Breaking Bad",
            overview: "A high school chemistry teacher...",
            first_air_date: "2008-01-20",
            vote_average: 8.9,
          },
        ],
      },
    };
    mockedAxios.get.mockResolvedValue(mockResponse);

    const result = await searchTvShows(apiKey, "Breaking Bad");

    expect(result).toContain("ID: 1396");
    expect(result).toContain("URL: https://www.themoviedb.org/tv/1396");
  });

  it("should return multiple results for 'Game of Thrones'", async () => {
    const mockResponse = {
      data: {
        results: [
          {
            id: 1399,
            name: "Game of Thrones",
            overview: "Seven noble families...",
            first_air_date: "2011-04-17",
            vote_average: 8.4,
          },
          {
            id: 94605,
            name: "House of the Dragon",
            overview: "The story of the House Targaryen...",
            first_air_date: "2022-08-21",
            vote_average: 8.4,
          },
        ],
      },
    };
    mockedAxios.get.mockResolvedValue(mockResponse);

    const result = await searchTvShows(apiKey, "Game of Thrones");

    expect(result).toContain("ID: 1399");
    expect(result).toContain("URL: https://www.themoviedb.org/tv/1399");
    expect(result).toContain("ID: 94605");
    expect(result).toContain("URL: https://www.themoviedb.org/tv/94605");
  });

  it("should return a 'no TV shows found' message when result list is empty", async () => {
    mockedAxios.get.mockResolvedValue({
      data: {
        results: [],
      },
    });

    const result = await searchTvShows(apiKey, "Nonexistent Show");

    expect(result).toBe('No TV shows found for query: "Nonexistent Show"');
  });
});
