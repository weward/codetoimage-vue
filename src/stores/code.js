// @ts-check
import { defineStore, acceptHMRUpdate } from 'pinia'


export const useCodeStore = defineStore({
  id: 'codeStore',
  
  state: () => ({
    title: '',
    userId: '',
    codeInput: '',
    styleId: '',
    languageId: '',
    fontId: '',
  }),

  getters: {
    
  },

  actions: {
    init() {
        console.log('[Store]: useCodeStore is working!')
        return
    },
    save() {

    },

    getRecord() {
        // view, edit
    },

    update() {

    },

    destroy() {

    },

  }

})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useCodeStore, import.meta.hot))
}
