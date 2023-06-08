<template>
    <div class="mt">
        
        <div v-if="obj.showMsg" class="text-center text-danger bold mb">
            {{ obj.msg }}
        </div>

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
                <tr v-for="code in codeStore.codes" :key="code.id">
                    <td>{{ code.title }}</td>
                    <td>{{ code.language.name }}</td>
                    <td>{{ code.style.name }}</td>
                    <td class="text-center">
                        
                        <div :id="`default_${code.id}`">
                            <a @click="edit($event, code)" href="#">
                                <font-awesome-icon icon="edit" class="text-primary"/>
                            </a>
                        
                            <a @click="confirmDelete(code.id, true)" href="#" class="ml-15 text-cancel">
                                <font-awesome-icon icon="trash" />
                            </a>
                        </div>

                        <div :id="`confirmation_${code.id}`" style="display: none;">
                            <span class="table-confirm-box">Delete?</span>
                            
                            <a @click="destroy($event, code.id)" href="#" class="text-success bold mr-15">
                                <font-awesome-icon icon="check" />
                            </a>

                            <a @click="confirmDelete(code.id, false)" href="#" class="text-danger bold">
                                <font-awesome-icon icon="xmark" />
                            </a>
                        </div>

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
        showMsg: false,
        msg: '',
        codes: [],
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

    const destroy = (event, id) => {
        codeStore.destroy(id)
            .then((res) => {
                showMsg('Deleted successfully!')
            })
            .catch((err) => {
                showMsg('Failed to delete!')
            })
    }

    const confirmDelete = (id, toggle) => {
        document.querySelector("#default_" + id).style.display = (toggle) ? 'none' : 'block'
        document.querySelector("#confirmation_" + id).style.display = (toggle) ? 'block' : 'none'
    }

    const showMsg = async (msg) => {
        obj.msg = await msg
        obj.showMsg = await !obj.showMsg

        await setTimeout(() => {
            obj.showMsg = !obj.showMsg
        }, 5000)
    }


    onMounted(async () => {
        await codeStore.getAll()
        .then(async (res) => {
            obj.codes = await res.data
        })
    })

</script>