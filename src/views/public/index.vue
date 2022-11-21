<template>
    <div>

        <CodeForm />

    </div>
</template>

<script setup>
    import { onMounted } from 'vue'
    import  CodeForm  from '@/components/Code/CodeForm.vue'

    onMounted(() => {
        console.log(import.meta.env.VITE_APP_NAME)
    })
</script>

<style>
    
</style>