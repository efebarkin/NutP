<template>
  <div class="meal-card p-2 bg-white rounded-lg shadow-sm border">
    <div class="flex justify-between items-start mb-2">
      <h3 class="font-semibold text-sm">{{ meal.name }}</h3>
      <button @click="$emit('remove', day, type, index)" class="text-red-500 hover:text-red-700">
        <i class="fas fa-times"></i>
      </button>
    </div>
    
    <div class="text-sm text-gray-600">
      <div class="flex justify-between">
        <span>Kalori:</span>
        <span>{{ meal.calories }} kcal</span>
      </div>
      <div class="flex justify-between">
        <span>Protein:</span>
        <span>{{ meal.protein }}g</span>
      </div>
      <div class="flex justify-between">
        <span>Karb:</span>
        <span>{{ meal.carbs }}g</span>
      </div>
      <div class="flex justify-between">
        <span>Yağ:</span>
        <span>{{ meal.fat }}g</span>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  meal: {
    type: Object,
    required: true
  },
  day: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true
  },
  index: {
    type: Number,
    default: null
  }
})
</script>

<style scoped>
.meal-card {
  cursor: move;
}
</style>
