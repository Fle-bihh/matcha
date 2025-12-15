import { EntryPage } from "@/pages";
import { APP_NAME } from "@matcha/shared";
import { Route, Routes } from "react-router-dom";

export function EntryLayout() {
  return (
    <div>
      <h1>Entry Area - {APP_NAME}</h1>
      <Routes>
        <Route index element={<EntryPage />} />
      </Routes>
    </div>
  );
}
