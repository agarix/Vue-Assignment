<template>
  <div id="app">
    <h1>Product Page</h1>

 
<div class="searchBar">

    <!-- Search Input -->
    <div class="search-wrapper">
    <input v-model="searchQuery" placeholder="Search Products" class="search-input" />
    <i class="fas fa-search search-icon"></i>
  </div>
     <div>
    <!-- Apply Filters Button -->
    <button @click="toggleFilterPanel" class="apply-filters-btn"> <i class="fas fa-sliders settings-icon"></i></button>
  <!-- Cart Button -->
  <button @click="showModal" class="cart-button">
    <i class="fas fa-shopping-cart cart-icon"></i> Cart
    </button>
  </div>
  </div>
    <!-- Right-Side Navigation Panel -->
    <div v-if="isFilterPanelVisible" class="filter-panel">
      <button @click="toggleFilterPanel" class="close-btn">X</button>
      <h2>Filters</h2>

      <!-- Category Filter (Multiple Checkboxes) -->
      <div class="categoryList">
        <h3>Categories</h3>
        <div class="categoryItem" v-for="category in categories" :key="category.slug">
  <input
    type="checkbox"
    :id="category.slug"
    :value="category.slug"
    v-model="selectedCategories"
  />
  <label :for="category.slug">{{ category.name }}</label>
</div>
      </div>

      <!-- Sorting Dropdown -->
      <div>
        <label class="sortLabel" for="sorting">Sort By</label>
        <select v-model="sortingOption" id="sorting">
          <option value="">Default</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
          <option value="name-asc">Name: A to Z</option>
          <option value="name-desc">Name: Z to A</option>
        </select>
      </div>

      <!-- Clear Filters Button -->
      <button @click="clearFilters" class="clear-filters-btn"> Clear Filters</button>
    </div>

    <!-- Product List -->
    <ProductList
      @add-to-basket="showModal"
      :search-query="searchQuery"
      :selected-category="selectedCategory"
      :selected-categories="selectedCategories"
      :sorting-option="sortingOption"
    />

    <!-- Basket Modal -->
    <BasketModal :isVisible="isModalVisible" @close="closeModal" />
    <!-- <Basket /> -->
  </div>
</template>

<script>
import { ref, reactive, onMounted } from 'vue';  // Import Composition API functions
import ProductList from './components/ProductList.vue';
import BasketModal from './components/BasketModal.vue';

export default {
  components: {
    ProductList,
    BasketModal
  },
  setup() {
    const searchQuery = ref('');  // Reactive reference for search input
    const selectedCategory = ref('');  // Reactive reference for category select
    const categories = ref([]);
    const isModalVisible = ref(false); // Define modal visibility state
    const sortingOption = ref("");
    const selectedCategories = ref([]);
    const isFilterPanelVisible = ref(false);

    const toggleFilterPanel = () => {
      isFilterPanelVisible.value = !isFilterPanelVisible.value;
    };

    const clearFilters = () => {
      sortingOption.value = ""; // Reset to default
      selectedCategories.value = []; // Clear categories
      searchQuery.value = ""; // Clear search query
    };

    // Fetch categories from API
    onMounted(() => {
      fetch("https://dummyjson.com/products/categories")
        .then((response) => response.json())
        .then((data) => {
          // If data is a string array, capitalize each string
          if (Array.isArray(data) && typeof data[0] === "string") {
            categories.value = data.map((category) => ({
              slug: category,
              name: category.charAt(0).toUpperCase() + category.slice(1),
            }));
          } else if (Array.isArray(data) && typeof data[0] === "object") {
            // Handle object array, assuming category.slug exists
            categories.value = data.map((category) => ({
              slug: category.slug,
              name: category.name || category.slug, // Use name or fallback to slug
            }));
          } else {
            console.error("Unexpected data format:", data);
          }
        })
        .catch((error) => console.error("Failed to fetch categories:", error));
    });

    // Define the showModal method
    const showModal = () => {
      console.log('Opening the basket modal'); // Debugging line
      isModalVisible.value = true;
    };

    // Define the closeModal method
    const closeModal = () => {
      isModalVisible.value = false;
    };

    return {
      searchQuery,
      selectedCategory,
      selectedCategories,
      categories,
      isModalVisible,
      sortingOption,
      isFilterPanelVisible,
      toggleFilterPanel,
      clearFilters,
      showModal,
      closeModal,
    };
  },
  methods: {
    showModal() {
      console.log('Showing modal'); // Debugging line
      this.isModalVisible = true;
    },
    closeModal() {
      this.isModalVisible = false;
    }
  },
};
</script>

<style>


.searchBar {
    display: flex;
    justify-content: space-between;
    align-items: self-start;
}
.fa-magnifying-glass:before, .fa-search:before {
    content: "\f002";
    color: #414141;
}
input:focus-visible {
    outline:none ;
}

.filter-panel {
  position: fixed;
  top: 0;
  right: 0;
  width: 300px;
  height: 100%;
  background-color: #ffffff;
  box-shadow: -2px 0 5px rgba(0, 0, 0, 0.2);
  z-index: 1000;
  padding: 20px;
  overflow-y: auto;
  transform: translateX(0);
  transition: transform 0.3s ease;
}

.apply-filters-btn {
  background-color: white;
    color: #01458e;
    border: 2px solid #01458e;
    padding: 8px 14px;
    border-radius: 7px;
    cursor: pointer;
    margin-left: 23px;
    height: 42px;
    border: 2px solid #01458e;
}

.apply-filters-btn:hover {
  background: #01458e !important;
    border: 2px solid #01458e;
    color: #ffffff;
    transition: 0.7s;
}

.clear-filters-btn {
  background-color: #dc3545;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-top: 10px;
}

.clear-filters-btn:hover {
  background-color: #c82333;
}

.close-btn {
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
  float: right;
}

.close-btn:hover {
  color: red;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin: 60px 50px;
}

.search-wrapper {
  position: relative;
    display: inline-block;
    width: 100%;
    flex: 1 0;
}

#app .search-wrapper input {
  width: -webkit-fill-available;
    height: 42px;
    border-radius: 7px;
    border: none;
    background: #e0efff;
    padding-left: 34px;
    font-size: 15px;
}

.search-icon {
  position: absolute;
  top: 50%;
  left: 10px;
  transform: translateY(-50%);
  color: #888; /* Icon color */
}

.cart-button {
  background-color: #01458e;
    color: #ffffff;
    padding: 10px 20px;
    border: 2px solid #01458e;
    border-radius: px;
    cursor: pointer;
    font-size: 16px;
    margin-bottom: 20px;
    height: 43px;
    margin-left: 23px;
}

.cart-button:hover {
  background-color: #ffffff !important;
    color: #01458e;
    transition: 0.7s;

}
</style>
