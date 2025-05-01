import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import { GameProvider } from './context/GameContext';
import { HomePage } from './pages/HomePage';
import { LevelPage } from './pages/LevelPage';
import { AboutPage } from './pages/AboutPage';
import { SettingsPage } from './pages/SettingsPage';
import { ProgressPage } from './pages/ProgressPage';
import AITestPage from './pages/AITestPage';
import { GlobalStyle, theme } from './components/StyledComponents';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <GameProvider>
        <GlobalStyle />
        <Router>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/level/:levelId" element={<LevelPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/progress" element={<ProgressPage />} />
            <Route path="/ai-test" element={<AITestPage />} />
            <Route path="*" element={<HomePage />} />
          </Routes>
        </Router>
      </GameProvider>
    </ThemeProvider>
  );
}

export default App;
