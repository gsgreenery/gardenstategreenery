"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { currency, todayDate, useDashboardData } from "./DashboardDataProvider";
import {
  equipmentStatuses,
  expenseCategories,
  serviceOptions,
  statusOptions,
  townOptions,
} from "./dashboardSeed";
import { employeeProfiles } from "./employees";

const emptyJob = {
  amount: "",
  crew: "",
  customer: "",
  date: "",
  notes: "",
  service: "Lawn mowing",
  status: "Scheduled",
  town: "River Edge",
};

const emptyExpense = {
  amount: "",
  category: "Fuel",
  date: "",
  item: "",
};

const emptyCustomer = {
  access: "",
  lastService: "",
  name: "",
  phone: "",
  town: "River Edge",
};

const emptyBlacklistItem = {
  name: "",
  reason: "",
  status: "Do not book",
};

const emptyEquipment = {
  item: "",
  note: "",
  status: "Ready",
};

const emptyMarketing = {
  booked: "",
  leads: "",
  source: "",
  spend: "",
};

function PageHeader({ actions, eyebrow, title, children }) {
  return (
    <header className="ops-page-head">
      <div>
        <p className="ops-kicker">{eyebrow}</p>
        <h1>{title}</h1>
        {children ? <p>{children}</p> : null}
      </div>
      {actions ? <div className="ops-page-actions">{actions}</div> : null}
    </header>
  );
}

function TextField({ label, name, onChange, placeholder, type = "text", value }) {
  return (
    <label className="ops-field">
      {label}
      <input
        name={name}
        onChange={(event) => onChange(name, event.target.value)}
        placeholder={placeholder}
        type={type}
        value={value}
      />
    </label>
  );
}

function SelectField({ label, name, onChange, options, value }) {
  return (
    <label className="ops-field">
      {label}
      <select name={name} onChange={(event) => onChange(name, event.target.value)} value={value}>
        {options.map((option) => (
          <option key={option}>{option}</option>
        ))}
      </select>
    </label>
  );
}

function TextAreaField({ label, name, onChange, placeholder, value }) {
  return (
    <label className="ops-field ops-field-wide">
      {label}
      <textarea
        name={name}
        onChange={(event) => onChange(name, event.target.value)}
        placeholder={placeholder}
        value={value}
      />
    </label>
  );
}

function EmptyState({ children }) {
  return <p className="ops-empty">{children}</p>;
}

function StatusPill({ children }) {
  return <span className="ops-status-pill">{children}</span>;
}

function formatAuditTime(value) {
  if (!value) {
    return "No time";
  }

  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function AuditList({ entries, limit }) {
  const visibleEntries = limit ? entries.slice(0, limit) : entries;

  if (!visibleEntries.length) {
    return <EmptyState>No activity has been logged yet.</EmptyState>;
  }

  return (
    <div className="ops-audit-list">
      {visibleEntries.map((entry) => (
        <article className="ops-audit-row" key={entry.id}>
          <time>{formatAuditTime(entry.time)}</time>
          <div>
            <strong>{entry.actor}</strong>
            <span>{entry.detail}</span>
          </div>
          <StatusPill>{entry.action}</StatusPill>
        </article>
      ))}
    </div>
  );
}

export function OverviewView() {
  const { actions, data, totals } = useDashboardData();
  const upcomingJobs = useMemo(
    () => [...data.jobs].sort((a, b) => a.date.localeCompare(b.date)).slice(0, 5),
    [data.jobs],
  );
  const urgentEquipment = data.equipment.filter((item) => item.status !== "Ready");
  const auditEntries = data.audit || [];

  return (
    <>
      <PageHeader
        actions={
          <button className="ops-secondary-button" type="button" onClick={actions.resetDemoData}>
            Reset demo data
          </button>
        }
        eyebrow="Operations"
        title="Today at a glance"
      >
        Route, money, notes, and loose ends without digging through one giant page.
      </PageHeader>

      <section className="ops-kpi-grid" aria-label="Dashboard summary">
        <article>
          <span>Open jobs</span>
          <strong>{totals.openJobs}</strong>
        </article>
        <article>
          <span>Scheduled value</span>
          <strong>{currency(totals.scheduledValue)}</strong>
        </article>
        <article>
          <span>Money in</span>
          <strong>{currency(totals.moneyIn)}</strong>
        </article>
        <article>
          <span>Money out</span>
          <strong>{currency(totals.moneyOut)}</strong>
        </article>
      </section>

      <section className="ops-page-grid">
        <article className="ops-card ops-card-span">
          <div className="ops-card-head">
            <div>
              <p className="ops-kicker">Schedule</p>
              <h2>Upcoming jobs</h2>
            </div>
            <Link className="ops-text-link" href="/dashboard/schedule">
              View schedule
            </Link>
          </div>
          <div className="ops-table">
            {upcomingJobs.map((job) => (
              <div className="ops-table-row" key={job.id}>
                <span>
                  <strong>{job.date}</strong>
                  {job.customer}
                </span>
                <span>{job.service}</span>
                <span>{job.town}</span>
                <StatusPill>{job.status}</StatusPill>
              </div>
            ))}
          </div>
        </article>

        <article className="ops-card">
          <div className="ops-card-head">
            <div>
              <p className="ops-kicker">Crew notes</p>
              <h2>Latest notes</h2>
            </div>
            <Link className="ops-text-link" href="/dashboard/notes">
              Add note
            </Link>
          </div>
          <div className="ops-note-stack">
            {data.notes.slice(0, 4).map((note) => (
              <p key={note.id}>{note.text}</p>
            ))}
          </div>
        </article>

        <article className="ops-card">
          <div className="ops-card-head">
            <div>
              <p className="ops-kicker">Equipment</p>
              <h2>Needs attention</h2>
            </div>
            <Link className="ops-text-link" href="/dashboard/equipment">
              Truck check
            </Link>
          </div>
          <div className="ops-compact-list">
            {urgentEquipment.length ? (
              urgentEquipment.map((item) => (
                <p key={item.id}>
                  <span>{item.item}</span>
                  <StatusPill>{item.status}</StatusPill>
                </p>
              ))
            ) : (
              <EmptyState>Everything is marked ready.</EmptyState>
            )}
          </div>
        </article>

        <article className="ops-card ops-card-span">
          <div className="ops-card-head">
            <div>
              <p className="ops-kicker">Sections</p>
              <h2>Quick jumps</h2>
            </div>
          </div>
          <div className="ops-module-grid">
            {[
              ["Jobs", "/dashboard/jobs"],
              ["Expenses", "/dashboard/expenses"],
              ["Customers", "/dashboard/customers"],
              ["Blacklist", "/dashboard/blacklist"],
              ["Marketing", "/dashboard/marketing"],
              ["Employees", "/dashboard/employees"],
              ["Audit Log", "/dashboard/audit"],
            ].map(([label, href]) => (
              <Link href={href} key={href}>
                {label}
              </Link>
            ))}
          </div>
        </article>

        <article className="ops-card ops-card-span">
          <div className="ops-card-head">
            <div>
              <p className="ops-kicker">Activity</p>
              <h2>Recent changes</h2>
            </div>
            <Link className="ops-text-link" href="/dashboard/audit">
              Audit log
            </Link>
          </div>
          <AuditList entries={auditEntries} limit={4} />
        </article>
      </section>
    </>
  );
}

export function JobsView() {
  const { actions, data } = useDashboardData();
  const [form, setForm] = useState({ ...emptyJob, date: todayDate() });

  function updateForm(name, value) {
    setForm((current) => ({ ...current, [name]: value }));
  }

  function submitJob(event) {
    event.preventDefault();

    if (!form.customer || !form.date || !form.amount) {
      return;
    }

    actions.addJob(form);
    setForm({ ...emptyJob, date: todayDate() });
  }

  return (
    <>
      <PageHeader eyebrow="Job log" title="Jobs">
        Add work, assign a crew, update the status, and keep the price tied to the job.
      </PageHeader>

      <section className="ops-page-grid">
        <article className="ops-card ops-card-span">
          <div className="ops-card-head">
            <div>
              <p className="ops-kicker">New job</p>
              <h2>Log work</h2>
            </div>
          </div>
          <form className="ops-form" onSubmit={submitJob}>
            <TextField label="Customer" name="customer" onChange={updateForm} placeholder="Name or address" value={form.customer} />
            <SelectField label="Town" name="town" onChange={updateForm} options={townOptions} value={form.town} />
            <SelectField label="Service" name="service" onChange={updateForm} options={serviceOptions} value={form.service} />
            <TextField label="Date" name="date" onChange={updateForm} type="date" value={form.date} />
            <TextField label="Crew" name="crew" onChange={updateForm} placeholder="Who is going?" value={form.crew} />
            <SelectField label="Status" name="status" onChange={updateForm} options={statusOptions} value={form.status} />
            <TextField label="Price" name="amount" onChange={updateForm} placeholder="0" type="number" value={form.amount} />
            <TextAreaField label="Notes" name="notes" onChange={updateForm} placeholder="Access, photos, special requests..." value={form.notes} />
            <button className="ops-primary-button" type="submit">
              Save job
            </button>
          </form>
        </article>

        <article className="ops-card ops-card-span">
          <div className="ops-card-head">
            <div>
              <p className="ops-kicker">Active log</p>
              <h2>{data.jobs.length} jobs</h2>
            </div>
          </div>
          <div className="ops-table">
            {data.jobs.map((job) => (
              <div className="ops-table-row ops-table-row-actions" key={job.id}>
                <span>
                  <strong>{job.customer}</strong>
                  {job.date} / {job.town}
                </span>
                <span>{job.service}</span>
                <span>{currency(job.amount)}</span>
                <select
                  aria-label={`Status for ${job.customer}`}
                  value={job.status}
                  onChange={(event) => actions.updateJob(job.id, { status: event.target.value })}
                >
                  {statusOptions.map((status) => (
                    <option key={status}>{status}</option>
                  ))}
                </select>
                <button type="button" onClick={() => actions.deleteItem("jobs", job.id)}>
                  Delete
                </button>
              </div>
            ))}
          </div>
        </article>
      </section>
    </>
  );
}

export function ExpensesView() {
  const { actions, data, totals } = useDashboardData();
  const [form, setForm] = useState({ ...emptyExpense, date: todayDate() });

  function updateForm(name, value) {
    setForm((current) => ({ ...current, [name]: value }));
  }

  function submitExpense(event) {
    event.preventDefault();

    if (!form.item || !form.amount) {
      return;
    }

    actions.addExpense(form);
    setForm({ ...emptyExpense, date: todayDate() });
  }

  return (
    <>
      <PageHeader eyebrow="Money out" title="Expenses">
        Log fuel, material, repair, and marketing spend so the route numbers stay honest.
      </PageHeader>

      <section className="ops-page-grid">
        <article className="ops-card">
          <div className="ops-card-head">
            <div>
              <p className="ops-kicker">Total spent</p>
              <h2>{currency(totals.moneyOut)}</h2>
            </div>
          </div>
          <form className="ops-form ops-form-single" onSubmit={submitExpense}>
            <TextField label="Item" name="item" onChange={updateForm} placeholder="Fuel, mulch, repair..." value={form.item} />
            <SelectField label="Category" name="category" onChange={updateForm} options={expenseCategories} value={form.category} />
            <TextField label="Date" name="date" onChange={updateForm} type="date" value={form.date} />
            <TextField label="Amount" name="amount" onChange={updateForm} placeholder="0" type="number" value={form.amount} />
            <button className="ops-primary-button" type="submit">
              Add expense
            </button>
          </form>
        </article>

        <article className="ops-card ops-card-span">
          <div className="ops-card-head">
            <div>
              <p className="ops-kicker">History</p>
              <h2>Expense log</h2>
            </div>
          </div>
          <div className="ops-table">
            {data.expenses.map((expense) => (
              <div className="ops-table-row ops-table-row-actions" key={expense.id}>
                <span>
                  <strong>{expense.item}</strong>
                  {expense.date}
                </span>
                <span>{expense.category}</span>
                <span>{currency(expense.amount)}</span>
                <button type="button" onClick={() => actions.deleteItem("expenses", expense.id)}>
                  Delete
                </button>
              </div>
            ))}
          </div>
        </article>
      </section>
    </>
  );
}

export function ScheduleView() {
  const { actions, data } = useDashboardData();
  const scheduledJobs = useMemo(
    () => [...data.jobs].sort((a, b) => a.date.localeCompare(b.date)),
    [data.jobs],
  );

  return (
    <>
      <PageHeader eyebrow="Calendar" title="Schedule">
        Route order, dates, crews, and quick status updates.
      </PageHeader>

      <section className="ops-card">
        <div className="ops-schedule-list">
          {scheduledJobs.map((job) => (
            <article className="ops-schedule-item" key={job.id}>
              <time>{job.date}</time>
              <div>
                <strong>{job.customer}</strong>
                <p>
                  {job.service} in {job.town}
                </p>
                <small>{job.crew || "Crew not assigned"}</small>
              </div>
              <select
                aria-label={`Status for ${job.customer}`}
                value={job.status}
                onChange={(event) => actions.updateJob(job.id, { status: event.target.value })}
              >
                {statusOptions.map((status) => (
                  <option key={status}>{status}</option>
                ))}
              </select>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}

export function CustomersView() {
  const { actions, data } = useDashboardData();
  const [form, setForm] = useState(emptyCustomer);

  function updateForm(name, value) {
    setForm((current) => ({ ...current, [name]: value }));
  }

  function submitCustomer(event) {
    event.preventDefault();

    if (!form.name) {
      return;
    }

    actions.addCustomer(form);
    setForm(emptyCustomer);
  }

  return (
    <>
      <PageHeader eyebrow="Customer info" title="Customers">
        Keep phone numbers, access notes, town, and last service together.
      </PageHeader>

      <section className="ops-page-grid">
        <article className="ops-card">
          <div className="ops-card-head">
            <div>
              <p className="ops-kicker">New customer</p>
              <h2>Add info</h2>
            </div>
          </div>
          <form className="ops-form ops-form-single" onSubmit={submitCustomer}>
            <TextField label="Name" name="name" onChange={updateForm} placeholder="Customer or address" value={form.name} />
            <TextField label="Phone" name="phone" onChange={updateForm} placeholder="551..." value={form.phone} />
            <SelectField label="Town" name="town" onChange={updateForm} options={townOptions} value={form.town} />
            <TextField label="Last service" name="lastService" onChange={updateForm} placeholder="Mowing, mulch..." value={form.lastService} />
            <TextAreaField label="Access notes" name="access" onChange={updateForm} placeholder="Gate, dog, parking, preferences..." value={form.access} />
            <button className="ops-primary-button" type="submit">
              Save customer
            </button>
          </form>
        </article>

        <article className="ops-card ops-card-span">
          <div className="ops-card-head">
            <div>
              <p className="ops-kicker">Directory</p>
              <h2>{data.customers.length} customers</h2>
            </div>
          </div>
          <div className="ops-record-grid">
            {data.customers.map((customer) => (
              <section className="ops-record-card" key={customer.id}>
                <strong>{customer.name}</strong>
                <span>{customer.town} / {customer.phone || "No phone"}</span>
                <p>{customer.lastService || "No service logged yet"}</p>
                <small>{customer.access || "No access notes"}</small>
                <button type="button" onClick={() => actions.deleteItem("customers", customer.id)}>
                  Delete
                </button>
              </section>
            ))}
          </div>
        </article>
      </section>
    </>
  );
}

export function BlacklistView() {
  const { actions, data } = useDashboardData();
  const [form, setForm] = useState(emptyBlacklistItem);

  function updateForm(name, value) {
    setForm((current) => ({ ...current, [name]: value }));
  }

  function submitItem(event) {
    event.preventDefault();

    if (!form.name || !form.reason) {
      return;
    }

    actions.addBlacklistItem(form);
    setForm(emptyBlacklistItem);
  }

  return (
    <>
      <PageHeader eyebrow="Blacklist" title="Do not book">
        Addresses, leads, or customers that need deposits, review, or no service.
      </PageHeader>

      <section className="ops-page-grid">
        <article className="ops-card">
          <div className="ops-card-head">
            <div>
              <p className="ops-kicker">New entry</p>
              <h2>Add warning</h2>
            </div>
          </div>
          <form className="ops-form ops-form-single" onSubmit={submitItem}>
            <TextField label="Name/address" name="name" onChange={updateForm} placeholder="Lead or address" value={form.name} />
            <TextField label="Reason" name="reason" onChange={updateForm} placeholder="Why it is flagged" value={form.reason} />
            <TextField label="Status" name="status" onChange={updateForm} placeholder="Do not book" value={form.status} />
            <button className="ops-primary-button" type="submit">
              Save warning
            </button>
          </form>
        </article>

        <article className="ops-card ops-card-span">
          <div className="ops-warning-list">
            {data.blacklist.map((item) => (
              <section className="ops-warning-card" key={item.id}>
                <strong>{item.name}</strong>
                <span>{item.reason}</span>
                <StatusPill>{item.status}</StatusPill>
                <button type="button" onClick={() => actions.deleteItem("blacklist", item.id)}>
                  Delete
                </button>
              </section>
            ))}
          </div>
        </article>
      </section>
    </>
  );
}

export function NotesView() {
  const { actions, data } = useDashboardData();
  const [text, setText] = useState("");

  function submitNote(event) {
    event.preventDefault();

    if (!text.trim()) {
      return;
    }

    actions.addNote(text.trim());
    setText("");
  }

  return (
    <>
      <PageHeader eyebrow="Crew notes" title="Notes">
        Quick details that keep jobs from getting messy.
      </PageHeader>

      <section className="ops-page-grid">
        <article className="ops-card">
          <form className="ops-note-form" onSubmit={submitNote}>
            <textarea
              onChange={(event) => setText(event.target.value)}
              placeholder="Gate code, customer preference, problem area..."
              value={text}
            />
            <button className="ops-primary-button" type="submit">
              Add note
            </button>
          </form>
        </article>
        <article className="ops-card ops-card-span">
          <div className="ops-note-stack">
            {data.notes.map((note) => (
              <p key={note.id}>
                {note.text}
                <button type="button" onClick={() => actions.deleteItem("notes", note.id)}>
                  Delete
                </button>
              </p>
            ))}
          </div>
        </article>
      </section>
    </>
  );
}

export function EquipmentView() {
  const { actions, data } = useDashboardData();
  const [form, setForm] = useState(emptyEquipment);

  function updateForm(name, value) {
    setForm((current) => ({ ...current, [name]: value }));
  }

  function submitEquipment(event) {
    event.preventDefault();

    if (!form.item) {
      return;
    }

    actions.addEquipment(form);
    setForm(emptyEquipment);
  }

  return (
    <>
      <PageHeader eyebrow="Equipment" title="Truck check">
        Track what is ready, what needs repair, and what should go in the truck.
      </PageHeader>

      <section className="ops-page-grid">
        <article className="ops-card">
          <form className="ops-form ops-form-single" onSubmit={submitEquipment}>
            <TextField label="Item" name="item" onChange={updateForm} placeholder="Mower, blower..." value={form.item} />
            <SelectField label="Status" name="status" onChange={updateForm} options={equipmentStatuses} value={form.status} />
            <TextField label="Note" name="note" onChange={updateForm} placeholder="Blade, battery, repair..." value={form.note} />
            <button className="ops-primary-button" type="submit">
              Add item
            </button>
          </form>
        </article>
        <article className="ops-card ops-card-span">
          <div className="ops-equipment-list">
            {data.equipment.map((item) => (
              <label key={item.id}>
                <span>
                  <strong>{item.item}</strong>
                  <small>{item.note || "No note"}</small>
                </span>
                <select
                  value={item.status}
                  onChange={(event) => actions.updateEquipmentStatus(item.id, event.target.value)}
                >
                  {equipmentStatuses.map((status) => (
                    <option key={status}>{status}</option>
                  ))}
                </select>
                <button type="button" onClick={() => actions.deleteItem("equipment", item.id)}>
                  Delete
                </button>
              </label>
            ))}
          </div>
        </article>
      </section>
    </>
  );
}

export function MarketingView() {
  const { actions, data } = useDashboardData();
  const [form, setForm] = useState(emptyMarketing);

  function updateForm(name, value) {
    setForm((current) => ({ ...current, [name]: value }));
  }

  function submitSource(event) {
    event.preventDefault();

    if (!form.source) {
      return;
    }

    actions.addMarketingSource(form);
    setForm(emptyMarketing);
  }

  return (
    <>
      <PageHeader eyebrow="Marketing" title="Lead tracking">
        See where leads come from and whether they turn into booked work.
      </PageHeader>

      <section className="ops-page-grid">
        <article className="ops-card">
          <form className="ops-form ops-form-single" onSubmit={submitSource}>
            <TextField label="Source" name="source" onChange={updateForm} placeholder="Flyers, Instagram..." value={form.source} />
            <TextField label="Leads" name="leads" onChange={updateForm} placeholder="0" type="number" value={form.leads} />
            <TextField label="Booked" name="booked" onChange={updateForm} placeholder="0" type="number" value={form.booked} />
            <TextField label="Spend" name="spend" onChange={updateForm} placeholder="0" type="number" value={form.spend} />
            <button className="ops-primary-button" type="submit">
              Add source
            </button>
          </form>
        </article>
        <article className="ops-card ops-card-span">
          <div className="ops-record-grid">
            {data.marketing.map((source) => {
              const closeRate = source.leads ? Math.round((source.booked / source.leads) * 100) : 0;

              return (
                <section className="ops-record-card" key={source.id}>
                  <strong>{source.source}</strong>
                  <span>{source.leads} leads / {source.booked} booked</span>
                  <p>{closeRate}% close rate</p>
                  <small>{currency(source.spend)} spend</small>
                  <button type="button" onClick={() => actions.deleteItem("marketing", source.id)}>
                    Delete
                  </button>
                </section>
              );
            })}
          </div>
        </article>
      </section>
    </>
  );
}

export function AuditLogView() {
  const { actor, data } = useDashboardData();
  const auditEntries = data.audit || [];

  return (
    <>
      <PageHeader eyebrow="Audit log" title="Activity">
        Local record of who added, deleted, updated, or signed into the dashboard.
      </PageHeader>

      <section className="ops-page-grid">
        <article className="ops-card">
          <div className="ops-card-head">
            <div>
              <p className="ops-kicker">Current user</p>
              <h2>{actor?.name || "Unknown"}</h2>
            </div>
          </div>
          <div className="ops-compact-list">
            <p>
              <span>Audit storage</span>
              <StatusPill>Local</StatusPill>
            </p>
            <p>
              <span>Entries kept</span>
              <StatusPill>{auditEntries.length}</StatusPill>
            </p>
          </div>
        </article>

        <article className="ops-card ops-card-span">
          <div className="ops-card-head">
            <div>
              <p className="ops-kicker">History</p>
              <h2>Latest activity</h2>
            </div>
          </div>
          <AuditList entries={auditEntries} />
        </article>
      </section>
    </>
  );
}

export function EmployeesView() {
  const { actor } = useDashboardData();

  return (
    <>
      <PageHeader eyebrow="Employees" title="Team">
        People with dashboard access and the role they cover.
      </PageHeader>

      <section className="ops-card">
        <div className="ops-employee-grid">
          {employeeProfiles.map((employee) => (
            <article
              className={`ops-employee-card ${
                actor?.slug === employee.slug ? "is-current" : ""
              }`}
              key={employee.slug}
            >
              <span className="ops-employee-initial">{employee.name.slice(0, 1)}</span>
              <div>
                <strong>{employee.name}</strong>
                <small>{employee.title}</small>
              </div>
              {actor?.slug === employee.slug ? <StatusPill>Signed in</StatusPill> : null}
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
