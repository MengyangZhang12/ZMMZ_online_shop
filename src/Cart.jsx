import Loading from './Loading';
import CartItem from './CartItem';
import {
  fetchCheckOut,
} from './services';

function Cart({
    products,
    cart,
    onSetError,
    onSetCart,
    onResetError,
}) {

    let show;

    const SHOW_CART = {  
      PENDING: 'pending',
      EMPTY: 'empty',
      CART: 'cart',
    };

    if (!Object.keys(cart.cartContent).length) {
      show = SHOW_CART.EMPTY;
    } else {
      show = SHOW_CART.CART;
    }

    let totalPrice = getTotal();

    function getTotal() {
      let sum = 0;
      if(!cart.cartContent) {
          return sum;
      }
      const userCart = cart.cartContent;
      for(let productId in userCart) {
          let subtotal = products[productId].price * userCart[productId];
          sum += subtotal;
      }
      return sum.toFixed(2);
    }

    function onCheckout(e){
      e.preventDefault();
      onResetError();
      fetchCheckOut(cart)
      .then(({userCart}) =>{
        onSetCart(userCart);
      })
      .catch( err => {
        onSetError(err); 
      });
    }

    
  return (
    <div className="content-cart">
      { show === SHOW_CART.PENDING && <Loading className="cart__waiting">Loading cart...</Loading> }
      { show === SHOW_CART.EMPTY && (
        <p>Your cart is empty now, let's start shopping!</p>
      )}
      { show === SHOW_CART.CART && (
        <ul className="cart-items">
          { cart.cartSequence.map( productId => (
            <li className="cart-item" key={productId}>
              <CartItem
                cart={cart}
                products={products}
                productId={productId}
                quantity={cart.cartContent[productId]}
                onSetCart={onSetCart}
                onSetError={onSetError}
              />
            </li>
          ))}
        </ul>
      )}
      { show === SHOW_CART.CART && (
        <div className="cart-checkout">
            <p className="total">Total price: ${totalPrice}</p>
            <button className="checkout"
            onClick={onCheckout}>Check out</button>
        </div>
      )}
    </div>
  );
}

export default Cart;