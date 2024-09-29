import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import {store} from "../store/store.ts"
import { Provider } from 'react-redux'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import LoginPage from './pages/login/LoginPage.tsx'
import RegisterPage from './pages/register/RegisterPage.tsx'
import AuthProvider from "react-auth-kit"
import {authStore} from "../auth/authStore.tsx"
import ProtectedRoute from "../auth/ProtectedRoute.tsx"
import SettingsPage from './pages/settings/SettingsPage.tsx'
import { PostHogProvider } from 'posthog-js/react'



const options = {
  api_host: 'https://us.i.posthog.com',
}



const router=createBrowserRouter([
  {
    path:'/login',
    element:<LoginPage/>,
  },
  {
    path:'/register',
    element:<RegisterPage/>
  },
  {
    path:'/',
    index:true,
    element:(
      <ProtectedRoute>
         <App/>
      </ProtectedRoute>
  )
  },
  {
    path:'/settings',
    element:(
      <ProtectedRoute>
        <SettingsPage/>
      </ProtectedRoute>
    )
  }
])

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider store={authStore} >
    <Provider store={store} >
      <PostHogProvider
      apiKey='phc_68dZt6F76WvG5j36CIC3esc7DJ4axdG7Y0VstmjFJtn'
      options={options}
      >
      <RouterProvider router={router} />
      </PostHogProvider>
    </Provider>
    </AuthProvider>  
  </StrictMode>,
)
