// src/services/listingService.js
import api from "./api"; // Use the pre-configured axios instance with VITE_API_URL

// Function to get all listings
export const getAllListings = async () => {
  // Sends a GET request to /api/listings on the backend
  // No need for full URL, api.js already handles baseURL
  const res = await api.get("/listings");

  // Return an array of listings; default to empty array if no items
  return res.data.items || [];
};

// Function to get a single listing by ID
export const getListingById = async (id) => {
  // Sends a GET request to /api/listings/:id
  const res = await api.get(`/listings/${id}`);

  // Return the listing object
  return res.data;
};

// Function to create a new listing (requires authentication)
export const createListing = async (listingData) => {
  // Sends a POST request to /api/listings with listing data
  const res = await api.post("/listings", listingData);

  // Return the newly created listing object
  return res.data;
};

// Function to update a listing by ID (requires authentication)
export const updateListing = async (id, listingData) => {
  // Sends a PATCH request to /api/listings/:id with updated data
  const res = await api.patch(`/listings/${id}`, listingData);

  // Return the updated listing object
  return res.data;
};

// Function to delete a listing by ID (requires authentication)
export const deleteListing = async (id) => {
  // Sends a DELETE request to /api/listings/:id
  const res = await api.delete(`/listings/${id}`);

  // Return the response object (confirmation of deletion)
  return res.data;
};

