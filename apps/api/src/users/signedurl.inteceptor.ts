import { AvatarService } from '@/users/avatar.service';
import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { from, map, mergeMap, Observable, of } from 'rxjs';

@Injectable()
export class SignedUrlInterceptor implements NestInterceptor {
  constructor(private readonly avatarService: AvatarService) {}

  intercept(_context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      mergeMap((user) => {
        if (!user || !user.profile_url) {
          return of(user);
        }

        return from(this.avatarService.getSignedUrl(user.profile_url)).pipe(
          map((signedUrl) => ({ ...user, profile_url: signedUrl })),
        );
      }),
    );
  }
}
