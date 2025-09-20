const API_BASE_URL = "https://api.sampleapis.com/cartoons/cartoons2D";

export async function fetchCartoons() {
  const response = await fetch(API_BASE_URL);
  if (!response.ok) {
    throw new Error("Failed to fetch cartoons");
  }
  const data = await response.json();

  // The API directly returns an array, not { results: [...] }
  return Array.isArray(data) ? data : [];
}
