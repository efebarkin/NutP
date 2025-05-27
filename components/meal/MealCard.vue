<template>
  <div
    class="rounded-2xl overflow-hidden shadow-sm transition-all hover:shadow-md transform hover:scale-101 duration-300"
    :class="[
      meal.type === 'breakfast' ? 'bg-yellow-600/5' : '',
      meal.type === 'lunch' ? 'bg-purple-600/5' : '',
      meal.type === 'dinner' ? 'bg-red-800/5' : '',
      meal.type === 'snack' ? 'bg-green-500/5' : '',
    ]"
  >
    <!-- Öğün Başlığı -->
    <div
      class="flex items-center justify-between p-5 border-b"
      :class="[
        meal.type === 'breakfast'
          ? 'bg-yellow-600/20 border-yellow-600/20'
          : '',
        meal.type === 'lunch'
          ? 'bg-purple-600/20 border-purple-600/20'
          : '',
        meal.type === 'dinner'
          ? 'bg-red-800/20 border-red-800/20'
          : '',
        meal.type === 'snack'
          ? 'bg-green-500/20 border-green-500/20'
          : '',
      ]"
    >
      <div class="flex items-center">
        <div class="mr-4 flex-shrink-0">
          <img
            v-if="meal.photoUrl"
            :src="meal.photoUrl"
            :alt="meal.name"
            class="w-12 h-12 rounded-lg object-cover shadow-md transform transition-all hover:scale-110 duration-300"
            @error="handleImageError"
          />
          <div
            v-else
            :class="`w-12 h-12 rounded-full ${getMealTypeColor(
              meal.type
            )} flex items-center justify-center text-white shadow-md transform transition-all hover:scale-110 duration-300`"
          >
            <i
              :class="`fas ${getMealTypeIcon(
                meal.type
              )} text-xl`"
            ></i>
          </div>
        </div>

        <div class="flex-1 min-w-0">
          <h3
            class="text-base sm:text-lg font-bold truncate"
            :class="`text-${getMealTypeColor(
              meal.type
            ).replace('bg-', '')}`"
          >
            {{ meal.name }}
          </h3>
          <div
            class="flex items-center text-xs sm:text-sm"
            :class="`text-${getMealTypeColor(
              meal.type
            ).replace('bg-', '')}/70`"
          >
            <i class="far fa-calendar-alt mr-1"></i>
            {{ formatDate(meal.date) }}
          </div>
        </div>
      </div>

      <div
        class="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:space-x-2"
      >
        <div
          class="px-4 py-2 bg-white rounded-xl shadow-sm"
        >
          <div
            class="flex items-center font-bold text-sm sm:text-base"
            :class="`text-${getMealTypeColor(
              meal.type
            ).replace('bg-', '')}`"
          >
            <i
              class="fas fa-fire-alt mr-2"
              :class="`text-${getMealTypeColor(
                meal.type
              ).replace('bg-', '')}`"
            ></i>
            {{ calculateMealCalories(meal) }}
            kcal
          </div>
        </div>

        <div class="flex items-center gap-2">
          <button
            @click="$emit('download-pdf', meal._id)"
            class="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-blue-100 text-blue-500 hover:bg-blue-200 hover:text-blue-600 flex items-center justify-center transition-all transform hover:scale-110 duration-300"
            title="PDF İndir"
          >
            <i class="fas fa-file-pdf text-sm"></i>
          </button>

          <button
            @click="$emit('toggle-expansion', meal._id)"
            class="w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition-all transform hover:scale-110 duration-300"
            :class="`bg-${getMealTypeColor(
              meal.type
            ).replace(
              'bg-',
              ''
            )}/20 text-${getMealTypeColor(
              meal.type
            ).replace('bg-', '')}`"
          >
            <i
              class="text-sm"
              :class="
                isExpanded
                  ? 'fas fa-chevron-up'
                  : 'fas fa-chevron-down'
              "
            ></i>
          </button>
          <button
            @click="$emit('delete-meal', meal._id)"
            class="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-red-100 text-red-500 hover:bg-red-200 hover:text-red-600 flex items-center justify-center transition-all transform hover:scale-110 duration-300"
            title="Öğünü Sil"
          >
            <i class="fas fa-trash-alt text-sm"></i>
          </button>
        </div>
      </div>
    </div>
    <!-- Makro Besin Özeti -->
    <div
      class="p-3 border-b"
      :class="[
        meal.type === 'breakfast'
          ? 'bg-yellow-600/15 border-yellow-600/20'
          : '',
        meal.type === 'lunch'
          ? 'bg-purple-600/15 border-purple-600/20'
          : '',
        meal.type === 'dinner'
          ? 'bg-red-800/15 border-red-800/20'
          : '',
        meal.type === 'snack'
          ? 'bg-green-500/15 border-green-500/20'
          : '',
      ]"
    >
      <div
        class="grid grid-cols-1 sm:grid-cols-3 gap-2 text-center"
      >
        <div
          class="bg-white p-2 rounded-lg shadow-sm transform transition-all hover:scale-105 duration-300"
        >
          <div
            class="text-xs font-medium"
            :class="`text-${getMealTypeColor(
              meal.type
            ).replace('bg-', '')}/70`"
          >
            Protein
          </div>
          <div
            class="font-bold flex items-center justify-center"
            :class="`text-${getMealTypeColor(
              meal.type
            ).replace('bg-', '')}`"
          >
            <i
              class="fas fa-drumstick-bite mr-1"
              :class="`text-${getMealTypeColor(
                meal.type
              ).replace('bg-', '')}`"
            ></i>
            {{ calculateMealProtein(meal) }}g
          </div>
        </div>
        <div
          class="bg-white p-2 rounded-lg shadow-sm transform transition-all hover:scale-105 duration-300"
        >
          <div
            class="text-xs font-medium"
            :class="`text-${getMealTypeColor(
              meal.type
            ).replace('bg-', '')}/70`"
          >
            Karbonhidrat
          </div>
          <div
            class="font-bold flex items-center justify-center"
            :class="`text-${getMealTypeColor(
              meal.type
            ).replace('bg-', '')}`"
          >
            <i
              class="fas fa-bread-slice mr-1"
              :class="`text-${getMealTypeColor(
                meal.type
              ).replace('bg-', '')}`"
            ></i>
            {{ calculateMealCarbs(meal) }}g
          </div>
        </div>
        <div
          class="bg-white p-2 rounded-lg shadow-sm transform transition-all hover:scale-105 duration-300"
        >
          <div
            class="text-xs font-medium"
            :class="`text-${getMealTypeColor(
              meal.type
            ).replace('bg-', '')}/70`"
          >
            Yağ
          </div>
          <div
            class="font-bold flex items-center justify-center"
            :class="`text-${getMealTypeColor(
              meal.type
            ).replace('bg-', '')}`"
          >
            <i
              class="fas fa-cheese mr-1"
              :class="`text-${getMealTypeColor(
                meal.type
              ).replace('bg-', '')}`"
            ></i>
            {{ calculateMealFat(meal) }}g
          </div>
        </div>
      </div>
    </div>

    <!-- Öğündeki Besinler - Açılır Kapanır Panel -->
    <div
      v-if="isExpanded"
      class="p-5 transition-all duration-300 transform origin-top"
      :class="[
        meal.type === 'breakfast' ? 'bg-yellow-600/10' : '',
        meal.type === 'lunch' ? 'bg-purple-600/10' : '',
        meal.type === 'dinner' ? 'bg-red-800/10' : '',
        meal.type === 'snack' ? 'bg-green-500/10' : '',
      ]"
    >
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div
          v-for="foodItem in meal.foods"
          :key="foodItem._id"
          class="bg-white p-4 rounded-xl border border-gray-100 transition-all hover:shadow-md transform hover:scale-102 duration-300 overflow-hidden"
        >
          <div class="flex items-center mb-2">
            <div class="flex-shrink-0 mr-3">
              <div
                v-if="foodItem.foodId.image"
                class="relative"
              >
                <img
                  :src="foodItem.foodId.image"
                  :alt="
                    foodItem.foodId.name?.tr ||
                    foodItem.foodId.name
                  "
                  class="w-10 h-10 rounded-xl object-cover shadow-sm"
                  @error="
                    e => (e.target.style.display = 'none')
                  "
                />
                <div
                  class="absolute -bottom-1 -right-1 w-4 h-4 bg-white rounded-full border shadow-sm flex items-center justify-center"
                >
                  <i
                    class="fas fa-camera text-xs text-gray-500"
                  ></i>
                </div>
              </div>
              <div
                v-else
                class="w-10 h-10 rounded-xl flex items-center justify-center"
                :class="`bg-${getMealTypeColor(
                  meal.type
                ).replace(
                  'bg-',
                  ''
                )}/20 text-${getMealTypeColor(
                  meal.type
                ).replace('bg-', '')}`"
              >
                <i class="fas fa-apple-alt"></i>
              </div>
            </div>
            <div class="flex-1">
              <h4
                class="font-medium flex items-center"
                :class="`text-${getMealTypeColor(
                  meal.type
                ).replace('bg-', '')}`"
              >
                {{
                  foodItem.foodId.name?.tr ||
                  foodItem.foodId.name
                }}
                <i
                  v-if="foodItem.foodId.image"
                  class="fas fa-image text-xs ml-1 opacity-60"
                ></i>
              </h4>
              <div
                class="text-xs"
                :class="`text-${getMealTypeColor(
                  meal.type
                ).replace('bg-', '')}/70`"
              >
                {{ foodItem.quantity.value }}g
              </div>
            </div>
          </div>

          <div
            class="grid grid-cols-4 gap-2 mt-2 p-2 rounded-lg"
            :class="`bg-${getMealTypeColor(
              meal.type
            ).replace('bg-', '')}/10`"
          >
            <div class="text-center">
              <div
                class="text-xs font-medium flex items-center justify-center"
                :class="`text-${getMealTypeColor(
                  meal.type
                ).replace('bg-', '')}`"
              >
                <i class="fas fa-fire-alt mr-1"></i>
              </div>
              <div class="text-xs font-bold">
                {{ calculateFoodCaloriesInMeal(foodItem) }}
                kcal
              </div>
            </div>
            <div class="text-center">
              <div
                class="text-xs font-medium flex items-center justify-center"
                :class="`text-${getMealTypeColor(
                  meal.type
                ).replace('bg-', '')}`"
              >
                <i class="fas fa-drumstick-bite mr-1"></i>
              </div>
              <div class="text-xs font-bold">
                {{ calculateFoodProteinInMeal(foodItem) }}g
              </div>
            </div>
            <div class="text-center">
              <div
                class="text-xs font-medium flex items-center justify-center"
                :class="`text-${getMealTypeColor(
                  meal.type
                ).replace('bg-', '')}`"
              >
                <i class="fas fa-bread-slice mr-1"></i>
              </div>
              <div class="text-xs font-bold">
                {{ calculateFoodCarbsInMeal(foodItem) }}g
              </div>
            </div>
            <div class="text-center">
              <div
                class="text-xs font-medium flex items-center justify-center"
                :class="`text-${getMealTypeColor(
                  meal.type
                ).replace('bg-', '')}`"
              >
                <i class="fas fa-cheese mr-1"></i>
              </div>
              <div class="text-xs font-bold">
                {{ calculateFoodFatInMeal(foodItem) }}g
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Öğündeki Besinler Özeti (Kapalı Durumda) -->
    <div
      v-if="!isExpanded"
      class="p-3 flex justify-center items-center cursor-pointer"
      :class="[
        meal.type === 'breakfast'
          ? 'bg-yellow-600/5 hover:bg-yellow-600/10'
          : '',
        meal.type === 'lunch'
          ? 'bg-purple-600/5 hover:bg-purple-600/10'
          : '',
        meal.type === 'dinner'
          ? 'bg-red-800/5 hover:bg-red-800/10'
          : '',
        meal.type === 'snack'
          ? 'bg-green-500/5 hover:bg-green-500/10'
          : '',
        'transition-all duration-300',
      ]"
      @click="$emit('toggle-expansion', meal._id)"
    >
      <span
        class="text-sm font-medium flex items-center"
        :class="`text-${getMealTypeColor(meal.type).replace(
          'bg-',
          ''
        )}`"
      >
        <i class="fas fa-utensils mr-2"></i>
        {{ meal.foods.length }} besin göster
      </span>
    </div>
    <div
      v-else
      class="p-3 flex justify-center items-center cursor-pointer"
      :class="[
        meal.type === 'breakfast'
          ? 'bg-yellow-600/10 hover:bg-yellow-600/15'
          : '',
        meal.type === 'lunch'
          ? 'bg-purple-600/10 hover:bg-purple-600/15'
          : '',
        meal.type === 'dinner'
          ? 'bg-red-800/10 hover:bg-red-800/15'
          : '',
        meal.type === 'snack'
          ? 'bg-green-500/10 hover:bg-green-500/15'
          : '',
        'transition-all duration-300',
      ]"
      @click="$emit('toggle-expansion', meal._id)"
    >
      <span
        class="text-sm font-medium flex items-center"
        :class="`text-${getMealTypeColor(meal.type).replace(
          'bg-',
          ''
        )}`"
      >
        <i class="fas fa-eye-slash mr-2"></i>
        Besinleri Gizle
      </span>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  meal: {
    type: Object,
    required: true,
  },
  isExpanded: {
    type: Boolean,
    required: true,
  },
});

const handleImageError = event => {
  event.target.style.display = 'none';
  // Optionally, you could try to set a fallback image or modify a reactive property
  // For example, if meal object had a photoDisplayUrl:
  // props.meal.photoDisplayUrl = null; // This would require meal to be reactive or handled carefully
};

const getMealTypeColor = type => {
  switch (type) {
    case 'breakfast':
      return 'bg-yellow-600';
    case 'lunch':
      return 'bg-purple-600';
    case 'dinner':
      return 'bg-red-800';
    case 'snack':
      return 'bg-green-500';
    default:
      return 'bg-gray-500';
  }
};

const getMealTypeIcon = type => {
  switch (type) {
    case 'breakfast':
      return 'fa-egg'; // Example icon
    case 'lunch':
      return 'fa-drumstick-bite'; // Example icon
    case 'dinner':
      return 'fa-utensils'; // Example icon
    case 'snack':
      return 'fa-apple-alt'; // Example icon
    default:
      return 'fa-question-circle';
  }
};

const formatDate = dateString => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('tr-TR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    // hour: '2-digit',
    // minute: '2-digit',
  });
};

const calculateMealCalories = meal => {
  if (!meal || !meal.totalNutrients) return 0;
  return Math.round(meal.totalNutrients.calories || 0);
};

const calculateMealProtein = meal => {
  if (!meal || !meal.totalNutrients) return 0;
  return (
    Math.round((meal.totalNutrients.protein || 0) * 10) / 10
  );
};

const calculateMealCarbs = meal => {
  if (!meal || !meal.totalNutrients) return 0;
  return (
    Math.round(
      (meal.totalNutrients.carbohydrate || 0) * 10
    ) / 10
  );
};

const calculateMealFat = meal => {
  if (!meal || !meal.totalNutrients) return 0;
  return (
    Math.round((meal.totalNutrients.fat || 0) * 10) / 10
  );
};

const calculateNutrientForFood = (
  foodItem,
  nutrientName
) => {
  if (
    !foodItem ||
    !foodItem.foodId ||
    !foodItem.foodId.nutrients ||
    !foodItem.quantity
  ) {
    return 0;
  }
  const nutrientData =
    foodItem.foodId.nutrients[nutrientName]; // e.g., energy, protein
  const nutrientValue = nutrientData?.value || 0;
  const quantityValue = foodItem.quantity.value || 0;

  // Assuming nutrients are per 100g and quantity is in grams
  return Math.round((nutrientValue * quantityValue) / 100);
};
const calculateNutrientForFoodDecimal = (
  foodItem,
  nutrientName
) => {
  if (
    !foodItem ||
    !foodItem.foodId ||
    !foodItem.foodId.nutrients ||
    !foodItem.quantity
  ) {
    return 0;
  }
  const nutrientData =
    foodItem.foodId.nutrients[nutrientName];
  const nutrientValue = nutrientData?.value || 0;
  const quantityValue = foodItem.quantity.value || 0;

  return (
    Math.round(
      ((nutrientValue * quantityValue) / 100) * 10
    ) / 10
  );
};

const calculateFoodCaloriesInMeal = foodItem => {
  return calculateNutrientForFood(foodItem, 'energy');
};
const calculateFoodProteinInMeal = foodItem => {
  return calculateNutrientForFoodDecimal(
    foodItem,
    'protein'
  );
};
const calculateFoodCarbsInMeal = foodItem => {
  return calculateNutrientForFoodDecimal(
    foodItem,
    'carbohydrate'
  );
};
const calculateFoodFatInMeal = foodItem => {
  return calculateNutrientForFoodDecimal(foodItem, 'fat');
};
</script>

<style scoped>
/* Add any specific styles for MealCard here if needed */
.transform {
  transition-property: transform, box-shadow;
}
.hover\:scale-101:hover {
  transform: scale(1.01);
}
.hover\:scale-102:hover {
  transform: scale(1.02);
}
.hover\:scale-110:hover {
  transform: scale(1.1);
}
</style>
