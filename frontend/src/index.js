import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

// রুট এলিমেন্ট সিলেক্ট করুন
const container = document.getElementById('root');

// রুট ক্রিয়েট করুন
const root = createRoot(container);

// অ্যাপ রেন্ডার করুন
root.render(
  <StrictMode>
    <App />
  </StrictMode>
);