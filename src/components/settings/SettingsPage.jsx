"use client";

import { useCallback, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { MdOutlineStorefront } from "react-icons/md";
import {
  FiMail,
  FiPhone,
  FiMapPin,
  FiAlertCircle,
} from "react-icons/fi";
import { fetchSettings } from "@/store/slices/settingsSlice";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

// Shown until the API answers, and as the fallback if a field comes back empty.
const DEFAULTS = {
  storeName: "",
  storeEmail: "",
  contactNumber: "",
  officeNumber: "",
  address: "",
  notificationsEnabled: true,
  notifications: {
    newOrder: true,
    orderShipped: true,
    newCustomer: true,
    paymentReceived: true,
    lowStock: true,
    customerReview: true,
    criticalStock: true,
    deliveryDelay: true,
  },
};

// The API stores only the toggles that were saved, so missing keys fall back to
// the defaults rather than rendering as "off".
const normalize = (data) => ({
  storeName: data?.storeName ?? "",
  storeEmail: data?.storeEmail ?? "",
  contactNumber: data?.contactNumber ?? "",
  officeNumber: data?.officeNumber ?? "",
  address: data?.address ?? "",
  notificationsEnabled: data?.notificationsEnabled ?? true,
  notifications: { ...DEFAULTS.notifications, ...(data?.notifications || {}) },
});

function SectionCard({ title, subtitle, children }) {
  return (
    <section className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm sm:p-7">
      {/* Serif headings, as in the reference. Playfair Display is already
          loaded by globals.css. */}
      <h2 className="font-['Playfair_Display'] text-[22px] font-semibold text-gray-900">
        {title}
      </h2>
      <p className="mt-1 text-sm text-gray-500">{subtitle}</p>
      <div className="mt-6">{children}</div>
    </section>
  );
}

function Field({ label, icon: Icon, id, children }) {
  return (
    <div>
      <label htmlFor={id} className="mb-2 block text-sm font-medium text-gray-700">
        {label}
      </label>
      <div className="relative">
        <Icon
          aria-hidden="true"
          className="pointer-events-none absolute top-3.5 left-4 h-[18px] w-[18px] text-gray-400"
        />
        {children}
      </div>
    </div>
  );
}

const INPUT =
  "w-full rounded-lg border border-gray-200 bg-white py-3 pr-4 pl-11 text-sm text-gray-900 outline-none transition-colors placeholder:text-gray-400 focus:border-[#430121] focus:ring-2 focus:ring-[#430121]/10 disabled:bg-gray-50 disabled:text-gray-400";

function Toggle({ checked, onChange, label, disabled }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-7 w-12 shrink-0 cursor-pointer items-center rounded-full transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/40 disabled:cursor-not-allowed disabled:opacity-60 ${
        checked ? "bg-emerald-500" : "bg-gray-300"
      }`}
    >
      <span
        aria-hidden="true"
        className={`inline-block h-5 w-5 rounded-full bg-white shadow transition-transform ${
          checked ? "translate-x-6" : "translate-x-1"
        }`}
      />
    </button>
  );
}

export default function SettingsPage() {
  const dispatch = useDispatch();
  const [saved, setSaved] = useState(DEFAULTS);
  const [form, setForm] = useState(DEFAULTS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState(null); // { type: "success" | "error", text }

  const dirty = JSON.stringify(form) !== JSON.stringify(saved);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("adminToken");
      const response = await fetch(`${API_URL}/api/admin/settings`, {
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      });
      const body = await response.json();
      if (!response.ok) throw new Error(body?.message || "Failed to load settings");

      const data = normalize(body.data);
      setSaved(data);
      setForm(data);
      setNotice(null);
    } catch (error) {
      setNotice({ type: "error", text: error.message || "Failed to load settings" });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  // Success messages clear themselves; errors stay until the next action.
  useEffect(() => {
    if (notice?.type !== "success") return;
    const t = setTimeout(() => setNotice(null), 3000);
    return () => clearTimeout(t);
  }, [notice]);

  const setField = (key) => (e) => {
    let value = e.target.value;

    if (key === "storeName") {
      value = value.replace(/\b\w/g, (char) => char.toUpperCase());
    } else if (key === "storeEmail") {
      value = value.toLowerCase();
    } else if (key === "contactNumber" || key === "officeNumber") {
      value = value.replace(/\D/g, "").slice(0, 10);
    }

    setForm((f) => ({ ...f, [key]: value }));
  };

  const handleCancel = () => {
    setForm(saved);
    setNotice(null);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const token = localStorage.getItem("adminToken");

      const response = await fetch(`${API_URL}/api/admin/settings`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(form),
      });
      const body = await response.json();
      if (!response.ok) throw new Error(body?.message || "Failed to save settings");

      const data = normalize(body.data);
      setSaved(data);
      setForm(data);


      setNotice({ type: "success", text: "Settings saved. The storefront footer is updated." });
    } catch (error) {
      setNotice({ type: "error", text: error.message || "Failed to save settings" });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-6xl space-y-6">
      {/* Actions, top right as in the reference. */}
      <div className="flex flex-wrap items-center justify-end gap-3">
        {notice ? (
          <p
            role="status"
            className={`mr-auto text-sm ${
              notice.type === "error" ? "text-red-600" : "text-emerald-700"
            }`}
          >
            {notice.text}
          </p>
        ) : null}
        <button
          type="button"
          onClick={handleCancel}
          disabled={!dirty || saving || loading}
          className="rounded-lg border border-gray-200 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={handleSave}
          disabled={!dirty || saving || loading}
          className="rounded-lg bg-[#430121] px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#2D000F] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>

      <SectionCard title="General Information" subtitle="Manage your store information and basic settings.">
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <Field label="Store Name" icon={MdOutlineStorefront} id="storeName">
            <input id="storeName" type="text" value={form.storeName} onChange={setField("storeName")} disabled={loading} className={INPUT} />
          </Field>

          <Field label="Store Email" icon={FiMail} id="storeEmail">
            <input id="storeEmail" type="email" value={form.storeEmail} onChange={setField("storeEmail")} disabled={loading} className={INPUT} />
          </Field>

          <Field label="Contact Number" icon={FiPhone} id="contactNumber">
            <input id="contactNumber" type="tel" value={form.contactNumber} onChange={setField("contactNumber")} disabled={loading} className={INPUT} />
          </Field>

          <Field label="Office Number" icon={FiPhone} id="officeNumber">
            <input id="officeNumber" type="tel" value={form.officeNumber} onChange={setField("officeNumber")} disabled={loading} className={INPUT} />
          </Field>

          <div className="md:col-span-2">
            <Field label="Head office Address" icon={FiMapPin} id="address">
              <textarea
                id="address"
                rows={4}
                value={form.address}
                onChange={setField("address")}
                disabled={loading}
                className={`${INPUT} resize-none`}
              />
            </Field>
          </div>
        </div>
        <p className="mt-4 text-xs text-gray-500">
          These details also appear in the storefront footer.
        </p>
      </SectionCard>

      <SectionCard title="Notification Preferences" subtitle="Enable or disable all notifications.">
        <div className="flex items-center gap-4">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-gray-200 text-gray-700">
            <FiAlertCircle aria-hidden="true" className="h-5 w-5" />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-sm font-semibold text-gray-900">Enable Notifications</span>
            <span className="mt-0.5 block text-xs text-gray-500">Receive all notifications</span>
          </span>
          <Toggle
            checked={form.notificationsEnabled}
            onChange={async (newState) => {
              setForm((f) => ({ ...f, notificationsEnabled: newState }));
              setSaving(true);
              try {
                const token = localStorage.getItem("adminToken");
                const response = await fetch(`${API_URL}/api/admin/notifications/settings`, {
                  method: "PUT",
                  headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                  body: JSON.stringify({ notificationsEnabled: newState }),
                });
                const body = await response.json();
                if (!response.ok) throw new Error(body?.message || "Failed to save");

                dispatch(fetchSettings());
                setNotice({ type: "success", text: "Notification settings updated" });
              } catch (error) {
                setForm((f) => ({ ...f, notificationsEnabled: !newState }));
                setNotice({ type: "error", text: error.message || "Failed to update notifications" });
              } finally {
                setSaving(false);
              }
            }}
            label="Enable Notifications"
            disabled={loading || saving}
          />
        </div>
      </SectionCard>

    </div>
  );
}
