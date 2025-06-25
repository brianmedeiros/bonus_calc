import React, { useEffect, useRef } from "react";
import type { EmployeeWithBonus } from "../types";
import { getManagerName } from "../utils/employeeHelpers";

interface Props {
    employee: EmployeeWithBonus | null;
    isOpen: boolean;
    onClose: () => void;
}

const EmployeeDetailPanel: React.FC<Props> = ({ employee, isOpen, onClose }) => {
    const panelRef = useRef<HTMLDivElement>(null);

    // Focus panel on open
    useEffect(() => {
        if (isOpen && employee && panelRef.current) {
            panelRef.current.focus();
        }
    }, [employee, isOpen]);


    return (
        <div
            ref={panelRef}
            tabIndex={-1}
            role="dialog"
            aria-modal="true"
            aria-labelledby="employee-panel-title"
            className={`fixed top-0 right-0 h-full bg-white text-black shadow-lg transition-transform duration-300 ease-in-out z-50
        ${isOpen ? "translate-x-0 pointer-events-auto" : "translate-x-full pointer-events-none"}
        w-full sm:w-[80%] md:w-[400px] focus:outline-none`}
        >
            {employee ? (
                <>
                    <div className="flex justify-between items-center p-4 border-b">
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
                        <p><strong>Salary:</strong> ${employee.salary.toLocaleString()}</p>
                        <p><strong>Birthday:</strong> {employee.birthday}</p>
                        <p><strong>Bonus:</strong> ${employee.bonus.toFixed(2)}</p>
                        <p><strong>Date for Bonus:</strong> {employee.bonusDate}</p>
                        <p><strong>Manager:</strong> {getManagerName(employee)}</p>
                    </div>
                </>
            ) : (
                <div className="p-4 text-gray-400 italic">No employee selected</div>
            )}
        </div>
    );
};

export default EmployeeDetailPanel;
