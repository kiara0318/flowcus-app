import React from "react";
import {BrowserRouter as Router, Route, Routes} from "react-router-dom";
import "./styles/global.css";
import {CreateUser, Dashboard, Home, Login, SpotifyRedirect} from "./pages";
import "@fontsource/fredoka-one/latin.css";
import "@fontsource/fredoka-one/latin-400.css";
import {AuthProvider, SpotifyPlayerProvider} from "./context";

function App() {
    return (
        <AuthProvider>
            <SpotifyPlayerProvider>
                <Router>
                    <Routes>
                        <Route path="/" element={<Home/>}/>
                        <Route path="/create-user" element={<CreateUser/>}/>
                        <Route path="/login" element={<Login/>}/>
                        <Route path="/dashboard" element={<Dashboard/>}/>
                        <Route path="/callback" element={<SpotifyRedirect/>}/>
                    </Routes>
                </Router>
            </SpotifyPlayerProvider>
        </AuthProvider>
    );
}

export default App;