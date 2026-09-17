export function withBase(path: string, base = import.meta.env.BASE_URL): string {
  if (/^(?:[a-z]+:)?\/\//i.test(path) || path.startsWith("mailto:")) return path;
  const normalizedBase = `/${base}`.replace(/\/{2,}/g, "/").replace(/\/?$/, "/");
  const normalizedPath = path.replace(/^\/+/, "");
  return `${normalizedBase}${normalizedPath}`.replace(/\/{2,}/g, "/");
}
