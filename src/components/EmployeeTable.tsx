import React, { useState } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "../store/store";
import { useAppDispatch } from "../store/hooks";
import { toggleExtraBonus, updateAllBonuses } from "../store/employeeSlice";
import { calculateTotalBonus, formatCurrency } from "../utils/employeeHelpers";
import EmployeeDetailPanel from "./EmployeeDetailPanel";
import type { EmployeeWithBonus } from "../types";
import EmployeeTableRow from "./EmployeeTableRow";

const BonusCell: React.FC<{ emp: EmployeeWithBonus; extraBonus: boolean }> = ({ emp, extraBonus }) => {
    const { total } = calculateTotalBonus(emp, extraBonus);
    return (
        <td className={`p-2 ${extraBonus ? "text-green-800" : "text-black"}`}>
            {formatCurrency(total)}
        </td>
    );
};

const EmployeeTable: React.FC = () => {
    const dispatch = useAppDispatch();
    const { employees, extraBonus } = useSelector((state: RootState) => state.employees);

    // Panel state
    const [selectedEmployeeId, setSelectedEmployeeId] = useState<string | null>(null);
    const [isPanelOpen, setIsPanelOpen] = useState(false);

    const selectedEmployee =
        employees.find((emp) => emp.id === selectedEmployeeId) || null;

    // Sorting state
    const [sortKey, setSortKey] = useState<"lName" | "bonus">("lName");
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

    const sortedEmployees = [...employees].sort((a, b) => {
        const aValue =
            sortKey === "lName"
                ? a.lName.toLowerCase()
                : calculateTotalBonus(a, extraBonus).total;
        const bValue =
            sortKey === "lName"
                ? b.lName.toLowerCase()
                : calculateTotalBonus(b, extraBonus).total;

        return sortOrder === "asc" ? aValue < bValue ? -1 : 1 : aValue > bValue ? -1 : 1;
    });

    return (
        <div className="p-4 min-h-screen">
            {/* Toggle Bonus Button */}
            <button
                onClick={() => {
                    dispatch(toggleExtraBonus());
                    dispatch(updateAllBonuses());
                    setIsPanelOpen(false);
                    setSelectedEmployeeId(null);
                }}
                className={`mb-4 px-4 py-2 rounded font-semibold transition-colors duration-200 border ${extraBonus
                    ? "bg-green-600 text-white border-green-900 hover:bg-green-700"
                    : "bg-red-300 text-red-800 border-red-800 hover:bg-red-400"
                    }`}
            >
                {extraBonus ? "Extra Bonus ON (+5%)" : "Extra Bonus OFF"}
            </button>

            {/* Table */}
            <div className="overflow-x-auto bg-white rounded shadow-md">
                <table className="min-w-full border border-gray-300 text-black" aria-label="Employee bonus table">
                    <thead className="bg-gray-100 text-left">
                        <tr>
                            <th
                                className="p-2 border-b cursor-pointer select-none"
                                onClick={() => {
                                    if (sortKey === "lName") {
                                        setSortOrder(sortOrder === "asc" ? "desc" : "asc");
                                    } else {
                                        setSortKey("lName");
                                        setSortOrder("asc");
                                    }
                                }}
                            >
                                Last Name{" "}
                                <span className="text-blue-400">
                                    {sortKey === "lName"
                                        ? sortOrder === "asc"
                                            ? "▲"
                                            : "▼"
                                        : "–"}
                                </span>
                            </th>
                            <th className="p-2 border-b">Birthday</th>
                            <th
                                className="p-2 border-b cursor-pointer select-none"
                                onClick={() => {
                                    if (sortKey === "bonus") {
                                        setSortOrder(sortOrder === "asc" ? "desc" : "asc");
                                    } else {
                                        setSortKey("bonus");
                                        setSortOrder("asc");
                                    }
                                }}
                            >
                                Bonus{" "}
                                <span className="text-blue-400">
                                    {sortKey === "bonus"
                                        ? sortOrder === "asc"
                                            ? "▲"
                                            : "▼"
                                        : "-"}
                                </span>
                            </th>
                        </tr>
                    </thead>

                    <tbody>
                        {sortedEmployees.map((emp) => (
                            <EmployeeTableRow
                                key={emp.id}
                                employee={emp}
                                extraBonus={extraBonus}
                                onSelect={(id) => {
                                    setSelectedEmployeeId(id);
                                    setIsPanelOpen(true);
                                }}
                            />
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Slide-out Panel */}
            <EmployeeDetailPanel
                employee={selectedEmployee}
                isOpen={isPanelOpen}
                onClose={() => {
                    setIsPanelOpen(false);
                    setSelectedEmployeeId(null);
                }}
            />
        </div>
    );
};

export default EmployeeTable;
