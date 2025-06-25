import React from "react";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "../store/store";
import { toggleExtraBonus } from "../store/employeeSlice";

const EmployeeTable: React.FC = () => {
    const dispatch = useDispatch();
    const employees = useSelector((state: RootState) => state.employees.employees);
    const extraBonus = useSelector((state: RootState) => state.employees.extraBonus);

    return (
        <div className="p-4">
            <button
                onClick={() => dispatch(toggleExtraBonus())}
                className={`mb-4 px-4 py-2 rounded font-semibold transition-colors duration-200 ${extraBonus
                    ? "bg-green-600 text-white hover:bg-green-700"
                    : "bg-red-300 text-red-800 hover:bg-red-400"
                    }`}
            >
                {extraBonus ? "Extra Bonus ON (+5%)" : "Extra Bonus OFF"}
            </button>

            <div className="overflow-x-auto">
                <table className="min-w-full border border-gray-300">
                    <thead className="bg-gray-100 text-left">
                        <tr>
                            <th className="p-2 border-b">Last Name</th>
                            <th className="p-2 border-b">Birthday</th>
                            <th className="p-2 border-b">Bonus</th>
                        </tr>
                    </thead>
                    <tbody>
                        {employees.map((emp) => (
                            <tr key={emp.lName} className="border-t hover:bg-gray-50">
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
