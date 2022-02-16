// 預設匯出 (區域元件)
export default {

    props: ['pages'],

    template: `<nav aria-label="Page navigation example">
    <ul class="pagination">

    <!-- 前 -->  
      <li class="page-item" :class="{ disabled: !pages.has_pre }">
        <a class="page-link" href="#" aria-label="Previous" @click.prevent="$emit('get-product', pages.current_page - 1)">
          <span aria-hidden="true">&laquo;</span>
          <span class="sr-only"> 上一頁</span>
        </a>
      </li>

      <!-- 頁數 1, 2, 3... -->   
      <li class="page-item" 
      v-for="page in pages.total_pages" 
      :key="page + 'page'"
      :class="{ active: page === pages.current_page }"
      >
        <a class="page-link" href="#" @click.prevent="$emit('get-product', page)">{{ page }}</a>
      </li>

      <!-- 後 -->
      <li class="page-item" :class="{ disabled: !pages.has_next }">
        <a class="page-link" href="#" aria-label="Next" @click.prevent="$emit('get-product', pages.current_page + 1)">
          <span aria-hidden="true">&raquo;</span>
          <span class="sr-only"> 下一頁</span>
        </a>
      </li>

    </ul>
  </nav>`

}

