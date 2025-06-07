<template>
  <div
    class="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100"
  >
    <!-- Minimal Profile Header -->
    <div
      class="bg-white border-b border-gray-200 shadow-sm"
    >
      <div class="container mx-auto px-4 py-8">
        <div class="max-w-6xl mx-auto">
          <div
            class="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-6"
          >
            <!-- Compact Avatar -->
            <div class="relative group flex-shrink-0">
              <div
                class="w-20 h-20 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-2xl p-1"
              >
                <div
                  class="w-full h-full bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl flex items-center justify-center group-hover:scale-105 transition-all duration-300"
                >
                  <i
                    class="fas fa-user text-2xl text-blue-600"
                  ></i>
                </div>
              </div>
              <div
                class="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-3 border-white flex items-center justify-center"
              >
                <i
                  class="fas fa-check text-white text-xs"
                ></i>
              </div>
            </div>

            <!-- User Info -->
            <div class="flex-1 text-center sm:text-left">
              <h1
                class="text-2xl sm:text-3xl font-bold text-gray-900 mb-1"
              >
                {{ user?.name || 'Kullanıcı' }}
              </h1>
              <p class="text-gray-600 mb-3">
                {{ user?.email }}
              </p>

              <!-- Compact Stats -->
              <div
                class="flex flex-wrap justify-center sm:justify-start gap-4 text-sm"
              >
                <div
                  class="flex items-center space-x-2 px-3 py-1 bg-blue-50 text-blue-700 rounded-full"
                >
                  <i class="fas fa-utensils text-xs"></i>
                  <span>{{ totalMeals }} öğün</span>
                </div>
                <div
                  class="flex items-center space-x-2 px-3 py-1 bg-orange-50 text-orange-700 rounded-full"
                >
                  <i class="fas fa-fire-alt text-xs"></i>
                  <span
                    >{{
                      Math.round(totalCalories)
                    }}
                    kcal</span
                  >
                </div>
                <div
                  class="flex items-center space-x-2 px-3 py-1 bg-green-50 text-green-700 rounded-full"
                >
                  <i class="fas fa-users text-xs"></i>
                  <span>{{ friends.length }} arkadaş</span>
                </div>
              </div>
            </div>

            <!-- Quick Actions -->
            <div class="flex space-x-2 flex-shrink-0">
              <NuxtLink
                to="/ogun"
                class="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors duration-200 text-sm font-medium"
              >
                <i class="fas fa-plus mr-1"></i>Öğün Ekle
              </NuxtLink>
              <NuxtLink
                to="/settings"
                class="px-4 py-2 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors duration-200 text-sm font-medium"
              >
                <i class="fas fa-cog mr-1"></i>Ayarlar
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="container mx-auto px-4 py-8">
      <div class="max-w-6xl mx-auto">
        <!-- Stats Cards -->
        <div
          class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
        >
          <div
            class="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border border-gray-100 group"
          >
            <div
              class="flex items-center justify-between mb-4"
            >
              <div
                class="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300"
              >
                <i
                  class="fas fa-utensils text-white text-xl"
                ></i>
              </div>
              <div class="text-right">
                <p
                  class="text-3xl font-bold text-gray-800 counter"
                  data-target="{{ totalMeals }}"
                >
                  {{ totalMeals }}
                </p>
                <p class="text-sm text-gray-500">Bu Ay</p>
              </div>
            </div>
            <h3
              class="text-lg font-semibold text-gray-700 mb-1"
            >
              Toplam Öğün
            </h3>
            <div
              class="w-full bg-gray-200 rounded-full h-2"
            >
              <div
                class="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all duration-1000"
                :style="`width: ${Math.min(
                  (totalMeals / 50) * 100,
                  100
                )}%`"
              ></div>
            </div>
          </div>

          <div
            class="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border border-gray-100 group"
          >
            <div
              class="flex items-center justify-between mb-4"
            >
              <div
                class="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300"
              >
                <i
                  class="fas fa-fire-alt text-white text-xl"
                ></i>
              </div>
              <div class="text-right">
                <p
                  class="text-3xl font-bold text-gray-800 counter"
                  data-target="{{ totalCalories }}"
                >
                  {{ totalCalories }}
                </p>
                <p class="text-sm text-gray-500">kcal</p>
              </div>
            </div>
            <h3
              class="text-lg font-semibold text-gray-700 mb-1"
            >
              Toplam Kalori
            </h3>
            <div
              class="w-full bg-gray-200 rounded-full h-2"
            >
              <div
                class="bg-gradient-to-r from-orange-500 to-orange-600 h-2 rounded-full transition-all duration-1000"
                :style="`width: ${Math.min(
                  (totalCalories / 2000) * 100,
                  100
                )}%`"
              ></div>
            </div>
          </div>

          <div
            class="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border border-gray-100 group"
          >
            <div
              class="flex items-center justify-between mb-4"
            >
              <div
                class="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300"
              >
                <i
                  class="fas fa-clock text-white text-xl"
                ></i>
              </div>
              <div class="text-right">
                <p class="text-lg font-bold text-gray-800">
                  {{ lastActivity }}
                </p>
                <p class="text-sm text-gray-500">
                  Son Aktivite
                </p>
              </div>
            </div>
            <h3
              class="text-lg font-semibold text-gray-700 mb-1"
            >
              Aktif Günler
            </h3>
            <div
              class="w-full bg-gray-200 rounded-full h-2"
            >
              <div
                class="bg-gradient-to-r from-green-500 to-green-600 h-2 rounded-full transition-all duration-1000"
                style="width: 75%"
              ></div>
            </div>
          </div>
        </div>

        <!-- Main Content Grid -->
        <div class="grid grid-cols-1 xl:grid-cols-3 gap-8">
          <!-- Left Column -->
          <div class="xl:col-span-2 space-y-8">
            <!-- Social Section -->
            <div
              class="grid grid-cols-1 lg:grid-cols-2 gap-6"
            >
              <!-- Friends Card -->
              <div
                class="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden"
              >
                <div
                  class="bg-gradient-to-r from-blue-500 to-blue-600 p-6 text-white"
                >
                  <div
                    class="flex items-center justify-between"
                  >
                    <div
                      class="flex items-center space-x-3"
                    >
                      <div
                        class="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center"
                      >
                        <i class="fas fa-users text-lg"></i>
                      </div>
                      <h2 class="text-xl font-bold">
                        Arkadaşlar
                      </h2>
                    </div>
                    <button
                      @click="fetchFriends"
                      class="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center hover:bg-white/30 transition-colors duration-200"
                    >
                      <i
                        class="fas fa-sync-alt text-sm"
                        :class="{
                          'animate-spin': loadingFriends,
                        }"
                      ></i>
                    </button>
                  </div>
                  <p class="mt-2 opacity-90">
                    {{ friends.length }} arkadaş
                  </p>
                </div>

                <div class="p-6">
                  <div
                    v-if="loadingFriends"
                    class="flex justify-center py-8"
                  >
                    <div
                      class="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"
                    ></div>
                  </div>

                  <div
                    v-else-if="friends.length === 0"
                    class="text-center py-8"
                  >
                    <div
                      class="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4"
                    >
                      <i
                        class="fas fa-user-friends text-2xl text-gray-400"
                      ></i>
                    </div>
                    <p class="text-gray-500 mb-4">
                      Henüz arkadaşınız bulunmuyor
                    </p>
                    <button
                      @click="showAddFriendModal = true"
                      class="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-200 transform hover:scale-105"
                    >
                      <i class="fas fa-user-plus mr-2"></i
                      >Arkadaş Ekle
                    </button>
                  </div>

                  <div
                    v-else
                    class="space-y-3 max-h-80 overflow-y-auto custom-scrollbar"
                  >
                    <div
                      v-for="friend in friends"
                      :key="friend._id"
                      class="flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-all duration-200 group"
                    >
                      <div
                        class="flex items-center space-x-3"
                      >
                        <div class="relative">
                          <div
                            class="w-10 h-10 bg-gradient-to-br from-primary-100 to-primary-200 rounded-xl flex items-center justify-center"
                          >
                            <i
                              class="fas fa-user text-primary-600"
                            ></i>
                          </div>
                          <div
                            class="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"
                          ></div>
                        </div>
                        <div>
                          <p
                            class="font-medium text-gray-800"
                          >
                            {{ friend.name }}
                          </p>
                          <p class="text-xs text-gray-500">
                            {{ getUserStatus(friend._id) }}
                          </p>
                        </div>
                      </div>
                      <div
                        class="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                      >
                        <button
                          @click="
                            startConversation(friend._id)
                          "
                          class="w-8 h-8 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors duration-200 flex items-center justify-center"
                        >
                          <i
                            class="fas fa-comment text-sm"
                          ></i>
                        </button>
                        <button
                          @click="removeFriend(friend._id)"
                          class="w-8 h-8 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors duration-200 flex items-center justify-center"
                        >
                          <i
                            class="fas fa-user-minus text-sm"
                          ></i>
                        </button>
                      </div>
                    </div>
                  </div>

                  <div
                    class="mt-4 pt-4 border-t border-gray-200"
                  >
                    <NuxtLink
                      to="/messages"
                      class="flex items-center justify-center space-x-2 text-blue-600 hover:text-blue-700 font-medium transition-colors duration-200"
                    >
                      <i class="fas fa-comments"></i>
                      <span>Tüm Mesajları Görüntüle</span>
                    </NuxtLink>
                  </div>
                </div>
              </div>

              <!-- Messages Card -->
              <div
                class="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden"
              >
                <div
                  class="bg-gradient-to-r from-green-500 to-green-600 p-6 text-white"
                >
                  <div
                    class="flex items-center justify-between"
                  >
                    <div
                      class="flex items-center space-x-3"
                    >
                      <div
                        class="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center"
                      >
                        <i
                          class="fas fa-comments text-lg"
                        ></i>
                      </div>
                      <h2 class="text-xl font-bold">
                        Son Mesajlar
                      </h2>
                    </div>
                    <button
                      @click="fetchRecentConversations"
                      class="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center hover:bg-white/30 transition-colors duration-200"
                    >
                      <i
                        class="fas fa-sync-alt text-sm"
                        :class="{
                          'animate-spin':
                            loadingConversations,
                        }"
                      ></i>
                    </button>
                  </div>
                  <p class="mt-2 opacity-90">
                    {{ recentConversations.length }} aktif
                    konuşma
                  </p>
                </div>

                <div class="p-6">
                  <div
                    v-if="loadingConversations"
                    class="flex justify-center py-8"
                  >
                    <div
                      class="w-8 h-8 border-2 border-green-500 border-t-transparent rounded-full animate-spin"
                    ></div>
                  </div>

                  <div
                    v-else-if="
                      recentConversations.length === 0
                    "
                    class="text-center py-8"
                  >
                    <div
                      class="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4"
                    >
                      <i
                        class="fas fa-comment-slash text-2xl text-gray-400"
                      ></i>
                    </div>
                    <p class="text-gray-500 mb-4">
                      Henüz mesajlaşmanız bulunmuyor
                    </p>
                    <NuxtLink
                      to="/messages"
                      class="inline-block px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl hover:from-green-600 hover:to-green-700 transition-all duration-200 transform hover:scale-105"
                    >
                      <i
                        class="fas fa-comment-dots mr-2"
                      ></i
                      >Mesajlaşmaya Başla
                    </NuxtLink>
                  </div>

                  <div
                    v-else
                    class="space-y-3 max-h-80 overflow-y-auto custom-scrollbar"
                  >
                    <div
                      v-for="conversation in recentConversations"
                      :key="conversation._id"
                      @click="
                        goToConversation(conversation._id)
                      "
                      class="p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-all duration-200 cursor-pointer group"
                    >
                      <div
                        class="flex justify-between items-start mb-2"
                      >
                        <p
                          class="font-medium text-gray-800 group-hover:text-green-600 transition-colors duration-200"
                        >
                          {{
                            getConversationName(
                              conversation
                            )
                          }}
                        </p>
                        <p class="text-xs text-gray-500">
                          {{
                            formatDate(
                              conversation.updatedAt
                            )
                          }}
                        </p>
                      </div>
                      <p
                        class="text-sm text-gray-600 truncate mb-2"
                      >
                        {{ getLastMessage(conversation) }}
                      </p>
                      <div
                        v-if="conversation.unreadCount > 0"
                        class="flex justify-end"
                      >
                        <span
                          class="bg-gradient-to-r from-green-500 to-green-600 text-white text-xs px-2 py-1 rounded-full animate-pulse"
                        >
                          {{ conversation.unreadCount }}
                          yeni
                        </span>
                      </div>
                    </div>
                  </div>

                  <div
                    class="mt-4 pt-4 border-t border-gray-200"
                  >
                    <NuxtLink
                      to="/messages"
                      class="flex items-center justify-center space-x-2 text-green-600 hover:text-green-700 font-medium transition-colors duration-200"
                    >
                      <i class="fas fa-comments"></i>
                      <span>Tüm Mesajları Görüntüle</span>
                    </NuxtLink>
                  </div>
                </div>
              </div>
            </div>

            <!-- Recent Meals -->
            <div
              class="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden"
            >
              <div
                class="bg-gradient-to-r from-purple-500 to-purple-600 p-6 text-white"
              >
                <div
                  class="flex items-center justify-between"
                >
                  <div class="flex items-center space-x-3">
                    <div
                      class="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center"
                    >
                      <i
                        class="fas fa-utensils text-lg"
                      ></i>
                    </div>
                    <h2 class="text-xl font-bold">
                      Son Öğünler
                    </h2>
                  </div>
                  <button
                    @click="fetchMeals"
                    class="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center hover:bg-white/30 transition-colors duration-200"
                  >
                    <i
                      class="fas fa-sync-alt text-sm"
                      :class="{ 'animate-spin': loading }"
                    ></i>
                  </button>
                </div>
                <p class="mt-2 opacity-90">
                  {{ recentMeals.length }} öğün kaydı
                </p>
              </div>

              <div class="p-6">
                <div
                  v-if="loading"
                  class="flex justify-center py-8"
                >
                  <div
                    class="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin"
                  ></div>
                </div>

                <div
                  v-else-if="recentMeals.length === 0"
                  class="text-center py-12"
                >
                  <div
                    class="w-20 h-20 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-6"
                  >
                    <i
                      class="fas fa-utensils text-3xl text-gray-400"
                    ></i>
                  </div>
                  <h3
                    class="text-lg font-semibold text-gray-700 mb-2"
                  >
                    Henüz öğün eklenmemiş
                  </h3>
                  <p class="text-gray-500 mb-6">
                    İlk öğününüzü ekleyerek başlayın!
                  </p>
                  <NuxtLink
                    to="/ogun"
                    class="inline-block px-6 py-3 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl hover:from-purple-600 hover:to-purple-700 transition-all duration-200 transform hover:scale-105"
                  >
                    <i class="fas fa-plus mr-2"></i>Öğün
                    Ekle
                  </NuxtLink>
                </div>

                <div v-else class="space-y-4">
                  <div
                    v-for="meal in recentMeals.slice(0, 5)"
                    :key="meal._id"
                    class="group relative overflow-hidden bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-5 hover:shadow-md transition-all duration-300"
                  >
                    <div
                      class="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    ></div>
                    <div class="relative">
                      <div
                        class="flex justify-between items-center mb-3"
                      >
                        <div
                          class="flex items-center space-x-3"
                        >
                          <div
                            class="w-10 h-10 bg-gradient-to-br from-purple-100 to-purple-200 rounded-xl flex items-center justify-center"
                          >
                            <i
                              class="fas fa-clock text-purple-600"
                            ></i>
                          </div>
                          <div>
                            <h3
                              class="font-semibold text-gray-800"
                            >
                              {{
                                getMealTypeName(
                                  meal.mealType
                                )
                              }}
                            </h3>
                            <p
                              class="text-sm text-gray-500"
                            >
                              {{ formatDate(meal.date) }}
                            </p>
                          </div>
                        </div>
                        <div class="text-right">
                          <div
                            class="text-lg font-bold text-purple-600"
                          >
                            {{
                              calculateTotalCalories(meal)
                            }}
                          </div>
                          <div
                            class="text-xs text-gray-500"
                          >
                            kcal
                          </div>
                        </div>
                      </div>

                      <div class="space-y-2">
                        <div
                          v-for="food in meal.foods.slice(
                            0,
                            3
                          )"
                          :key="food._id"
                          class="flex justify-between items-center text-sm bg-white/60 rounded-lg p-2"
                        >
                          <span class="flex items-center">
                            <div
                              class="w-2 h-2 bg-purple-400 rounded-full mr-3"
                            ></div>
                            {{ getFoodName(food.food) }}
                          </span>
                          <span
                            class="text-gray-600 font-medium"
                          >
                            {{ food.quantity.value
                            }}{{ food.quantity.unit }}
                          </span>
                        </div>
                        <div
                          v-if="meal.foods.length > 3"
                          class="text-center text-xs text-gray-500 py-1"
                        >
                          +{{ meal.foods.length - 3 }} besin
                          daha...
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Right Column -->
          <div class="space-y-8">
            <!-- Favorites -->
            <div
              class="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden"
            >
              <div
                class="bg-gradient-to-r from-red-500 to-pink-500 p-6 text-white"
              >
                <div
                  class="flex items-center justify-between"
                >
                  <div class="flex items-center space-x-3">
                    <div
                      class="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center"
                    >
                      <i class="fas fa-heart text-lg"></i>
                    </div>
                    <h2 class="text-xl font-bold">
                      Favori Besinler
                    </h2>
                  </div>
                  <NuxtLink
                    to="/favoriler"
                    class="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center hover:bg-white/30 transition-colors duration-200"
                  >
                    <i
                      class="fas fa-external-link-alt text-sm"
                    ></i>
                  </NuxtLink>
                </div>
                <p class="mt-2 opacity-90">
                  {{ favorites.length }} favori
                </p>
              </div>

              <div class="p-6">
                <div
                  v-if="loading"
                  class="flex justify-center py-8"
                >
                  <div
                    class="w-8 h-8 border-2 border-red-500 border-t-transparent rounded-full animate-spin"
                  ></div>
                </div>

                <div
                  v-else-if="favorites.length === 0"
                  class="text-center py-8"
                >
                  <div
                    class="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4"
                  >
                    <i
                      class="fas fa-heart-broken text-2xl text-gray-400"
                    ></i>
                  </div>
                  <p class="text-gray-500 mb-4">
                    Henüz favori besininiz yok
                  </p>
                  <NuxtLink
                    to="/yiyecekler"
                    class="inline-block px-4 py-2 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-xl hover:from-red-600 hover:to-pink-600 transition-all duration-200 transform hover:scale-105"
                  >
                    <i class="fas fa-search mr-2"></i
                    >Besinleri Keşfet
                  </NuxtLink>
                </div>

                <div
                  v-else
                  class="space-y-3 max-h-96 overflow-y-auto custom-scrollbar"
                >
                  <div
                    v-for="favorite in favorites.slice(
                      0,
                      6
                    )"
                    :key="favorite.id"
                    class="group relative overflow-hidden bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-4 hover:shadow-md transition-all duration-300"
                  >
                    <div
                      class="absolute inset-0 bg-gradient-to-r from-red-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    ></div>
                    <div class="relative">
                      <div
                        class="flex justify-between items-start mb-3"
                      >
                        <div class="flex-1">
                          <h3
                            class="font-semibold text-gray-800 mb-1"
                          >
                            {{ favorite.name.tr }}
                          </h3>
                          <p
                            v-if="
                              favorite.category.name?.tr
                            "
                            class="text-xs text-gray-500 mb-2"
                          >
                            {{ favorite.category.name.tr }}
                          </p>
                        </div>
                        <div
                          class="flex flex-col space-y-1"
                        >
                          <button
                            @click="
                              removeFavorite(favorite.id)
                            "
                            class="w-8 h-8 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors duration-200 flex items-center justify-center"
                            :disabled="
                              removing[favorite.id]
                            "
                          >
                            <i
                              class="fas fa-heart text-sm"
                            ></i>
                          </button>
                          <button
                            @click="addToMeal(favorite)"
                            class="w-8 h-8 bg-green-100 text-green-600 rounded-lg hover:bg-green-200 transition-colors duration-200 flex items-center justify-center"
                          >
                            <i
                              class="fas fa-plus text-sm"
                            ></i>
                          </button>
                        </div>
                      </div>

                      <div
                        class="grid grid-cols-2 gap-2 text-xs"
                      >
                        <div
                          class="flex items-center space-x-1"
                        >
                          <i
                            class="fas fa-fire-alt text-orange-500"
                          ></i>
                          <span
                            >{{
                              favorite.nutrients.energy
                                .value
                            }}
                            kcal</span
                          >
                        </div>
                        <div
                          class="flex items-center space-x-1"
                        >
                          <i
                            class="fas fa-egg text-blue-500"
                          ></i>
                          <span
                            >{{
                              favorite.nutrients.protein
                                .value
                            }}g</span
                          >
                        </div>
                        <div
                          class="flex items-center space-x-1"
                        >
                          <i
                            class="fas fa-bread-slice text-yellow-500"
                          ></i>
                          <span
                            >{{
                              favorite.nutrients
                                .carbohydrate.value
                            }}g</span
                          >
                        </div>
                        <div
                          class="flex items-center space-x-1"
                        >
                          <i
                            class="fas fa-cheese text-green-500"
                          ></i>
                          <span
                            >{{
                              favorite.nutrients.fat.value
                            }}g</span
                          >
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div
                  v-if="favorites.length > 6"
                  class="mt-4 pt-4 border-t border-gray-200"
                >
                  <NuxtLink
                    to="/favoriler"
                    class="flex items-center justify-center space-x-2 text-red-500 hover:text-red-600 font-medium transition-colors duration-200"
                  >
                    <span
                      >{{ favorites.length - 6 }} favori
                      daha...</span
                    >
                    <i class="fas fa-arrow-right"></i>
                  </NuxtLink>
                </div>
              </div>
            </div>

            <!-- Water Tracking -->
            <Water />

            <!-- Quick Actions -->
            <div
              class="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden"
            >
              <div
                class="bg-gradient-to-r from-indigo-500 to-indigo-600 p-6 text-white"
              >
                <div class="flex items-center space-x-3">
                  <div
                    class="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center"
                  >
                    <i class="fas fa-bolt text-lg"></i>
                  </div>
                  <h2 class="text-xl font-bold">
                    Hızlı İşlemler
                  </h2>
                </div>
                <p class="mt-2 opacity-90">
                  Sık kullanılan özellikler
                </p>
              </div>

              <div class="p-6 space-y-3">
                <NuxtLink
                  to="/ogun"
                  class="flex items-center space-x-3 p-3 bg-gray-50 hover:bg-gray-100 rounded-xl transition-all duration-200 group"
                >
                  <div
                    class="w-10 h-10 bg-gradient-to-br from-green-100 to-green-200 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300"
                  >
                    <i
                      class="fas fa-plus text-green-600"
                    ></i>
                  </div>
                  <div>
                    <p class="font-medium text-gray-800">
                      Öğün Ekle
                    </p>
                    <p class="text-sm text-gray-500">
                      Yeni bir öğün kaydet
                    </p>
                  </div>
                </NuxtLink>

                <NuxtLink
                  to="/yiyecekler"
                  class="flex items-center space-x-3 p-3 bg-gray-50 hover:bg-gray-100 rounded-xl transition-all duration-200 group"
                >
                  <div
                    class="w-10 h-10 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300"
                  >
                    <i
                      class="fas fa-search text-blue-600"
                    ></i>
                  </div>
                  <div>
                    <p class="font-medium text-gray-800">
                      Besin Ara
                    </p>
                    <p class="text-sm text-gray-500">
                      Besin veritabanında ara
                    </p>
                  </div>
                </NuxtLink>
              </div>
            </div>
          </div>
        </div>

        <!-- Friend Search Component -->
        <div class="mt-8">
          <FriendSearch />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useAuthStore } from '~/stores/auth';
import Water from '~/components/Water.vue';
import { useToast } from 'vue-toastification';
import { useSocketClient } from '~/composables/useSocketClient';
import { useRouter } from 'vue-router';
import FriendSearch from '~/components/FriendSearch.vue';

const toast = useToast();
const authStore = useAuthStore();
const router = useRouter();
const { socket, connected, getUserStatus } =
  useSocketClient();

// Kullanıcı bilgisi
const user = computed(() => authStore.user || {});

// Sayfa durumu
const loading = ref(true);
const error = ref(null);
const totalMeals = ref(0);
const totalCalories = ref(0);
const lastActivity = ref('Henüz aktivite yok');
const recentMeals = ref([]);
const favorites = ref([]);
const loadingFavorites = ref(false);
const removing = ref({});

// Arkadaşlar ve mesajlar için state
const friends = ref([]);
const loadingFriends = ref(false);
const showAddFriendModal = ref(false);
const recentConversations = ref([]);
const loadingConversations = ref(false);

// Yardımcı fonksiyonlar
const formatJoinDate = () => {
  const joinDate = user.value?.createdAt || new Date();
  return new Date(joinDate).toLocaleDateString('tr-TR', {
    year: 'numeric',
    month: 'long',
  });
};

// [Tüm diğer fonksiyonlar aynı kalacak - fetchFriends, fetchMeals, vs.]
// ... (Mevcut script içeriğini buraya kopyalayın)

// Arkadaşları getir
const fetchFriends = async () => {
  try {
    loadingFriends.value = true;

    // Socket ile dene
    if (socket.value && connected.value) {
      socket.value.emit('get_friends', {}, response => {
        if (response && response.success) {
          friends.value = response.data || [];
          loadingFriends.value = false;
        } else {
          // Socket başarısız olursa REST API'ye düş
          fetchFriendsFromAPI();
        }
      });
    } else {
      // Socket bağlantısı yoksa REST API'ye düş
      fetchFriendsFromAPI();
    }
  } catch (err) {
    console.error('Arkadaşlar getirilirken hata:', err);
    error.value = 'Arkadaşlar getirilirken bir hata oluştu';
    loadingFriends.value = false;
    friends.value = []; // Hata durumunda boş dizi
  }
};

// REST API'den arkadaşları getir
const fetchFriendsFromAPI = async () => {
  try {
    const response = await fetch('/api/users/friends', {
      headers: authStore.getAuthHeader(),
    });

    if (response.ok) {
      const data = await response.json();
      friends.value = data.friends || [];
    } else {
      console.error(`API error: ${response.status}`);
      friends.value = []; // Hata durumunda boş dizi
    }
  } catch (err) {
    console.error('API isteği hatası:', err);
    friends.value = []; // Hata durumunda boş dizi
  } finally {
    loadingFriends.value = false;
  }
};

// Arkadaş ekle
const addFriend = async email => {
  if (!email) return;

  try {
    const response = await fetch('/api/users/friends', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...authStore.getAuthHeader(), // getAuthHeader metodu hem Authorization hem X-CSRF-Token ekler
      },
      body: JSON.stringify({ email }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(
        error.message ||
          'Arkadaş eklenirken bir hata oluştu'
      );
    }

    toast.success('Arkadaş başarıyla eklendi');
    fetchFriends();
    showAddFriendModal.value = false;
  } catch (error) {
    console.error('Arkadaş eklenirken hata:', error);
    toast.error(
      error.message || 'Arkadaş eklenirken bir hata oluştu'
    );
  }
};

// Arkadaş kaldır
const removeFriend = async friendId => {
  if (!friendId) return;

  if (
    !confirm(
      'Bu arkadaşı silmek istediğinize emin misiniz?'
    )
  ) {
    return;
  }

  try {
    const response = await fetch(
      `/api/users/friends/${friendId}`,
      {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${authStore.user?.token}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(
        'Arkadaş kaldırılırken bir hata oluştu'
      );
    }

    toast.success('Arkadaş başarıyla kaldırıldı');
    fetchFriends();
  } catch (error) {
    console.error('Arkadaş kaldırılırken hata:', error);
    toast.error('Arkadaş kaldırılırken bir hata oluştu');
  }
};

// Konuşma başlat
const startConversation = async userId => {
  if (!userId) return;

  try {
    const response = await fetch('/api/conversations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...authStore.getAuthHeader(), // getAuthHeader metodu hem Authorization hem X-CSRF-Token ekler
      },
      body: JSON.stringify({ participants: [userId] }),
    });

    if (!response.ok) {
      throw new Error(
        'Konuşma başlatılırken bir hata oluştu'
      );
    }

    const data = await response.json();
    router.push(
      `/messages?conversation=${data.conversation._id}`
    );
  } catch (error) {
    console.error('Konuşma başlatılırken hata:', error);
    toast.error('Konuşma başlatılırken bir hata oluştu');
  }
};

// Son konuşmaları getir
const fetchRecentConversations = async () => {
  try {
    loadingConversations.value = true;
    // Socket ile dene
    if (socket.value && connected.value) {
      socket.value.emit(
        'get_conversations',
        { limit: 5 },
        response => {
          if (response && response.success) {
            recentConversations.value = response.data || [];
          } else {
            // Socket başarısız olursa REST API'ye düş
            fetchConversationsFromAPI();
          }
          loadingConversations.value = false;
        }
      );
    } else {
      // Socket bağlantısı yoksa REST API'ye düş
      fetchConversationsFromAPI();
    }
  } catch (err) {
    console.error('Konuşmalar getirilirken hata:', err);
    error.value = 'Konuşmalar getirilirken bir hata oluştu';
    recentConversations.value = []; // Hata durumunda boş dizi
    loadingConversations.value = false;
  }
};

// REST API'den konuşmaları getir
const fetchConversationsFromAPI = async () => {
  try {
    const response = await fetch(
      '/api/conversations?limit=5',
      {
        headers: authStore.getAuthHeader(),
      }
    );

    if (response.ok) {
      const data = await response.json();
      recentConversations.value = data || [];
    } else {
      console.error(`API error: ${response.status}`);
      recentConversations.value = []; // Hata durumunda boş dizi
    }
  } catch (err) {
    console.error('API isteği hatası:', err);
    recentConversations.value = []; // Hata durumunda boş dizi
  } finally {
    loadingConversations.value = false;
  }
};

// Konuşma adını getir
const getConversationName = conversation => {
  if (!conversation || !conversation.participants)
    return 'Konuşma';

  // Grup konuşması ise
  if (conversation.isGroup && conversation.name) {
    return conversation.name;
  }

  // Birebir konuşma ise
  const otherParticipant = conversation.participants.find(
    p => p._id !== authStore.user?._id
  );
  return otherParticipant
    ? otherParticipant.name
    : 'Konuşma';
};

// Son mesajı getir
const getLastMessage = conversation => {
  if (!conversation || !conversation.lastMessage)
    return 'Henüz mesaj yok';

  if (
    conversation.lastMessage.sender._id ===
    authStore.user?._id
  ) {
    return `Siz: ${conversation.lastMessage.content}`;
  }

  return conversation.lastMessage.content;
};

// Konuşmaya git
const goToConversation = conversationId => {
  if (!conversationId) return;
  router.push(`/messages?conversation=${conversationId}`);
};

// İstatistikler hesaplama
const updateStatistics = () => {
  totalMeals.value = recentMeals.value.length;

  totalCalories.value = recentMeals.value
    .reduce((total, meal) => {
      const mealCalories = meal.foods.reduce(
        (mealTotal, food) => {
          const calories =
            food.food?.nutrients?.energy?.value || 0;
          const quantity = food.quantity?.value || 0;
          const multiplier =
            food.quantity?.unit === 'g'
              ? quantity / 100
              : 1;
          return mealTotal + calories * multiplier;
        },
        0
      );
      return total + mealCalories;
    }, 0)
    .toFixed(0);

  const lastMeal = recentMeals.value[0];
  lastActivity.value = lastMeal
    ? formatDate(lastMeal.date)
    : 'Henüz aktivite yok';
};

// Öğünleri getir
const fetchMeals = async () => {
  try {
    loading.value = true;
    const headers = authStore.getAuthHeader();
    const response = await $fetch('/api/meals/recent', {
      headers,
    });

    if (!Array.isArray(response)) {
      recentMeals.value = [];
      return;
    }

    // Öğünleri işle ve besin verilerini standardize et
    recentMeals.value = response.map(meal => {
      return {
        ...meal,
        foods: meal.foods.map(food => {
          // Besin verisini standardize et
          const standardFood = {
            _id: food._id || food.id,
            name: {
              tr:
                food.food?.name?.tr ||
                food.food?.tr ||
                food.name ||
                'İsimsiz',
            },
            nutrients: {
              energy: {
                value:
                  food.food?.nutrients?.energy?.value ||
                  food.food?.calories ||
                  0,
                unit: 'kcal',
              },
              protein: {
                value:
                  food.food?.nutrients?.protein?.value ||
                  food.food?.protein ||
                  0,
                unit: 'g',
              },
              fat: {
                value:
                  food.food?.nutrients?.fat?.value ||
                  food.food?.fat ||
                  0,
                unit: 'g',
              },
              carbohydrate: {
                value:
                  food.food?.nutrients?.carbohydrate
                    ?.value ||
                  food.food?.carbs ||
                  0,
                unit: 'g',
              },
            },
            quantity: {
              value:
                food.quantity?.value || food.quantity || 0,
              unit: food.quantity?.unit || 'g',
            },
          };
          return {
            ...food,
            food: standardFood,
          };
        }),
      };
    });
    updateStatistics();
  } catch (error) {
    console.error('Error fetching meals:', error);
    toast.error('Öğünler yüklenirken bir hata oluştu');
    recentMeals.value = [];
  } finally {
    loading.value = false;
  }
};

// Favorileri getir
const fetchFavorites = async () => {
  try {
    loadingFavorites.value = true;
    const response = await $fetch('/api/favorites', {
      headers: authStore.getAuthHeader(),
    });

    // API yanıtını kontrol et ve düzenle
    if (!response || !Array.isArray(response)) {
      favorites.value = [];
      return;
    }

    // Her bir favori besini işle
    favorites.value = response.map(fav => {
      // Temel favori objesi
      const favorite = {
        id: fav._id || fav.id,
        name: {
          tr:
            fav.name?.tr ||
            fav.food?.name?.tr ||
            fav.food?.tr ||
            fav.name ||
            'İsimsiz',
        },
        category: fav.category || fav.food?.category || {},
        nutrients: {
          energy: {
            value:
              fav.nutrients?.energy?.value ||
              fav.food?.nutrients?.energy?.value ||
              fav.calories ||
              0,
            unit: 'kcal',
          },
          protein: {
            value:
              fav.nutrients?.protein?.value ||
              fav.food?.nutrients?.protein?.value ||
              fav.protein ||
              0,
            unit: 'g',
          },
          fat: {
            value:
              fav.nutrients?.fat?.value ||
              fav.food?.nutrients?.fat?.value ||
              fav.fat ||
              0,
            unit: 'g',
          },
          carbohydrate: {
            value:
              fav.nutrients?.carbohydrate?.value ||
              fav.food?.nutrients?.carbohydrate?.value ||
              fav.carbs ||
              0,
            unit: 'g',
          },
        },
        portionSize: {
          value:
            fav.portionSize?.value ||
            fav.food?.portionSize?.value ||
            100,
          unit:
            fav.portionSize?.unit ||
            fav.food?.portionSize?.unit ||
            'g',
        },
      };

      return favorite;
    });
  } catch (error) {
    console.error('Error fetching favorites:', error);
    toast.error('Favoriler yüklenirken bir hata oluştu');
    favorites.value = [];
  } finally {
    loadingFavorites.value = false;
  }
};

// Favori kaldır
const removeFavorite = async favoriteId => {
  try {
    removing.value[favoriteId] = true;
    await $fetch(`/api/favorites/${favoriteId}`, {
      method: 'DELETE',
      headers: authStore.getAuthHeader(),
    });
    favorites.value = favorites.value.filter(
      f => f.id !== favoriteId
    );
    toast.success('Favori başarıyla kaldırıldı');
  } catch (error) {
    console.error('Error removing favorite:', error);
    toast.error('Favori kaldırılırken bir hata oluştu');
  } finally {
    removing.value[favoriteId] = false;
  }
};

// Öğüne ekle
const addToMeal = async food => {
  try {
    await $fetch('/api/meals', {
      method: 'POST',
      body: {
        foodId: food._id,
        quantity: 1,
        mealType: 'breakfast',
        date: new Date().toISOString(),
      },
      headers: authStore.getAuthHeader(),
    });
    toast.success('Besin öğüne eklendi');
  } catch (error) {
    console.error('Error adding to meal:', error);
    toast.error('Öğüne eklenirken bir hata oluştu');
  }
};

// Yardımcı fonksiyonlar
const formatDate = date => {
  return new Date(date).toLocaleDateString('tr-TR');
};

const getMealTypeName = type => {
  const types = {
    breakfast: 'Sabah',
    lunch: 'Öğle',
    dinner: 'Akşam',
    snack: 'Ara',
  };
  return types[type] || type;
};

const calculateTotalCalories = meal => {
  if (!meal?.foods?.length) return 0;

  return meal.foods
    .reduce((total, food) => {
      const calories =
        food.food?.nutrients?.energy?.value || 0;
      const quantity = food.quantity?.value || 0;
      const multiplier =
        food.quantity?.unit === 'g' ? quantity / 100 : 1;
      return total + calories * multiplier;
    }, 0)
    .toFixed(0);
};

const getFoodName = food => {
  if (!food) return '';

  if (typeof food === 'string') {
    try {
      food = JSON.parse(food);
    } catch (e) {
      return food;
    }
  }

  // Besin verisi obje olarak gelmiş
  if (food.name) return food.name;
  if (food.tr) return food.tr;
  if (food.en) return food.en;

  return 'İsimsiz Besin';
};

// Sayfa yüklendiğinde verileri getir
onMounted(() => {
  fetchMeals();
  fetchFavorites();
  fetchFriends();
  fetchRecentConversations();
});

// Sayfa başlığı
definePageMeta({
  title: 'Profil',
  description: 'Kullanıcı profili ve aktivite özeti',
});
</script>

<style scoped>
/* Custom scrollbar */
.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: #f1f5f9;
  border-radius: 2px;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 2px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}

/* Counter animation */
.counter {
  animation: countUp 2s ease-out;
}

@keyframes countUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Hover effects */
.group:hover .group-hover\:scale-105 {
  transform: scale(1.05);
}

.group:hover .group-hover\:scale-110 {
  transform: scale(1.1);
}

/* Gradient text effect */
.bg-clip-text {
  background-clip: text;
  -webkit-background-clip: text;
}

/* Loading animation enhancement */
@keyframes shimmer {
  0% {
    background-position: -200px 0;
  }
  100% {
    background-position: calc(200px + 100%) 0;
  }
}

.animate-shimmer {
  animation: shimmer 2s infinite;
  background: linear-gradient(
    90deg,
    #f0f0f0 25%,
    #e0e0e0 50%,
    #f0f0f0 75%
  );
  background-size: 200px 100%;
}

/* Pulse effect for notifications */
@keyframes pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

/* Smooth transitions for all interactive elements */
* {
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 200ms;
}

/* Focus states for accessibility */
button:focus,
a:focus {
  outline: 2px solid #3b82f6;
  outline-offset: 2px;
}

/* Mobile responsive improvements */
@media (max-width: 768px) {
  .container {
    padding-left: 1rem;
    padding-right: 1rem;
  }
}
</style>