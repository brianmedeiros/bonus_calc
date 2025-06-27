import React, { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "../store/store";
import type { EmployeeWithBonus } from "../types";
import { getManagerName, calculateTotalBonus, formatCurrency } from "../utils/employeeHelpers";
import EmployeeDetailsBreakdown from "./EmployeeDetailsBreakdown";

interface Props {
    employee: EmployeeWithBonus | null;
    isOpen: boolean;
    onClose: () => void;
    returnFocusTo: HTMLElement | null;
}

const EmployeeDetailPanel: React.FC<Props> = ({
    employee,
    isOpen,
    onClose,
    returnFocusTo,
}) => {
    const extraBonus = useSelector((state: RootState) => state.employees.extraBonus);
    const panelRef = useRef<HTMLDivElement>(null);

    // Focus on panel when opened
    useEffect(() => {
        if (isOpen && employee && panelRef.current) {
            panelRef.current.focus();
        }
    }, [employee, isOpen]);

    // Return focus on close
    useEffect(() => {
        if (!isOpen && returnFocusTo) {
            returnFocusTo.focus();
        }
    }, [isOpen, returnFocusTo]);

    // ESC to close
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                onClose();
            }
        };
        if (isOpen) {
            window.addEventListener("keydown", handleKeyDown);
        }
        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [isOpen, onClose]);

    if (!employee) {
        return (
            <div
                className={`fixed top-0 right-0 h-full transition-transform duration-300 ease-in-out z-50
        ${isOpen ? "translate-x-0" : "translate-x-full pointer-events-none"}
        w-[90%] sm:w-[80%] md:w-[400px] focus:outline-none
        bg-gradient-to-t from-orange-400 to-orange-500 text-black shadow-2xl`}
            >
                <div className="p-4 text-gray-100 italic">No employee selected</div>
            </div>
        );
    }

    const { total } = calculateTotalBonus(employee, extraBonus);

    return (
        <div
            ref={panelRef}
            tabIndex={-1}
            role="dialog"
            aria-modal="true"
            aria-labelledby="employee-panel-title"
            className={`fixed top-0 right-0 h-full transition-transform duration-300 ease-in-out z-50
        ${isOpen ? "translate-x-0" : "translate-x-full pointer-events-none"}
        w-[90%] sm:w-[80%] md:w-[400px] focus:outline-none
        bg-gradient-to-t from-orange-400 to-orange-500 text-black shadow-2xl`}
        >
            {/* Header */}
            <div className="flex justify-between items-center p-4 border-b border-orange-300">
                <h2 id="employee-panel-title" className="text-xl font-semibold">
                    {employee.fName} {employee.lName}
                </h2>
                <button
                    onClick={onClose}
                    className="text-red-100 text-2xl font-bold focus:outline-none focus:ring-2 focus:ring-red-300 rounded"
                    aria-label="Close employee details"
                >
                    &times;
                </button>
            </div>

            {/* Details */}
            <div className="p-4 space-y-2">
                <p><strong>Team:</strong> {employee.team}</p>
                <p><strong>Title:</strong> {employee.title}</p>
                <p><strong>Salary:</strong> {formatCurrency(employee.salary)}</p>
                <p><strong>Birthday:</strong> {employee.birthday}</p>
                <p>
                    <strong>Bonus:</strong>{" "}
                    <span className={extraBonus ? "text-green-800" : "text-black"}>
                        {formatCurrency(total)}
                    </span>
                </p>
                <p><strong>Date for Bonus:</strong> {employee.bonusDate}</p>
                <p><strong>Manager:</strong> {getManagerName(employee)}</p>
            </div>

            {/* Breakdown */}
            <EmployeeDetailsBreakdown employee={employee} />

            {/* weather warning */}
            {employee.weatherError && (
                <div className="mt-2 p-2 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-800 text-sm rounded">
                    Weather data unavailable. Temperature defaulted to 0°F.
                </div>
            )}
        </div>
    );
};

export default EmployeeDetailPanel;
