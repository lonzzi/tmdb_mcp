#!/usr/bin/env node
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import dotenv from "dotenv";
import { searchMovies, searchTvShows, validateApiKey } from "./tmdb";

dotenv.config();

const API_KEY = process.env.TMDB_API_KEY;

if (!API_KEY) {
  console.error("TMDB_API_KEY environment variable is not set");
  process.exit(1);
}

const server = new McpServer({
  name: "tmdb-search",
  version: "1.0.0",
});

server.registerTool(
  "search_movies",
  {
    description:
      "Search for movies on TMDB by title to get metadata like overview, release date, and rating",
    inputSchema: z.object({
      query: z.string().describe("The movie title to search for"),
    }),
  },
  async ({ query }) => {
    try {
      const result = await searchMovies(API_KEY, query);
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(result, null, 2),
          },
        ],
      };
    } catch (error: any) {
      return {
        content: [
          {
            type: "text",
            text: error.message || "Unknown error occurred",
          },
        ],
        isError: true,
      };
    }
  }
);

server.registerTool(
  "search_tv_shows",
  {
    description:
      "Search for TV shows on TMDB by title to get metadata like overview, first air date, and rating",
    inputSchema: z.object({
      query: z.string().describe("The TV show title to search for"),
    }),
  },
  async ({ query }) => {
    try {
      const result = await searchTvShows(API_KEY, query);
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(result, null, 2),
          },
        ],
      };
    } catch (error: any) {
      return {
        content: [
          {
            type: "text",
            text: error.message || "Unknown error occurred",
          },
        ],
        isError: true,
      };
    }
  }
);

const main = async () => {
  try {
    await validateApiKey(API_KEY);
  } catch (error: any) {
    console.error("Failed to validate TMDB_API_KEY:", error.message);
    process.exit(1);
  }

  const transport = new StdioServerTransport();
  await server.connect(transport);
};

main().catch((error) => {
  console.error("Server error:", error);
  process.exit(1);
});
