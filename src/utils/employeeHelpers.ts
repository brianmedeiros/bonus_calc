import type { EmployeeWithBonus } from "../types";

// sort managers
export function getManagerName(emp: EmployeeWithBonus): string {
    if (emp.team.startsWith("Executive")) return "None";
    if (emp.team.startsWith("Supervisor")) return "Moshe Roth";
    if (emp.team.startsWith("Manager")) return "Chaim Stark";
    if (emp.team.startsWith("Employee")) {
        return emp.title.includes("Website") ? "Miriam Weiss" : "Yehuda Gold";
    }
    return "Unknown";
}

// format currency
export function formatCurrency(value: number): string {
    return `$${value.toLocaleString(undefined, { minimumFractionDigits: 2 })}`;
}

// bonus calculation
export function calculateFullBonus(
    employee: EmployeeWithBonus,
    extraBonus: boolean
): number {
    const base = {
        Executive: 0.2,
        Supervisor: 0.1,
        Manager: 0.08,
        Employee: 0.05,
    }[employee.team];

    const temp = employee.temperatureF ?? 0;
    let weather = 0;
    if (temp > 86) weather = 0.1;
    else if (temp >= 68) weather = 0.05;

    const extra = extraBonus ? 0.05 : 0;

    return employee.salary * (base + weather + extra);
}

// calculate total bonus breakdown
export function calculateTotalBonus(
  employee: EmployeeWithBonus,
  extraBonus: boolean
): {
  base: number;
  weather: number;
  extra: number;
  total: number;
} {
  const basePct = {
    Executive: 0.2,
    Supervisor: 0.1,
    Manager: 0.08,
    Employee: 0.05,
  }[employee.team];

  const temp = employee.temperatureF ?? 0;
  let weatherPct = 0;
  if (temp > 86) weatherPct = 0.1;
  else if (temp >= 68) weatherPct = 0.05;

  const extraPct = extraBonus ? 0.05 : 0;

  const base = employee.salary * basePct;
  const weather = employee.salary * weatherPct;
  const extra = employee.salary * extraPct;
  const total = base + weather + extra;

  return { base, weather, extra, total };
}