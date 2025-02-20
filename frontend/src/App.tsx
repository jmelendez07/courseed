import './App.css';
import './axios.ts';
import { Toaster } from './components/ui/toaster.tsx';
import './dayjs.ts';
import AuthProvider from './providers/AuthProvider';
import Routes from './routes';

function App() {
  return (
    <AuthProvider>
      <Routes />
      <Toaster />
    </AuthProvider>
  )
}

export default App;
