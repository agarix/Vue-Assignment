<template>
  <div v-if="isVisible" class="modal-overlay" @click.self="close">
    <div class="modal-content">
      <button class="modalclose close-btn" @click="close">X</button>
      <h2>Your Cart</h2>

      <!-- Display message if cart is empty -->
      <div v-if="basketItems.length === 0">Your cart is empty.</div>

      <!-- Table for displaying basket items -->
      <table v-else class="basket-table">
        <thead>
          <tr>
            <th>Product</th>
            <th>Price</th>
            <th>Quantity</th>
            <th>Total</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in basketItems" :key="item.id">
            <td class="productContent">
              <img 
                :src="item.thumbnail || 'https://via.placeholder.com/100'" 
                alt="Product Image" 
                class="product-image" 
                @error="handleImageError(item)" 
              />
              {{ item.title }}
            </td>
            <td>${{ item.price }}</td>
            <td>
 
  <input
    class="quantity-input"
    type="number"
    v-model.number="item.quantity"
    @change="updateQuantity(item.id, item.quantity)"
    min="1"
  />
</td>
            <td>${{ (item.price * item.quantity).toFixed(2) }}</td>
            <td>
              <button class="removeItem" @click="removeItem(item.id)">X</button>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- Total amount -->
      <h3>Total Amount: ${{ totalAmount.toFixed(2) }}</h3>
      <button class="cart-button checkout-button" >Check Out</button>

    </div>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex';

export default {
  props: ['isVisible'],
  computed: {
    ...mapState({
      basketItems: (state) => state.basket, // Map the basket array from Vuex state
    
    }),
    ...mapGetters(['totalAmount']),
  
  },
  methods: {
    close() {
      this.$emit('close');
    },
    removeItem(productId) {
      // state.basket.filter(item => item.id === product.id);

      // this.$store.commit('removeFromBasket', productId);
      this.$store.dispatch('removeFromBasket', productId);
    },
    updateQuantity(productId, quantity) {
    const newQuantity = parseInt(quantity, 10);
  
    if (!isNaN(newQuantity) && newQuantity >= 0) {
      // Call the Vuex mutation to update the quantity
      this.$store.commit('updateQuantity', { productId, quantity: newQuantity });
    }
  },
    handleImageError(item) {
      item.image = 'https://via.placeholder.com/100'; // Replace broken image with placeholder
    },
  },
};
</script>

<style scoped>
/* Table styling */
.basket-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
}

.basket-table th, .basket-table td {
  padding: 12px;
  text-align: left;
  border-bottom: 1px solid #ddd;
  font-size: 14px;
  color: #5e5e5e;
  font-weight: 500;
}

/* Product image styling */
.product-image {
  width: 50px;
  height: 50px;
  object-fit: cover;
  border-radius: 5px;
  margin-right: 10px;
}

/* Modal overlay styling */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

/* Modal content styling */
.modal-content {
  background-color: white;
  padding: 20px;
  border-radius: 5px;
  width: 500px;
  position: relative;
}

.modalclose {
  position: absolute;
  top: 10px;
  right: 10px;
  font-size: 20px;
  cursor: pointer;
}

.quantity-input {
  width: 58px;
}

.productContent {
  display: flex;
  align-items: center;
}

.removeItem {
  border-radius: 31px;
  padding: 5px 8px;
  border: none;
  cursor: pointer;
  font-size: 12px;
  font-weight: 500;
}

button.cart-button.checkout-button {
    margin-left: 0px;
    width: 277px;
    height: 44px;
    
}
</style>

