// import { createApp } from 'https://cdnjs.cloudflare.com/ajax/libs/vue/3.0.9/vue.esm-browser.js';
import delProductModal from './components/delProduct-modal.js';
import productModal from './components/product-modal.js';
import pagination from './components/pagination.js';

const app = Vue.createApp({
  data() {
    return {
      products: [],
      tempProduct: {},
      pagination: {},
      isNew: false
    }
  },

  methods: {
    getProduct(page = 1) { // 先給預設值 1
      JsLoadingOverlay.show();

      const api = `${apiUrl}/api/${apiPath}/admin/products?page=${page}`;
      axios.get(api)
        .then(res => {
          this.products = res.data.products;
          this.pagination = res.data.pagination;
          // 結構大概是 {total_pages: 1, current_page: 1, has_pre: false, has_next: false, category: null}

          JsLoadingOverlay.hide();
        })
        .catch(err => {
          console.log(err.response);
        })
    },
    openModal(type, item) {
      switch (type) {
        case 'new':
          this.tempProduct = {};
          this.isNew = true;
          this.$refs.productModal.openModal();
          break;
        case 'edit':
          this.isNew = false;
          this.tempProduct = JSON.parse(JSON.stringify(item));
          this.$refs.productModal.openModal();
          break;
        case 'delete':
          this.tempProduct = JSON.parse(JSON.stringify(item));
          this.$refs.delProductModal.openModal();
          break;
        default:
          break;
      }
    },
  },
  created() {
    // 從 cookie 取出剛剛登入時存放的 token
    const token = document.cookie.replace(/(?:(?:^|.*;\s*)token\s*\=\s*([^;]*).*$)|^.*$/, "$1");

    if (token === '') {
      window.location = 'index.html';
    }

    // request headers
    axios.defaults.headers.common.Authorization = token;

    // 初始化，取出產品資料
    this.getProduct();
  }
})


  // 產品新增 & 編輯元件
  .component('productModal', productModal)

  // 產品刪除元件
  .component('delProductModal', delProductModal)

  // 分頁元件
  .component('pagination', pagination)

app.mount('#app');