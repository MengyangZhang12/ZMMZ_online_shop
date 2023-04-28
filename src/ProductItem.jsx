import {
  fetchUpdateCart,
} from './services';

function ProductItem({
    product,
    cart,
    onSetCart,
    onSetError,

}) {

    let cartQuantity = 0;
    if(cart && cart.cartContent) {
      cartQuantity = cart.cartContent[product.productId] ? cart.cartContent[product.productId] : 0;
    }

    let buttonDisable = false;

    function addToCart(e){
        e.preventDefault();
        let targetId = e.target.dataset.id;

        if(!cart.cartContent[targetId]) {
          cart.cartSequence.unshift(targetId);
          cart.cartContent[targetId] = 1;
        } else if (cart.cartContent[targetId] >= product.quantity) {
          buttonDisable = true;
          return;
        } else {
          cart.cartContent[targetId] += 1;
          if (cart.cartContent[targetId] === product.quantity) {
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

    return (
      <>
        <img className="product-img" alt={product.name} src={product.image} />
        <span className="product-name" data-id={product.productId}>{product.name}</span>
        <span className="product-price" data-id={product.productId}>Price: ${product.price}</span>
        <span className="product-inventory" data-id={product.productId}>Inventory: {product.quantity}</span>
        <button className="product-cart" 
        data-id={product.productId}
        onClick={addToCart}
        disabled={buttonDisable}
        >Add to Cart | {cartQuantity} in cart</button>
      </>
    );
  }
  
  export default ProductItem;