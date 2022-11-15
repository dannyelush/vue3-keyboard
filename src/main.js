import { createApp } from 'vue'
import './style.css'
import App from './App.vue'

const app = createApp(App);

app.directive('keyboard', {
  created(el) {
    el.classList.add('use-keyboard-input');
  },
})

app.mount('#app')
