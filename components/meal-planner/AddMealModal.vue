<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white rounded-lg p-6 w-full max-w-lg">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-xl font-bold">Öğün Ekle</h2>
        <button @click="$emit('close')" class="text-gray-500 hover:text-gray-700">
          <i class="fas fa-times"></i>
        </button>
      </div>

      <form @submit.prevent="handleSubmit" class="space-y-4">
        <!-- Gün Seçimi -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Gün</label>
          <select v-model="selectedDay" class="w-full border rounded-lg p-2">
            <option v-for="day in days" :key="day.value" :value="day.value">
              {{ day.label }}
            </option>
          </select>
        </div>

        <!-- Öğün Tipi -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Öğün Tipi</label>
          <select v-model="selectedType" class="w-full border rounded-lg p-2">
            <option value="breakfast">Kahvaltı</option>
            <option value="lunch">Öğle Yemeği</option>
            <option value="dinner">Akşam Yemeği</option>
            <option value="snacks">Ara Öğün</option>
          </select>
        </div>

        <!-- Yemek Adı -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Yemek Adı</label>
          <input
            v-model="mealName"
            type="text"
            class="w-full border rounded-lg p-2"
            required
          />
        </div>

        <!-- Besin Değerleri -->
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Kalori (kcal)</label>
            <input
              v-model.number="calories"
              type="number"
              min="0"
              class="w-full border rounded-lg p-2"
              required
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Protein (g)</label>
            <input
              v-model.number="protein"
              type="number"
              min="0"
              class="w-full border rounded-lg p-2"
              required
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Karbonhidrat (g)</label>
            <input
              v-model.number="carbs"
              type="number"
              min="0"
              class="w-full border rounded-lg p-2"
              required
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Yağ (g)</label>
            <input
              v-model.number="fat"
              type="number"
              min="0"
              class="w-full border rounded-lg p-2"
              required
            />
          </div>
        </div>

        <!-- Notlar -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Notlar</label>
          <textarea
            v-model="notes"
            class="w-full border rounded-lg p-2"
            rows="3"
          ></textarea>
        </div>

        <!-- Butonlar -->
        <div class="flex justify-end space-x-2">
          <button
            type="button"
            @click="$emit('close')"
            class="px-4 py-2 border rounded-lg hover:bg-gray-50"
          >
            İptal
          </button>
          <button
            type="submit"
            class="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark"
          >
            Kaydet
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const days = [
  { value: 'monday', label: 'Pazartesi' },
  { value: 'tuesday', label: 'Salı' },
  { value: 'wednesday', label: 'Çarşamba' },
  { value: 'thursday', label: 'Perşembe' },
  { value: 'friday', label: 'Cuma' },
  { value: 'saturday', label: 'Cumartesi' },
  { value: 'sunday', label: 'Pazar' }
]

const selectedDay = ref('monday')
const selectedType = ref('breakfast')
const mealName = ref('')
const calories = ref(0)
const protein = ref(0)
const carbs = ref(0)
const fat = ref(0)
const notes = ref('')

const handleSubmit = () => {
  const meal = {
    name: mealName.value,
    calories: calories.value,
    protein: protein.value,
    carbs: carbs.value,
    fat: fat.value,
    notes: notes.value,
    foods: [] // Şimdilik boş, daha sonra besin seçimi eklenebilir
  }

  emit('save', meal, selectedDay.value, selectedType.value)
}

const emit = defineEmits(['close', 'save'])
</script>
