export default {
  template: '#delProductModal',
  props: ['item'],
  data() {
    return {
      modal: null,
    };
  },

  methods: {
    delProduct() {
      JsLoadingOverlay.show();

      const api = `${apiUrl}/api/${apiPath}/admin/product/${this.item.id}`;
      axios.delete(api)
        .then(res => {
          if (!res.data.success) return;

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
      backdrop: 'static',
    });
  }
}