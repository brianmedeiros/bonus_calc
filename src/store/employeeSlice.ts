import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { EmployeeWithBonus } from "../types";

interface EmployeeState {
  employees: EmployeeWithBonus[];
  extraBonus: boolean;
}

const initialState: EmployeeState = {
  employees: [],
  extraBonus: false,
};

const employeeSlice = createSlice({
  name: "employees",
  initialState,
  reducers: {
    setEmployees(state, action: PayloadAction<EmployeeWithBonus[]>) {
      state.employees = action.payload;
    },

    toggleExtraBonus(state) {
      state.extraBonus = !state.extraBonus;
      state.employees = state.employees.map(emp => ({
        ...emp,
        bonus: state.extraBonus ? emp.bonus * 1.05 : emp.bonus / 1.05,
      }));
    },

  },

});

export const { setEmployees, toggleExtraBonus } = employeeSlice.actions;
export default employeeSlice.reducer;