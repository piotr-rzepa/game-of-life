import * as React from 'react';
import { Websocket } from './Websocket';
import { showModal } from '../components/Modal';

export const WebsocketContext = React.createContext<Websocket | undefined>(undefined);

export const useWebsocketContext = () => {
  const context = React.useContext(WebsocketContext);
  if (typeof context === 'undefined') {
    throw new Error('useWebsocketContext must be used within a WebsocketProvider');
  }
  return context;
};

export interface Props {
  children?: React.ReactNode;
}

export const WebsocketProvider: React.FC<Props> = ({ children }) => {
  showModal({
    type: 'success',
    displaySeconds: 10,
    intervalDurationMilliseconds: 1000,
    title: 'Successfully connected to the websocket'
  });
  const websocket = React.useMemo(() => new Websocket('http://localhost:3001'), []);

  return <WebsocketContext.Provider value={websocket}>{children}</WebsocketContext.Provider>;
};
