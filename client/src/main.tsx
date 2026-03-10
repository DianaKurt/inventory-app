// src/main.tsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import '@/i18n'
import { Providers } from '@/app/providers/Providers'
import { router } from '@/app/routes/routes'
import { RouterProvider } from 'react-router-dom'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Providers>
      <RouterProvider router={router}/>
    </Providers>
  </React.StrictMode>,
)