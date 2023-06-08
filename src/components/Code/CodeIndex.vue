<template>
    <div class="margin-top">
        <table>
            <thead>
                <tr>
                    <th>Title</th>
                    <th>Lanugage</th>
                    <th>Style</th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="code in obj.codes" :key="code.id">
                    <td>{{ code.title }}</td>
                    <td>{{ code.language.name }}</td>
                    <td>{{ code.style.name }}</td>
                    <td class="text-center">
                        <a @click="edit($event, code)" href="#">
                            <font-awesome-icon icon="edit" />
                        </a>
                    </td>
                </tr>
            </tbody>
        </table>

    </div>
</template>
<script setup>

    import { reactive, onMounted } from 'vue'
    import { useCodeStore } from '@/stores/code'

    const codeStore = useCodeStore()

    const obj = reactive({
        codes: []
    })

    const edit = (e, code) => {
        e.preventDefault();

        codeStore.$patch({
            editing: true,
            id: code.id,
            code: JSON.parse(code.code),
            title: code.title,
            style_id: code.style_id,
            language_id: code.language_id,
            code_bg: code.code_bg,
            selectedLanguage: code.language.code,
            selectedStyle: code.style.code,
        })
        
    }

    onMounted(async () => {
        await codeStore.getAll()
        .then(async (res) => {
            obj.codes = await res.data
        })
    })

</script>