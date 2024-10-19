import React from "react";
import {Link} from "react-router-dom";

const Home = () => {
    return (
        <div>
            <h1>Welcome to the Routine Reminder App</h1>
            <nav>
                <Link to="/create-user">Create User</Link>
                <Link to="/login">Login</Link>
            </nav>
        </div>
    );
};

export default Home;
