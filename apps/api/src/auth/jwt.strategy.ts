import { Auth0JwtPayload } from '@/auth/payload.type';
import { UserInfo } from '@/auth/userinfo.type';
import { UsersPrismaService } from '@/database/users.prisma.service';
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import * as jwksRsa from 'jwks-rsa';
import { ExtractJwt, Strategy, VerifiedCallback } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly usersPrismaService: UsersPrismaService) {
    super({
      secretOrKeyProvider: jwksRsa.passportJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: `https://${process.env.AUTH0_DOMAIN}/.well-known/jwks.json`,
      }),
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      audience: process.env.AUTH0_AUDIENCE,
      issuer: `https://${process.env.AUTH0_DOMAIN}/`,
      algorithms: ['RS256'],
      passReqToCallback: true,
    });
  }

  private async getUserProfileInfo(issuer: string, token: string | null): Promise<UserInfo> {
    const userInfoUrl = `${issuer}userinfo`;
    const response = await fetch(userInfoUrl, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch user profile info');
    }

    return response.json();
  }

  async validate(req: Request, payload: Auth0JwtPayload, done: VerifiedCallback): Promise<unknown> {
    let user = await this.usersPrismaService.user.findUnique({ where: { id: payload.sub } });
    if (!user) {
      const token = ExtractJwt.fromAuthHeaderAsBearerToken()(req);
      const userInfo = await this.getUserProfileInfo(payload.iss, token);
      user = await this.usersPrismaService.user.create({
        data: {
          id: payload.sub,
          name: userInfo.name || '',
          display_name: userInfo.given_name || '',
          profile_url: userInfo.picture || '',
        },
      });
    }
    return done(null, user);
  }
}
