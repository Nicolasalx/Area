export function getUserFriendlyDate(franceDate: Date): string {
  return new Intl.DateTimeFormat('fr-FR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  }).format(franceDate);
}

export function getTriggerDate(): string {
  const nowInFrance = new Date().toLocaleString('en-US', {
    timeZone: 'Europe/Paris',
  });
  const franceDate = new Date(nowInFrance);

  return getUserFriendlyDate(franceDate);
}
