// 上週是參考範例檔案的，這週嘗試自己寫出來，之後會再整合成一個分頁元件

export default {
  props: ['pages'],
  template:
    `
    <nav aria-label="Page navigation example">
      <ul class="pagination pagination-sm justify-content-center">

        <li class="page-item" :class="{ disabled : !pages.has_pre }">
          <a href="#" class="page-link" @click.prevent="$emit('emitChange', pages.current_page - 1)">
            <i class="fas fa-chevron-left small"></i>
          </a>
        </li>

        <li class="page-item" v-for="(item, index) in pages.total_pages" :key="index"
        :class="{ 'active' : pages.current_page == item }">
          <a href="#" class="page-link" @click.prevent="$emit('emitChange', item)">{{ item }}</a>
        </li>

        <li class="page-item" :class="{ disabled : !pages.has_next }">
          <a href="#" class="page-link" @click.prevent="$emit('emitChange', pages.current_page + 1)">
            <i class="fas fa-chevron-right small"></i>
          </a>
        </li>

      </ul>
    </nav>
    `
}