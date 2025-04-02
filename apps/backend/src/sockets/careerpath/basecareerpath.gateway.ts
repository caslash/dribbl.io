import { HostRoomMessageBody } from "@dribbl.io/shared";
import {
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets';

@WebSocketGateway()
export class BaseCareerPathGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  afterInit(server: any) {}

  handleConnection(client: any, ...args: any[]) {
    console.log(`Client id: ${client.id} connected.`);
  }

  handleDisconnect(client: any, ...args: any[]) {
    console.log(`Client id: ${client.id} disconnected.`);
  }

  @SubscribeMessage('host_room')
  handleHostRoom(@MessageBody() messageBody: HostRoomMessageBody) {}
}
