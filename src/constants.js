export const LOGIN_STATUS = {
  PENDING: 'pending',
  NOT_LOGGED_IN: 'notLoggedIn',
  IS_LOGGED_IN: 'loggedIn',
};

export const PAGE_STATUS = {
  PRODUCTS_PAGE: 'productsPage',
  CART_PAGE: 'cartPage',
  ACCOUNT_PAGE: 'accountPage',
  PENDING: 'pending',
};

export const SERVER = {
  AUTH_MISSING: 'auth-missing',
  AUTH_INSUFFICIENT: 'auth-insufficient',
  REQUIRED_USERNAME: 'required-username',
  SHORT_INVENTORY: 'lack-inventory',
};

export const CLIENT = {
  NETWORK_ERROR: 'networkError',
  NO_SESSION: 'noSession',
};

export const MESSAGES = {
  [CLIENT.NETWORK_ERROR]: 'Trouble connecting to the network.  Please try again',
  [SERVER.AUTH_INSUFFICIENT]: 'Your username/password combination does not match any records, please try again.',
  [SERVER.REQUIRED_USERNAME]: 'Please enter a valid (letters and/or numbers) username',
  [SERVER.SHORT_INVENTORY]: 'Sorry. Some items are understock, please recheck inventory and try again!',
  default: 'Something went wrong.  Please try again',
};