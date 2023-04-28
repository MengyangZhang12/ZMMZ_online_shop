import { useState } from 'react';
import {
  PAGE_STATUS,
  SERVER,
} from './constants';

import {
  fetchProducts,
  fetchCart,
  fetchOrders,
} from './services';

import Loading from './Loading';
import Products from './Products';
import Cart from './Cart';
import Account from './Account';


function Homepage({
  username, 
  onLogout, 
  products, 
  onSetProducts, 
  cart, 
  onSetCart, 
  onSetError,
  onResetError,
}) {

  const [ pageStatus, setPageStatus ] = useState(PAGE_STATUS.PRODUCTS_PAGE);
  const [ orders, setOrders] = useState();

  function onViewProduct(e){
    e.preventDefault();
    onResetError(); 
    setPageStatus(PAGE_STATUS.PENDING);
    fetchProducts()
    .then( products => { 
      onSetProducts(products);
      setPageStatus(PAGE_STATUS.PRODUCTS_PAGE);
    })
    .catch( err => {
      if( err?.error === SERVER.AUTH_MISSING ) { 
        onLogout();
        return;
      }
      onSetError(err); 
    });
    
  }

  function onViewCart(e){
    e.preventDefault();
    onResetError();  
    setPageStatus(PAGE_STATUS.PENDING);
    fetchCart()
    .then( userCart => {
      onSetCart(userCart);
      setPageStatus(PAGE_STATUS.CART_PAGE);
    })
    .catch( err => {
      if( err?.error === SERVER.AUTH_MISSING ) { 
        onLogout();
        return;
      }
      onSetError(err); 
    });
  }

  function onViewOrder(e){
    e.preventDefault();
    onResetError();
    setPageStatus(PAGE_STATUS.PENDING);    
    fetchOrders()
    .then( userOrders => {
      setOrders(userOrders);
      setPageStatus(PAGE_STATUS.ACCOUNT_PAGE);
    })
    .catch( err => {
      if( err?.error === SERVER.AUTH_MISSING ) { 
        onLogout();
        return;
      }
      onSetError(err); 
    });
  }

  function onSetOrders(orders) {
    setOrders(orders);
  }
  

  return(
      <div className='homepage'>
          <div className="title">
              <div className="title-welcome">       
                  Welcome, {username}!
              </div>
              <div className="title-buttons">
                  <button className="cart-button" onClick={onViewCart}>Cart</button>
                  <span> | </span>
                  <button className="account-button" onClick={onViewOrder}>My Account</button>
                  <span> | </span>
                  <button className="logout-button" onClick={onLogout}>Log out</button>
              </div>
          </div>
          <nav className="menubar"> 
          <ul className="menu">
            <li>
              <button className="home-button" onClick={onViewProduct}>Home</button>
            </li>          
            <li>
              <button type="button">Style</button>
              <ul className="submenu">
                  <li>Bracelets</li>
                  <li>Necklaces</li>
                  <li>Earrings</li>
                  <li>Rings</li>
              </ul>
            </li>
            <li>
              <button type="button">Blog</button>
              <ul className="submenu">
                  <li>Stones Gallery</li>
                  <li>Meanings and Uses</li>
                  <li>Gift Ideas</li>
              </ul>
            </li>
            <li>
              <button type="button">Contact Us</button>
              <ul className="submenu">
                  <li>About ZMMZ</li>
                  <li>Here To Help</li>
              </ul>
            </li>
          </ul>
        </nav>
        <div className="content-page">
          { pageStatus === PAGE_STATUS.PENDING && <Loading className="data-waiting">Loading data...</Loading> }
          { pageStatus === PAGE_STATUS.PRODUCTS_PAGE && <Products 
            products={products} 
            cart={cart}
            onSetCart={onSetCart}
            onSetError={onSetError}
            /> }
          { pageStatus === PAGE_STATUS.CART_PAGE && <Cart 
            products={products} 
            cart={cart} 
            onSetCart={onSetCart}
            onSetError={onSetError}
            onResetError={onResetError}
            /> }
          { pageStatus === PAGE_STATUS.ACCOUNT_PAGE && <Account 
            products={products} 
            orders={orders}
            onSetError={onSetError}
            onSetOrders={onSetOrders}
            onResetError={onResetError}/> }
        </div>
      </div>
    );
}
export default Homepage;