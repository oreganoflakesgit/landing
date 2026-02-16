export default function formatPostDate(dateString) {
  const date = new Date(`${dateString}T00:00:00Z`);
  return date.toLocaleString("en-US", {
    month: "short",
    day: "2-digit",
    timeZone: "UTC"
  });
}
