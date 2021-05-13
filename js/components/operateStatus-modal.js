export default {
  data() {
    return {
      modal: null,
    };
  },

  mounted() {
    this.modal = new bootstrap.Modal(this.$refs.modal);
  },

  methods: {
    openModal() {
      this.modal.show();
    }
  },

  props: ['msg', 'isSuccessful'],
  template:
    `
    <div class="modal fade" tabindex="-1" ref="modal">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-body shadow">
            <!-- 操作成功 -->
            <h5 class="mb-0 fw-bold text-success d-flex align-content-center justify-content-center" v-if="isSuccessful">
              <i class="fas fa-check-circle d-inline-block me-1"></i>
              {{ this.msg }}
            </h5>

            <!-- 操作失敗 -->
            <h5 class="mb-0 fw-bold text-danger d-flex align-content-center justify-content-center" v-else>
              <i class="fas fa-times-circle d-inline-block me-1"></i>
              {{ this.msg }}
            </h5>
          </div>
        </div>
      </div>
    </div>
    `
}