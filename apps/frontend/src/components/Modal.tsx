import { Modal } from 'antd';

interface ModalOptions {
  displaySeconds: number;
  intervalDurationMilliseconds: number;
  title: string;
  type: 'success' | 'error' | 'info' | 'warn';
}

const modalType = {
  success: Modal.success,
  error: Modal.error,
  info: Modal.info,
  warn: Modal.warn
} as const;

export const showModal = ({ displaySeconds, intervalDurationMilliseconds, title, type }: ModalOptions) => {
  let secondsToGo = displaySeconds;
  const modal = modalType[type]({
    title,
    content: `This modal will be destroyed after ${secondsToGo} second.`
  });

  const timer = setInterval(() => {
    secondsToGo -= 1;
    modal.update({
      content: `This modal will be destroyed after ${secondsToGo} second.`
    });
  }, intervalDurationMilliseconds);

  setTimeout(() => {
    clearInterval(timer);
    modal.destroy();
  }, secondsToGo * intervalDurationMilliseconds);
};
