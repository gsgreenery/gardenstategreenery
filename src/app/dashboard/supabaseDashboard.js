import { initialDashboardData } from "./dashboardSeed";

const SUPABASE_REST_PATH = "rest/v1";
const AUDIT_LIMIT = 250;

const collections = {
  blacklist: {
    table: "gsg_blacklist",
    fromDb: (row) => ({
      id: row.id,
      name: row.name,
      reason: row.reason,
      status: row.status,
    }),
    toDb: (item) => ({
      id: item.id,
      name: item.name,
      reason: item.reason,
      status: item.status,
    }),
  },
  customers: {
    table: "gsg_customers",
    fromDb: (row) => ({
      access: row.access,
      id: row.id,
      lastService: row.last_service,
      name: row.name,
      phone: row.phone,
      town: row.town,
    }),
    toDb: (item) => ({
      access: item.access,
      id: item.id,
      last_service: item.lastService,
      name: item.name,
      phone: item.phone,
      town: item.town,
    }),
  },
  employees: {
    primaryKey: "slug",
    table: "gsg_employees",
    fromDb: (row) => ({
      env: row.env,
      isManagement: row.is_management,
      name: row.name,
      slug: row.slug,
      title: row.title,
    }),
    toDb: (item) => ({
      env: item.env,
      is_management: item.isManagement,
      name: item.name,
      slug: item.slug,
      title: item.title,
    }),
  },
  equipment: {
    table: "gsg_equipment",
    fromDb: (row) => ({
      id: row.id,
      item: row.item,
      note: row.note,
      status: row.status,
    }),
    toDb: (item) => ({
      id: item.id,
      item: item.item,
      note: item.note,
      status: item.status,
    }),
  },
  expenses: {
    table: "gsg_expenses",
    fromDb: (row) => ({
      amount: Number(row.amount || 0),
      category: row.category,
      date: row.date,
      id: row.id,
      item: row.item,
    }),
    toDb: (item) => ({
      amount: item.amount === undefined ? undefined : Number(item.amount || 0),
      category: item.category,
      date: item.date,
      id: item.id,
      item: item.item,
    }),
  },
  jobs: {
    table: "gsg_jobs",
    fromDb: (row) => ({
      amount: Number(row.amount || 0),
      crew: row.crew,
      customer: row.customer,
      date: row.date,
      id: row.id,
      notes: row.notes,
      service: row.service,
      status: row.status,
      town: row.town,
    }),
    toDb: (item) => ({
      amount: item.amount === undefined ? undefined : Number(item.amount || 0),
      crew: item.crew,
      customer: item.customer,
      date: item.date,
      id: item.id,
      notes: item.notes,
      service: item.service,
      status: item.status,
      town: item.town,
    }),
  },
  marketing: {
    table: "gsg_marketing_sources",
    fromDb: (row) => ({
      booked: Number(row.booked || 0),
      id: row.id,
      leads: Number(row.leads || 0),
      source: row.source,
      spend: Number(row.spend || 0),
    }),
    toDb: (item) => ({
      booked: item.booked === undefined ? undefined : Number(item.booked || 0),
      id: item.id,
      leads: item.leads === undefined ? undefined : Number(item.leads || 0),
      source: item.source,
      spend: item.spend === undefined ? undefined : Number(item.spend || 0),
    }),
  },
  notes: {
    table: "gsg_crew_notes",
    fromDb: (row) => ({
      id: row.id,
      text: row.text,
    }),
    toDb: (item) => ({
      id: item.id,
      text: item.text,
    }),
  },
};

const collectionLabels = {
  blacklist: "blacklist entry",
  customers: "customer",
  employees: "employee",
  equipment: "equipment item",
  expenses: "expense",
  jobs: "job",
  marketing: "marketing source",
  notes: "crew note",
};

function getSupabaseConfig() {
  const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SECRET_KEY || "";

  return {
    configured: Boolean(url && key),
    key,
    url: url.replace(/\/$/, ""),
  };
}

export function isSupabaseDashboardConfigured() {
  return getSupabaseConfig().configured;
}

function makeId(prefix) {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return `${prefix}-${crypto.randomUUID().slice(0, 8).toUpperCase()}`;
  }

  return `${prefix}-${Date.now()}`;
}

function getActorName(actor) {
  return actor?.name || "Unknown employee";
}

function getActorSlug(actor) {
  return actor?.slug || "unknown";
}

function describeRecord(item) {
  if (!item) {
    return "Unknown record";
  }

  return (
    item.customer ||
    item.name ||
    item.item ||
    item.source ||
    item.text?.slice(0, 60) ||
    item.id ||
    "Record"
  );
}

async function supabaseRequest(path, options = {}) {
  const config = getSupabaseConfig();

  if (!config.configured) {
    throw new Error("Supabase dashboard env vars are not configured.");
  }

  const response = await fetch(`${config.url}/${SUPABASE_REST_PATH}/${path}`, {
    ...options,
    cache: "no-store",
    headers: {
      apikey: config.key,
      authorization: `Bearer ${config.key}`,
      "content-type": "application/json",
      ...(options.headers || {}),
    },
  });

  if (!response.ok) {
    throw new Error(await response.text());
  }

  const text = await response.text();

  return text ? JSON.parse(text) : null;
}

async function insertRows(collection, rows) {
  if (!rows.length) {
    return [];
  }

  const meta = collections[collection];

  return supabaseRequest(meta.table, {
    body: JSON.stringify(rows.map(meta.toDb)),
    headers: { Prefer: "return=representation" },
    method: "POST",
  });
}

async function updateRow(collection, id, changes) {
  const meta = collections[collection];

  return supabaseRequest(`${meta.table}?id=eq.${encodeURIComponent(id)}`, {
    body: JSON.stringify(meta.toDb({ ...changes, id })),
    headers: { Prefer: "return=representation" },
    method: "PATCH",
  });
}

async function deleteRow(collection, id) {
  const meta = collections[collection];

  await supabaseRequest(`${meta.table}?id=eq.${encodeURIComponent(id)}`, {
    headers: { Prefer: "return=minimal" },
    method: "DELETE",
  });
}

async function insertAudit(actor, action, target, detail) {
  await supabaseRequest("gsg_audit_log", {
    body: JSON.stringify({
      action,
      actor: getActorName(actor),
      actor_slug: getActorSlug(actor),
      detail,
      id: makeId("AUD"),
      target,
    }),
    headers: { Prefer: "return=minimal" },
    method: "POST",
  });
}

async function getRows(collection, query = "") {
  const meta = collections[collection];
  const rows = await supabaseRequest(`${meta.table}?select=*${query}`);

  return rows.map(meta.fromDb);
}

export async function readDashboardData() {
  const [blacklist, customers, employees, equipment, expenses, jobs, marketing, notes, auditRows] =
    await Promise.all([
      getRows("blacklist", "&order=created_at.desc"),
      getRows("customers", "&order=created_at.desc"),
      getRows("employees", "&order=name.asc"),
      getRows("equipment", "&order=created_at.desc"),
      getRows("expenses", "&order=date.desc,created_at.desc"),
      getRows("jobs", "&order=date.asc,created_at.desc"),
      getRows("marketing", "&order=created_at.desc"),
      getRows("notes", "&order=created_at.desc"),
      supabaseRequest(`gsg_audit_log?select=*&order=created_at.desc&limit=${AUDIT_LIMIT}`),
    ]);

  return {
    ...initialDashboardData,
    audit: auditRows.map((row) => ({
      action: row.action,
      actor: row.actor,
      actorSlug: row.actor_slug,
      detail: row.detail,
      id: row.id,
      target: row.target,
      time: row.created_at,
    })),
    blacklist,
    customers,
    employees,
    equipment,
    expenses,
    jobs,
    marketing,
    notes,
  };
}

async function resetDemoData(actor) {
  await Promise.all(
    Object.values(collections).map((collection) => {
      const primaryKey = collection.primaryKey || "id";

      return supabaseRequest(`${collection.table}?${primaryKey}=neq.__never_delete__`, {
        headers: { Prefer: "return=minimal" },
        method: "DELETE",
      });
    }),
  );

  await Promise.all(
    Object.keys(collections).map((collection) =>
      insertRows(collection, initialDashboardData[collection] || []),
    ),
  );
  await insertAudit(actor, "Reset", "Dashboard", "Reset dashboard data.");
}

export async function mutateDashboardData(actor, mutation) {
  switch (mutation.type) {
    case "signIn": {
      await insertAudit(
        actor,
        "Signed in",
        "Dashboard",
        `${getActorName(actor)} opened the employee dashboard.`,
      );
      break;
    }
    case "addBlacklistItem": {
      const item = mutation.payload;
      await insertRows("blacklist", [item]);
      await insertAudit(actor, "Added", "Blacklist", `Added blacklist entry for ${describeRecord(item)}.`);
      break;
    }
    case "addCustomer": {
      const customer = mutation.payload;
      await insertRows("customers", [customer]);
      await insertAudit(actor, "Added", "Customers", `Added customer ${describeRecord(customer)}.`);
      break;
    }
    case "addEquipment": {
      const item = mutation.payload;
      await insertRows("equipment", [item]);
      await insertAudit(actor, "Added", "Equipment", `Added equipment item ${describeRecord(item)}.`);
      break;
    }
    case "addExpense": {
      const expense = mutation.payload;
      await insertRows("expenses", [expense]);
      await insertAudit(
        actor,
        "Added",
        "Expenses",
        `Added ${describeRecord(expense)} expense for $${Number(expense.amount || 0).toFixed(0)}.`,
      );
      break;
    }
    case "addJob": {
      const job = mutation.payload;
      await insertRows("jobs", [job]);
      await insertAudit(actor, "Added", "Jobs", `Added ${job.service} job for ${describeRecord(job)}.`);
      break;
    }
    case "addMarketingSource": {
      const source = mutation.payload;
      await insertRows("marketing", [source]);
      await insertAudit(actor, "Added", "Marketing", `Added marketing source ${describeRecord(source)}.`);
      break;
    }
    case "addNote": {
      const note = mutation.payload;
      await insertRows("notes", [note]);
      await insertAudit(actor, "Added", "Crew Notes", `Added crew note: ${describeRecord(note)}.`);
      break;
    }
    case "deleteItem": {
      const { collection, id, label } = mutation.payload;
      await deleteRow(collection, id);
      await insertAudit(
        actor,
        "Deleted",
        collectionLabels[collection] || collection,
        `Deleted ${collectionLabels[collection] || "record"} ${label || id}.`,
      );
      break;
    }
    case "resetDemoData": {
      await resetDemoData(actor);
      break;
    }
    case "updateEquipmentStatus": {
      const { id, item, status } = mutation.payload;
      await updateRow("equipment", id, { status });
      await insertAudit(actor, "Updated", "Equipment", `Changed ${item || id} status to ${status}.`);
      break;
    }
    case "updateJob": {
      const { changes, id, label } = mutation.payload;
      await updateRow("jobs", id, changes);
      await insertAudit(
        actor,
        "Updated",
        "Jobs",
        `Changed ${label || id} ${changes.status ? `status to ${changes.status}` : "job details"}.`,
      );
      break;
    }
    case "updateMarketing": {
      const { changes, id, label } = mutation.payload;
      await updateRow("marketing", id, changes);
      await insertAudit(actor, "Updated", "Marketing", `Updated marketing source ${label || id}.`);
      break;
    }
    default:
      throw new Error(`Unknown dashboard mutation: ${mutation.type}`);
  }

  return readDashboardData();
}
