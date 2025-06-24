export interface Employee {
  team: "Executive" | "Supervisor" | "Manager" | "Employee";
  title: string;
  fName: string;
  lName: string;
  salary: number;
  birthday: string;
}

export interface EmployeeWithBonus extends Employee {
  bonus: number;
}

export interface WeatherData {
  temperatureF: number;
}
