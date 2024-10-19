import React from "react";
import {BrowserRouter as Router, Route, Routes} from "react-router-dom";
// For normal weight
import "./styles/global.css"; // Then import your global CSS
import {CreateUser, Dashboard, Home, Login, SpotifyRedirect} from "./pages";
import "@fontsource/fredoka-one/latin.css";
import "@fontsource/fredoka-one/latin-400.css";

function App() {
    return (<Router>
        <Routes>
            <Route path="/" element={<Home/>}/>
            <Route path="/create-user" element={<CreateUser/>}/>
            <Route path="/login" element={<Login/>}/>
            <Route path="/dashboard" element={<Dashboard/>}/>
            <Route path="/callback" element={<SpotifyRedirect/>}/>
        </Routes>
    </Router>);
}

export default App;


