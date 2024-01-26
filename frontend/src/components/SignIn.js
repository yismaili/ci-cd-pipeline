import React, { useState } from 'react';

const SignIn = () => {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [emailError, setEmailError] = useState("");
    const [passwordError, setPasswordError] = useState("");
        
    const onButtonClick = async () => {
        setEmailError("");
        setPasswordError("");
        
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
        
        try {
            const response = await fetch('http://localhost:3001/users/signin', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    firstName,
                    lastName,
                    email,
                    password,
                }),
                credentials: 'include'
            });
            // window.location.reload()
            console.log('Response:', response);
        
            if (response.ok) {
                const responseData = await response.json();
                window.location.reload()
            } else {
                const errorData = await response.json();
                console.error('Error:', errorData.message);
            }
        } catch (error) {
            console.error('Network error:', error);
        }
        
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
