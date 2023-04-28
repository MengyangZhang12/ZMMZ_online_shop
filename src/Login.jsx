import { useState } from 'react';

function Login({onLogin}) {

    const [username, setUsername] = useState('');

    function onChange(e) {
        setUsername(e.target.value);
      }
    
    function onSubmit(e) {
        e.preventDefault(); 
        if(username) {  
            onLogin(username); 
        }
    }

    return (            
        <div className="login">
            <form  className="login-input" onSubmit={onSubmit}>
                <div className="information">               
                    <label htmlFor="user-name">Username:</label>
                    <input id="user-name" name="username" placeholder="Please enter username composed only by letters and numbers"
                    value={username} onChange = {onChange} required/>                           
                </div>
                <div className="login-button">
                    <button type="submit">Log In</button>
                </div>
            </form>
        </div>
    );
}

export default Login;