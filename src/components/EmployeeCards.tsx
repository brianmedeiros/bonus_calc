import React from "react";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "../store/store";
import { toggleExtraBonus } from "../store/employeeSlice";

const EmployeeCards: React.FC = () => {
    const dispatch = useDispatch();
    const employees = useSelector((state: RootState) => state.employees.employees);

    return (
        <div className="p-4">
            <button onClick={() => dispatch(toggleExtraBonus())} className="mb-4 bg-blue-500 text-white px-4 py-2 rounded" >
                Toggle Extra Bonus (+5%)
            </button>
            <div className="flex flex-wrap gap-4 justify-start">
                {employees.map((emp) => (
                    <div key={emp.lName} className="w-full md:w-1/2 lg:w-1/3 p-4 border rounded-lg shadow-md bg-white" >
                        <div className="text-xl font-semibold mb-2">
                            {emp.fName} {emp.lName}
                        </div>
                        <div className="text-sm text-gray-500 mb-1">
                            🎂 Birthday: {emp.birthday}
                        </div>
                        <div className="text-sm text-gray-500 mb-2">
                            📌 Team: {emp.team}
                        </div>
                        <div className="text-lg font-bold text-green-600">
                            💰 Bonus: ${emp.bonus.toFixed(2)}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default EmployeeCards;
