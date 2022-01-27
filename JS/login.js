import { createApp } from 'https://cdnjs.cloudflare.com/ajax/libs/vue/3.2.27/vue.esm-browser.min.js';

const baseUrl = 'https://vue3-course-api.hexschool.io/v2';


const app = createApp({

    data() {
        return {
            userData: {
                username: '',
                password: ''
            }
        }
    },

    methods: {

        login(){
            // post 帶入 api + 帳密 userData 物件
            axios.post(`${baseUrl}/admin/signin`, this.userData)
            .then(res => {
                console.log(res.data);
                const { token, expired } = res.data;
                // 1. 把上一行取出的 token 及 expired 個別存入 cookie
                document.cookie = `karenzToken=${token}; expires= ${new Date (expired)};`;

                // 2-1. 把 token 單獨取出來，等下要給 axios 自動驗證使用
                const tokenSaver = document.cookie.replace(/(?:(?:^|.*;\s*)karenzToken\s*\=\s*([^;]*).*$)|^.*$/, "$1");
                // 2-2. saveToken 存入 axios 自動驗證
                axios.defaults.headers.common['Authorization'] = tokenSaver;

                window.location = 'admin.html';

            })
            .catch(err => {
                console.log(err);
            })
        },

    },

})

app.mount('#app');


