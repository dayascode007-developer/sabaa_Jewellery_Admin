const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://192.168.29.163:5000";

const getToken = () => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("adminToken");
};

export const getPendingReviewsApi = async (limit = 20, offset = 0) => {
  const token = getToken();
  if (!token) throw new Error("Authentication required");

  const response = await fetch(
    `${API_URL}/api/admin/reviews/pending?limit=${limit}&offset=${offset}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch reviews");
  }

  return data.data;
};

export const approveReviewApi = async (reviewId) => {
  const token = getToken();
  if (!token) throw new Error("Authentication required");

  const response = await fetch(
    `${API_URL}/api/admin/reviews/${reviewId}/approve`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to approve review");
  }

  return data.data;
};

export const rejectReviewApi = async (reviewId) => {
  const token = getToken();
  if (!token) throw new Error("Authentication required");

  const response = await fetch(
    `${API_URL}/api/admin/reviews/${reviewId}/reject`,
    {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to reject review");
  }

  return data.data;
};
