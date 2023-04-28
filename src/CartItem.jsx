import {
  fetchUpdateCart,
} from './services';

function CartItem({
    cart,
    products,
    productId,
    quantity,
    onSetCart,
    onSetError,
}) {

    let buttonDisable = false;
    let subtotal = products[productId].price * quantity;

    function addQuantity(e){
      e.preventDefault();
      let targetId = e.target.dataset.id;
      if (cart.cartContent[targetId] >= products[productId].quantity) {
        buttonDisable = true;
        return;
      } else {
        cart.cartContent[targetId] += 1;
        if (cart.cartContent[targetId] === products[productId].quantity) {
          buttonDisable = true;
        }
      }

      fetchUpdateCart(cart)
      .then(({userCart}) =>{
        onSetCart(userCart);
      })
      .catch( err => {
        onSetError(err); 
      });
    }

    function minusQuantity(e){
      e.preventDefault();
      let targetId = e.target.dataset.id;
      if (cart.cartContent[targetId] === 1) {
        cart.cartSequence.splice(cart.cartSequence.indexOf(targetId), 1);
        delete cart.cartContent[targetId];
      } else {
        cart.cartContent[targetId] -= 1;
        buttonDisable = false;
      }

      fetchUpdateCart(cart)
      .then(({userCart}) =>{
        onSetCart(userCart);
      })
      .catch( err => {
        onSetError(err); 
      });
    }
    
    return (
      <>
        <img className="cart-img" alt={products[productId].name} src={products[productId].image}/>
        <span className="cart-name">Name: {products[productId].name}</span>
        <span className="cart-price">Price: ${subtotal.toFixed(2)}</span>
        <div className="cart-quantity">
          <button className="cart-button" 
          data-id={productId}
          onClick={minusQuantity}> - </button>
          <span data-id={productId}>Quantity: {quantity}</span>
          <button className="cart-button" 
          data-id={productId}
          onClick={addQuantity}
          disabled={buttonDisable}> + </button>
        </div>
      </>
    );
  }
  
  export default CartItem;