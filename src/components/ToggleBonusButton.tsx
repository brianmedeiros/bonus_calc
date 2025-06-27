import React from "react";
import { useSelector } from "react-redux";
import { useAppDispatch } from "../store/storeHooks";
import { toggleExtraBonus, updateAllBonuses } from "../store/employeeSlice";
import type { RootState } from "../store/store";

interface Props {
    onResetSelection?: () => void;
}

const ToggleBonusButton: React.FC<Props> = () => {
    const dispatch = useAppDispatch();
    const extraBonus = useSelector((state: RootState) => state.employees.extraBonus);

    const handleClick = () => {
        dispatch(toggleExtraBonus());
        dispatch(updateAllBonuses());
    };

    return (
        <button
            onClick={handleClick}
            className={`mb-4 px-4 py-2 rounded font-semibold transition-colors duration-200 border
        ${extraBonus
                    ? "bg-green-600 text-white border-green-900 hover:bg-green-700"
                    : "bg-red-300 text-red-800 border-red-800 hover:bg-red-400"
                }`}
        >
            {extraBonus ? "Extra Bonus ON (+5%)" : "Extra Bonus OFF"}
        </button>
    );
};

export default ToggleBonusButton;
