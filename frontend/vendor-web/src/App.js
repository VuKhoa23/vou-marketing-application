import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import './App.css';
import HomePage from './pages/Home';
import EventsPage from './pages/Events';
import Dashboard from './pages/dashboard/default';
import RootLayout from './pages/Root';
import EventDetailPage from './pages/EventDetail';
import NewEventPage from './pages/NewEvent';
import CollaborationRequest from './pages/CollaborationRequest';


const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'events',
        children: [
          { index: true, element: <EventsPage /> },
          { path: ':eventId', element: <EventDetailPage /> },
          { path: 'form', element: <CollaborationRequest /> },
        ],
      },
      { path: 'stats', element: <Dashboard /> },
      { path: 'newEvent', element: <NewEventPage /> },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
