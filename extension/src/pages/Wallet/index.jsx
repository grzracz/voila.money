import React from 'react';
import { createRoot } from 'react-dom/client';
import Routes from 'core/Routes';

const container = document.getElementById('app-container');
const root = createRoot(container);
root.render(<Routes display="tab" />);
