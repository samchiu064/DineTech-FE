import { defineComponent } from 'vue'

export default defineComponent({
  data() {
    return {
      showModal: false
    }
  },
  methods: {
    open() {
      this.showModal = true
    },
    close() {
      this.showModal = false
    }
  }
})
