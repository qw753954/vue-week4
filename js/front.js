import operateStatusModal from './components/operateStatus-modal.js'; // 操作成功或失敗的提示 modal
import productInfoModal from './components/productInfo-modal.js'; // 產品介紹 modal
import pagination from './components/pagination2.js'; // 分頁元件


VeeValidate.defineRule('email', VeeValidateRules['email']);
VeeValidate.defineRule('required', VeeValidateRules['required']);

VeeValidateI18n.loadLocaleFromURL('./json/zh_TW.json');

VeeValidate.configure({
  generateMessage: VeeValidateI18n.localize('zh_TW'), // 切換成中文版
  validateOnInput: true, // 調整為輸入字元立即進行驗證
});


const app = Vue.createApp({
  data() {
    return {
      products: [],
      tempProduct: {},
      pagination: {},
      carts: [],
      cartsTotal: 0, // 原價
      cartsFinalTotal: 0, // 折扣完

      msg: '',
      isSuccessful: true, // 操作成功 or 失敗，會影響 modal 的文字顏色呈現 ( 綠->成功, 紅->失敗 )
      couponCode: '',

      orderInfo: {
        user: {
          email: '',
          tel: '',
          name: '',
          region: '台北市',
          address: '',
          payment: '',
        },
        message: '',
      },


      loadingBtn: { // 讀取效果 ...(ˊ_>ˋ)//
        addCart: '',
        info: '',
        delCart: '',
        coupon: ''
      }
    }
  },

  created() {
    // 初始化，頁面載入時就呈現產品、購物車列表
    this.getProduct();
    this.getCart();
  },

  methods: {
    // 取得產品列表
    getProduct(page = 1) {
      // get 產品列表
      axios.get(`${apiUrl}/api/${apiPath}/products?page=${page}`)
        .then(res => {
          console.log('getProduct', res);
          if (!res.data.success) return;

          this.products = res.data.products;
          this.pagination = res.data.pagination;
        })
        .catch(err => {
          console.log(err.response);
        });
    },

    // 取得產品細節
    getProductInfo(item) {
      this.loadingBtn.info = item.id;
      axios.get(`${apiUrl}/api/${apiPath}/product/${item.id}`)
        .then(res => {
          console.log('getProductInfo', res);
          if (!res.data.success) return;

          this.tempProduct = res.data.product;
          this.openModal('info')
          this.loadingBtn.info = '';
        })
        .catch(err => {
          console.log(err.response);
        });
    },

    // 取得購物車列表
    getCart() {
      axios.get(`${apiUrl}/api/${apiPath}/cart`)
        .then(res => {
          console.log('getCart', res);
          if (!res.data.success) return;

          this.carts = res.data.data.carts;
          this.cartsTotal = res.data.data.total;
          this.cartsFinalTotal = res.data.data.final_total;
        })
        .catch(err => {
          console.log(err.response);
        });
    },

    // 加入購物車  ****大部分註解都在這
    addToCart(product_id, qty = 1) {
      if (qty < 1) {
        this.isSuccessful = false; // 數量小於 1 就擋請求 -> 操作失敗！等等的 modal 會是失敗提示
        this.openModal('operateStatus', '產品數量不能小於 1'); // [] 開始處理開啟 modal 事宜
        return; // 中斷函式
      }

      // .. 尚未撈到遠端資料先秀 loading
      this.loadingBtn.addCart = product_id;

      const data = {
        data: {
          product_id, qty
        }
      }
      axios.post(`${apiUrl}/api/${apiPath}/cart`, data)
        .then(res => {
          console.log('addToCart', res);
          if (!res.data.success) return;


          /* 撈完了～已儲存到資料庫 */
          this.getCart(); // 重新取得 + 渲染購物車列表
          this.isSuccessful = true; // 操作成功！等等的 modal 會是成功提示
          this.openModal('operateStatus', res.data.message); // [] 開始處理開啟 modal 事宜
          this.loadingBtn.addCart = ''; // .. 消除 loading
          this.$refs.productInfoModal.closeModal(); // 自動關閉產品細節 modal
        })
        .catch(err => {
          alert('no')
          console.log(err, err.response);
        })
    },

    // 刪除單筆購物車
    delCartItem(id) {
      this.loadingBtn.delCart = id;

      axios.delete(`${apiUrl}/api/${apiPath}/cart/${id}`)
        .then(res => {
          console.log('delCartItem', res);
          if (!res.data.success) return;

          this.getCart();

          this.openModal('success', res.data.message);
          this.loadingBtn.delCart = '';
        })
        .catch(err => {
          console.log(err.response);
        })
    },

    // 套用優惠券
    useCoupon() {
      this.loadingBtn.coupon = 'default';

      const data = {
        data: {
          code: this.couponCode
        }
      }
      axios.post(`${apiUrl}/api/${apiPath}/coupon`, data)
        .then(res => {
          console.log(res);

          if (!res.data.success) {
            this.isSuccessful = false;
            this.openModal('operateStatus', res.data.message);
          } else {
            this.getCart();
            this.isSuccessful = true;
            this.openModal('operateStatus', res.data.message);
          }
          this.loadingBtn.coupon = '';
        })
        .catch(err => {
          console.log(err.response);
        })
    },

    // 開啟 modal
    openModal(type, msg) {
      switch (type) {
        case 'operateStatus':
          this.msg = msg;
          this.$refs.operateStatusModal.openModal();
          break;

        case 'info':
          this.$refs.productInfoModal.openModal();
          break;

        default:
          break;
      }
    },

    // 表單驗證 + 送出
    onSubmit(values, { resetForm }) {
      // console.log(this.orderInfo.user);
      const data = {
        data: this.orderInfo
      }
      axios.post(`${apiUrl}/api/${apiPath}/order`, data)
        .then(res => {
          console.log('submitForm', res);

          if (!res.data.success) {
            this.isSuccessful = false;
            this.openModal('operateStatus', res.data.message);
            return;
          }

          this.isSuccessful = true;
          resetForm();
          this.getCart();

          this.openModal('operateStatus', res.data.message);
        })
        .catch(err => {
          console.log(err.response);
        })
    },

    isPhone(value) {
      if (!value) return '手機 為必填';
      const phoneNum = /^(09)[0-9]{8}$/;
      return phoneNum.test(value) ? true : '手機 格式不正確';
    },

  }
})

app.component('productInfoModal', productInfoModal)
app.component('operateStatusModal', operateStatusModal)
app.component('pagination', pagination)

// vee-validate
app.component('VForm', VeeValidate.Form);
app.component('VField', VeeValidate.Field);
app.component('ErrorMessage', VeeValidate.ErrorMessage);

app.mount('#app');