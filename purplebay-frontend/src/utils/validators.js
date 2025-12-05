import * as yup from "yup";

export const registerValidator = yup.object().shape({
  name: yup.string().min(2, "Name should be at least 2 characters").required("Name is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
});

export const loginValidator = yup.object().shape({
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup.string().required("Password is required"),
});

export const createListingValidator = yup.object().shape({
  title: yup.string().min(3).max(120).required("Title is required"),
  description: yup.string().max(2000),
  startingPrice: yup.number().positive("Price must be greater than 0").required("Starting price is required"),
  category: yup.string().required("Category is required"),
});

export const bidValidator = yup.object().shape({
  amount: yup.number().positive("Bid must be greater than 0").required("Amount is required"),
});

export const chatValidator = yup.object().shape({
  text: yup.string().min(1, "Message cannot be empty").required("Message is required"),
});
