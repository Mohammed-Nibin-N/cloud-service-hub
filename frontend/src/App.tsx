import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import HomePage from './pages/HomePage';
import DataUploadAccessPage from './pages/DataUploadAccessPage';
import SecureUploadRequestPage from './pages/SecureUploadRequestPage';
import RequestSuccessPage from './pages/RequestSuccessPage';
import AdminDashboardPage from './pages/AdminDashboardPage';

const router = createBrowserRouter([
  {
    path: '/',
    element: <HomePage />,
  },
  {
    path: '/data-upload-access',
    element: <DataUploadAccessPage />,
  },
  {
    path: '/secure-upload-request',
    element: <SecureUploadRequestPage />,
  },
  {
    path: '/request-success',
    element: <RequestSuccessPage />,
  },
  {
    path: '/admin',
    element: <AdminDashboardPage />,
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
