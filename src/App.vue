<template>
  <!-- Replace this with router then move the (PublicMain) template to the views -->
  <PublicMain :title="`CodeToImage`">
    <PublicIndex />
  </PublicMain>
</template>

<script setup lang="ts">

  import PublicMain from './layouts/public/main.vue'

  import PublicIndex from './views/public/index.vue'

  import { onMounted, ref } from 'vue'
  import { useCodeStore } from './stores/code'

  const codeStore = useCodeStore()

  // @ts-ignore
  window.stores = { codeStore }

  onMounted(() => {
    codeStore.init()
  })

</script>

<style lang="scss">
  @import "./assets/scss/main.scss"
</style>
