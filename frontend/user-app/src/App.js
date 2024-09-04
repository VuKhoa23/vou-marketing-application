import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import './App.css';
import RootLayout from './pages/Root';
import Home, { loader as eventsLoader } from './pages/Home';
import GamePage from './pages/GamePage';
import UserProfile from './pages/UserProfile';

const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      { index: true, element: <Home />, loader: eventsLoader },
      {
        path: 'game',
        children: [
          { index: true, element: <GamePage /> }
        ],
      },
      { path: 'profile', element: <UserProfile /> },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
