import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const SignIn = () => {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [emailError, setEmailError] = useState("");
    const [passwordError, setPasswordError] = useState("");
    
    const navigate = useNavigate();
        
    const onButtonClick = () => {
        // Set initial error values to empty
        setEmailError("");
        setPasswordError("");
        
        // Check if the user has entered all fields correctly
        if (firstName.trim() === "") {
            setEmailError("Please enter your first name");
            return;
        }

        if (lastName.trim() === "") {
            setEmailError("Please enter your last name");
            return;
        }

        if (email.trim() === "") {
            setEmailError("Please enter your email");
            return;
        }
        
        if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
            setEmailError("Please enter a valid email");
            return;
        }
        
        if (password.trim() === "") {
            setPasswordError("Please enter a password");
            return;
        }
        
        if (password.length < 8) {
            setPasswordError("The password must be 8 characters or longer");
            return;
        }
        
        // Here you can add logic for submitting the form or authenticating the user
        // For now, let's just navigate to a success page
        navigate('/success');
    };

    return (
        <div className="mainContainer">
            <div className="titleContainer">
                <div>SignIn</div>
            </div>
            <br />
            <div className="inputContainer">
                <input
                    value={firstName}
                    placeholder="Enter your first name"
                    onChange={(ev) => setFirstName(ev.target.value)}
                    className="inputBox"
                />
            </div>
            <br />
            <div className="inputContainer">
                <input
                    value={lastName}
                    placeholder="Enter your last name"
                    onChange={(ev) => setLastName(ev.target.value)}
                    className="inputBox"
                />
            </div>
            <br />
            <div className="inputContainer">
                <input
                    value={email}
                    placeholder="Enter your email here"
                    onChange={(ev) => setEmail(ev.target.value)}
                    className="inputBox"
                />
                <label className="errorLabel">{emailError}</label>
            </div>
            <br />
            <div className="inputContainer">
                <input
                    value={password}
                    placeholder="Enter your password here"
                    onChange={(ev) => setPassword(ev.target.value)}
                    className="inputBox"
                    type="password"
                />
                <label className="errorLabel">{passwordError}</label>
            </div>
            <br />
            <div className="inputContainer">
                <input
                    className="inputButton"
                    type="button"
                    onClick={onButtonClick}
                    value="Sign In"
                />
            </div>
        </div>
    );
};

export default SignIn;
