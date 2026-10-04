export const DEPARTMENTS = ["OBM", "ISI", "Maintenance"] as const;

export type SerialCounters = Record<string, number>;

export function serialPeriodKey(department: string, date: Date): string {
  if (!(DEPARTMENTS as readonly string[]).includes(department)) {
    throw new Error("Invalid department");
  }
  return `${department}-${date.getFullYear()}-${date.getMonth() + 1}`;
}

export function nextSerialNumber(counters: SerialCounters, department: string, date: Date): string {
  const sequence = (counters[serialPeriodKey(department, date)] ?? 0) + 1;
  const prefix = department.slice(0, 3).toUpperCase();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = String(date.getFullYear()).slice(-2);
  return `${prefix}-${String(sequence).padStart(2, "0")}-${month}-${year}`;
}

export function reserveSerialNumber(counters: SerialCounters, department: string, date: Date): string {
  const number = nextSerialNumber(counters, department, date);
  const key = serialPeriodKey(department, date);
  counters[key] = (counters[key] ?? 0) + 1;
  return number;
}

export function seedSerialCounters(jobs: readonly { department: string; jobNumber: string; createdAt: string }[]): SerialCounters {
  const counters: SerialCounters = {};
  for (const job of jobs) {
    const date = new Date(job.createdAt);
    if (Number.isNaN(date.getTime()) || !(DEPARTMENTS as readonly string[]).includes(job.department)) continue;
    const match = job.jobNumber.match(/^([A-Z]{3})-(\d+)-(\d{2})-(\d{2})$/);
    if (!match || match[1] !== job.department.slice(0, 3).toUpperCase()
      || Number(match[3]) !== date.getMonth() + 1
      || match[4] !== String(date.getFullYear()).slice(-2)) continue;
    const key = serialPeriodKey(job.department, date);
    counters[key] = Math.max(counters[key] ?? 0, Number(match[2]));
  }
  return counters;
}
