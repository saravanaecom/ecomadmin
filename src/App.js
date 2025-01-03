import Router from '../src/routes/Routes'
import { AuthProvider } from './context/authContext'; 
import './App.css';


function App() {
  return (
    <>
     <AuthProvider>
     <Router/>
    </AuthProvider>
    
  </>
  );
}

export default App;
