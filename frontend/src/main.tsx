import React from 'react';
import ReactDOM from 'react-dom/client';
import { AppRoutes } from './app/AppRoutes';
import { TooltipProvider } from './components/ui/tooltip';
import { Toaster } from './components/ui/sonner';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <TooltipProvider delayDuration={200}>
      <AppRoutes />
      <Toaster position="bottom-right" />
    </TooltipProvider>
  </React.StrictMode>
);
