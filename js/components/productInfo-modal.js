export default {
  data() {
    return {
      modal: null,
      qty: 1
    };
  },

  mounted() {
    this.modal = new bootstrap.Modal(this.$refs.modal, {
      keyboard: false,
      backdrop: 'static',
    });
  },

  methods: {
    openModal() {
      this.modal.show();
    },
    closeModal() {
      this.modal.hide();
    }
  },

  props: ['product', 'loadingBtn'],
  template:
    ` 
    <div class="modal fade" tabindex="-1" ref="modal">
      <div class="modal-dialog modal-dialog-centered modal-lg">
        <div class="modal-content">
          <div class="modal-header bg-light">
            <h5 class="modal-title">{{ product.title }}</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body position-relative">
            <div class="row">
              <div class="col-xl-5">
                <img :src="product.image" :alt="product.title" class="img-fluid rounded mt-4 mt-xl-0">
              </div>
              <div class="col-xl-7">

                <div v-if="product.origin_price !== product.price">
                  <h5><span class="badge px-3 py-2 rounded-pill bg-success">原價</span></h5>
                  <p class="ps-1 mb-4">
                    $ {{ product.origin_price }}
                  </p>                
                </div>

                <h5><span class="badge px-3 py-2 rounded-pill bg-success">售價</span></h5>
                <p class="h5 fw-bold ps-1 mb-4">$ {{ product.price }}</p>

                <h5><span class="badge px-3 py-2 rounded-pill bg-success">產品敘述</span></h5>
                <p class="ps-1 mb-4">{{ product.description ? product.description : '無' }}</p>

                <h5><span class="badge px-3 py-2 rounded-pill bg-success">說明內容</span></h5>
                <p class="ps-1">{{ product.content ? product.content : '無' }}</p>
                <p class="info-tag text-primary position-absolute"># {{ product.category }}</p>

                <hr class="my-4">

                <div class="input-group">
                    <input type="number" class="form-control w-50" min="1" v-model.number="qty">
                    <button class="btn btn-sm btn-outline-dark" type="button"
                    @click="$emit('emitAdd', product.id, qty)"
                    :disabled="loadingBtn.addCart == product.id">
                      <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"
                      v-if="loadingBtn.addCart == product.id"></span>  
                      加入購物車
                    </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    `
}