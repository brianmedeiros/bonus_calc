import React from "react";

interface Props {
    sortKey: "lName" | "bonus";
    sortOrder: "asc" | "desc";
    onSortChange: (key: "lName" | "bonus") => void;
}

const EmployeeTableHeader: React.FC<Props> = ({ sortKey, sortOrder, onSortChange }) => {
    const renderArrow = (key: "lName" | "bonus") => {
        if (sortKey !== key) return "–";
        return sortOrder === "asc" ? "▲" : "▼";
    };

    return (
        <thead className="bg-gray-100 text-left">
            <tr>
                <th
                    className="p-2 border-b cursor-pointer select-none"
                    onClick={() => onSortChange("lName")}
                >
                    Last Name <span className="text-blue-400">{renderArrow("lName")}</span>
                </th>
                <th className="p-2 border-b">Birthday</th>
                <th
                    className="p-2 border-b cursor-pointer select-none"
                    onClick={() => onSortChange("bonus")}
                >
                    Bonus <span className="text-blue-400">{renderArrow("bonus")}</span>
                </th>
            </tr>
        </thead>
    );
};

export default EmployeeTableHeader;
