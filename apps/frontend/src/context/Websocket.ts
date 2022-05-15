import io, { Socket } from 'socket.io-client';
import { GameEvent, EventType } from 'interfaces';

export class Websocket {
  private ws: Socket;

  constructor(private url: string) {
    this.ws = io(this.url);
  }

  public sendEvent<T>({ type, payload }: GameEvent<T>) {
    this.ws.emit(type, payload);
  }

  public addListener(type: EventType, listener: (...args: any[]) => void): void {
    this.ws.on(type, listener);
  }
}
