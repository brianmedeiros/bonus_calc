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
    returnFocusTo?: HTMLElement | null;
}

const EmployeeDetailPanel: React.FC<Props> = ({
    employee,
    isOpen,
    onClose,
    returnFocusTo,
}) => {
    const panelRef = useRef<HTMLDivElement>(null);
    const allEmployees = useSelector((state: RootState) => state.employees.employees);
    const extraBonus = useSelector((state: RootState) => state.employees.extraBonus);

    // Manage focus when panel opens/closes
    useEffect(() => {
        if (isOpen && employee && panelRef.current) {
            panelRef.current.focus();
        }
    }, [isOpen, employee]);

    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                onClose();
            }
        };

        if (isOpen) {
            window.addEventListener("keydown", handleEsc);
        }

        return () => {
            window.removeEventListener("keydown", handleEsc);
        };
    }, [isOpen, onClose]);

    useEffect(() => {
        return () => {
            if (returnFocusTo) {
                returnFocusTo.focus();
            }
        };
    }, [returnFocusTo]);

    if (!employee) {
        return (
            <div
                className={`fixed top-0 right-0 h-full bg-orange-100 text-black shadow-lg transition-transform duration-300 ease-in-out z-50
        ${isOpen ? "translate-x-0 pointer-events-auto" : "translate-x-full pointer-events-none"}
        w-[90%] sm:w-[80%] md:w-[400px] focus:outline-none`}
            >
                <div className="p-4 text-gray-400 italic">No employee selected</div>
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
            className={`fixed top-0 right-0 h-full bg-gradient-to-b from-orange-300 to-orange-100 text-black shadow-2xl transition-transform duration-300 ease-in-out z-50
        ${isOpen ? "translate-x-0 pointer-events-auto" : "translate-x-full pointer-events-none"}
        w-[90%] sm:w-[80%] md:w-[400px] focus:outline-none`}
        >
            <div className="flex justify-between items-center p-4 border-b border-orange-300">
                <h2 id="employee-panel-title" className="text-xl font-semibold">
                    {employee.fName} {employee.lName}
                </h2>
                <button
                    onClick={onClose}
                    className="text-red-500 text-2xl font-bold focus:outline-none focus:ring-2 focus:ring-red-400 rounded"
                    aria-label="Close employee details"
                >
                    &times;
                </button>
            </div>

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
                <p><strong>Manager:</strong> {getManagerName(employee, allEmployees)}</p>
            </div>

            <EmployeeDetailsBreakdown employee={employee} />
        </div>
    );
};

export default EmployeeDetailPanel;
