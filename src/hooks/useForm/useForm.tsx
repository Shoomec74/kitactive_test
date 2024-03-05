import React, { ChangeEvent, useState } from "react";

export type TForm = {
  [key: string]: string;
};

function useForm(inputValues: TForm) {
  const [values, setValues] = useState(inputValues);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { value, name } = event.target;
    setValues({ ...values, [name]: value });
  };
  return { values, handleChange, setValues };
}

export default useForm;
