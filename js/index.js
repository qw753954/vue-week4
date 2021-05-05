import { createApp } from 'https://cdnjs.cloudflare.com/ajax/libs/vue/3.0.9/vue.esm-browser.js';

createApp({
  data() {
    return {
      user: {
        username: '',
        password: '',
      },
    }
  },
  methods: {
    login() {
      const api = 'https://vue-course-api.hexschool.io/admin/signin';
      axios.post(api, this.user).then(res => {
        console.log(res);
        window.location = 'products.html';

        if (!response.data.success) return;

        // const { token, expired } = response.data;
        const token = response.data.token;
        const expired = response.data.expired;

        // 寫入 cookie token & expires 設置有效時間
        document.cookie = `token=${token};expires=${new Date(expired)}; path=/`;
      }).catch(err => {
        console.log(err.response);
      });
    },
  },
}).mount('#app');
