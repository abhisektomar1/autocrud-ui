export function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

export function globalFilter<T>(
  arr: T[],
  globalFilterText: string,
  fields?: Array<keyof T>
): T[] {
  const data = arr.filter((i) => {
    const item = i as any;
    fields = fields || (Object.keys(item) as Array<keyof T>);
    for (const field of fields) {
      if (field === "optionHolderState") {
        const replacedString = item?.[field]
          .toString()
          .toLowerCase()
          .replace("_", " ");
        if (replacedString?.includes(globalFilterText.toLowerCase().trim())) {
          return true;
        }
      }
      if (
        item?.[field]
          .toString()
          .toLowerCase()
          .includes(globalFilterText.toLowerCase().trim())
      ) {
        return true;
      }
    }
    return false;
  });
  arr = data;
  return data;
}

export function convertDate(dateString: any) {
  const date = new Date(dateString);

  const day = date.getUTCDate().toString().padStart(2, "0");
  const month = date.toLocaleString("en-US", { month: "short" });
  const year = date.getUTCFullYear();

  let hours = date.getUTCHours();
  const minutes = date.getUTCMinutes().toString().padStart(2, "0");
  const ampm = hours >= 12 ? "PM" : "AM";

  hours = hours % 12;
  hours = hours || 12; // the hour '0' should be '12'
  const hoursString = hours.toString().padStart(2, "0");

  return `${day}-${month}-${year} ${hoursString}:${minutes} ${ampm}`;
}

export function formatDisplayDate(dateString: string): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  }).format(new Date(dateString));
}
