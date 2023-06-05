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
                    <button
                        @click="deleteRecord(code.id)"
                        class="btn-sm btn-danger"
                    ><strong>X</strong></button>
                </div>
            </div>
        </div>

    </div>
</template>

<script setup>
    import { onMounted, reactive, computed } from 'vue'
    import { useCodeStore } from '@/stores/code'
    import { find } from 'lodash'

    const codeStore = useCodeStore()

    const obj = reactive({
        codes: [],
        refreshComponent: 0,
    })

    function deleteRecord(codeId) {
        console.log(codeId)
        codeStore.destroy(codeId)
            .then((res) => {
                console.log(res)
                obj.codes = codeStore.codes

                obj.refreshComponent += 1

            })
            .catch((err) => {

            })
    }

    onMounted(() => {
        // codeStore.getAll()
        // .then((res) => {
        //     // obj.codes = res.data
        //     obj.codes = codeStore.codes
        // })
        // .catch((err) => {
        //     console.log('[Code] - getAll() not working')
        // })
    })

</script>

<style scoped>
    
</style>