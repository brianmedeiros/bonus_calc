import React, { useEffect } from "react";
import employeesData from "./employees.json";
import { useDispatch } from "react-redux";
import { setEmployees } from "./store/employeeSlice";
import { fetchWeather, calculateBonus } from "./utils/calculateBonus";
import EmployeeTable from "./components/EmployeeTable";
import type { EmployeeWithBonus, Employee } from "./types";
import "./App.css";

const App: React.FC = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        const initEmployees = async () => {
            const empWithBonuses: EmployeeWithBonus[] = await Promise.all(
                (employeesData as Employee[]).map(async (emp) => {
                    const { temperatureF, dateUsed } = await fetchWeather(emp.birthday);
                    const bonus = calculateBonus(emp, { temperatureF });
                    return { ...emp, bonus, bonusDate: dateUsed };
                })
            );
            dispatch(setEmployees(empWithBonuses));
        };

        initEmployees();
    }, [dispatch]);

    return (
        <div className="min-h-screen w-full bg-cover bg-no-repeat bg-top bg-center" style={{ backgroundImage: "url('/bg.png')" }}>
            <div className="container mx-auto">
                <EmployeeTable />
            </div>
        </div>
    );
};

export default App;
