export function dateFromFileSlug(fileSlug) {
  const [month, day] = fileSlug.split(".").map(Number);
  const date = new Date(2000, month - 1, day);

  return date;
}

// fileSlug is in the format "mm.dd", this returns a URL friendly English version of that string
// i.e. "01.01" -> "january-1" & "12.31" -> "december-31"
export function formatDate(fileSlug) {
  const date = dateFromFileSlug(fileSlug);

  return date
    .toLocaleString("en", { month: "long", day: "numeric" }) // todo: using english string in code - what about i18n/l10n?
    .toLowerCase()
    .replace(/\s+/g, "-");
}

// Converts "Month dd" string to "MM-DD" format for <time datetime> attribute
export function toTimeAttribute(monthDayString) {
  if (!monthDayString || typeof monthDayString !== 'string') return "";

  // Handle "MM.DD" format if passed (e.g. from fileSlug)
  if (monthDayString.includes('.')) return monthDayString.replace('.', '-');

  // Use an arbitrary year (e.g., 2000) to parse the month and day correctly
  const date = new Date(`2000 ${monthDayString}`);
  if (isNaN(date.getTime())) return "";

  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  return `${month}-${day}`;
}
