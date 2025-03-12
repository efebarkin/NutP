<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-xl font-bold">Öğün Oluştur</h2>
        <button @click="$emit('close')" class="text-gray-500 hover:text-gray-700">
          <i class="fas fa-times"></i>
        </button>
      </div>

      <!-- Öğün Adı -->
      <div class="mb-4">
        <label class="block text-sm font-medium text-gray-700 mb-1">Öğün Adı</label>
        <input
          v-model="mealName"
          type="text"
          class="w-full border rounded-lg p-2"
          placeholder="Örn: Kahvaltı 1"
          required
        />
      </div>

      <!-- Seçili Yiyecekler -->
      <div class="mb-4">
        <h3 class="text-lg font-medium mb-2">Seçili Yiyecekler</h3>
        <div class="space-y-2">
          <div
            v-for="(item, index) in selectedFoods"
            :key="index"
            class="flex items-center justify-between bg-gray-50 p-3 rounded-lg"
          >
            <div>
              <p class="font-medium">{{ item.food.name.tr }}</p>
              <div class="text-sm text-gray-600 mt-1">
                <span>{{ item.food.nutrients.energy.value * (item.portion / 100) }} kcal</span>
                <span class="mx-2">•</span>
                <span>{{ item.portion }}g</span>
              </div>
            </div>
            <div class="flex items-center space-x-4">
              <div class="flex items-center space-x-2">
                <button
                  @click="updatePortion(index, -10)"
                  class="text-gray-500 hover:text-gray-700"
                >
                  <i class="fas fa-minus"></i>
                </button>
                <input
                  v-model.number="item.portion"
                  type="number"
                  class="w-16 text-center border rounded p-1"
                  min="1"
                  step="10"
                />
                <button
                  @click="updatePortion(index, 10)"
                  class="text-gray-500 hover:text-gray-700"
                >
                  <i class="fas fa-plus"></i>
                </button>
              </div>
              <button
                @click="removeFood(index)"
                class="text-red-500 hover:text-red-700"
              >
                <i class="fas fa-trash"></i>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Toplam Besin Değerleri -->
      <div class="mb-6 p-4 bg-gray-50 rounded-lg">
        <h3 class="text-lg font-medium mb-3">Toplam Besin Değerleri</h3>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <p class="text-gray-600">Kalori</p>
            <p class="text-lg font-medium">{{ totalNutrients.energy }} kcal</p>
          </div>
          <div>
            <p class="text-gray-600">Protein</p>
            <p class="text-lg font-medium">{{ totalNutrients.protein }}g</p>
          </div>
          <div>
            <p class="text-gray-600">Karbonhidrat</p>
            <p class="text-lg font-medium">{{ totalNutrients.carbs }}g</p>
          </div>
          <div>
            <p class="text-gray-600">Yağ</p>
            <p class="text-lg font-medium">{{ totalNutrients.fat }}g</p>
          </div>
        </div>
      </div>

      <!-- Notlar -->
      <div class="mb-6">
        <label class="block text-sm font-medium text-gray-700 mb-1">Notlar</label>
        <textarea
          v-model="notes"
          rows="2"
          class="w-full border rounded-lg p-2"
          placeholder="Öğün ile ilgili notlarınızı buraya yazabilirsiniz..."
        ></textarea>
      </div>

      <!-- Kaydet Butonu -->
      <div class="flex justify-end">
        <button
          @click="saveMeal"
          class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          :disabled="!canSave"
        >
          Öğünü Kaydet
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const props = defineProps({
  selectedFoods: {
    type: Array,
    required: true
  }
});

const emit = defineEmits(['close', 'save', 'update:selectedFoods']);

const mealName = ref('');
const notes = ref('');

// Porsiyon güncelleme
const updatePortion = (index, change) => {
  const foods = [...props.selectedFoods];
  const newPortion = Math.max(1, foods[index].portion + change);
  foods[index].portion = newPortion;
  emit('update:selectedFoods', foods);
};

// Yiyecek kaldırma
const removeFood = (index) => {
  const foods = props.selectedFoods.filter((_, i) => i !== index);
  emit('update:selectedFoods', foods);
};

// Toplam besin değerlerini hesapla
const totalNutrients = computed(() => {
  return props.selectedFoods.reduce((total, item) => {
    const portionMultiplier = item.portion / 100;
    return {
      energy: Math.round((total.energy + (item.food.nutrients.energy.value * portionMultiplier)) * 10) / 10,
      protein: Math.round((total.protein + (item.food.nutrients.protein.value * portionMultiplier)) * 10) / 10,
      carbs: Math.round((total.carbs + (item.food.nutrients.carbohydrate.value * portionMultiplier)) * 10) / 10,
      fat: Math.round((total.fat + (item.food.nutrients.fat.value * portionMultiplier)) * 10) / 10
    };
  }, { energy: 0, protein: 0, carbs: 0, fat: 0 });
});

// Kaydetme kontrolü
const canSave = computed(() => {
  return mealName.value.trim() && props.selectedFoods.length > 0;
});

// Öğünü kaydet
const saveMeal = () => {
  if (!canSave.value) return;

  const meal = {
    name: mealName.value.trim(),
    foods: props.selectedFoods.map(item => ({
      food: item.food._id,
      portion: item.portion
    })),
    totalNutrients: totalNutrients.value,
    notes: notes.value.trim()
  };

  emit('save', meal);
};
</script>
