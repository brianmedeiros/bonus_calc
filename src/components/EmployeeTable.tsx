import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "../store/store";
import { toggleExtraBonus } from "../store/employeeSlice";
import type { EmployeeWithBonus } from "../types";
import { getManagerName, formatCurrency } from "../utils/employeeHelpers";


const EmployeeTable: React.FC = () => {
    const dispatch = useDispatch();
    const employees = useSelector((state: RootState) => state.employees.employees);
    const extraBonus = useSelector((state: RootState) => state.employees.extraBonus);

    // State for selected employee, panel visibility
    const [selectedEmployee, setSelectedEmployee] = useState<EmployeeWithBonus | null>(null);
    const [isPanelOpen, setIsPanelOpen] = useState(false);


    // State for sorting table
    const [sortKey, setSortKey] = useState<'lName' | 'bonus'>('lName');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

    // Function to handle sorting
    const sortedEmployees = [...employees].sort((a, b) => {
        const aValue = sortKey === 'lName' ? a.lName.toLowerCase() : a.bonus;
        const bValue = sortKey === 'lName' ? b.lName.toLowerCase() : b.bonus;

        if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
        return 0;
    });


    return (
        <div className="p-4 min-h-screen">
            <button
                onClick={() => dispatch(toggleExtraBonus())}
                className={`mb-4 px-4 py-2 rounded font-semibold transition-colors duration-200 border
                    ${extraBonus ? "bg-green-600 text-white border-green-900 hover:bg-green-700" : "bg-red-300 text-red-800 border-red-800 hover:bg-red-400"}
                    `}
            >
                {extraBonus ? "Extra Bonus ON (+5%)" : "Extra Bonus OFF"}
            </button>

            <div className="overflow-x-auto bg-white rounded shadow-md">
                <table className="min-w-full border border-gray-300 text-black">
                    <thead className="bg-gray-100 text-left">
                        <tr>
                            {/* last name with toggle for sort */}
                            <th
                                className="p-2 border-b cursor-pointer select-none"
                                onClick={() => {
                                    if (sortKey === 'lName') {
                                        setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                                    } else {
                                        setSortKey('lName');
                                        setSortOrder('asc');
                                    }
                                }}
                            >
                                Last Name{" "}
                                <span className="text-blue-400">
                                    {sortKey === 'lName'
                                        ? sortOrder === 'asc'
                                            ? '▲'
                                            : '▼'
                                        : '–'}
                                </span>
                            </th>

                            <th className="p-2 border-b">Birthday</th>

                            {/* bonus with toggle for sort */}
                            <th
                                className="p-2 border-b cursor-pointer select-none"
                                onClick={() => {
                                    if (sortKey === 'bonus') {
                                        setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                                    } else {
                                        setSortKey('bonus');
                                        setSortOrder('asc');
                                    }
                                }}
                            >
                                Bonus{" "}
                                <span className="text-blue-400">
                                    {sortKey === 'bonus'
                                        ? sortOrder === 'asc'
                                            ? '▲'
                                            : '▼'
                                        : '-'}
                                </span>
                            </th>
                        </tr>
                    </thead>


                    <tbody>
                        {sortedEmployees.map((emp) => (
                            // lname with click to open panel
                            <tr key={emp.lName} className="border-t hover:bg-gray-100">
                                <td className="p-2 text-blue-400 underline cursor-pointer" onClick={() => {
                                    setSelectedEmployee(emp);
                                    setIsPanelOpen(true);
                                }}>
                                    {emp.lName}
                                </td>
                                <td className="p-2">{emp.birthday}</td>
                                <td className="p-2">${emp.bonus.toFixed(2)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {/* side panel */}
                {selectedEmployee && (
                    <div className={`fixed top-0 right-0 h-full bg-white text-black shadow-lg transition-transform duration-300 ease-in-out z-50
                    ${isPanelOpen ? "translate-x-0" : "translate-x-full"} w-full sm:w-[80%] md:w-[400px]`} >
                        <div className="flex justify-between items-center p-4 border-b">
                            <h2 className="text-xl font-semibold">{selectedEmployee.fName} {selectedEmployee.lName}</h2>
                            <button onClick={() => setIsPanelOpen(false)} className="text-red-500 text-2xl font-bold">
                                &times;
                            </button>
                        </div>
                        <div className="p-4 space-y-2">
                            <p><strong>Team:</strong> {selectedEmployee.team}</p>
                            <p><strong>Title:</strong> {selectedEmployee.title}</p>
                            <p><strong>Salary:</strong> {formatCurrency(selectedEmployee.salary)}</p>
                            <p><strong>Birthday:</strong> {selectedEmployee.birthday}</p>
                            <p><strong>Bonus:</strong> ${selectedEmployee.bonus.toFixed(2)}</p>
                            <p><strong>Date for Bonus:</strong> {selectedEmployee.bonusDate}</p>
                            <p><strong>Manager:</strong> {getManagerName(selectedEmployee)}</p>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
};

export default EmployeeTable;
