import io, { Socket } from 'socket.io-client';
import { GameEvent } from 'interfaces';

class Websocket {
  private ws: Socket;

  constructor(private url: string) {
    this.ws = io(this.url);
  }

  public sendEvent(event: GameEvent) {
    this.ws.emit(event.type, JSON.stringify(event.payload));
  }
}

export default Websocket;
