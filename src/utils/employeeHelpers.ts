import type { EmployeeWithBonus } from "../types";

export function getManagerName(emp: EmployeeWithBonus): string {
    if (emp.team.startsWith("Executive")) return "None";
    if (emp.team.startsWith("Supervisor")) return "Moshe Roth";
    if (emp.team.startsWith("Manager")) return "Chaim Stark";
    if (emp.team.startsWith("Employee")) {
        return emp.title.includes("Website") ? "Miriam Weiss" : "Yehuda Gold";
    }
    return "Unknown";
}

export function formatCurrency(value: number): string {
    return `$${value.toLocaleString(undefined, { minimumFractionDigits: 2 })}`;
}
