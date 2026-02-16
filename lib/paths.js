const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

function withBasePath(path) {
  if (!path || typeof path !== "string") {
    return path;
  }
  if (
    path.startsWith("http://") ||
    path.startsWith("https://") ||
    path.startsWith("mailto:") ||
    path.startsWith("tel:")
  ) {
    return path;
  }
  if (basePath && path.startsWith(basePath + "/")) {
    return path;
  }
  if (path.startsWith("/")) {
    return `${basePath}${path}`;
  }
  return `${basePath}/${path}`;
}

export { basePath, withBasePath };
