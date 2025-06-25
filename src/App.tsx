import React, { useEffect } from "react";
import employeesData from "./employees.json";
import { useDispatch } from "react-redux";
import { setEmployees } from "./store/employeeSlice";
import { fetchWeather, calculateBonus } from "./utils/calculateBonus";
import EmployeeCards from "./components/EmployeeCards";
import type { EmployeeWithBonus, Employee } from "./types";
import "./App.css";

const App: React.FC = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        const initEmployees = async () => {
            const empWithBonuses: EmployeeWithBonus[] = await Promise.all(
                (employeesData as Employee[]).map(async (emp) => {
                    const { temperatureF, dateUsed } = await fetchWeather(emp.birthday);
                    const bonus = calculateBonus(emp, {temperatureF});
                    return { ...emp, bonus, bondusDate: dateUsed };
                })
            );
            dispatch(setEmployees(empWithBonuses));
        };

        initEmployees();
    }, [dispatch]);

    return (
        <div className="container mx-auto">
            <EmployeeCards />
        </div>
    );
};

export default App;
