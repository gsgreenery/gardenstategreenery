"use client";

import { createContext, useContext, useEffect, useMemo, useSyncExternalStore } from "react";
import { initialDashboardData } from "./dashboardSeed";

const STORAGE_KEY = "gsg-dashboard-data-v2";
const STORAGE_EVENT = "gsg-dashboard-data-change";
const AUDIT_LIMIT = 250;
const fallbackSnapshot = JSON.stringify(initialDashboardData);

function getServerSnapshot() {
  return fallbackSnapshot;
}

function getSnapshot() {
  if (typeof window === "undefined") {
    return fallbackSnapshot;
  }

  return window.localStorage.getItem(STORAGE_KEY) || fallbackSnapshot;
}

function subscribe(callback) {
  window.addEventListener("storage", callback);
  window.addEventListener(STORAGE_EVENT, callback);

  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(STORAGE_EVENT, callback);
  };
}

function parseSnapshot(snapshot) {
  try {
    return {
      ...initialDashboardData,
      ...JSON.parse(snapshot),
    };
  } catch {
    return initialDashboardData;
  }
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

function createAuditEntry(actor, action, target, detail) {
  return {
    action,
    actor: getActorName(actor),
    actorSlug: getActorSlug(actor),
    detail,
    id: makeId("AUD"),
    target,
    time: new Date().toISOString(),
  };
}

function withAuditEntry(data, actor, action, target, detail) {
  return {
    ...data,
    audit: [createAuditEntry(actor, action, target, detail), ...(data.audit || [])].slice(
      0,
      AUDIT_LIMIT,
    ),
  };
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

const collectionLabels = {
  audit: "audit entry",
  blacklist: "blacklist entry",
  customers: "customer",
  equipment: "equipment item",
  expenses: "expense",
  jobs: "job",
  marketing: "marketing source",
  notes: "crew note",
};

function saveData(nextData) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextData));
  window.dispatchEvent(new Event(STORAGE_EVENT));
}

function updateData(actor, updater, audit) {
  const currentData = parseSnapshot(getSnapshot());
  const updatedData = updater(currentData);
  const nextData = audit
    ? withAuditEntry(updatedData, actor, audit.action, audit.target, audit.detail)
    : updatedData;

  saveData(nextData);
}

const DashboardDataContext = createContext(null);

export function DashboardDataProvider({ actor, children }) {
  const snapshot = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const data = useMemo(() => parseSnapshot(snapshot), [snapshot]);

  useEffect(() => {
    if (typeof window === "undefined" || !actor?.slug) {
      return;
    }

    const signInKey = `gsg-dashboard-signed-in-${actor.slug}`;

    if (window.sessionStorage.getItem(signInKey)) {
      return;
    }

    window.sessionStorage.setItem(signInKey, "true");
    updateData(actor, (current) => current, {
      action: "Signed in",
      detail: `${getActorName(actor)} opened the employee dashboard.`,
      target: "Dashboard",
    });
  }, [actor]);

  const totals = useMemo(() => {
    const moneyIn = data.jobs
      .filter((job) => job.status === "Complete")
      .reduce((sum, job) => sum + Number(job.amount || 0), 0);
    const scheduledValue = data.jobs
      .filter((job) => job.status !== "Complete")
      .reduce((sum, job) => sum + Number(job.amount || 0), 0);
    const moneyOut = data.expenses.reduce((sum, expense) => sum + Number(expense.amount || 0), 0);

    return {
      moneyIn,
      moneyOut,
      openJobs: data.jobs.filter((job) => job.status !== "Complete").length,
      scheduledValue,
    };
  }, [data]);

  const actions = useMemo(
    () => ({
      addBlacklistItem(item) {
        const savedItem = { ...item, id: makeId("BLK") };

        updateData(
          actor,
          (current) => ({
            ...current,
            blacklist: [savedItem, ...current.blacklist],
          }),
          {
            action: "Added",
            detail: `Added blacklist entry for ${describeRecord(savedItem)}.`,
            target: "Blacklist",
          },
        );
      },
      addCustomer(customer) {
        const savedCustomer = { ...customer, id: makeId("CUS") };

        updateData(
          actor,
          (current) => ({
            ...current,
            customers: [savedCustomer, ...current.customers],
          }),
          {
            action: "Added",
            detail: `Added customer ${describeRecord(savedCustomer)}.`,
            target: "Customers",
          },
        );
      },
      addEquipment(item) {
        const savedItem = { ...item, id: makeId("EQ") };

        updateData(
          actor,
          (current) => ({
            ...current,
            equipment: [savedItem, ...current.equipment],
          }),
          {
            action: "Added",
            detail: `Added equipment item ${describeRecord(savedItem)}.`,
            target: "Equipment",
          },
        );
      },
      addExpense(expense) {
        const savedExpense = { ...expense, amount: Number(expense.amount || 0), id: makeId("EXP") };

        updateData(
          actor,
          (current) => ({
            ...current,
            expenses: [savedExpense, ...current.expenses],
          }),
          {
            action: "Added",
            detail: `Added ${describeRecord(savedExpense)} expense for ${currency(savedExpense.amount)}.`,
            target: "Expenses",
          },
        );
      },
      addJob(job) {
        const savedJob = { ...job, amount: Number(job.amount || 0), id: makeId("JOB") };

        updateData(
          actor,
          (current) => ({
            ...current,
            jobs: [savedJob, ...current.jobs],
          }),
          {
            action: "Added",
            detail: `Added ${savedJob.service} job for ${describeRecord(savedJob)}.`,
            target: "Jobs",
          },
        );
      },
      addMarketingSource(source) {
        const savedSource = {
          ...source,
          booked: Number(source.booked || 0),
          id: makeId("MKT"),
          leads: Number(source.leads || 0),
          spend: Number(source.spend || 0),
        };

        updateData(
          actor,
          (current) => ({
            ...current,
            marketing: [savedSource, ...current.marketing],
          }),
          {
            action: "Added",
            detail: `Added marketing source ${describeRecord(savedSource)}.`,
            target: "Marketing",
          },
        );
      },
      addNote(text) {
        const savedNote = { id: makeId("NOTE"), text };

        updateData(
          actor,
          (current) => ({
            ...current,
            notes: [savedNote, ...current.notes],
          }),
          {
            action: "Added",
            detail: `Added crew note: ${describeRecord(savedNote)}.`,
            target: "Crew Notes",
          },
        );
      },
      deleteItem(collection, id) {
        updateData(
          actor,
          (current) => {
            const deletedItem = current[collection].find((item) => item.id === id);

            return withAuditEntry(
              {
                ...current,
                [collection]: current[collection].filter((item) => item.id !== id),
              },
              actor,
              "Deleted",
              collectionLabels[collection] || collection,
              `Deleted ${collectionLabels[collection] || "record"} ${describeRecord(deletedItem)}.`,
            );
          },
          null,
        );
      },
      resetDemoData() {
        const currentData = parseSnapshot(getSnapshot());

        saveData(
          withAuditEntry(
            { ...initialDashboardData, audit: currentData.audit || [] },
            actor,
            "Reset",
            "Dashboard",
            "Reset dashboard demo data.",
          ),
        );
      },
      updateEquipmentStatus(id, status) {
        updateData(
          actor,
          (current) => {
            const equipmentItem = current.equipment.find((item) => item.id === id);

            return {
              ...current,
              equipment: current.equipment.map((item) =>
                item.id === id ? { ...item, status } : item,
              ),
              audit: [
                createAuditEntry(
                  actor,
                  "Updated",
                  "Equipment",
                  `Changed ${describeRecord(equipmentItem)} status to ${status}.`,
                ),
                ...(current.audit || []),
              ].slice(0, AUDIT_LIMIT),
            };
          },
          null,
        );
      },
      updateJob(id, changes) {
        updateData(
          actor,
          (current) => {
            const job = current.jobs.find((item) => item.id === id);
            const changeText = changes.status ? `status to ${changes.status}` : "job details";

            return {
              ...current,
              jobs: current.jobs.map((item) => (item.id === id ? { ...item, ...changes } : item)),
              audit: [
                createAuditEntry(
                  actor,
                  "Updated",
                  "Jobs",
                  `Changed ${describeRecord(job)} ${changeText}.`,
                ),
                ...(current.audit || []),
              ].slice(0, AUDIT_LIMIT),
            };
          },
          null,
        );
      },
      updateMarketing(id, changes) {
        updateData(
          actor,
          (current) => {
            const source = current.marketing.find((item) => item.id === id);

            return {
              ...current,
              marketing: current.marketing.map((item) =>
                item.id === id
                  ? {
                      ...item,
                      ...changes,
                      booked: Number(changes.booked ?? item.booked),
                      leads: Number(changes.leads ?? item.leads),
                      spend: Number(changes.spend ?? item.spend),
                    }
                  : item,
              ),
              audit: [
                createAuditEntry(
                  actor,
                  "Updated",
                  "Marketing",
                  `Updated marketing source ${describeRecord(source)}.`,
                ),
                ...(current.audit || []),
              ].slice(0, AUDIT_LIMIT),
            };
          },
          null,
        );
      },
    }),
    [actor],
  );

  const value = useMemo(() => ({ actions, actor, data, totals }), [actions, actor, data, totals]);

  return <DashboardDataContext.Provider value={value}>{children}</DashboardDataContext.Provider>;
}

export function useDashboardData() {
  const context = useContext(DashboardDataContext);

  if (!context) {
    throw new Error("useDashboardData must be used inside DashboardDataProvider");
  }

  return context;
}

export function currency(value) {
  return new Intl.NumberFormat("en-US", {
    currency: "USD",
    maximumFractionDigits: 0,
    style: "currency",
  }).format(Number(value || 0));
}

export function todayDate() {
  return new Date().toISOString().slice(0, 10);
}
