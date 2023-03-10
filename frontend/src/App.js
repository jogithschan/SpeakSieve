import logo from './logo.svg';
import './App.css';
import React, { createContext } from 'react'
import{Route,Routes} from "react-router-dom";
// Component imports
import Home from './components/Home';

export const userContext = createContext();

const Routing = () => {
  return (
    <Routes>
      <Route path="/" element = { <Home/> } />
    </Routes>
  )
}

// function App() {
  
//   return (
//     <div className="App">
//       <Routing />
//     </div>
//   );
// }

const App = () => {
  return (
    <div className="App">
      <Routing />
    </div>
  );
}


export default App;
