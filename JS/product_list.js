// 引入 vue 環境
import { createApp } from 'https://cdnjs.cloudflare.com/ajax/libs/vue/3.2.27/vue.esm-browser.min.js';

// 引入 pagination 元件
import pagination from './pagination.js'

let productModal = null;
let deleteProductModal = null;

// api 相關資訊
let url = 'https://vue3-course-api.hexschool.io/v2';
let api_path = 'karen666';

// 根元件
const app = createApp({

    // 區域元件
    components: {
        pagination
    },

    data() {
        return {

            // 商品資料
            productData: [],
            tempProduct: {
                imageUrls: []
            },
            // 與分頁元件的 props 使用
            pagination: {},

            isNew: false,
        }
    },

    methods: {

        // 驗證身份的 post API
        checkLogin(){
            // token 儲存
        const saveToken = document.cookie.replace(/(?:(?:^|.*;\s*)userToken\s*\=\s*([^;]*).*$)|^.*$/, "$1");
        // 用 axios 不用反覆登入驗證
        axios.defaults.headers.common['Authorization'] = saveToken;

        // 驗證身份
        const api_url = `${url}/api/user/check`;
        axios.post(api_url)
        .then(res => {
            // console.log(res.data);
            this.getProductData()
        })
        .catch(error => {
            // console.log(error);
        })    
        },

        // 取得產品資料 get API
                    // 參數預設值 (避免出現 undefined)
        getProductData(page = 1){
            axios.get(`${url}/api/${api_path}/admin/products?page=${page}`)
            .then(res => {
                // console.log(res.data.pagination);
                this.productData = res.data.products;
                this.pagination = res.data.pagination;
            })
            .catch(err => {
                console.log(err);
            })
        },

        // 打開 modal 的函式 (統一集中)
        openModal(status, productFile){
            
            if(status === 'isNew'){

                productModal.show();

                this.tempProduct = {

                    imageUrls: []
                };
            
                this.isNew = true;

            } else if (status === 'edit'){

                productModal.show();

                this.tempProduct = { ...productFile };
                
                this.isNew = false;

            } else if (status === 'delete'){

                deleteProductModal.show();
                // 將品項帶入
                this.tempProduct = { ...productFile };
            }
            
        },

    },

    mounted() {

        this.checkLogin();

        // 初始化兩個 modal 元件
        productModal = new bootstrap.Modal(document.getElementById('productModal'), {
            keyboard: false
          });

        deleteProductModal = new bootstrap.Modal(document.getElementById('delProductModal'), {
            keyboard: false
          });

    },
    
});

// 全域元件 : 新增、編輯產品 modal
app.component('productModalComponent', {

    template: '#templateForProductModal',
    props: ['tempProduct', 'isNew'],

    methods: {
        // 新增及編輯產品 API
        updateProduct(){

            if(!this.isNew){
                axios.put(`${url}/api/${api_path}/admin/product/${this.tempProduct.id}`, {data: this.tempProduct})
                .then(res => {
                    // console.log(res.data);
                    productModal.hide();
                    // this.getProductData();
                    this.$emit('get-product-data');
                })
                .catch(err => {
                    console.dir(err);
                })
            }else{
                axios.post(`${url}/api/${api_path}/admin/product`, {data: this.tempProduct})
            .then(res => {
                // console.log(res.data);
                productModal.hide();
                // this.getProductData();
                this.$emit('get-product-data');
            })
            .catch(err => {
                console.dir(err);
            })
            }
        },
    }
})

// 全域元件 : 刪除產品 modal

app.component('delete-product-modal-component', {

    template: '#templateForDeleteModal',
    props: ['tempProduct'],

    methods: {

        // 刪除商品
        deleteProduct(){
            axios.delete(`${url}/api/${api_path}/admin/product/${this.tempProduct.id}`)
            .then(res => {
                // console.log(res.data);
                deleteProductModal.hide();
                // this.getProductData();
                this.$emit('get-product-data')
            })
            .catch(err => {
                console.dir(err);
            })
        }

    }
})

app.mount('#app');