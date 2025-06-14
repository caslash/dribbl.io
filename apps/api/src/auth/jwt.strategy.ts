import { Auth0JwtPayload } from '@/auth/payload.type';
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
    });
  }

  async validate(payload: Auth0JwtPayload, done: VerifiedCallback): Promise<unknown> {
    let user = await this.usersPrismaService.user.findUnique({ where: { id: payload.sub } });
    if (!user) {
      user = await this.usersPrismaService.user.create({
        data: {
          id: payload.sub,
          first_name: payload.name || '',
          last_name: '',
        },
      });
    }
    return done(null, user);
  }
}
