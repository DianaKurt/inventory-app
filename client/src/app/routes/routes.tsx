import { createBrowserRouter, Navigate } from 'react-router-dom'
import RootLayout from '../layout/RootLayout'
import AuthLayout from '../layout/AuthLayout'

import SignInPage from '@/pages/auth/SignInPage'
import SignUpPage from '@/pages/auth/SignUpPage'
import InventoriesPage from '@/pages/inventories/InventoriesPage'
import UserPage from '@/pages/user/UserPage'

import HomePage from '@/pages/home/HomePage'
import SearchPage from '@/pages/search/SearchPage'
import { RequireAuth, RequireAdmin } from './guards'
import InventoryPage from '@/pages/inventory/InventoryPage'
import ItemPage from '@/pages/item/ItemPage'
import CreateInventoryPage from '@/pages/inventories/CreateInventoryPage'
import AdminDashboard from '@/pages/admin/AdminDashboard'




export const router = createBrowserRouter([
  // AUTH - without RootLayout
  {
    element: <AuthLayout />,
    children: [
      { path: '/auth', element: <Navigate to="/auth/sign-in" replace /> },
      { path: '/auth/sign-in', element: <SignInPage /> },
      { path: '/auth/sign-up', element: <SignUpPage /> },
    ],
  },

  //  Header/Footer
  {
    element: <RootLayout />,
    children: [
      { path: '/', element: <HomePage /> },
  
      { path: '/search', element: <SearchPage /> },
  
      { 
        path: '/admin',
        element: (
         <RequireAdmin>
          <AdminDashboard />
        </RequireAdmin>
        ),
      },
  
      {
        path: '/inventories',
        element: (
          <RequireAuth>
            <InventoriesPage />
          </RequireAuth>
        ),
      },
  
      {
        path: '/user',
        element: (
          <RequireAuth>
            <UserPage />
          </RequireAuth>
        ),
      },
  
      {
        path: '/inventories/:inventoryId',
        element: (
          <RequireAuth>
            <InventoryPage />
          </RequireAuth>
        ),
      },
      {
        path: '/inventories/new',
        element: (
          <RequireAuth>
           <CreateInventoryPage />
         </RequireAuth>
        ),
      },
  
      {
        path: '/inventories/:inventoryId/items/:itemId',
        element: (
          <RequireAuth>
            <ItemPage />
          </RequireAuth>
        ),
      },
    ],
  },
])