import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import './App.css';
import RootLayout from './pages/Root';
import Home, { loader as eventsLoader } from './pages/Home';
import GamePage from './pages/GamePage';
import UserProfile from './pages/UserProfile';
import TriviaGame from './pages/GamePage/components/TriviaGame';
import Login from './pages/Login';
import store from './redux/store';
import { Provider } from 'react-redux';

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
      {
        path: 'trivia',
        children: [
          { index: true, element: <TriviaGame /> }
        ],
      },
      { path: 'profile', element: <UserProfile /> },
    ],
  },
  { path: 'login', element: <Login /> },
]);

function App() {
  return (
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>);
}

export default App;
