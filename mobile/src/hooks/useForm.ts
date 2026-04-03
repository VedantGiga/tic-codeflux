import { useState } from "react";

export const useForm = (initialState) => {
  const [values, setValues] = useState(initialState);
  const handleChange = (name, value) => setValues({ ...values, [name]: value });
  return [values, handleChange];
};
