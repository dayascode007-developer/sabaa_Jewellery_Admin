const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const getToken = () => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("adminToken");
};

export const getOrdersApi = async (limit = 10, offset = 0, filters = {}) => {
  const token = getToken();

  if (!token) {
    throw new Error("Authentication required. Please login first.");
  }

  const params = new URLSearchParams({
    limit,
    offset,
  });

  if (filters.status) {
    params.append("status", filters.status);
  }
  if (filters.paymentStatus) {
    params.append("paymentStatus", filters.paymentStatus);
  }
  if (filters.customerId) {
    params.append("customerId", filters.customerId);
  }
  if (filters.from) {
    params.append("from", filters.from);
  }
  if (filters.to) {
    params.append("to", filters.to);
  }
  if (filters.search) {
    params.append("search", filters.search);
  }

  const response = await fetch(`${API_URL}/api/admin/orders?${params.toString()}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to fetch orders");
  }

  const data = await response.json();
  return data;
};

export const getOrderStatsApi = async () => {
  const token = getToken();

  if (!token) {
    throw new Error("Authentication required. Please login first.");
  }

  const response = await fetch(`${API_URL}/api/admin/orders/stats`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to fetch order stats");
  }

  const data = await response.json();
  return data.data;
};

export const getOrderDetailsApi = async (orderId) => {
  const token = getToken();

  if (!token) {
    throw new Error("Authentication required. Please login first.");
  }

  const response = await fetch(`${API_URL}/api/admin/orders/${orderId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to fetch order details");
  }

  const data = await response.json();
  return data.data;
};

export const getOrderOptionsApi = async () => {
  const token = getToken();

  if (!token) {
    throw new Error("Authentication required. Please login first.");
  }

  const response = await fetch(`${API_URL}/api/admin/orders/options`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to fetch order options");
  }

  const data = await response.json();
  return data.data;
};
