import './App.css';
import './axios.ts';
import './dayjs.ts';
import AuthProvider from './providers/AuthProvider';
import Routes from './routes';

function App() {
  return (
    <AuthProvider>
      <Routes />
    </AuthProvider>
  )
}

export default App;
