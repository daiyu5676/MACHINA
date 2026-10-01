import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import Assets from "./pages/Assets";
import Predictions from "./pages/Predictions";
import Insights from "./pages/Insights";
import History from "./pages/History";
import "./App.css";

/*
  MACHINA — Main Application Shell
  
  Layout: Header + Sidebar + Main content area
  Routing: Dashboard, Assets, Predictions, Insights, History
  
  This replaces the original single-page App.jsx.
  All original functionality (predict, explain, sensors, SHAP, decision)
  is preserved in the Dashboard page component.
*/

function App() {
  return (
    <BrowserRouter>
      <div className="app">
        <Header />
        <div className="app-body">
          <Sidebar />
          <main className="main-content">
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