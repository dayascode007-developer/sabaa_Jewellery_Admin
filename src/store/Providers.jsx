"use client";

import { useRef } from "react";
import { Provider } from "react-redux";
import { makeStore } from "@/store/store";

// Client boundary for Redux. The root layout is a Server Component and cannot
// hold the store, so it renders this instead.
export default function Providers({ children }) {
  const storeRef = useRef(null);

  // Created once per client, not on every render.
  if (!storeRef.current) {
    storeRef.current = makeStore();
  }

  return <Provider store={storeRef.current}>{children}</Provider>;
}
