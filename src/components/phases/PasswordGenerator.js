import { useEffect, useState } from "react";
import { FormControl, FormGroup } from "react-bootstrap";
import { hashePassword } from "../../utils/packing";

export function PasswordGenerator() {
  const [password, setPassword] = useState("");
  const [hashedPassword, setHashedPassword] = useState("");

  useEffect(() => {
    setHashedPassword(hashePassword(password));
  }, [password, setHashedPassword]);

  return (
    <FormGroup>
      <p>Please input password: </p>
      <FormControl onChange={({ target }) => setPassword(target.value)} />
      <p>{hashedPassword}</p>
    </FormGroup>
  );
}
