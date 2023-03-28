import React from 'react';
import { createRoot } from 'react-dom/client';
import App from 'core';

const theme = localStorage.getItem('theme') || 'light';
if (theme === 'dark') {
  document.body.classList.add('dark');
} else {
  document.body.classList.remove('dark');
}
const container = document.getElementById('app-container');
const root = createRoot(container);
root.render(<App display="extension" />);
