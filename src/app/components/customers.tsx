"use client";
import { SubmitButton } from "app/ui/submit-button";
import { createCustomer } from "../actions/customers";
import { useActionState } from "react";

const initialState = {
  message: "",
};

export function CustomerForm() {
  const [state, formAction] = useActionState(createCustomer, initialState);
  return (
    <section>
      <h2>Add Customer</h2>
      <form action={formAction}>
        <div className="form-line">
          <label>Customer Code:</label>
          <input
            type="text"
            name="customerCode"
            placeholder="Customer Code"
            required
          />
        </div>
        <div className="form-line">
          <label>Customer Name:</label>
          <input
            type="text"
            name="customerName"
            placeholder="Customer Name"
            required
          />
        </div>
        <p className="submit-message">{state?.message}</p>
        <SubmitButton title="Add Customer" />
      </form>
    </section>
  );
}
