import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/Smart-Bus-Ticket-Booking-Platform/', // ✅ REQUIRED
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});