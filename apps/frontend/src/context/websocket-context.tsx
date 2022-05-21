import * as React from 'react';
import { EventType } from 'interfaces';
import { Websocket } from './Websocket';
import { openNotificationWithIcon } from '../components/Modal';

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
  const websocket = React.useMemo(() => new Websocket(process.env.REACT_APP_WEBSOCKET_URL!), []);
  websocket.addListener(EventType.CONNECT_ERROR, () =>
    openNotificationWithIcon({
      type: 'error',
      message: 'Connection error',
      description: `Connection with the backend at ${process.env.REACT_APP_WEBSOCKET_URL} server was not established. Reconnecting...`
    })
  );
  websocket.addListener(EventType.CONNECT_SUCCESS, () =>
    openNotificationWithIcon({
      type: 'success',
      message: 'Connection success',
      description: `Successfully connected to the websocket at ${process.env.REACT_APP_WEBSOCKET_URL}`
    })
  );

  return <WebsocketContext.Provider value={websocket}>{children}</WebsocketContext.Provider>;
};
