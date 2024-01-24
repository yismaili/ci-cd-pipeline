import React from "react"
import { useNavigate } from "react-router-dom";

const Home = (props) => {
    const { loggedIn, SignIn, email } = props
    const navigate = useNavigate();
    
    const onButtonClick = () => {
      if (loggedIn) {
          navigate('/logout');
      } else {

          navigate('/login');
      }
    }
    const onButtonClickSign = () => {
      if (SignIn) {
          navigate('/signout');
      } else {
          navigate('/signin');
      }
  }
  

    return <div className="mainContainer">
        <div className={"titleContainer"}>
            <div>Welcome!</div>
        </div>
        <div>
            To the Home Page.
        </div>
        <div className={"buttonContainer"}>
            <input
                className={"inputButton"}
                type="button"
                onClick={onButtonClick}
                value={loggedIn ? "Log out" : "Log in"} />
            {(loggedIn ? <div>
                Your email address is {email}
            </div> : <div/>)}
            <input
                className={"inputButton"}
                type="button"
                onClick={onButtonClickSign}
                value={SignIn ? "Sign out" : "Sign in"} />
            {(SignIn ? <div>
                Your email address is {email}
            </div> : <div/>)}
        </div>
    </div>
}

export default Home