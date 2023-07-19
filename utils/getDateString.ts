function getDateString(d: string | number | Date) {
  const date = new Date(d);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Adding 1 to month since it's zero-based
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}${month}${day}`;
}

export default getDateString;
