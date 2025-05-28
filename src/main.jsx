import React from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import './index.css'

const isProduction = import.meta.env.PROD
const basename = isProduction ? '/react-gh-pages' : ''

const router = createBrowserRouter([
    {
        path: '/',
        element: <App />,
    }
], { basename })

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <RouterProvider router={ router } />
    </React.StrictMode>,
)