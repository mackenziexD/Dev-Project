import wretch, { Wretch, WretchError } from "wretch";
import { AuthActions } from "@/app/auth/utils";

// Extract necessary functions from the AuthActions utility.
const { handleJWTRefresh, storeToken, getToken } = AuthActions();

/**
 * Configures the API with authentication and automatic token refresh on 401 responses.
 */
const api = () => {
  return (
    wretch("https://c0027816-devproject-django.azurewebsites.net/")
      // Initialize authentication with the access token.
      .auth(`Bearer ${getToken("access")}`)
      // Catch 401 errors to refresh the token and retry the request.
      .catcher(401, async (error: WretchError, request: Wretch) => {
        try {
          // Attempt to refresh the JWT token.
          const { access } = (await handleJWTRefresh().json()) as {
            access: string;
          };

          // Store the new access token.
          storeToken(access, "access");

          // Replay the original request with the new access token.
          return request
            .auth(`Bearer ${access}`)
            .fetch()
            .unauthorized(() => {
              // Rethrow the error if unauthorized after token refresh.
              window.location.replace("/");
            })
            .json();
        } catch (err) {
          window.location.replace("/");
        }
      })
  );
};

/**
 * GET, PUT, POST, DELETE data from the specified URL, automatically handling authentication and token refresh.
 * @returns {Promise<any>} The promise resolving to the fetched data.
 * @param url
 */
export const fetcher = (url: string): Promise<any> => {
  return api().get(url).json();
};
export const putter = (url: string, data: any): Promise<any> => {
  return api().url(url).put(data).json();
};
export const poster = (url: string, data: any): Promise<any> => {
  return api().url(url).post(data).json();
};
export const deleter = (url: string): Promise<any> => {
  return api().url(url).delete().res();
};