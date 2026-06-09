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
  blacklist: [
    {
      id: "BLK-100",
      name: "No-service address",
      reason: "Unpaid prior balance",
      status: "Do not book",
    },
    {
      id: "BLK-101",
      name: "Oak Street lead",
      reason: "Repeated no-shows",
      status: "Deposit first",
    },
  ],
  customers: [
    {
      id: "CUS-100",
      access: "Gate on left side. Text before arrival.",
      lastService: "Mowing + edging",
      name: "Reyes Residence",
      phone: "201.555.0184",
      town: "River Edge",
    },
    {
      id: "CUS-101",
      access: "No backyard access needed.",
      lastService: "Mulch refresh",
      name: "Patel Residence",
      phone: "201.555.0149",
      town: "Oradell",
    },
    {
      id: "CUS-102",
      access: "Dog in yard. Confirm before entering.",
      lastService: "Leaf cleanup",
      name: "Keller Residence",
      phone: "201.555.0172",
      town: "Paramus",
    },
  ],
  equipment: [
    { id: "EQ-100", item: "Mower", note: "Blade sharpened", status: "Ready" },
    { id: "EQ-101", item: "Blower", note: "Battery charged", status: "Ready" },
    { id: "EQ-102", item: "Edger", note: "Bring extra line", status: "Check" },
    { id: "EQ-103", item: "Shovels", note: "Winter bin", status: "Stored" },
  ],
  expenses: [
    { id: "EXP-221", amount: 42, category: "Fuel", date: "2026-06-08", item: "Fuel" },
    { id: "EXP-220", amount: 18, category: "Supplies", date: "2026-06-07", item: "Trimmer line" },
    { id: "EXP-219", amount: 145, category: "Materials", date: "2026-06-05", item: "Mulch delivery" },
  ],
  jobs: [
    {
      id: "JOB-1042",
      amount: 85,
      crew: "Lucas / Mateo",
      customer: "Reyes Residence",
      date: "2026-06-10",
      notes: "Normal front and backyard cut.",
      service: "Mowing + edging",
      status: "Scheduled",
      town: "River Edge",
    },
    {
      id: "JOB-1041",
      amount: 260,
      crew: "Lucas",
      customer: "Patel Residence",
      date: "2026-06-11",
      notes: "Dark brown mulch only.",
      service: "Mulch refresh",
      status: "Estimate sent",
      town: "Oradell",
    },
    {
      id: "JOB-1040",
      amount: 150,
      crew: "Mateo",
      customer: "Keller Residence",
      date: "2026-06-12",
      notes: "Needs before photos.",
      service: "Leaf cleanup",
      status: "Needs photos",
      town: "Paramus",
    },
  ],
  marketing: [
    { id: "MKT-100", booked: 3, leads: 9, source: "Door hangers", spend: 64 },
    { id: "MKT-101", booked: 2, leads: 5, source: "Instagram", spend: 0 },
    { id: "MKT-102", booked: 4, leads: 4, source: "Neighbor referral", spend: 0 },
  ],
  notes: [
    {
      id: "NOTE-100",
      text: "River Edge route: ask before using side gate on Elm Ave.",
    },
    {
      id: "NOTE-101",
      text: "Paramus mulch customer wants dark brown, not black.",
    },
    {
      id: "NOTE-102",
      text: "Keep extra trash bags in truck for leaf jobs.",
    },
  ],
};
