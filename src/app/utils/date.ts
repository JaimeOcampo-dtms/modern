export function toLocalDateTimeString(isoStringOrDate: string | Date): string {
  const pad = (n: number) => n.toString().padStart(2, '0');

  const date = typeof isoStringOrDate === 'string' ? new Date(isoStringOrDate) : isoStringOrDate;
  return (
    date.getFullYear() +
    '-' +
    pad(date.getMonth() + 1) +
    '-' +
    pad(date.getDate()) +
    'T' +
    pad(date.getHours()) +
    ':' +
    pad(date.getMinutes())
  );
}
