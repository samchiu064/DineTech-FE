<template>
  <div>
    <div v-for="flavour in radioOptions" :key="flavour.name">
      <p class="block mb-1 text-gray-66 after:content-['*'] after:ml-0.5 after:text-primary-orange">
        {{ flavour.name }}
      </p>
      <ErrorMessage name="flavour" class="text-secondary-red text-sm" />

      <div class="flex items-center gap-x-8 ps-2 my-2">
        <label v-for="option in flavour.options" :key="option">
          <VField
            v-model="radioValue"
            type="radio"
            name="flavour"
            :value="option"
            :label="flavour.name"
            :rules="{ required: true }"
            class="w-4 h-4 border border-gray-d4 rounded-full checked:bg-primary-orange checked:text-primary-orange checked:ring-transparent focus:ring-transparent focus:border-gray-9f"
          />
          <span class="ps-2 text-sm">{{ option }}</span>
        </label>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  props: {
    value: {
      type: String,
      required: true
    },
    category: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      radioValue: this.value,
      spiciness: {
        name: '辣度',
        options: {
          nonSpicy: '不辣',
          mild: '微辣',
          medium: '中辣',
          spicy: '特辣'
        }
      },
      ice: {
        name: '冰塊',
        options: {
          normal: '正常',
          less: '少冰',
          no: '去冰',
          warm: '溫',
          hot: '熱'
        }
      }
    }
  },
  watch: {
    radioValue(value) {
      this.$emit('update:modelValue', value)
    }
  },
  computed: {
    radioOptions() {
      switch (this.category) {
        case 'beverage':
          return [this.ice]
        case 'rice':
        case 'pasta':
          return [this.spiciness]
        default:
          return []
      }
    }
  }
})
</script>
