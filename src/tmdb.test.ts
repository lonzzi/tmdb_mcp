import axios from "axios";
import { validateApiKey } from "./tmdb";

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

// We need to implement isAxiosError on the mock because the source code uses it
mockedAxios.isAxiosError = jest.fn((payload) => {
    return payload && payload.isAxiosError === true;
}) as any;

describe("validateApiKey", () => {
  it("should resolve when API key is valid", async () => {
    mockedAxios.get.mockResolvedValue({ data: {} });
    await expect(validateApiKey("valid_key")).resolves.not.toThrow();
  });

  it("should throw specific error when API returns 401", async () => {
    const error401 = {
        isAxiosError: true,
        response: { status: 401 }
    };
    mockedAxios.get.mockRejectedValue(error401);
    
    await expect(validateApiKey("invalid_key")).rejects.toThrow("Invalid TMDB_API_KEY. Please check your API key.");
  });

  it("should rethrow other errors", async () => {
    const networkError = new Error("Network Error");
    mockedAxios.get.mockRejectedValue(networkError);
    
    await expect(validateApiKey("key")).rejects.toThrow("Network Error");
  });
});