import { Routes, Route } from "react-router-dom";
import { Header } from "./components/Header";
import { Home } from "./pages/Home";
import { Programs } from "./pages/Programs";
import { ProgramDetail } from "./pages/ProgramDetail";
import { Register } from "./pages/Register";
import { OrgAuth } from "./pages/OrgAuth";
import { Dashboard } from "./pages/Dashboard";
import { Impact } from "./pages/Impact";

export default function App() {
  return (
    <>
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/programs" element={<Programs />} />
          <Route path="/programs/:onChainId" element={<ProgramDetail />} />
          <Route path="/programs/:onChainId/register" element={<Register />} />
          <Route path="/org" element={<OrgAuth />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/impact" element={<Impact />} />
        </Routes>
      </main>
    </>
  );
}
