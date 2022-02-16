import { createApp } from 'https://cdnjs.cloudflare.com/ajax/libs/vue/3.2.27/vue.esm-browser.min.js';

const url = 'https://vue3-course-api.hexschool.io/v2';

const app = createApp({

    data() {
        return {
            userInfo: {
                "username": '',
                "password": '',
            }
        }
    },

    methods: {

        // 登入帳號，同時儲存 cookie 跟 token
        login() {
            const api_url = `${url}/admin/signin`;

            axios.post(api_url, this.userInfo)
                .then(res => {
                    console.log(res.data);
                    // 從 res.data 解構取得：token, expired
                    const { token, expired } = res.data;
                    // 存 cookie
                    document.cookie = `userToken=${token}; expires= ${new Date(expired)};`;

                    // 轉址
                    window.location = './product_list.html';
                    
                })
                .catch(err => {
                    console.log(err);
                })
        },


    },

});

app.mount('#app')
