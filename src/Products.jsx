import ProductItem from './ProductItem';

function Products({
    products,
    cart,
    onSetCart,
    onSetError,
}) {

  return (
    <div className="content-products">
      { 
        <div className="products">
          { Object.values(products).map( product => {
            if(product.quantity > 0) {
              return (<li className="product" key={product.productId}>
              <ProductItem
                product={product}
                cart={cart}
                onSetCart={onSetCart}
                onSetError={onSetError}
              />
            </li>
            );}
          })}
        </div>
      }
    </div>
  );
}

export default Products;