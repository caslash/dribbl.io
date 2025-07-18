import { PERMISSIONS_KEY } from '@/auth/permissions.decorator';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { WsException } from '@nestjs/websockets';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredPerms = this.reflector.getAllAndOverride<string[]>(PERMISSIONS_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredPerms || requiredPerms.length === 0) {
      return true;
    }

    const client = context.switchToWs().getClient();

    const hasAll = requiredPerms.every((perm) =>
      client.handshake?.auth?.permissions?.includes(perm),
    );

    if (!hasAll) {
      throw new WsException('Forbidden: insufficient permissions');
    }

    return true;
  }
}
