<template>
    <div>
        <div v-if="obj.codes.length">
            <h3 class="margin-top margin-bottom">History</h3>
            <div v-for="code in obj.codes" class="width-1-1 child-width-1-2">
                <div>{{ code.title }}</div>
                <div class="align-right">
                    <button 
                        @click="editRecord(code.id)"
                        class="btn">
                        Edit
                    </button>
                </div>
            </div>
        </div>

    </div>
</template>

<script setup>
    import { onMounted, reactive, computed } from 'vue'
    import { useCodeStore } from '@/stores/code'

    const codeStore = useCodeStore()

    const obj = reactive({
        codes: [],
    })

    onMounted(() => {
        codeStore.getAll()
        .then((res) => {
            obj.codes = res.data
        })
        .catch((err) => {
            console.log('[Code] - getAll() not working')
        })
    })

</script>

<style scoped>
    
</style>