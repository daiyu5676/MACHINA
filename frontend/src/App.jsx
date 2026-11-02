import { BrowserRouter, Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import Dashboard from "./pages/Dashboard";
import Assets from "./pages/Assets";
import Predictions from "./pages/Predictions";
import Insights from "./pages/Insights";
import History from "./pages/History";

function App() {
  return (
    <BrowserRouter>
      <div className="flex flex-col min-h-screen bg-[#F5F6F7]">
        <Header />
        <div className="flex flex-1 overflow-hidden">
          <Sidebar />
          <main className="flex-1 overflow-y-auto px-4 py-5 sm:px-6 sm:py-6 md:px-9 md:py-7 max-h-[calc(100vh-52px)]">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/assets" element={<Assets />} />
              <Route path="/predictions" element={<Predictions />} />
              <Route path="/insights" element={<Insights />} />
              <Route path="/history" element={<History />} />
            </Routes>
          </main>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
