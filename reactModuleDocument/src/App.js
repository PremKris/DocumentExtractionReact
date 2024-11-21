import React from "react";
import "./App.css";
import NotFound from "pages/NotFound";
import AppBar from "components/AppBar";
import MasterPage from "pages/MasterPage";
import ObjectPage from "pages/ObjectPage";
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import Rattachments from "components/Rattachments";
import DocExchange from "components/DocExchange";
import SubmitState from "context/SubmitState";

const App = () => {
  return (
    <div className="App full-height">
      <Router>
        <SubmitState>
          <AppBar />
          <Routes>
            <Route path="/" element={<MasterPage />} />
            <Route path="/" element={<Rattachments />} />
            <Route path="/" element={<DocExchange />} />
            <Route path="/object-page/:orderNumber" element={<ObjectPage />} />
          </Routes>
        </SubmitState>
      </Router>
    </div>
  );
};

export default App;
