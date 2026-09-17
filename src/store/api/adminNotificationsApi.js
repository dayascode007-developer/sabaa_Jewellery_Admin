const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://192.168.29.163:5000";

const getToken = () => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("adminToken");
};

export const getNotificationsApi = async (page = 1, limit = 20, filters = {}) => {
  const token = getToken();

  if (!token) {
    throw new Error("Authentication required. Please login first.");
  }

  const params = new URLSearchParams({
    page,
    limit,
  });

  if (filters.unread !== undefined) {
    params.append("unread", filters.unread);
  }
  if (filters.type) {
    params.append("type", filters.type);
  }

  const response = await fetch(`${API_URL}/api/admin/notifications?${params.toString()}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to fetch notifications");
  }

  const data = await response.json();
  return data.data;
};

export const getUnreadCountApi = async () => {
  const token = getToken();

  if (!token) {
    throw new Error("Authentication required. Please login first.");
  }

  const response = await fetch(`${API_URL}/api/admin/notifications/unread/count`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to fetch unread count");
  }

  const data = await response.json();
  return data.data;
};

export const markAsReadApi = async (notificationId) => {
  const token = getToken();

  if (!token) {
    throw new Error("Authentication required. Please login first.");
  }

  const response = await fetch(`${API_URL}/api/admin/notifications/${notificationId}/read`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to mark notification as read");
  }

  const data = await response.json();
  return data.data;
};

export const markAllAsReadApi = async () => {
  const token = getToken();

  if (!token) {
    throw new Error("Authentication required. Please login first.");
  }

  const response = await fetch(`${API_URL}/api/admin/notifications/read/all`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to mark all as read");
  }

  const data = await response.json();
  return data.data;
};

export const deleteNotificationApi = async (notificationId) => {
  const token = getToken();

  if (!token) {
    throw new Error("Authentication required. Please login first.");
  }

  const response = await fetch(`${API_URL}/api/admin/notifications/${notificationId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to delete notification");
  }

  const data = await response.json();
  return data.data;
};
