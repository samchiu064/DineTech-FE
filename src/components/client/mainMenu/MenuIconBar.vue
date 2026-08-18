<template>
  <div
    class="flex flex-col items-center bg-secondary-white gap-y-4 border border-t-0 border-gray-e9 shadow-[0_4px_24px_rgba(0,0,0,0.1)] absolute end-0 h-[inherit] 0"
  >
    <button
      type="button"
      class="w-9 h-12 bg-secondary-white flex items-center justify-center border-b border-gray-e9"
      @click="toggleSidebar"
    >
      <span class="material-icons-outlined text-secondary-black">menu</span>
    </button>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { mapActions } from 'pinia'
import { useClientStore } from '@/stores/clientStore'

export default defineComponent({
  methods: {
    ...mapActions(useClientStore, ['toggleSidebar'])
  }
})
</script>
