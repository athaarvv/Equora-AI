import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ChatPage } from './pages/Chat';
import { MarketPage } from './pages/Market';
import { PortfolioPage } from './pages/Portfolio';
import { WatchlistPage } from './pages/Watchlist';
import { DocumentsPage } from './pages/Documents';
import { LearnPage } from './pages/Learn';
import { ScamDetectorPage } from './pages/ScamDetector';
import { SettingsPage } from './pages/Settings';

export const App: React.FC = () => {
  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <Routes>
        <Route path="/" element={<ChatPage />} />
        <Route path="/market" element={<MarketPage />} />
        <Route path="/portfolio" element={<PortfolioPage />} />
        <Route path="/watchlist" element={<WatchlistPage />} />
        <Route path="/documents" element={<DocumentsPage />} />
        <Route path="/learn" element={<LearnPage />} />
        <Route path="/scam-detector" element={<ScamDetectorPage />} />
        <Route path="/settings" element={<SettingsPage />} />
      </Routes>
    </Router>
  );
};

export default App;
