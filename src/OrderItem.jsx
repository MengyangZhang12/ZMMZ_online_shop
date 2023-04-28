function OrderItem({
    orderContent,
    products,
}) {

  return (

    <ul className="order-items">
        { Object.keys(orderContent).map( productId => (
            <li className="order-item" key={productId}>
                <span >Product: {products[productId].name}</span>
                <span >Unit price: {products[productId].price}</span>
                <span >Quantity: {orderContent[productId]}</span>
            </li>
        ))}
    </ul>

  );
}

export default OrderItem;