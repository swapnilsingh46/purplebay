// src/services/listingService.js
import api from "./api"; // pre-configured axios instance with VITE_API_URL

// --------------------
// PUBLIC API FUNCTIONS
// --------------------

// Get all listings (public, no login required)
export const getAllListings = async (params = {}) => {
  const res = await api.get("/listings", {
    params,
    headers: { isPublic: true }, // tells api.js not to attach token
  });
  return res.data.items || [];
};

// Get a single listing by ID (public)
export const getListingById = async (id) => {
  const res = await api.get(`/listings/${id}`, {
    headers: { isPublic: true },
  });
  return res.data;
};

// --------------------
// PROTECTED API FUNCTIONS
// --------------------

// Create a new listing (requires login)
export const createListing = async (listingData) => {
  const res = await api.post("/listings", listingData);
  return res.data;
};

// Update a listing by ID (requires login)
export const updateListing = async (id, listingData) => {
  const res = await api.patch(`/listings/${id}`, listingData);
  return res.data;
};

// Delete a listing by ID (requires login)
export const deleteListing = async (id) => {
  const res = await api.delete(`/listings/${id}`);
  return res.data;
};

