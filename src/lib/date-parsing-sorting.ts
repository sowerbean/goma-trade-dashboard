/**
 * Parses a date string in DD/MM/YYYY format.
 * Returns a Date object or null for invalid/empty values.
 */
export function parseDate(value: string | undefined | null): Date | null {
  if (!value) return null;
  const [day, month, year] = value.split('/');
  const date = new Date(`${year}-${month}-${day}`);
  return isNaN(date.getTime()) ? null : date;
}

/**
 * Custom sorting function for DD/MM/YYYY dates.
 * Treats empty fields as latest (sorts them first when descending).
 */
export const dateSort = (rowA: any, rowB: any, columnId: string) => {
  const a = parseDate(rowA.getValue(columnId));
  const b = parseDate(rowB.getValue(columnId));

  if (!a && !b) return 0;
  if (!a) return 1; // nulls/empty = "latest"
  if (!b) return -1;

  return a > b ? 1 : a < b ? -1 : 0;
};
