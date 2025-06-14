
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from "react-router-dom";
import App from './App.tsx'
import './index.css'

// Get the base path from the environment or use default
const basename = import.meta.env.MODE === 'production' ? '/campusconnect-launch-notify/' : '/';

createRoot(document.getElementById("root")!).render(
  <BrowserRouter basename={basename}>
    <App />
  </BrowserRouter>
);
