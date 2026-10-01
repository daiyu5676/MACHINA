import { BrowserRouter, Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import Dashboard from "./pages/Dashboard";
import Assets from "./pages/Assets";
import Predictions from "./pages/Predictions";
import Insights from "./pages/Insights";
import History from "./pages/History";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <div className="app">
        <Header />
        <div className="app-body">
          <Sidebar />
          <div className="main-content">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/assets" element={<Assets />} />
              <Route path="/predictions" element={<Predictions />} />
              <Route path="/insights" element={<Insights />} />
              <Route path="/history" element={<History />} />
            </Routes>
          </div>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;