import logo from './logo.svg';
import './App.css';
import React, { createContext } from 'react'
import{Route,Routes} from "react-router-dom";
// Component imports
import Home from './components/Home';
import AboutProject from './components/AboutProject';
import CustomNavbar from './components/CustomNavbar';
import AboutTeam from './components/AboutTeam';

export const userContext = createContext();

const Routing = () => {
  return (
    <Routes>
      <Route path="/" element = { <Home/> } />
      <Route path="/Home" element = { <Home/> } />
      <Route path="/AboutTeam" element = { <AboutTeam/> } />
      <Route path="/AboutProject" element = { <AboutProject/> } />

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
      <CustomNavbar />
      <Routing />
    </div>
  );
}


export default App;
