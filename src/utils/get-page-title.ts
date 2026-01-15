import defaultSettings from '@/settings';


export function getPageTitle(pageTitle: string): string {
  const title = defaultSettings.title;
  if (pageTitle) {
    return `${pageTitle} - ${title}`;
  }
  return title;
}