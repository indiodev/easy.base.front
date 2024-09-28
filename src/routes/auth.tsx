import { Layout } from "@layouts/index";
import React from "react";
import { Route, Routes } from "react-router-dom";

const AuthPage = React.lazy(async function () {
  const module = await import("@pages/auth");
  return {
    default: module.Auth,
  };
});

export function Router(): React.ReactElement {
  return (
    <Routes>
      <Route path="/" element={<Layout.Auth />}>
        <Route index element={<AuthPage />} />
      </Route>
    </Routes>
  );
}
