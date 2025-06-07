export interface Auth0JwtPayload {
  iss: string; // Issuer (Auth0 domain)
  sub: string; // Subject (user ID)
  aud: string; // Audience (API identifier)
  exp: number; // Expiration time
  iat: number; // Issued at time
  azp?: string; // Authorized party
  scope?: string; // Scopes granted
  permissions?: string[]; // Custom permissions
  email?: string; // User's email
  name?: string; // User's name
  nickname?: string; // User's nickname
  picture?: string; // User's profile picture
}
