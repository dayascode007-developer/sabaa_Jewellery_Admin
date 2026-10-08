"use client";

import { useEffect, useMemo, useState } from "react";
import { MdCheckCircle, MdClose, MdOutlineCameraAlt } from "react-icons/md";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

/**
 * Which AR try-on model a product is previewed as.
 *
 * The list is the try-on viewer's own catalogue, fetched from the backend
 * rather than written out here: the viewer gains models most weeks, and a copy
 * of the list in the admin panel would be out of date the first time one was
 * added. It is also why nothing is hardcoded about how many there are.
 *
 * Most products have no try-on, so the whole thing starts closed and says so.
 *
 * @param {string|null} value   the chosen model's id, or null for none
 * @param {Function} onChange   called with the new id, or "" for none
 */
export default function TryOnPicker({ value, onChange }) {
  const [catalogue, setCatalogue] = useState(null);
  const [error, setError] = useState(null);
  const [mode, setMode] = useState(null);
  const [group, setGroup] = useState("");

  useEffect(() => {
    let live = true;
    fetch(`${API_URL}/api/ar/models`)
      .then((response) => response.json())
      .then((body) => {
        if (!live) return;
        if (!body?.success) throw new Error(body?.message || "Could not load the try-on models");
        setCatalogue(body.data);
      })
      .catch((e) => live && setError(e.message));
    return () => {
      live = false;
    };
  }, []);

  // What is already chosen, found across every mode. Doing this by search
  // rather than by remembering means an edited product opens showing its own
  // model without the form having to store the mode as well as the id.
  const chosen = useMemo(() => {
    if (!value || !catalogue) return null;
    for (const entry of catalogue) {
      const model = entry.models.find((m) => m.id === value);
      if (model) return model;
    }
    return null;
  }, [value, catalogue]);

  // Open on the chosen model's own mode, so editing a product lands where its
  // piece is rather than on the first tab.
  useEffect(() => {
    if (chosen && mode === null) {
      setMode(chosen.mode);
      setGroup(chosen.group ?? "");
    }
  }, [chosen, mode]);

  const current = catalogue?.find((entry) => entry.mode === mode) ?? null;
  const models = current
    ? current.models.filter((model) => !group || (model.group && model.group.startsWith(group)))
    : [];

  if (error) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
        Try-on models could not be loaded: {error}
        <div className="mt-1 text-red-600">
          The product can still be saved; it will simply have no try-on.
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-gray-200 p-4">
      <div className="mb-3 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <MdOutlineCameraAlt size={20} className="text-gray-500" />
          <h3 className="text-lg font-semibold text-gray-900">AR Try-On</h3>
        </div>
        {chosen && (
          <button
            type="button"
            onClick={() => {
              onChange("");
              setMode(null);
              setGroup("");
            }}
            className="flex items-center gap-1 rounded-full px-3 py-1 text-sm text-gray-600 hover:bg-gray-100 cursor-pointer"
          >
            <MdClose size={16} />
            Remove
          </button>
        )}
      </div>

      {/* What the customer will get, stated plainly, since this is the whole
          point of the section and an admin should not have to infer it from
          which row is highlighted. */}
      <p className="mb-4 text-sm text-gray-600">
        {chosen ? (
          <span className="inline-flex items-center gap-1.5 text-gray-900">
            <MdCheckCircle size={16} style={{ color: "var(--primary)" }} />
            Customers can try this on as <strong>{chosen.name}</strong> ({chosen.mode})
          </span>
        ) : (
          "No try-on. Pick a model below to let customers see this piece on their camera."
        )}
      </p>

      {!catalogue && <p className="text-sm text-gray-500">Loading models…</p>}

      {catalogue && (
        <>
          <div className="mb-3 flex flex-wrap gap-2">
            {catalogue.map((entry) => (
              <button
                key={entry.mode}
                type="button"
                onClick={() => {
                  setMode(entry.mode);
                  setGroup("");
                }}
                style={mode === entry.mode ? { backgroundColor: "var(--primary)" } : undefined}
                className={`rounded-full border px-4 py-1.5 text-sm font-medium cursor-pointer transition-colors ${
                  mode === entry.mode
                    ? "border-transparent text-white"
                    : "border-gray-300 text-gray-700 hover:bg-gray-50"
                }`}
              >
                {entry.label}
                <span className="ml-1.5 opacity-70">{entry.models.length}</span>
              </button>
            ))}
          </div>

          {current && current.groups.length > 1 && (
            <div className="mb-3">
              <label className="mb-1 block text-sm font-medium text-gray-900">
                {current.groupLabel}
              </label>
              {/* text-black on the select and on every option: the select
                  inherited its colour from the surrounding card, and the
                  options are drawn by the OS, which does not inherit it at all. */}
              <select
                value={group}
                onChange={(e) => setGroup(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-black"
              >
                <option className="text-black" value="">
                  All
                </option>
                {current.groups.map((option) => (
                  <option className="text-black" key={option.id} value={option.id}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          )}

          {current && (
            <div className="grid max-h-72 grid-cols-3 gap-2 overflow-y-auto sm:grid-cols-4 md:grid-cols-6">
              {models.map((model) => {
                const picked = model.id === value;
                return (
                  <button
                    key={model.id}
                    type="button"
                    title={`${model.name} — ${model.tags.shape}, ${model.tags.weight}, ${model.tags.metal}`}
                    onClick={() => onChange(model.id)}
                    style={picked ? { borderColor: "var(--primary)" } : undefined}
                    className={`flex flex-col items-center gap-1 rounded-lg border-2 p-2 cursor-pointer transition-colors ${
                      picked ? "bg-amber-50" : "border-gray-200 hover:bg-gray-50"
                    }`}
                  >
                    {/* Chains, jimiki and photographed ring faces have a
                        picture; the rest are built in code and have none, so
                        those show their name alone rather than a broken box. */}
                    {model.preview ? (
                      <img
                        src={`${API_URL}${model.preview}`}
                        alt=""
                        className="h-14 w-full object-contain"
                      />
                    ) : (
                      <span className="flex h-14 w-full items-center justify-center text-xs text-gray-400">
                        no image
                      </span>
                    )}
                    <span className="w-full truncate text-center text-xs font-medium text-gray-800">
                      {model.name}
                    </span>
                  </button>
                );
              })}
              {models.length === 0 && (
                <p className="col-span-full py-4 text-center text-sm text-gray-500">
                  No models in this group yet.
                </p>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}
