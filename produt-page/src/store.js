import { createStore } from 'vuex';

export default createStore({
  state: {
    basket: [], // Array to store products in the basket
  },

  mutations: {
    // Add a product to the basket or update its quantity if it already exists
    addToBasket(state, product) {
      const existingProduct = state.basket.find((item) => item.id === product.id);
      if (existingProduct) {
        // Increment quantity if the product already exists
        existingProduct.quantity += product.quantity || 1;
      } else {
        // Add new product with default quantity of 1 if not provided
        state.basket.push({
          ...product,
          quantity: product.quantity || 1,
          price: Number(product.price), // Ensure price is a number
        });
      }
    },

    // Remove a product from the basket
    removeFromBasket(state, productId) {
      state.basket = state.basket.filter((item) => item.id !== productId);
    },

    // Update the quantity of a product in the basket
    updateQuantity(state, { productId, quantity }) {
      console.log('Updating quantity for product ID:', productId, 'to:', quantity);
      const productIndex = state.basket.findIndex((item) => item.id === productId);
      if (productIndex !== -1) {
        const newQuantity = parseInt(quantity, 10);
        if (!isNaN(newQuantity) && newQuantity > 0) {
          // Create a new object and replace the old product in the basket
          const updatedProduct = { ...state.basket[productIndex], quantity: newQuantity };
          state.basket.splice(productIndex, 1, updatedProduct);  // Ensures reactivity
        } else if (newQuantity === 0) {
          // Remove the product if quantity is set to 0
          state.basket.splice(productIndex, 1);  // Properly remove the item
        }
      }
    },
  },

  getters: {
    // Calculate the total amount dynamically
   
    totalAmount(state) { console.log('Recalculating total...');
      return state.basket.reduce((total, item) => total + item.price * item.quantity, 0);
      
    },
  },
  actions: {
    // Dispatch addToBasket mutation
    addToBasket({ commit }, product) {
      commit('addToBasket', product);
    },

    // Dispatch removeFromBasket mutation
    removeFromBasket({ commit }, productId) {
      commit('removeFromBasket', productId);
    },

    // Dispatch updateQuantity mutation
    updateQuantity({ commit }, { productId, quantity }) {
      commit('updateQuantity', { productId, quantity });
    },
  },
});
