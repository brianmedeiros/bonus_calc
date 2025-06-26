import React from "react";
import type { EmployeeWithBonus } from "../types";
import { calculateTotalBonus, formatCurrency } from "../utils/employeeHelpers";

interface Props {
    employee: EmployeeWithBonus;
    extraBonus: boolean;
    onSelect: (id: string) => void;
}

const EmployeeTableRow: React.FC<Props> = ({ employee, extraBonus, onSelect }) => {
    const { total } = calculateTotalBonus(employee, extraBonus);

    return (
        <tr key={employee.id} className="border-t hover:bg-gray-100">
            <td
                className="p-2 text-blue-400 underline cursor-pointer focus:outline-none focus:ring-2 ring-blue-400"
                tabIndex={0}
                onClick={() => onSelect(employee.id)}
                onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                        onSelect(employee.id);
                    }
                }}
            >
                {employee.lName}
            </td>
            <td className="p-2">{employee.birthday}</td>
            <td className={`p-2 ${extraBonus ? "text-green-800" : "text-black"}`}>
                {formatCurrency(total)}
            </td>
        </tr>
    );
};

export default EmployeeTableRow;
