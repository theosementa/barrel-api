import { DateTime } from "luxon";

// MARK: - Year
declare global {
  interface Date {
    endOfYear: Date;
    daysToEndOfYear: number;
  }
}

Object.defineProperty(Date.prototype, "endOfYear", {
  get: function (): Date {
    const calendar = new Date(this);
    const year = calendar.getFullYear() + 1;
    const startOfNextYear = new Date(year, 0, 1);
    return new Date(startOfNextYear.getTime() - 1);
  },
});

Object.defineProperty(Date.prototype, "daysToEndOfYear", {
  get: function (): number {
    return daysBetween(this, this.endOfYear);
  },
});

// MARK: - Month
declare global {
  interface Date {
    endOfMonth: Date;
    daysToEndOfMonth: number;
  }
}

Object.defineProperty(Date.prototype, "endOfMonth", {
  get: function (): Date {
    const calendar = new Date(this);
    const month = calendar.getMonth() + 1;
    const startOfNextMonth = new Date(calendar.getFullYear(), month, 1);
    return new Date(startOfNextMonth.getTime() - 1);
  },
});

Object.defineProperty(Date.prototype, "daysToEndOfMonth", {
  get: function (): number {
    return daysBetween(this, this.endOfMonth);
  },
});

export function obtenirDateFR(date: Date): string {
  return DateTime.fromJSDate(date)
    .setLocale("fr")
    .toFormat("dd-MM-yyyy HH:mm:ss");
}

export function daysBetween(firstDate: Date, secondDate: Date): number {
  const timeDifference = Math.abs(secondDate.getTime() - firstDate.getTime());
  return Math.ceil(timeDifference / (1000 * 3600 * 24));
}
