export function formatDate(isoString: string): string {
  const pad = (n: number) => n.toString().padStart(2, '0');

  const date = new Date(isoString);
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
