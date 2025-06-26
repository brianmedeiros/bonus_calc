import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "../store/store";
import { toggleExtraBonus } from "../store/employeeSlice";
import { calculateTotalBonus, formatCurrency } from "../utils/employeeHelpers";
import EmployeeDetailPanel from "./EmployeeDetailPanel";

const EmployeeTable: React.FC = () => {
    const dispatch = useDispatch();
    const employees = useSelector((state: RootState) => state.employees.employees);
    const extraBonus = useSelector((state: RootState) => state.employees.extraBonus);

    // Panel state
    const [selectedEmployeeId, setSelectedEmployeeId] = useState<string | null>(null);
    const [isPanelOpen, setIsPanelOpen] = useState(false);

    const selectedEmployee =
        useSelector((state: RootState) =>
            state.employees.employees.find((emp) => emp.id === selectedEmployeeId)
        ) || null;

    // Sorting state
    const [sortKey, setSortKey] = useState<"lName" | "bonus">("lName");
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

    const sortedEmployees = [...employees].sort((a, b) => {
        const aValue = sortKey === "lName"
            ? a.lName.toLowerCase()
            : calculateTotalBonus(a, extraBonus).total;
        const bValue = sortKey === "lName"
            ? b.lName.toLowerCase()
            : calculateTotalBonus(b, extraBonus).total;

        if (aValue < bValue) return sortOrder === "asc" ? -1 : 1;
        if (aValue > bValue) return sortOrder === "asc" ? 1 : -1;
        return 0;
    });

    return (
        <div className="p-4 min-h-screen">
            {/* Toggle Bonus Button */}
            <button
                onClick={() => {
                    dispatch(toggleExtraBonus());
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
                <table className="min-w-full border border-gray-300 text-black">
                    <thead className="bg-gray-100 text-left">
                        <tr>
                            {/* Last Name column with sorting */}
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

                            {/* Bonus column with sorting */}
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
                        {sortedEmployees.map((emp) => {
                            const { total } = calculateTotalBonus(emp, extraBonus);
                            return (
                                <tr key={emp.id} className="border-t hover:bg-gray-100">
                                    <td
                                        className="p-2 text-blue-400 underline cursor-pointer focus:outline-none focus:ring-2 ring-blue-400"
                                        tabIndex={0}
                                        onClick={() => {
                                            setSelectedEmployeeId(emp.id);
                                            setIsPanelOpen(true);
                                        }}
                                        onKeyDown={(e) => {
                                            if (e.key === "Enter" || e.key === " ") {
                                                setSelectedEmployeeId(emp.id);
                                                setIsPanelOpen(true);
                                            }
                                        }}
                                    >
                                        {emp.lName}
                                    </td>
                                    <td className="p-2">{emp.birthday}</td>
                                    <td className={`p-2 ${extraBonus ? "text-green-800" : "text-black"}`}>
                                        {formatCurrency(total)}
                                    </td>
                                </tr>
                            );
                        })}
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
