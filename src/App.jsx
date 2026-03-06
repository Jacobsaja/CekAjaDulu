import { HashRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import TesMinatIntro from './pages/TesMinatIntro';
import TesMinat from './pages/TesMinat';
import TesLanjutan from './pages/TesLanjutan';
import SnbpSimulation from './pages/SnbpSimulation';

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/snbp" element={<SnbpSimulation />} />
        <Route path="/tes-minat" element={<TesMinatIntro />} />
        <Route path="/tes-minat/mulai" element={<TesMinat />} />
        <Route path="/tes-lanjutan" element={<TesLanjutan />} />
      </Routes>
    </HashRouter>
  );
}

export default App;
