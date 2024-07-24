import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import './App.css';
import HomePage from './pages/Home';
import EventsPage from './pages/Events';
import StatisticsPage from './pages/Stats';
import RootLayout from './pages/Root';
import EventDetailPage from './pages/EventDetail';
import NewEventPage from './pages/NewEvent';


const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'events', element: <EventsPage /> },
      { path: 'events/:eventId', element: <EventDetailPage /> },
      { path: 'stats', element: <StatisticsPage /> },
      { path: 'newEvent', element: <NewEventPage /> },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
