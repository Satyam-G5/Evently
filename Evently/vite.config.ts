import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  server:{
    proxy :{
      
      "/add_user" :{
        target: "http://localhost:8000"
      },
      "/log_user" :{
        target: "http://localhost:8000"
      },
      "/get_user" :{
        target: "http://localhost:8000"
      },
      "/all_user" : {
        target : "http://localhost:8000"
      },
      "/save_events" : {
        target : "http://localhost:8000"
      },
      "/get_events" : {
        target : "http://localhost:8000" 
      },
      "/book_events" : {
        target : "http://localhost:8000"
      },
      "/booking_success" : {
        target : "http://localhost:8000"
      },
      "/collect_book" : {
        target : "http://localhost:8000"
      },
      "/create-payment-intent" : {
        target : "http://localhost:8000"
      },
      "/delbooking" : {
        target : "http://localhost:8000"
      }

    }
  },
  plugins: [react()],
})
