import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./header";
import Homepage from "./homepage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/header" element={<Header />} />
        <Route path="/home" element={<Homepage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;