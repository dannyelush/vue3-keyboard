<template>
  <textarea v-keyboard v-model="text"/>

  <Keyboard v-model="text"/>  
</template>

<script setup>
import { ref } from 'vue';
import Keyboard from './components/Keyboard.vue'

const text = ref('Wow');

const text2 = ref('Second');
</script>