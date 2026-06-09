import { employeeProfiles } from "./employees";

export const townOptions = ["River Edge", "Oradell", "Paramus"];

export const serviceOptions = [
  "Lawn mowing",
  "Blowing",
  "Edging",
  "Mulching",
  "Leaf cleanup",
  "Snow shoveling",
  "Estimate visit",
];

export const statusOptions = [
  "Scheduled",
  "In progress",
  "Complete",
  "Estimate sent",
  "Needs photos",
];

export const expenseCategories = ["Fuel", "Materials", "Supplies", "Repairs", "Marketing", "Other"];

export const equipmentStatuses = ["Ready", "Check", "Needs repair", "Stored"];

export const initialDashboardData = {
  audit: [],
  blacklist: [],
  customers: [],
  equipment: [],
  employees: employeeProfiles,
  expenses: [],
  jobs: [],
  marketing: [],
  notes: [],
};
