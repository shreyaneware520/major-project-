import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import AuthLayout from "../../components/Login/AuthLayout";
import AuthForm from "../../components/Login/AuthForm";

function Login() {
  const [searchParams] = useSearchParams();
  const queryMode = searchParams.get("mode") === "signup" ? "signup" : "login";
  const [mode, setMode] = useState(queryMode);
  const [prevQueryMode, setPrevQueryMode] = useState(queryMode);

  if (queryMode !== prevQueryMode) {
    setPrevQueryMode(queryMode);
    setMode(queryMode);
  }

  return (
    <AuthLayout mode={mode} setMode={setMode}>
      <AuthForm mode={mode} setMode={setMode} />
    </AuthLayout>
  );
}

export default Login;