import React, { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "../store/store";
import type { EmployeeWithBonus } from "../types";
import { getManagerName, calculateFullBonus } from "../utils/employeeHelpers";

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

    return (
        <div
            ref={panelRef}
            tabIndex={-1}
            role="dialog"
            aria-modal="true"
            aria-labelledby="employee-panel-title"
            className={`fixed top-0 right-0 h-full bg-orange-200 text-black shadow-lg transition-transform duration-300 ease-in-out z-50
        ${isOpen ? "translate-x-0 pointer-events-auto" : "translate-x-full pointer-events-none"}
        w-[90%] sm:w-[80%] md:w-[400px] focus:outline-none`}
        >
            {!employee ? (
                <div className="p-4 text-gray-400 italic">No employee selected</div>
            ) : (
                <>
                    {/* === Logic safely scoped inside JSX === */}
                    {(() => {
                        const baseBonusPercentage = {
                            Executive: 0.2,
                            Supervisor: 0.1,
                            Manager: 0.08,
                            Employee: 0.05,
                        }[employee.team];

                        const temp = employee.temperatureF ?? 0;
                        let weatherBonusPercentage = 0;
                        if (temp > 86) weatherBonusPercentage = 0.1;
                        else if (temp >= 68) weatherBonusPercentage = 0.05;

                        const extraBonusPercentage = extraBonus ? 0.05 : 0;
                        const totalBonusAmount = employee.salary * (
                            baseBonusPercentage + weatherBonusPercentage + extraBonusPercentage
                        );

                        return (
                            <>
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
                                    <p><strong>Salary:</strong> {employee.salary.toLocaleString("en-US", { style: "currency", currency: "USD" })}</p>
                                    <p><strong>Birthday:</strong> {employee.birthday}</p>
                                    <p>
                                        <strong>Bonus:</strong>{" "}
                                        <span className={extraBonus ? "text-green-800" : "text-black"}>
                                            {calculateFullBonus(employee, extraBonus).toLocaleString("en-US", {
                                                style: "currency",
                                                currency: "USD",
                                            })}
                                        </span>
                                    </p>
                                    <p><strong>Date for Bonus:</strong> {employee.bonusDate}</p>
                                    <p><strong>Manager:</strong> {getManagerName(employee)}</p>
                                </div>

                                <div className="mt-4 bg-gray-50 p-3 rounded border text-sm space-y-1 border-l-4 border-blue-300 pl-3">
                                    <h3 className="font-semibold text-gray-700 mb-1">Bonus Breakdown:</h3>
                                    <p>
                                        <strong>Base Bonus:</strong> {(baseBonusPercentage * 100).toFixed(0)}% →{" "}
                                        {(employee.salary * baseBonusPercentage).toLocaleString("en-US", {
                                            style: "currency",
                                            currency: "USD",
                                        })}{" "}
                                        for {employee.team}
                                    </p>

                                    <p><strong>Bonus Date:</strong> {employee.bonusDate}</p>
                                    <p><strong>Weather Temp:</strong> {temp}°F</p>

                                    <p>
                                        <strong>Weather Bonus:</strong> {(weatherBonusPercentage * 100).toFixed(0)}% →{" "}
                                        {(employee.salary * weatherBonusPercentage).toLocaleString("en-US", {
                                            style: "currency",
                                            currency: "USD",
                                        })}
                                    </p>

                                    {extraBonus && (
                                        <p>
                                            <strong>Extra Bonus:</strong> 5% →{" "}
                                            {(employee.salary * 0.05).toLocaleString("en-US", {
                                                style: "currency",
                                                currency: "USD",
                                            })}{" "}
                                            (toggle enabled)
                                        </p>
                                    )}

                                </div>

                                <div className="mt-4 border-t pt-3 text-right text-lg text-green-700 font-bold pr-4">
                                    Total Bonus Awarded:{" "}
                                    {totalBonusAmount.toLocaleString("en-US", {
                                        style: "currency",
                                        currency: "USD",
                                    })}
                                </div>
                            </>
                        );
                    })()}
                </>
            )}
        </div>
    );
};

export default EmployeeDetailPanel;
