import { createApp } from 'https://cdnjs.cloudflare.com/ajax/libs/vue/3.2.27/vue.esm-browser.min.js';

// 統一放到 data 內
// const baseUrl = 'https://vue3-course-api.hexschool.io/v2';
// const api_path = 'karen666';

// 設定 Boostrap modal 初始值
let productModal = null;
let deleteProductModal = null;

const app = createApp({

    data() {
        return {
            baseUrl: 'https://vue3-course-api.hexschool.io/v2',
            api_path: 'karen666',
            newProduct: false,
            allProductsData: [],
            tempImgUrl: '',
            tempProduct: {
                imagesUrl: [],
            }
        }
    },
    
    methods: {

        // 確認 token 仍有效
        checkAdmin(){
            axios.post(`${this.baseUrl}/api/user/check`)
            .then(res => {
                console.log(res);
            })
            .catch(err => {
                console.log(err);
                window.location = 'login.html'
            })
        },

        // 驗證 token 後，取資料
        getProductData(){
            axios.get(`${this.baseUrl}/api/${this.api_path}/admin/products/all`)
            .then(res => {
                console.log(res.data.products);
                this.allProductsData = res.data.products;
            })
            .catch(err => {
                console.log(err);
            })
        },

        // 新增、修改、刪除產品都透過這個 method 打開 modal
        openModal(status, product){

            if(status === 'addProduct'){
                this.tempProduct = {
                    imagesUrl: [],
                };
                this.newProduct = true;
                productModal.show();

            }else if(status === 'modifyProduct'){
                
                this.tempProduct = { ...product };
                this.newProduct = false;
                productModal.show();

            }else if(status === 'deleteProduct'){

                this.tempProduct = { ...product };
                deleteProductModal.show();

            }
        },

        // 刪除單筆資料
        deleteProduct(){
            axios.delete(`${this.baseUrl}/api/${this.api_path}/admin/product/${this.tempProduct.id}`)
            .then(res => {
                console.log(res);
                this.getProductData();
                deleteProductModal.hide();
            })
            .catch(err => {
                console.log(err);
                alert(err.data.message);
            })
        },

        dispatchProduct(){
            
            if(this.newProduct === false){

                this.modifyProduct();  // 如果不是新產品，就走修改單筆資料的 API (從 openModal 那邊決定)
            
            }else{

                this.addNewProduct();  // 如果是新產品，就走新增單筆資料的 API (從 openModal 那邊決定)

            }

        },

        // 修改單筆資料
        modifyProduct(){
            // 這邊要注意物件格式，必須為 { data: ... } API 才會收
            axios.put(`${this.baseUrl}/api/${this.api_path}/admin/product/${this.tempProduct.id}`, {data: this.tempProduct})
            .then(res => {
                console.log(res);
                this.getProductData();
                productModal.hide();
            })
            .catch(err => {
                console.dir(err);
            })
        },

        // 新增產品資料
        addNewProduct(){
            axios.post(`${this.baseUrl}/api/${this.api_path}/admin/product`, { data: this.tempProduct })
            .then(res => {
                console.log(res);
                this.getProductData();
                productModal.hide();
            })
            .catch(err => {
                console.log(err);
            })
        },

        // uploadNewImg(){
        //     this.tempProduct.imagesUrl = [];
        //     this.tempProduct.imagesUrl.push('');
        // }
        addNewImg(){

            if(this.tempImgUrl === ""){
                return
            }

             // 為什麼沒有加入這一行就不會動？ this.tempProduct.imagesUrl = [];
            if(this.tempProduct.imagesUrl === undefined){
                this.tempProduct.imagesUrl = [];
            }

            this.tempProduct.imagesUrl.push(this.tempImgUrl);
            this.tempImgUrl = '';
            
        },

        deleteImg(){
            this.tempProduct.imagesUrl.pop();
        }


    },

    mounted() {

        // 取 token + axios 自動驗證
        const tokenSaver = document.cookie.replace(/(?:(?:^|.*;\s*)karenzToken\s*\=\s*([^;]*).*$)|^.*$/, "$1");
        axios.defaults.headers.common['Authorization'] = tokenSaver;
        this.checkAdmin();

        // 先 checkAdmin 通過驗證後，才能執行 getProductData() 取資料
        this.getProductData();

        // 刪除商品 modal
        deleteProductModal = new bootstrap.Modal(document.getElementById('deleteProductModal'), {
            keyboard: false
        });

        // 新增、修改商品 共用的 modal
        productModal = new bootstrap.Modal(document.getElementById('productModal'), {
            keyboard: false
        });
    },

})

app.mount('#app')