import React, { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "../store/store";
import type { EmployeeWithBonus } from "../types";
import { getManagerName, calculateTotalBonus, formatCurrency } from "../utils/employeeHelpers";

interface Props {
    employee: EmployeeWithBonus | null;
    isOpen: boolean;
    onClose: () => void;
}

const EmployeeDetailPanel: React.FC<Props> = ({ employee, isOpen, onClose }) => {
    const extraBonus = useSelector((state: RootState) => state.employees.extraBonus);
    const panelRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (isOpen && employee && panelRef.current) {
            panelRef.current.focus();
        }
    }, [employee, isOpen]);

    if (!employee) {
        return (
            <div
                className={`fixed top-0 right-0 h-full bg-gradient-to-b from-orange-300 to-orange-500 text-black shadow-xl transition-transform duration-300 ease-in-out z-50
        ${isOpen ? "translate-x-0 pointer-events-auto" : "translate-x-full pointer-events-none"}
        w-[90%] sm:w-[80%] md:w-[400px] focus:outline-none`}
            >
                <div className="p-4 text-gray-400 italic">No employee selected</div>
            </div>
        );
    }

    const { base, weather, extra, total } = calculateTotalBonus(employee, extraBonus);
    const temp = employee.temperatureF ?? 0;

    return (
        <div
            ref={panelRef}
            tabIndex={-1}
            role="dialog"
            aria-modal="true"
            aria-labelledby="employee-panel-title"
            className={`fixed top-0 right-0 h-full bg-gradient-to-b from-orange-300 to-orange-500 text-black shadow-xl transition-transform duration-300 ease-in-out z-50
        ${isOpen ? "translate-x-0 pointer-events-auto" : "translate-x-full pointer-events-none"}
        w-[90%] sm:w-[80%] md:w-[400px] focus:outline-none`}
        >
            <div className="flex justify-between items-center p-4 border-b border-orange-400">
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
                <p><strong>Manager:</strong> {getManagerName(employee)}</p>
            </div>

            <div className="mt-4 bg-gray-50 p-3 rounded border text-sm space-y-1 border-l-4 border-blue-300 pl-3 mx-4 mb-4">
                <h3 className="font-semibold text-gray-700 mb-1">Bonus Breakdown:</h3>
                <p>
                    <strong>Base Bonus:</strong> {((base / employee.salary) * 100).toFixed(0)}% → {formatCurrency(base)}
                </p>
                <p><strong>Bonus Date:</strong> {employee.bonusDate}</p>
                <p><strong>Weather Temp:</strong> {temp}°F</p>
                <p>
                    <strong>Weather Bonus:</strong> {((weather / employee.salary) * 100).toFixed(0)}% → {formatCurrency(weather)}
                </p>
                {extraBonus && (
                    <p>
                        <strong>Extra Bonus:</strong> 5% → {formatCurrency(extra)}
                    </p>
                )}
                <hr className="border-t border-gray-300 my-2" />
                <p><strong>Total Bonus:</strong> {formatCurrency(total)}</p>
            </div>

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
