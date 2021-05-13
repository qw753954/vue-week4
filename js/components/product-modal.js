export default {
  template: '#productModal',
  props: ['product', 'isNew'],
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
        .then(res => {
          if (!res.data.success) {
            alert(res.data.message);
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