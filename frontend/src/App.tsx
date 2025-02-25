import './App.css';
import './axios.ts';
import { Toaster } from './components/ui/toaster.tsx';
import './dayjs.ts';
import AuthProvider from './providers/AuthProvider';
import ThemeProvider from './providers/ThemeProvider.tsx';
import Routes from './routes';

function App() {
	return (
		<ThemeProvider>
			<AuthProvider>
				<Routes />
				<Toaster />
			</AuthProvider>
		</ThemeProvider>
	)
}

export default App;
