// src/services/listingService.js
import api from './api'; // <- import your pre-configured axios instance

// Get all listings
export const getAllListings = async () => {
  const res = await api.get('/listings'); // no need for full URL, api has baseURL
  return res.data.items || [];
};

// Get a single listing by ID
export const getListingById = async (id) => {
  const res = await api.get(`/listings/${id}`);
  return res.data;
};

// Create a new listing (requires auth)
export const createListing = async (listingData) => {
  const res = await api.post('/listings', listingData);
  return res.data;
};

// Update a listing (requires auth)
export const updateListing = async (id, listingData) => {
  const res = await api.patch(`/listings/${id}`, listingData);
  return res.data;
};

// Delete a listing (requires auth)
export const deleteListing = async (id) => {
  const res = await api.delete(`/listings/${id}`);
  return res.data;
};

