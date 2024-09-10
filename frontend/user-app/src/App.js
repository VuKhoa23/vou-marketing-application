import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import './App.css';
import RootLayout from './pages/Root';
import Home, { loader as eventsLoader } from './pages/Home';
import GamePage from './pages/GamePage';
import UserProfile from './pages/UserProfile';
import TriviaGame from './pages/GamePage/components/TriviaGame';
import Login from './pages/Login';
import Signup from './pages/Signup';
import store from './redux/store';
import { Provider } from 'react-redux';

const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      { index: true, element: <Home />, loader: eventsLoader },
      {
        path: 'game/:eventId',
        children: [
          { index: true, element: <GamePage /> }
        ],
      },
      {
        path: 'trivia/:eventId',
        children: [
          { index: true, element: <TriviaGame /> }
        ],
      },
      { path: 'profile', element: <UserProfile /> },
    ],
  },
  { path: 'login', element: <Login /> },
  { path: 'signup', element: <Signup /> },
]);

function App() {
  return (
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>);
}

export default App;
