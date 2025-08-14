import { Routes, Route, HashRouter } from "react-router";
import LayoutMain from "./components/layouts/layout-main";
import ScheduleGeneratorPage from "./pages/ScheduleGeneratorPage";
import RosterManagementPage from "./pages/RosterManagementPage";
import PostManagementPage from "./pages/PostManagementPage";
import HistoryPage from "./pages/HistoryPage";
import ScheduleViewerPage from "./pages/ScheduleViewerPage";
import HomePage from "./pages/HomePage";

function App() {
  return (
    <div className="min-h-screen bg-gray-100 text-gray-800">
      <main>
        <HashRouter>
          <Routes>
            <Route element={<LayoutMain />}>
              <Route path="/" element={<HomePage />} />
              <Route path="generator" element={<ScheduleGeneratorPage />} />
              <Route path="roster" element={<RosterManagementPage />} />
              <Route path="posts" element={<PostManagementPage />} />
              <Route path="history" element={<HistoryPage />} />
              <Route path="/schedule/:scheduleId" element={<ScheduleViewerPage />} />
            </Route>
          </Routes>
        </HashRouter>
      </main>
    </div>
  );
}

export default App;
