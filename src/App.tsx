import React, { useEffect } from "react";
import employeesData from "./employees.json";
import { useDispatch } from "react-redux";
import { setEmployees } from "./store/employeeSlice";
import { v4 as uuidv4 } from "uuid";
import { fetchWeather } from "./utils/fetchWeather";
import { calculateTotalBonus } from "./utils/employeeHelpers";
import EmployeeTable from "./components/EmployeeTable";
import type { EmployeeWithBonus, Employee } from "./types";
import "./App.css";

const App: React.FC = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        const initEmployees = async () => {
            const empWithBonuses: EmployeeWithBonus[] = await Promise.all(
                (employeesData as unknown[]).map(async (raw) => {
                    const partial = raw as Omit<Employee, "id">;
                    const fullEmployee: Employee = { ...partial, id: uuidv4() };

                    let temperatureF = 0;
                    let bonusDate = "";
                    let weatherError = false;

                    try {
                        const weather = await fetchWeather(fullEmployee.birthday);
                        temperatureF = weather.temperatureF;
                        bonusDate = weather.dateUsed;
                    } catch {
                        weatherError = true;
                    }

                    const { total } = calculateTotalBonus(
                        {
                            ...fullEmployee,
                            bonus: 0,
                            bonusDate,
                            temperatureF,
                        },
                        false
                    );

                    return {
                        ...fullEmployee,
                        bonus: total,
                        bonusDate,
                        temperatureF,
                        weatherError,
                    };
                })
            );

            dispatch(setEmployees(empWithBonuses));
        };

        initEmployees();
    }, [dispatch]);

    return (
        <div
            className="min-h-screen w-full bg-cover bg-no-repeat bg-top bg-center"
            style={{ backgroundImage: "url('/bonus_calc/bg.png')" }}
        >
            <div className="container mx-auto">
                <EmployeeTable />
            </div>
        </div>
    );
};

export default App;
