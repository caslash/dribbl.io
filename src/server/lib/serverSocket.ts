import { Server as HttpServer } from 'http';
import { Server } from 'socket.io';

export const createServerSocket = (httpServer: HttpServer): Server => {
  return new Server(httpServer);
};
