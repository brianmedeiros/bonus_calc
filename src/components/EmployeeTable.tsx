import React, { useState } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "../store/store";
import { calculateTotalBonus } from "../utils/employeeHelpers";
import EmployeeDetailPanel from "./EmployeeDetailPanel";
import EmployeeTableRow from "./EmployeeTableRow";
import EmployeeTableHeader from "./EmployeeTableHeader";
import ToggleBonusButton from "./ToggleBonusButton";

const EmployeeTable: React.FC = () => {
    const { employees, extraBonus } = useSelector((state: RootState) => state.employees);

    // Panel state
    const [selectedEmployeeId, setSelectedEmployeeId] = useState<string | null>(null);
    const [isPanelOpen, setIsPanelOpen] = useState(false);
    const [lastFocusedElement, setLastFocusedElement] = useState<HTMLElement | null>(null);

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

            <ToggleBonusButton
                onResetSelection={() => {
                    setSelectedEmployeeId(null);
                    setIsPanelOpen(false);
                }}
            />

            <div className="overflow-x-auto bg-white rounded shadow-md">
                <table
                    className="min-w-full border border-gray-300 text-black"
                    aria-label="Employee bonus table"
                >
                    <EmployeeTableHeader
                        sortKey={sortKey}
                        sortOrder={sortOrder}
                        onSortChange={(key) => {
                            if (sortKey === key) {
                                setSortOrder(sortOrder === "asc" ? "desc" : "asc");
                            } else {
                                setSortKey(key);
                                setSortOrder("asc");
                            }
                        }}
                    />

                    <tbody>
                        {sortedEmployees.map((emp) => (
                            <EmployeeTableRow
                                key={emp.id}
                                employee={emp}
                                extraBonus={extraBonus}
                                onSelect={(id) => {
                                    setLastFocusedElement(document.activeElement as HTMLElement);
                                    setSelectedEmployeeId(id);
                                    setIsPanelOpen(true);
                                }}
                            />
                        ))}
                    </tbody>
                </table>
            </div>

            <EmployeeDetailPanel
                employee={selectedEmployee}
                isOpen={isPanelOpen}
                returnFocusTo={lastFocusedElement}
                onClose={() => {
                    setIsPanelOpen(false);
                    setSelectedEmployeeId(null);
                }}
            />
        </div>
    );
};

export default EmployeeTable;
