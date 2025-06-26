import { createSlice, type PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import type { EmployeeWithBonus } from "../types";
import type { RootState } from "./store";
import { calculateTotalBonus } from "../utils/employeeHelpers";

interface EmployeeState {
  employees: EmployeeWithBonus[];
  extraBonus: boolean;
}

const initialState: EmployeeState = {
  employees: [],
  extraBonus: false,
};

// Async thunk to recalculate all bonuses based on current state
export const updateAllBonuses = createAsyncThunk(
  "employees/updateAllBonuses",
  async (_, { getState, dispatch }) => {
    const state = getState() as RootState;
    const { employees, extraBonus } = state.employees;

    const updatedEmployees = employees.map((emp) => {
      const { total } = calculateTotalBonus(emp, extraBonus);
      return { ...emp, bonus: total };
    });

    dispatch(setEmployees(updatedEmployees));
  }
);

const employeeSlice = createSlice({
  name: "employees",
  initialState,
  reducers: {
    setEmployees(state, action: PayloadAction<EmployeeWithBonus[]>) {
      state.employees = action.payload;
    },

    toggleExtraBonus(state) {
      state.extraBonus = !state.extraBonus;
    },
  },
});

export const { setEmployees, toggleExtraBonus } = employeeSlice.actions;
export default employeeSlice.reducer;
