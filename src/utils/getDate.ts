export function getDate(date: string): string {
    return `${new Intl.DateTimeFormat('en-US', { month: 'short' }).format(new Date(date))} ${new Date(date).getDate()}, ${new Date(date).getFullYear()}`;
}