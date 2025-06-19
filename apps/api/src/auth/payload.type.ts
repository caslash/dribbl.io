export type Auth0JwtPayload = {
  aud: string; // Audience (API identifier)
  azp?: string; // Authorized party
  exp: number; // Expiration time
  iat: number; // Issued at time
  iss: string; // Issuer (Auth0 domain)
  scope?: string; // Scopes granted
  sub: string; // Subject (user ID)
};
