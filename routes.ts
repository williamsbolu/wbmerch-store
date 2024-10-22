/**
 * An array of routes that are accessible to the public
 * This routes do not require authentication
 * @type {string[]}
 */
export const publicRoutes = [
  "/",
  "/auth/new-verification",
  "/products/:slug",
  "/cart",
  "/payment-confirmation",
  "/payment-success",
  "/payment-failed",
  "/checkout",
  "/collections/:category",
];

/**
 * An array of routes that are used for authentication
 * This routes will redirect logged in users to /account
 * @type {string[]}
 */
export const authRoutes = [
  "/signup",
  "/login",
  "/auth/error",
  "/auth/reset",
  "/auth/new-password",
];

/**
 * The prefix for the API authentication routes
 * Routes that start with this prefix are used for API authentication
 * For example: /login, /signup
 * @type {string}
 */
export const apiAuthPrefix = "/api/auth";

/**
 * The default redirect path after logging in
 * @type {string}
 */
export const DEFAULT_LOGIN_REDIRECT = "/account";
