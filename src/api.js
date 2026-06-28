const BASE_URL = "https://aarohi-pr61.onrender.com";

export const registerUser = async (data) => {
  const res = await fetch(`${BASE_URL}/api/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
};

export const getApplications = async () => {
  const res = await fetch(`${BASE_URL}/api/applications`);
  return res.json();
};

export const createApplication = async (data) => {
  const res = await fetch(`${BASE_URL}/api/applications`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
};