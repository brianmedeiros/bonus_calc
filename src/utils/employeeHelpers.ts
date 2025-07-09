import type { EmployeeWithBonus } from "../types";

// Get a manager name based on the employee team
export function getManagerName(
    emp: EmployeeWithBonus,
    allEmployees: EmployeeWithBonus[]
): string {
    if (emp.team === "Executive") return "None";

    // Define who manages whom
    const managerTeamByTeam: Record<
        Exclude<EmployeeWithBonus["team"], "Executive">,
        EmployeeWithBonus["team"]
    > = {
        Supervisor: "Executive",
        Manager: "Supervisor",
        Employee: "Manager",
    };

    // Special lookup for employees
    if (emp.team === "Employee" && emp.title.includes("Website")) {
        const websiteManager = allEmployees.find(
            (e) => e.team === "Manager" && e.title.includes("Website")
        );
        return websiteManager
            ? `${websiteManager.fName} ${websiteManager.lName}`
            : "Unknown";
    }

    const targetTeam = managerTeamByTeam[emp.team as keyof typeof managerTeamByTeam];
    const manager = allEmployees.find((e) => e.team === targetTeam);
    return manager ? `${manager.fName} ${manager.lName}` : "Unknown";
}

// Format a number as USD currency
export function formatCurrency(value: number): string {
    return `${value.toLocaleString("en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 2,
    })}`;
}

// Calculate the full breakdown of an employee's bonus
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
