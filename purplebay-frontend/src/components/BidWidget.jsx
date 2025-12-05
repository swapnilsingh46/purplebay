import React, { useState } from "react";
import { bidValidator } from "../utils/validators";
import { placeBid } from "../services/bidsService";

export default function BidWidget({ listing }) {
  const [amount, setAmount] = useState("");
  const [errors, setErrors] = useState({});

  const submitBid = async (e) => {
    e.preventDefault();
    try {
      await bidValidator.validate({ amount: Number(amount) }, { abortEarly: false });
      await placeBid(listing._id, Number(amount));
      setAmount("");
      alert("Bid placed successfully");
    } catch (err) {
      if (err.inner) {
        const errs = {};
        err.inner.forEach(e => (errs[e.path] = e.message));
        setErrors(errs);
      } else {
        alert("Bid failed");
      }
    }
  };

  return (
    <form onSubmit={submitBid}>
      <input type="number" className="form-control mb-2" placeholder="Your bid" value={amount} onChange={e => setAmount(e.target.value)} />
      {errors.amount && <small className="text-danger">{errors.amount}</small>}
      <button className="btn btn-primary mt-2">Place Bid</button>
    </form>
  );
}

