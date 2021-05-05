export default { // 會成為 html 標籤名稱
  template: '#productModal', // 樣板內容綁定在 <script ... id="productModal"></script> 裡
  props: ['product', 'isNew'], // 屬性名稱
  data() {
    return {
      modal: null,
    };
  },

  methods: {
    updateProduct() {
      let api, httpMethod;
      if (this.isNew) {
        // 新增商品 API
        api = `${apiUrl}/api/${apiPath}/admin/product`;
        httpMethod = 'post';
      } else {
        // 編輯商品 API
        api = `${apiUrl}/api/${apiPath}/admin/product/${this.product.id}`;
        httpMethod = 'put';
      }

      JsLoadingOverlay.show();
      axios[httpMethod](api, { data: this.product })
        .then((response) => {
          if (!response.data.success) {
            alert(response.data.message);
            JsLoadingOverlay.hide();
            return;
          }

          this.hideModal();
          this.$emit('update');
          JsLoadingOverlay.hide();
        })
        .catch(err => {
          console.log(err.response);
        });
    },
    openModal() {
      this.modal.show();
    },
    hideModal() {
      this.modal.hide();
    },
  },

  mounted() {
    this.modal = new bootstrap.Modal(this.$refs.modal, {
      keyboard: false,
      backdrop: 'static'
    });
  }
}