<template>
    <div>

        <CodeForm />

        <CodeList />

    </div>
</template>

<script setup>
    import { onMounted } from 'vue'
    import  CodeForm  from '@/components/Code/CodeForm.vue'
    import  CodeList  from '@/components/Code/CodeList.vue'

    onMounted(() => {
        console.log(import.meta.env.VITE_APP_NAME)
    })
</script>

<style>
    
</style>