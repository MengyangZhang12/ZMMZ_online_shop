import {
    fetchOrders,
    fetchCancelOrder,
} from './services';

import Loading from './Loading';
import OrderItem from './OrderItem';

function Account({
    products,
    orders,
    onSetError,
    onSetOrders,
    onResetError,
}) {

  let show;

  const SHOW_ORDERS = {
    PENDING: 'pending',
    EMPTY: 'empty',
    ORDERS: 'orders',
  };

  if (orders.length === 0) {
    show = SHOW_ORDERS.EMPTY;
  } else {
    show = SHOW_ORDERS.ORDERS;
  }

  function onCancelOrder(e) {
    e.preventDefault();
    onResetError();
    let targetOrderId = e.target.dataset.id;
    fetchCancelOrder(targetOrderId)
      .then( () => {
        return fetchOrders(); 
      })
      .then( userOrders => {        
        if(!userOrders) {
          show = SHOW_ORDERS.EMPTY;
        } else {
          show = SHOW_ORDERS.ORDERS;
        }
        onSetOrders(userOrders);
      })
      .catch( err => {
        onSetError(err); 
    });
  }


  return (
    <div className="content-account">
      { show === SHOW_ORDERS.PENDING && <Loading className="orders__waiting">Loading Orders...</Loading> }
      { show === SHOW_ORDERS.EMPTY && (
        <p>No History Order, start shopping!</p>
      )}
      { show === SHOW_ORDERS.ORDERS && (
        <h2>Your history Orders: </h2>
      )}
      { show === SHOW_ORDERS.ORDERS && (
        <ul className="orders">
          { orders.map( order => (
            <li className="order" key={order.orderId}>
                <div className="order-id">OrderId: {order.orderId}</div>
                <div className="order-content">
                    <OrderItem
                        orderContent={order.items}
                        products={products}
                    />
                </div>
                <div className="order-total">Total: ${order.total}</div>
                <button data-id={order.orderId}
                onClick={onCancelOrder}
                >Cancel Order</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Account;