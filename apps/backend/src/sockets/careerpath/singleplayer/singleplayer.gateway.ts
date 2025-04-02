import { BaseCareerPathGateway } from '@/sockets/careerpath/basecareerpath.gateway';
import { WebSocketGateway } from '@nestjs/websockets';

@WebSocketGateway()
export class SingleplayerGateway extends BaseCareerPathGateway {}
