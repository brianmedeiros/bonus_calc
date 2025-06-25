import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "../store/store";
import { toggleExtraBonus } from "../store/employeeSlice";

const EmployeeTable: React.FC = () => {
    const dispatch = useDispatch();
    const employees = useSelector((state: RootState) => state.employees.employees);
    const extraBonus = useSelector((state: RootState) => state.employees.extraBonus);
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
                                        : '–'}
                                </span>
                            </th>
                        </tr>
                    </thead>


                    <tbody>
                        {sortedEmployees.map((emp) => (
                            <tr key={emp.lName} className="border-t hover:bg-gray-100">
                                <td className="p-2">{emp.lName}</td>
                                <td className="p-2">{emp.birthday}</td>
                                <td className="p-2">${emp.bonus.toFixed(2)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default EmployeeTable;
