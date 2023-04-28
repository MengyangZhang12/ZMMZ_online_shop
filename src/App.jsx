import { useState, useEffect } from 'react';
import './css/app.css';
import './css/login.css';
import {
  LOGIN_STATUS,
  CLIENT,
  SERVER,
} from './constants';

import {
  fetchSession,
  fetchLogin,
  fetchLogout,
  fetchProducts,
  fetchCart,
} from './services';

import logo from './logo.jpg';
import Homepage from './Homepage';
import Login from './Login';
import Status from './Status';
import Loading from './Loading';


function App() {

  const [ error, setError ] = useState('');
  const [ username, setUsername ] = useState('');
  const [ loginStatus, setLoginStatus ] = useState(LOGIN_STATUS.PENDING);
  const [ products, setProducts] = useState('');
  const [ cart, setCart] = useState();


  function onLogin( username ) {

    fetchLogin(username)
    .then( productslist => {
      setError(''); 
      setProducts( productslist );
      setUsername(username);
      setLoginStatus(LOGIN_STATUS.IS_LOGGED_IN);
      return fetchCart();
    })
    .catch( err => {
      return Promise.reject(err); 
    })
    .then( userCart => {
      setCart(userCart);
    })
    .catch( err => {
      setError(err?.error || 'ERROR');
    });
  }

  function onLogout() {
    setError('');
    setUsername('');
    setLoginStatus(LOGIN_STATUS.NOT_LOGGED_IN);
    fetchLogout() 
    .catch( err => {
      setError(err?.error || 'ERROR'); 
    });
  }

  function checkForSession() {
    setError('');
    fetchSession()
    .then( session => { 
      setUsername(session.username);
      setLoginStatus(LOGIN_STATUS.IS_LOGGED_IN); 
      return fetchProducts(); 
    })
    .catch( err => {
      if( err?.error === SERVER.AUTH_MISSING ) {
        return Promise.reject({ error: CLIENT.NO_SESSION }) 
      }
      return Promise.reject(err); 
    })
    .then( products => {
      setProducts(products);
      return fetchCart();
    })
    .catch( err => {
      if( err?.error === SERVER.AUTH_MISSING ) {
        return Promise.reject({ error: CLIENT.NO_SESSION }) 
      }
      return Promise.reject(err); 
    })
    .then( userCart => {
      setCart(userCart);
    })
    .catch( err => {
      if( err?.error === CLIENT.NO_SESSION ) { 
        setLoginStatus(LOGIN_STATUS.NOT_LOGGED_IN);
        return;
      }
      setError(err?.error || 'ERROR'); 
    });
  }

  function onSetProducts(products){
    setProducts(products);
  }

  function onSetCart(cart){
    setCart(cart);
  }

  function onSetError(err) {
    setError(err?.error || 'ERROR');
  }

  function onResetError() {
    setError('');
  }

  useEffect(
    () => {
      checkForSession();
    },
    [] 
  );

  return (
    <div className="app">
      <header>
          <div className="header-logo">
              <img src={logo} className="logo" alt="ZMMZ logo" />
          </div>
          <h1>Welcome to ZMMZ Gemstone Museum</h1>       
      </header>     
      <main>
        { error && <Status error={error}/> }
        { loginStatus === LOGIN_STATUS.PENDING && <Loading className="login__waiting">Loading user...</Loading> }
        { loginStatus === LOGIN_STATUS.NOT_LOGGED_IN && <Login onLogin={onLogin}/> }
        { loginStatus === LOGIN_STATUS.IS_LOGGED_IN && <Homepage 
          username={username}
          onLogout={onLogout}
          products={products}
          onSetProducts={onSetProducts}
          cart={cart}
          onSetCart={onSetCart}
          onSetError={onSetError}
          onResetError={onResetError}/> }
      </main>
      <footer>
        <p>Copyright © 2022 ZMMZ.</p>
        <p>Terms of Service - Return Policy - support@zmmz.com</p>
      </footer>
    </div>
  );
}

export default App;
