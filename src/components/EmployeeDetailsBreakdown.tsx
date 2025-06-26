import React from "react";
import { useSelector } from "react-redux";
import type { RootState } from "../store/store";
import { calculateTotalBonus, formatCurrency } from "../utils/employeeHelpers";
import type { EmployeeWithBonus } from "../types";

interface Props {
    employee: EmployeeWithBonus;
}

const EmployeeDetailsBreakdown: React.FC<Props> = ({ employee }) => {
    const extraBonus = useSelector((state: RootState) => state.employees.extraBonus);
    const { base, weather, extra, total } = calculateTotalBonus(employee, extraBonus);
    const temp = employee.temperatureF ?? 0;
    return (
        <div className="mt-4 bg-gray-50 p-3 rounded border text-sm space-y-1 border-l-4 border-blue-300 pl-3 mx-4 mb-4">
            <h3 className="font-semibold text-gray-700 mb-1">Bonus Breakdown:</h3>
            <p>
                <strong>Base Bonus:</strong>{" "}
                {((base / employee.salary) * 100).toFixed(0)}% → {formatCurrency(base)}
            </p>
            <p><strong>Bonus Date:</strong> {employee.bonusDate}</p>
            <p><strong>Weather Temp:</strong> {temp}°F</p>
            <p>
                <strong>Weather Bonus:</strong>{" "}
                {((weather / employee.salary) * 100).toFixed(0)}% → {formatCurrency(weather)}
            </p>
            {extraBonus && (
                <p>
                    <strong>Extra Bonus:</strong> 5% → {formatCurrency(extra)}
                </p>
            )}
            <hr className="border-t border-gray-300 my-2" />
            <p><strong>Total Bonus:</strong> {formatCurrency(total)}</p>
        </div>
    );
};

export default EmployeeDetailsBreakdown;
