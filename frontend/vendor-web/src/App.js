import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import './App.css';
import HomePage from './pages/Home';
import EventsPage, { loader as eventsLoader } from './pages/Events';
import Dashboard from './pages/dashboard';
import RootLayout from './pages/Root';
import CollaborationRequest from './pages/CollaborationRequest';
import VendorProfile from './pages/VendorProfile';


const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'events',
        children: [
          { index: true, element: <EventsPage />, loader: eventsLoader },
          { path: 'form', element: <CollaborationRequest /> },
        ],
      },
      { path: 'stats', element: <Dashboard /> },
      { path: 'profile',  element: <VendorProfile />},
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
