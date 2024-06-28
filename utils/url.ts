export function getHostFromUrl(url: string) {
  return url.match(/(http[s]?:\/\/)?([^\/]+)/)?.[2]
}