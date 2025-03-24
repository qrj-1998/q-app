import { Routes, Route } from "react-router-dom";
import ReactPage from "../pages/reactPage";
import VuePage from "../pages/vuePage";

export default function Router() {
  return (
    <Routes>
      <Route path="/" element={<ReactPage />} />
      <Route path="/react-app" element={<ReactPage />} />
      <Route path="/vue-app" element={<VuePage />} />
    </Routes>
  );
}