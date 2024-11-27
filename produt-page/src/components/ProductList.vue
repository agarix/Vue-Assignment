<template>
  <div class="product-grid">
    <div v-for="product in filteredProducts" :key="product.id" class="product-item">
      <img :src="product.thumbnail" :alt="product.title" />
      <h3>{{ product.title }}</h3>
      <p>{{ product.description }}</p>
      <p class="productPrice">$ {{ product.price }} </p>
      <button class="cart-button" @click="addToBasket(product)">Add to Basket</button>
    </div>
    
  </div>
</template>

<script>
import axios from 'axios';
import { mapMutations } from "vuex";

export default {
  props: {
    searchQuery: {
      type: String,
      required: true
    },
    selectedCategories: {
      type: Array,
      required: true,
    },
    selectedCategory: {
      type: String,
      required: true
    },
    sortingOption: {
    type: String,
    required: true
  }
  },
  data() {
    return {
      products: []
    };
  },
  computed: {
    filteredProducts() {
      if (!this.products || this.products.length === 0) return []; // Handle undefined products

      let filtered = this.products.filter((product) => {
        const matchesCategory =
          !this.selectedCategories.length ||
          this.selectedCategories.includes(product.category);
        const matchesSearch = product.title
          .toLowerCase()
          .includes(this.searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
      });
      console.log("Filtered Products:", this.filteredProducts);
      // Sorting logic
      switch (this.sortingOption) {
      case "price-asc":
        filtered.sort((a, b) => a.price - b.price); // Low to High
        break;
      case "price-desc":
        filtered.sort((a, b) => b.price - a.price); // High to Low
        break;
      case "name-asc":
        filtered.sort((a, b) => a.title.localeCompare(b.title)); // A to Z
        break;
      case "name-desc":
        filtered.sort((a, b) => b.title.localeCompare(a.title)); // Z to A
        break;
      default:
        break; // Do nothing for invalid sorting option
    }

      return filtered;

      
    },
},
created() {
  axios.get('https://dummyjson.com/products')
    .then(response => {
      // Ensure that products have valid images before rendering
      this.products = response.data.products.map(product => ({
        ...product,
        thumbnail: product.thumbnail || 'https://via.placeholder.com/100', // Fallback to placeholder
      }));
    })
    .catch(error => {
      console.error('Error fetching products:', error);
    });
},
  methods: {
    addToBasket(product) {
      console.log('Adding to basket:', product); // Debugging line
  console.log('Product added:', product); // Debugging line
  this.$emit('add-to-basket'); // Emit event to trigger modal opening
  console.log('Current basket state:', this.$store.state.basket); // Debugging line

  const productWithImage = {
      ...product,
      image: product.images || 'default-image.jpg', // Ensure the image field exists
    };
    this.$store.commit('addToBasket', productWithImage);
    }
  },
  mutations: {
addToBasket(state, product) {
  const index = state.basket.findIndex(item => item.id === product.id);

  console.log('Current basket state mut:', state.basket); // Debugging line
  if (index !== -1) {
    // Update quantity for existing item
    state.basket = state.basket.map(item =>
      item.id === product.id
        ? { ...item, quantity: item.quantity + 1 }
        : item
    );
    console.log('Current basket state mutisif:', state.basket); // Debugging line
  } else {
    // Add new product
    state.basket = [...state.basket, { ...product, quantity: 1 }];
    console.log('Current basket state mutiselsef:', state.basket); // Debugging line
  }
},
removeFromBasket(state, productId) {
  const _res = state.basket.filter(item => item.id !== productId);
    state.basket =JSON.stringify(JSON.parse( _res));
  }
},
watch: {
  sortingOption(newValue) {
    console.log("Sorting option updated to:", newValue);
  },
},
};
</script>

<style scoped>
.product-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 30px;
}

.product-item {
  border: 1px solid #ddd;
    padding: 16px 22px;
    border-radius: 8px;
    text-align: center;
}

.product-item button.cart-button {
    margin-left: 0px;
    margin-right: auto;
    display: block;
    font-size: 13px;
    padding: 8px 11px;
    height: 37px;
    border-radius: 4px;
    margin-bottom: 8px;
    width: 100%;
   
}

.product-item img {
  max-width: 194px;
    height: auto;
    border-radius: 4px;
    width: 100%;
}

.product-item h3 {
  font-size: 1em;
  margin: 8px 0;
  text-align: left; 
}

.product-item p {
  margin: 9px 0 18px;
    font-size: 14px;
    line-height: 18px;
    color: #5d5d5d;
    display: -webkit-box;
  -webkit-line-clamp: 2;  
  -webkit-box-orient: vertical; 
  overflow: hidden; 
  text-overflow: ellipsis;
  text-align: left; 
}
p.productPrice {
  font-size: 18px !important;
    margin: 13px 0px;
    font-weight: 700;
    color: #01458e !important;
    font-family: sans-serif;
    text-align: left;
}


.product-item button:hover {
  background-color: #218838;
}
</style>
