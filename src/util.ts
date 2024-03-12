import type { AxiosError } from 'axios';

export function formatDate(timestamp: number): string {
  const date = new Date(timestamp);
  return `${date.toLocaleDateString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })} в ${date.toLocaleTimeString('ru-RU', {
    hour: '2-digit',
    minute: '2-digit',
  })}`;
}

export function formatDuration(durationMilliseconds: number): string {
  const durationSeconds = Math.round(durationMilliseconds / 1000);
  const minutes = Math.floor(durationSeconds / 60);
  const seconds = durationSeconds % 60;
  return `${('0' + minutes).slice(-2)}:${('0' + seconds).slice(-2)}`;
}

export function generateErrorMessage(error: AxiosError) {
  if (!error) {
    return '';
  }

  const statusCode = error?.response?.status;
  const statusText = error?.response?.statusText;

  if (statusCode === 401) {
    return 'Неверные учетные данные. Попробуйте снова.';
  } else if (!statusText) {
    return 'Проблемы с сетевым подключением. Проверьте ваше соединение.';
  } else {
    return 'Произошла ошибка. Попробуйте позже.';
  }
}
