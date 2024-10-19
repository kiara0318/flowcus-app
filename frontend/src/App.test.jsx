import React from "react";
import {fireEvent, render, screen} from "@testing-library/react"; // Import fireEvent if needed
import App from "./App";

test("renders Routine Reminder App message", () => {
    render(<App/>);
    const headerElement = screen.getByText(/Welcome to the Routine Reminder App/i);
    expect(headerElement).toBeInTheDocument();
});

// Example of an additional test
test("navigates to create user page", () => {
    render(<App/>);
    const createUserLink = screen.getByText(/Create User/i);
    fireEvent.click(createUserLink); // Simulate clicking the link
    const newHeaderElement = screen.getByText(/Create a New User/i); // Adjust based on your actual content
    expect(newHeaderElement).toBeInTheDocument(); // Check if the new header appears
});
