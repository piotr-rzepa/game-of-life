import { notification } from 'antd';

interface NotificationOptions {
  message: string;
  description: string;
  type: 'success' | 'error' | 'info' | 'warn';
}

export const openNotificationWithIcon = ({ type, message, description }: NotificationOptions) => {
  notification[type]({
    message,
    description
  });
};
