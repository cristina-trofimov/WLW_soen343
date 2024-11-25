import './index.css'
import '@mantine/core/styles.css';
import { createTheme, MantineProvider } from '@mantine/core'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom'
import Layout from './routes/Layout'
import ErrorPage from './pages/ErrorPage'
import HomePage from './pages/HomePage'
import QuotationPage from "./pages/QuotationPage.tsx";
import PaymentPage from './pages/PaymentPage.tsx';
import ChatbotPopup from './components/ChatbotPopup.tsx';
import OrderingPage from './pages/OrderingPage.tsx';
import ConfirmationPage from './pages/ConfirmationPage.tsx';
import OrderPage from './pages/OrderPage.tsx';
import MyOrdersPage from './pages/MyOrdersPage.tsx';
import ContactUs from './pages/ContactUsPage.tsx';


const router = createBrowserRouter([

  //any page that has the layout with the header will be a child of the root
  {
    path: "/",
    element: <Layout />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <Navigate to="/home" replace />
      },
      {
        path: "home",
        element: <HomePage />,

      },
        {
        path: "quote",
        element: <QuotationPage />,

      },
      {
        path: "order",
        element: <OrderingPage />,
        children: [
          { path: "", element: <Navigate to="place" replace /> },
          { path: "place", element: <OrderPage /> },
          { path: "payment", element: <PaymentPage /> },
          { path: "review", element: <ConfirmationPage /> },
        ]
      },
      {
        path: "my-orders",
        element: <MyOrdersPage />,
      },
      {
        path: "contact-us",
        element: <ContactUs />,
      }
    ]
  },

])

const theme = createTheme({
  colors: {
    'wlw-green': [
      '#ccd5ae',
      '#b8c09d',
      '#a3aa8b',
      '#8f957a',
      '#7a8068',
      '#666b57',
      '#525546',
      '#3d4034',
      '#292b23',
      '#141511',
    ],
  },
  primaryColor: 'wlw-green',
  primaryShade: 1,
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <MantineProvider theme={theme} defaultColorScheme='light'>
      <RouterProvider router={router} />
      <ChatbotPopup />
    </MantineProvider>

  </StrictMode>,
)