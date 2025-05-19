<template>
  <div class="bg-white">
    <!-- Hero Section -->
    <div class="relative overflow-hidden bg-gradient-to-r from-green-50 via-green-100 to-green-50">
      <!-- Dekoratif Elementler -->
      <div class="hidden lg:block lg:absolute lg:inset-y-0 lg:h-full lg:w-full">
        <div class="relative h-full text-lg max-w-prose mx-auto">
          <svg class="absolute top-12 left-full transform translate-x-32" width="404" height="384" fill="none" viewBox="0 0 404 384">
            <defs>
              <pattern id="74b3fd99-0a6f-4271-bef2-e80eeafdf357" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                <rect x="0" y="0" width="4" height="4" class="text-green-200" fill="currentColor" />
              </pattern>
            </defs>
            <rect width="404" height="384" fill="url(#74b3fd99-0a6f-4271-bef2-e80eeafdf357)" />
          </svg>
          <svg class="absolute top-1/2 right-full transform -translate-y-1/2 -translate-x-32" width="404" height="384" fill="none" viewBox="0 0 404 384">
            <defs>
              <pattern id="f210dbf6-a58d-4871-961e-36d5016a0f49" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                <rect x="0" y="0" width="4" height="4" class="text-green-200" fill="currentColor" />
              </pattern>
            </defs>
            <rect width="404" height="384" fill="url(#f210dbf6-a58d-4871-961e-36d5016a0f49)" />
          </svg>
        </div>
      </div>
      
      <div class="max-w-7xl mx-auto">
        <div class="relative z-10 pb-8 bg-transparent sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32">
          <main class="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
            <div class="sm:text-center lg:text-left">
              <h1 class="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
                <span class="block xl:inline">Beslenme Alışkanlıklarınızı</span>
                <span class="block text-green-600 xl:inline"> Takip Edin ve Geliştirin</span>
              </h1>
              <p class="mt-3 text-base text-gray-500 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                Yemek takibi yapın, besin değerlerini öğrenin ve sağlıklı beslenme hedeflerinize ulaşın. Kişiselleştirilmiş önerilerle daha sağlıklı bir yaşama adım atın.
              </p>
              
              <!-- Öne Çıkan Özellikler -->
              <div class="mt-5 grid grid-cols-3 gap-3 sm:mt-8 sm:max-w-lg sm:mx-auto lg:mx-0">
                <div class="flex flex-col items-center bg-white p-3 rounded-lg shadow-sm">
                  <div class="text-green-600 text-xl mb-1">
                    <i class="fas fa-utensils"></i>
                  </div>
                  <p class="text-xs font-medium text-gray-700">5.000+ Besin</p>
                </div>
                <div class="flex flex-col items-center bg-white p-3 rounded-lg shadow-sm">
                  <div class="text-green-600 text-xl mb-1">
                    <i class="fas fa-chart-line"></i>
                  </div>
                  <p class="text-xs font-medium text-gray-700">Detaylı Raporlar</p>
                </div>
                <div class="flex flex-col items-center bg-white p-3 rounded-lg shadow-sm">
                  <div class="text-green-600 text-xl mb-1">
                    <i class="fas fa-medal"></i>
                  </div>
                  <p class="text-xs font-medium text-gray-700">Kişisel Hedefler</p>
                </div>
              </div>
              
              <div class="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
                <div class="rounded-md shadow">
                  <NuxtLink
                    to="/register"
                    class="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-green-600 hover:bg-green-700 md:py-4 md:text-lg md:px-10 transition-colors duration-300"
                  >
                    Ücretsiz Başlayın
                  </NuxtLink>
                </div>
                <div class="mt-3 sm:mt-0 sm:ml-3">
                  <NuxtLink
                    to="/yiyecekler"
                    class="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-green-600 bg-white hover:bg-gray-50 md:py-4 md:text-lg md:px-10 transition-colors duration-300 shadow-sm"
                  >
                    Besin Değerlerini İnceleyin
                  </NuxtLink>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
      
      <!-- Hero Görseli -->
      <div class="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2">
        <img class="h-56 w-full object-cover sm:h-72 md:h-96 lg:w-full lg:h-full" src="https://images.unsplash.com/photo-1490818387583-1baba5e638af?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80" alt="Sağlıklı beslenme konsepti">
      </div>
    </div>

    <!-- Nasıl Çalışır Bölümü -->
    <div class="py-16 bg-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center">
          <h2 class="text-base text-green-600 font-semibold tracking-wide uppercase">Basit ve Etkili</h2>
          <p class="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            Sağlıklı Yaşam Yolculuğunuz
          </p>
          <p class="mt-4 max-w-2xl text-xl text-gray-500 mx-auto">
            Sadece üç adımda sağlıklı beslenme yolculuğunuza başlayın
          </p>
        </div>

        <div class="mt-12">
          <div class="relative">
            <!-- Adım Çizgisi -->
            <div class="hidden md:block absolute top-1/2 left-0 w-full h-1 bg-green-200 transform -translate-y-1/2"></div>
            
            <div class="relative grid grid-cols-1 md:grid-cols-3 gap-8">
              <!-- Adım 1 -->
              <div class="relative flex flex-col items-center p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300">
                <div class="flex items-center justify-center h-16 w-16 rounded-full bg-green-600 text-white text-2xl font-bold mb-4 z-10">
                  1
                </div>
                <h3 class="text-xl font-medium text-gray-900 mb-2">Hedeflerinizi Belirleyin</h3>
                <p class="text-center text-gray-600">
                  Kişisel bilgilerinizi girin ve sağlık hedeflerinizi belirleyin. Size özel bir beslenme planı oluşturalım.
                </p>
                <div class="mt-4">
                  <NuxtLink to="/register" class="text-green-600 hover:text-green-800 font-medium">Kayıt Ol →</NuxtLink>
                </div>
              </div>

              <!-- Adım 2 -->
              <div class="relative flex flex-col items-center p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300">
                <div class="flex items-center justify-center h-16 w-16 rounded-full bg-green-600 text-white text-2xl font-bold mb-4 z-10">
                  2
                </div>
                <h3 class="text-xl font-medium text-gray-900 mb-2">Yemeklerinizi Takip Edin</h3>
                <p class="text-center text-gray-600">
                  Günlük öğünlerinizi kaydedin. Barkod tarama, fotoğraf çekme veya arama yaparak hızlıca besinleri ekleyin.
                </p>
                <div class="mt-4">
                  <NuxtLink to="/ogun" class="text-green-600 hover:text-green-800 font-medium">Öğün Ekle →</NuxtLink>
                </div>
              </div>

              <!-- Adım 3 -->
              <div class="relative flex flex-col items-center p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300">
                <div class="flex items-center justify-center h-16 w-16 rounded-full bg-green-600 text-white text-2xl font-bold mb-4 z-10">
                  3
                </div>
                <h3 class="text-xl font-medium text-gray-900 mb-2">Gelişiminizi Görün</h3>
                <p class="text-center text-gray-600">
                  Detaylı raporlar ve grafiklerle ilerlemenizi takip edin. Kişiselleştirilmiş önerilerle hedeflerinize ulaşın.
                </p>
                <div class="mt-4">
                  <NuxtLink to="/profil" class="text-green-600 hover:text-green-800 font-medium">Raporlarım →</NuxtLink>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Sağlık Hedefleri Bölümü -->
    <div class="bg-gray-50 py-20">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-16">
          <h2 class="text-base text-green-600 font-semibold tracking-wide uppercase">Sağlık Hedefleriniz</h2>
          <p class="mt-2 text-4xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-5xl">
            Hedeflerinize Göre <span class="text-green-600">Özelleştirilmiş</span> Deneyim
          </p>
          <p class="mt-6 max-w-2xl text-xl text-gray-500 mx-auto">
            Kişisel hedeflerinize uygun beslenme planları ve öneriler
          </p>
        </div>

        <div class="mt-12 grid grid-cols-1 md:grid-cols-3 gap-10">
          <!-- Hedef 1: Kilo Verme -->
          <div class="group relative bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2">
            <div class="absolute inset-0 bg-gradient-to-br from-pink-500/80 to-red-600/80 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10"></div>
            
            <div class="h-64 overflow-hidden relative">
              <img src="https://images.unsplash.com/photo-1535914254981-b5012eebbd15?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80" 
                   alt="Kilo Verme" 
                   class="w-full h-full object-cover object-center transform group-hover:scale-110 transition-transform duration-700 ease-in-out" />
              <div class="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
              <div class="absolute bottom-0 left-0 p-6 z-20">
                <h3 class="text-2xl font-bold text-white mb-1">Kilo Verme</h3>
                <div class="w-12 h-1 bg-green-500 rounded-full mb-3 transform origin-left group-hover:scale-x-150 transition-transform duration-500"></div>
              </div>
            </div>
            
            <div class="p-6 relative z-20">
              <p class="text-gray-700 group-hover:text-white transition-colors duration-500">
                Sağlıklı bir şekilde kilo vermek için kalori açığı oluşturun. Günlük kalori ihtiyacınızı hesaplayın ve beslenmenizi takip edin.
              </p>
              
              <ul class="mt-6 space-y-3">
                <li class="flex items-center group-hover:text-white transition-colors duration-500">
                  <div class="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center mr-3 group-hover:bg-green-500 transition-colors duration-500">
                    <i class="fas fa-check text-green-600 text-sm group-hover:text-white transition-colors duration-500"></i>
                  </div>
                  <span class="text-gray-700 group-hover:text-white transition-colors duration-500">Kişiselleştirilmiş kalori hedefi</span>
                </li>
                <li class="flex items-center group-hover:text-white transition-colors duration-500">
                  <div class="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center mr-3 group-hover:bg-green-500 transition-colors duration-500">
                    <i class="fas fa-check text-green-600 text-sm group-hover:text-white transition-colors duration-500"></i>
                  </div>
                  <span class="text-gray-700 group-hover:text-white transition-colors duration-500">Düşük kalorili tarifler</span>
                </li>
                <li class="flex items-center group-hover:text-white transition-colors duration-500">
                  <div class="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center mr-3 group-hover:bg-green-500 transition-colors duration-500">
                    <i class="fas fa-check text-green-600 text-sm group-hover:text-white transition-colors duration-500"></i>
                  </div>
                  <span class="text-gray-700 group-hover:text-white transition-colors duration-500">İlerleme takibi ve grafikler</span>
                </li>
              </ul>
              
              <div class="mt-8">
                <NuxtLink to="/register" class="inline-flex items-center px-4 py-2 rounded-full bg-green-600 text-white font-medium hover:bg-green-700 transition-colors duration-300 group-hover:bg-white group-hover:text-green-600 shadow-md hover:shadow-lg">
                  Hemen Başlayın <i class="fas fa-arrow-right ml-2"></i>
                </NuxtLink>
              </div>
            </div>
          </div>

          <!-- Hedef 2: Kas Kütlesi Kazanma -->
          <div class="group relative bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2">
            <div class="absolute inset-0 bg-gradient-to-br from-blue-500/80 to-indigo-600/80 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10"></div>
            
            <div class="h-64 overflow-hidden relative">
              <img src="https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80" 
                   alt="Kas Kütlesi Kazanma" 
                   class="w-full h-full object-cover object-center transform group-hover:scale-110 transition-transform duration-700 ease-in-out" />
              <div class="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
              <div class="absolute bottom-0 left-0 p-6 z-20">
                <h3 class="text-2xl font-bold text-white mb-1">Kas Kütlesi Kazanma</h3>
                <div class="w-12 h-1 bg-green-500 rounded-full mb-3 transform origin-left group-hover:scale-x-150 transition-transform duration-500"></div>
              </div>
            </div>
            
            <div class="p-6 relative z-20">
              <p class="text-gray-700 group-hover:text-white transition-colors duration-500">
                Protein alımınızı optimize edin ve kalori fazlası oluşturun. Makro besin dengenizi koruyarak kas gelişiminizi destekleyin.
              </p>
              
              <ul class="mt-6 space-y-3">
                <li class="flex items-center group-hover:text-white transition-colors duration-500">
                  <div class="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center mr-3 group-hover:bg-green-500 transition-colors duration-500">
                    <i class="fas fa-check text-green-600 text-sm group-hover:text-white transition-colors duration-500"></i>
                  </div>
                  <span class="text-gray-700 group-hover:text-white transition-colors duration-500">Protein odaklı beslenme planı</span>
                </li>
                <li class="flex items-center group-hover:text-white transition-colors duration-500">
                  <div class="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center mr-3 group-hover:bg-green-500 transition-colors duration-500">
                    <i class="fas fa-check text-green-600 text-sm group-hover:text-white transition-colors duration-500"></i>
                  </div>
                  <span class="text-gray-700 group-hover:text-white transition-colors duration-500">Makro besin takibi</span>
                </li>
                <li class="flex items-center group-hover:text-white transition-colors duration-500">
                  <div class="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center mr-3 group-hover:bg-green-500 transition-colors duration-500">
                    <i class="fas fa-check text-green-600 text-sm group-hover:text-white transition-colors duration-500"></i>
                  </div>
                  <span class="text-gray-700 group-hover:text-white transition-colors duration-500">Antrenman sonrası beslenme önerileri</span>
                </li>
              </ul>
              
              <div class="mt-8">
                <NuxtLink to="/register" class="inline-flex items-center px-4 py-2 rounded-full bg-green-600 text-white font-medium hover:bg-green-700 transition-colors duration-300 group-hover:bg-white group-hover:text-green-600 shadow-md hover:shadow-lg">
                  Hemen Başlayın <i class="fas fa-arrow-right ml-2"></i>
                </NuxtLink>
              </div>
            </div>
          </div>

          <!-- Hedef 3: Sağlıklı Beslenme -->
          <div class="group relative bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2">
            <div class="absolute inset-0 bg-gradient-to-br from-green-500/80 to-teal-600/80 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10"></div>
            
            <div class="h-64 overflow-hidden relative">
              <img src="https://images.unsplash.com/photo-1498837167922-ddd27525d352?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80" 
                   alt="Sağlıklı Beslenme" 
                   class="w-full h-full object-cover object-center transform group-hover:scale-110 transition-transform duration-700 ease-in-out" />
              <div class="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
              <div class="absolute bottom-0 left-0 p-6 z-20">
                <h3 class="text-2xl font-bold text-white mb-1">Sağlıklı Beslenme</h3>
                <div class="w-12 h-1 bg-green-500 rounded-full mb-3 transform origin-left group-hover:scale-x-150 transition-transform duration-500"></div>
              </div>
            </div>
            
            <div class="p-6 relative z-20">
              <p class="text-gray-700 group-hover:text-white transition-colors duration-500">
                Dengeli ve çeşitli beslenin. Vitamin ve mineral alımınızı takip edin, besin değeri yüksek gıdaları keşfedin.
              </p>
              
              <ul class="mt-6 space-y-3">
                <li class="flex items-center group-hover:text-white transition-colors duration-500">
                  <div class="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center mr-3 group-hover:bg-green-500 transition-colors duration-500">
                    <i class="fas fa-check text-green-600 text-sm group-hover:text-white transition-colors duration-500"></i>
                  </div>
                  <span class="text-gray-700 group-hover:text-white transition-colors duration-500">Vitamin ve mineral analizi</span>
                </li>
                <li class="flex items-center group-hover:text-white transition-colors duration-500">
                  <div class="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center mr-3 group-hover:bg-green-500 transition-colors duration-500">
                    <i class="fas fa-check text-green-600 text-sm group-hover:text-white transition-colors duration-500"></i>
                  </div>
                  <span class="text-gray-700 group-hover:text-white transition-colors duration-500">Besin çeşitliliği takibi</span>
                </li>
                <li class="flex items-center group-hover:text-white transition-colors duration-500">
                  <div class="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center mr-3 group-hover:bg-green-500 transition-colors duration-500">
                    <i class="fas fa-check text-green-600 text-sm group-hover:text-white transition-colors duration-500"></i>
                  </div>
                  <span class="text-gray-700 group-hover:text-white transition-colors duration-500">Sağlıklı tarifler ve öneriler</span>
                </li>
              </ul>
              
              <div class="mt-8">
                <NuxtLink to="/register" class="inline-flex items-center px-4 py-2 rounded-full bg-green-600 text-white font-medium hover:bg-green-700 transition-colors duration-300 group-hover:bg-white group-hover:text-green-600 shadow-md hover:shadow-lg">
                  Hemen Başlayın <i class="fas fa-arrow-right ml-2"></i>
                </NuxtLink>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- İstatistikler Bölümü -->
    <div class="relative py-24 overflow-hidden">
      <!-- Arkaplan -->
      <div class="absolute inset-0 bg-gradient-to-br from-green-600 via-green-700 to-green-800 z-0"></div>
      
      <!-- Dekoratif Şekiller -->
      <div class="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
        <div class="absolute -top-20 -left-20 w-64 h-64 bg-white opacity-5 rounded-full blur-3xl"></div>
        <div class="absolute top-40 right-20 w-96 h-96 bg-green-300 opacity-10 rounded-full blur-3xl"></div>
        <div class="absolute bottom-10 left-1/4 w-80 h-80 bg-green-100 opacity-5 rounded-full blur-3xl"></div>
      </div>
      
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div class="text-center mb-16">
          <div class="inline-block">
            <h2 class="text-base text-green-200 font-semibold tracking-wide uppercase relative inline-block">
              Rakamlarla Başarımız
              <div class="absolute -bottom-1 left-0 w-full h-0.5 bg-green-300 transform scale-x-50 origin-center"></div>
            </h2>
          </div>
          <p class="mt-3 text-4xl sm:text-5xl font-extrabold text-white leading-tight">
            <span class="bg-clip-text text-transparent bg-gradient-to-r from-white to-green-200">Güçlü Sonuçlar</span>
          </p>
          <p class="mt-6 max-w-2xl text-xl text-green-100 mx-auto">
            Binlerce kullanıcımız hedeflerine ulaşıyor ve sağlıklı yaşam yolculuğunda başarı elde ediyor
          </p>
        </div>
        
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 text-center">
          <!-- İstatistik 1 -->
          <div class="group relative bg-white bg-opacity-10 backdrop-blur-sm rounded-2xl p-8 transform transition-all duration-500 hover:scale-105 hover:bg-opacity-15 hover:shadow-xl hover:shadow-green-900/20">
            <div class="absolute inset-0 bg-gradient-to-br from-green-400/20 to-green-600/20 opacity-0 group-hover:opacity-100 rounded-2xl transition-opacity duration-500 z-0"></div>
            <div class="relative z-10">
              <div class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-white to-green-100 mb-6 shadow-lg group-hover:shadow-green-300/30 transition-all duration-500 group-hover:scale-110">
                <i class="fas fa-users text-green-600 text-2xl"></i>
              </div>
              <div class="relative">
                <p class="text-5xl font-extrabold text-white mb-1 tracking-tight">10,000+</p>
                <div class="w-12 h-0.5 bg-green-400 mx-auto mb-3 transform origin-left group-hover:scale-x-150 transition-transform duration-500"></div>
                <p class="text-xl text-green-100 font-medium">Kayıtlı Kullanıcı</p>
              </div>
            </div>
          </div>
          
          <!-- İstatistik 2 -->
          <div class="group relative bg-white bg-opacity-10 backdrop-blur-sm rounded-2xl p-8 transform transition-all duration-500 hover:scale-105 hover:bg-opacity-15 hover:shadow-xl hover:shadow-green-900/20">
            <div class="absolute inset-0 bg-gradient-to-br from-green-400/20 to-green-600/20 opacity-0 group-hover:opacity-100 rounded-2xl transition-opacity duration-500 z-0"></div>
            <div class="relative z-10">
              <div class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-white to-green-100 mb-6 shadow-lg group-hover:shadow-green-300/30 transition-all duration-500 group-hover:scale-110">
                <i class="fas fa-apple-alt text-green-600 text-2xl"></i>
              </div>
              <div class="relative">
                <p class="text-5xl font-extrabold text-white mb-1 tracking-tight">5,000+</p>
                <div class="w-12 h-0.5 bg-green-400 mx-auto mb-3 transform origin-left group-hover:scale-x-150 transition-transform duration-500"></div>
                <p class="text-xl text-green-100 font-medium">Besin Veritabanı</p>
              </div>
            </div>
          </div>
          
          <!-- İstatistik 3 -->
          <div class="group relative bg-white bg-opacity-10 backdrop-blur-sm rounded-2xl p-8 transform transition-all duration-500 hover:scale-105 hover:bg-opacity-15 hover:shadow-xl hover:shadow-green-900/20">
            <div class="absolute inset-0 bg-gradient-to-br from-green-400/20 to-green-600/20 opacity-0 group-hover:opacity-100 rounded-2xl transition-opacity duration-500 z-0"></div>
            <div class="relative z-10">
              <div class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-white to-green-100 mb-6 shadow-lg group-hover:shadow-green-300/30 transition-all duration-500 group-hover:scale-110">
                <i class="fas fa-utensils text-green-600 text-2xl"></i>
              </div>
              <div class="relative">
                <p class="text-5xl font-extrabold text-white mb-1 tracking-tight">1M+</p>
                <div class="w-12 h-0.5 bg-green-400 mx-auto mb-3 transform origin-left group-hover:scale-x-150 transition-transform duration-500"></div>
                <p class="text-xl text-green-100 font-medium">Kaydedilen Öğün</p>
              </div>
            </div>
          </div>
          
          <!-- İstatistik 4 -->
          <div class="group relative bg-white bg-opacity-10 backdrop-blur-sm rounded-2xl p-8 transform transition-all duration-500 hover:scale-105 hover:bg-opacity-15 hover:shadow-xl hover:shadow-green-900/20">
            <div class="absolute inset-0 bg-gradient-to-br from-green-400/20 to-green-600/20 opacity-0 group-hover:opacity-100 rounded-2xl transition-opacity duration-500 z-0"></div>
            <div class="relative z-10">
              <div class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-white to-green-100 mb-6 shadow-lg group-hover:shadow-green-300/30 transition-all duration-500 group-hover:scale-110">
                <i class="fas fa-star text-green-600 text-2xl"></i>
              </div>
              <div class="relative">
                <p class="text-5xl font-extrabold text-white mb-1 tracking-tight">4.8/5</p>
                <div class="w-12 h-0.5 bg-green-400 mx-auto mb-3 transform origin-left group-hover:scale-x-150 transition-transform duration-500"></div>
                <p class="text-xl text-green-100 font-medium">Kullanıcı Memnuniyeti</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Popüler Besinler Bölümü -->
    <div class="bg-gradient-to-b from-gray-50 to-white py-24">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-16">
          <div class="inline-block">
            <h2 class="text-base text-green-600 font-semibold tracking-wide uppercase relative inline-block">
              Besin Kataloğu
              <div class="absolute -bottom-1 left-0 w-full h-0.5 bg-green-500 transform scale-x-50 origin-center"></div>
            </h2>
          </div>
          <p class="mt-3 text-4xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-5xl">
            Popüler <span class="text-green-600">Besinler</span>
          </p>
          <p class="mt-6 max-w-2xl text-xl text-gray-500 mx-auto">
            En çok aranan ve takip edilen besinleri keşfedin
          </p>
        </div>

        <div class="mt-16 grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          <!-- Besin 1 -->
          <div class="group relative bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2">
            <!-- Overlay gradient on hover -->
            <div class="absolute inset-0 bg-gradient-to-br from-green-500/70 to-green-700/70 opacity-0 group-hover:opacity-80 transition-opacity duration-500 z-10"></div>
            
            <div class="relative">
              <div class="h-56 overflow-hidden">
                <img src="https://images.unsplash.com/photo-1607532941433-304659e8198a?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" 
                     alt="Avokado" 
                     class="w-full h-full object-cover object-center transform group-hover:scale-110 transition-transform duration-700 ease-in-out">
              </div>
              
              <!-- Badge -->
              <div class="absolute top-4 right-4 bg-white/90 backdrop-blur-sm text-green-600 text-sm font-bold px-3 py-1 rounded-full shadow-md z-20">
                160 kcal
              </div>
              
              <!-- Content -->
              <div class="p-6 relative">
                <h3 class="text-xl font-bold text-gray-900 group-hover:text-white transition-colors duration-300 z-20 relative">Avokado</h3>
                <div class="w-10 h-0.5 bg-green-500 my-3 transform origin-left group-hover:bg-white group-hover:scale-x-150 transition-all duration-300"></div>
                
                <div class="flex justify-between text-sm text-gray-500 group-hover:text-white/80 transition-colors duration-300 mb-4 relative z-20">
                  <span>100g</span>
                </div>
                
                <div class="grid grid-cols-3 gap-2 relative z-20">
                  <div class="bg-green-50 group-hover:bg-green-600/40 text-green-800 group-hover:text-white px-3 py-2 rounded-lg text-center transition-colors duration-300">
                    <span class="font-medium text-xs">Protein</span>
                    <p class="text-lg font-bold mt-1">2g</p>
                  </div>
                  <div class="bg-amber-50 group-hover:bg-amber-500/40 text-amber-800 group-hover:text-white px-3 py-2 rounded-lg text-center transition-colors duration-300">
                    <span class="font-medium text-xs">Karb</span>
                    <p class="text-lg font-bold mt-1">9g</p>
                  </div>
                  <div class="bg-blue-50 group-hover:bg-blue-500/40 text-blue-800 group-hover:text-white px-3 py-2 rounded-lg text-center transition-colors duration-300">
                    <span class="font-medium text-xs">Yağ</span>
                    <p class="text-lg font-bold mt-1">15g</p>
                  </div>
                </div>
                
                <div class="mt-6 relative z-20">
                  <NuxtLink to="/yiyecekler" class="inline-flex items-center px-4 py-2 rounded-full bg-green-600 text-white font-medium hover:bg-green-700 transition-colors duration-300 group-hover:bg-white group-hover:text-green-600 shadow-md hover:shadow-lg">
                    Detayları Gör <i class="fas fa-arrow-right ml-2"></i>
                  </NuxtLink>
                </div>
              </div>
            </div>
          </div>

          <!-- Besin 2 -->
          <div class="group relative bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2">
            <!-- Overlay gradient on hover -->
            <div class="absolute inset-0 bg-gradient-to-br from-amber-500/70 to-amber-700/70 opacity-0 group-hover:opacity-80 transition-opacity duration-500 z-10"></div>
            
            <div class="relative">
              <div class="h-56 overflow-hidden">
                <img src="https://images.unsplash.com/photo-1565299585323-38d6b0865b47?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" 
                     alt="Yulaf" 
                     class="w-full h-full object-cover object-center transform group-hover:scale-110 transition-transform duration-700 ease-in-out">
              </div>
              
              <!-- Badge -->
              <div class="absolute top-4 right-4 bg-white/90 backdrop-blur-sm text-amber-600 text-sm font-bold px-3 py-1 rounded-full shadow-md z-20">
                389 kcal
              </div>
              
              <!-- Content -->
              <div class="p-6 relative">
                <h3 class="text-xl font-bold text-gray-900 group-hover:text-white transition-colors duration-300 z-20 relative">Yulaf</h3>
                <div class="w-10 h-0.5 bg-amber-500 my-3 transform origin-left group-hover:bg-white group-hover:scale-x-150 transition-all duration-300"></div>
                
                <div class="flex justify-between text-sm text-gray-500 group-hover:text-white/80 transition-colors duration-300 mb-4 relative z-20">
                  <span>100g</span>
                </div>
                
                <div class="grid grid-cols-3 gap-2 relative z-20">
                  <div class="bg-green-50 group-hover:bg-green-600/40 text-green-800 group-hover:text-white px-3 py-2 rounded-lg text-center transition-colors duration-300">
                    <span class="font-medium text-xs">Protein</span>
                    <p class="text-lg font-bold mt-1">13g</p>
                  </div>
                  <div class="bg-amber-50 group-hover:bg-amber-500/40 text-amber-800 group-hover:text-white px-3 py-2 rounded-lg text-center transition-colors duration-300">
                    <span class="font-medium text-xs">Karb</span>
                    <p class="text-lg font-bold mt-1">67g</p>
                  </div>
                  <div class="bg-blue-50 group-hover:bg-blue-500/40 text-blue-800 group-hover:text-white px-3 py-2 rounded-lg text-center transition-colors duration-300">
                    <span class="font-medium text-xs">Yağ</span>
                    <p class="text-lg font-bold mt-1">7g</p>
                  </div>
                </div>
                
                <div class="mt-6 relative z-20">
                  <NuxtLink to="/yiyecekler" class="inline-flex items-center px-4 py-2 rounded-full bg-amber-600 text-white font-medium hover:bg-amber-700 transition-colors duration-300 group-hover:bg-white group-hover:text-amber-600 shadow-md hover:shadow-lg">
                    Detayları Gör <i class="fas fa-arrow-right ml-2"></i>
                  </NuxtLink>
                </div>
              </div>
            </div>
          </div>

          <!-- Besin 3 -->
          <div class="group relative bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2">
            <!-- Overlay gradient on hover -->
            <div class="absolute inset-0 bg-gradient-to-br from-blue-500/70 to-blue-700/70 opacity-0 group-hover:opacity-80 transition-opacity duration-500 z-10"></div>
            
            <div class="relative">
              <div class="h-56 overflow-hidden">
                <img src="https://images.unsplash.com/photo-1615485290382-441e4d049cb5?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" 
                     alt="Somon" 
                     class="w-full h-full object-cover object-center transform group-hover:scale-110 transition-transform duration-700 ease-in-out">
              </div>
              
              <!-- Badge -->
              <div class="absolute top-4 right-4 bg-white/90 backdrop-blur-sm text-blue-600 text-sm font-bold px-3 py-1 rounded-full shadow-md z-20">
                208 kcal
              </div>
              
              <!-- Content -->
              <div class="p-6 relative">
                <h3 class="text-xl font-bold text-gray-900 group-hover:text-white transition-colors duration-300 z-20 relative">Somon</h3>
                <div class="w-10 h-0.5 bg-blue-500 my-3 transform origin-left group-hover:bg-white group-hover:scale-x-150 transition-all duration-300"></div>
                
                <div class="flex justify-between text-sm text-gray-500 group-hover:text-white/80 transition-colors duration-300 mb-4 relative z-20">
                  <span>100g</span>
                </div>
                
                <div class="grid grid-cols-3 gap-2 relative z-20">
                  <div class="bg-green-50 group-hover:bg-green-600/40 text-green-800 group-hover:text-white px-3 py-2 rounded-lg text-center transition-colors duration-300">
                    <span class="font-medium text-xs">Protein</span>
                    <p class="text-lg font-bold mt-1">20g</p>
                  </div>
                  <div class="bg-amber-50 group-hover:bg-amber-500/40 text-amber-800 group-hover:text-white px-3 py-2 rounded-lg text-center transition-colors duration-300">
                    <span class="font-medium text-xs">Karb</span>
                    <p class="text-lg font-bold mt-1">0g</p>
                  </div>
                  <div class="bg-blue-50 group-hover:bg-blue-500/40 text-blue-800 group-hover:text-white px-3 py-2 rounded-lg text-center transition-colors duration-300">
                    <span class="font-medium text-xs">Yağ</span>
                    <p class="text-lg font-bold mt-1">13g</p>
                  </div>
                </div>
                
                <div class="mt-6 relative z-20">
                  <NuxtLink to="/yiyecekler" class="inline-flex items-center px-4 py-2 rounded-full bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors duration-300 group-hover:bg-white group-hover:text-blue-600 shadow-md hover:shadow-lg">
                    Detayları Gör <i class="fas fa-arrow-right ml-2"></i>
                  </NuxtLink>
                </div>
              </div>
            </div>
          </div>

          <!-- Besin 4 -->
          <div class="group relative bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2">
            <!-- Overlay gradient on hover -->
            <div class="absolute inset-0 bg-gradient-to-br from-purple-500/70 to-purple-700/70 opacity-0 group-hover:opacity-80 transition-opacity duration-500 z-10"></div>
            
            <div class="relative">
              <div class="h-56 overflow-hidden">
                <img src="https://images.unsplash.com/photo-1550828520-4cb496926fc9?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" 
                     alt="Kinoa" 
                     class="w-full h-full object-cover object-center transform group-hover:scale-110 transition-transform duration-700 ease-in-out">
              </div>
              
              <!-- Badge -->
              <div class="absolute top-4 right-4 bg-white/90 backdrop-blur-sm text-purple-600 text-sm font-bold px-3 py-1 rounded-full shadow-md z-20">
                368 kcal
              </div>
              
              <!-- Content -->
              <div class="p-6 relative">
                <h3 class="text-xl font-bold text-gray-900 group-hover:text-white transition-colors duration-300 z-20 relative">Kinoa</h3>
                <div class="w-10 h-0.5 bg-purple-500 my-3 transform origin-left group-hover:bg-white group-hover:scale-x-150 transition-all duration-300"></div>
                
                <div class="flex justify-between text-sm text-gray-500 group-hover:text-white/80 transition-colors duration-300 mb-4 relative z-20">
                  <span>100g</span>
                </div>
                
                <div class="grid grid-cols-3 gap-2 relative z-20">
                  <div class="bg-green-50 group-hover:bg-green-600/40 text-green-800 group-hover:text-white px-3 py-2 rounded-lg text-center transition-colors duration-300">
                    <span class="font-medium text-xs">Protein</span>
                    <p class="text-lg font-bold mt-1">14g</p>
                  </div>
                  <div class="bg-amber-50 group-hover:bg-amber-500/40 text-amber-800 group-hover:text-white px-3 py-2 rounded-lg text-center transition-colors duration-300">
                    <span class="font-medium text-xs">Karb</span>
                    <p class="text-lg font-bold mt-1">64g</p>
                  </div>
                  <div class="bg-blue-50 group-hover:bg-blue-500/40 text-blue-800 group-hover:text-white px-3 py-2 rounded-lg text-center transition-colors duration-300">
                    <span class="font-medium text-xs">Yağ</span>
                    <p class="text-lg font-bold mt-1">6g</p>
                  </div>
                </div>
                
                <div class="mt-6 relative z-20">
                  <NuxtLink to="/yiyecekler" class="inline-flex items-center px-4 py-2 rounded-full bg-purple-600 text-white font-medium hover:bg-purple-700 transition-colors duration-300 group-hover:bg-white group-hover:text-purple-600 shadow-md hover:shadow-lg">
                    Detayları Gör <i class="fas fa-arrow-right ml-2"></i>
                  </NuxtLink>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="mt-16 text-center">
          <NuxtLink to="/yiyecekler" class="inline-flex items-center px-8 py-4 rounded-full bg-gradient-to-r from-green-600 to-green-700 text-white text-lg font-medium hover:from-green-700 hover:to-green-800 transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-green-500/20 transform hover:-translate-y-1">
            Tüm Besinleri Gör
            <i class="fas fa-arrow-right ml-3"></i>
          </NuxtLink>
        </div>
      </div>
    </div>

    <!-- Kullanıcı Hikayeleri/Görüşleri Bölümü -->
    <div class="bg-gradient-to-b from-white to-gray-50 py-24">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-16">
          <div class="inline-block">
            <h2 class="text-base text-green-600 font-semibold tracking-wide uppercase relative inline-block">
              Başarı Hikayeleri
              <div class="absolute -bottom-1 left-0 w-full h-0.5 bg-green-500 transform scale-x-50 origin-center"></div>
            </h2>
          </div>
          <p class="mt-3 text-4xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-5xl">
            Kullanıcılarımızın <span class="text-green-600">Deneyimleri</span>
          </p>
          <p class="mt-6 max-w-2xl text-xl text-gray-500 mx-auto">
            Binlerce kullanıcımız beslenme alışkanlıklarını değiştirerek hedeflerine ulaştı
          </p>
        </div>

        <div class="mt-16 grid gap-10 md:grid-cols-3">
          <!-- Başarı Hikayesi 1 -->
          <div class="group relative bg-white rounded-2xl shadow-xl overflow-hidden transform transition-all duration-500 hover:shadow-2xl hover:-translate-y-2">
            <!-- Profil Bölümü -->
            <div class="relative h-64 overflow-hidden">
              <img src="https://images.unsplash.com/photo-1545291730-faff8ca1d4b0?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" 
                   alt="Başarı hikayesi" 
                   class="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700 ease-in-out">
              
              <!-- Gradyan Overlay -->
              <div class="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent opacity-70 group-hover:opacity-80 transition-opacity duration-500"></div>
              
              <!-- Başarı Rozeti -->
              <div class="absolute top-4 right-4 bg-green-500/90 backdrop-blur-sm text-white text-sm font-bold px-3 py-1 rounded-full shadow-md z-20">
                15 kg verdi
              </div>
              
              <!-- Kullanıcı Bilgisi -->
              <div class="absolute bottom-6 left-6 text-white z-10">
                <p class="font-bold text-2xl">Ayşe K.</p>
                <div class="w-10 h-0.5 bg-green-500 my-2 transform origin-left group-hover:scale-x-150 transition-transform duration-300"></div>
                <div class="flex items-center mt-1">
                  <div class="flex text-amber-400 mr-3">
                    <i class="fas fa-star"></i>
                    <i class="fas fa-star"></i>
                    <i class="fas fa-star"></i>
                    <i class="fas fa-star"></i>
                    <i class="fas fa-star"></i>
                  </div>
                  <p class="text-sm text-white/80">4 ay önce</p>
                </div>
              </div>
            </div>
            
            <!-- İçerik Bölümü -->
            <div class="p-8 relative">
              <div class="absolute top-0 right-0 transform translate-x-1/4 -translate-y-1/4 w-24 h-24 bg-green-100 rounded-full opacity-0 group-hover:opacity-10 blur-xl transition-opacity duration-500"></div>
              
              <div class="relative z-10">
                <i class="fas fa-quote-left text-3xl text-green-200 opacity-50 absolute -top-1 -left-1"></i>
                <p class="text-gray-700 italic leading-relaxed text-lg relative z-10 pl-6">
                  "Bu uygulamayla beslenme alışkanlıklarımı tamamen değiştirdim. Artık ne yediğimin farkındayım ve daha bilinçli seçimler yapıyorum. Sadece kilo vermekle kalmadım, kendimi çok daha enerjik hissediyorum."
                </p>
              </div>
            </div>
          </div>

          <!-- Başarı Hikayesi 2 -->
          <div class="group relative bg-white rounded-2xl shadow-xl overflow-hidden transform transition-all duration-500 hover:shadow-2xl hover:-translate-y-2">
            <!-- Profil Bölümü -->
            <div class="relative h-64 overflow-hidden">
              <img src="https://images.unsplash.com/photo-1517836357463-d25dfeac3438?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" 
                   alt="Başarı hikayesi" 
                   class="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700 ease-in-out">
              
              <!-- Gradyan Overlay -->
              <div class="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent opacity-70 group-hover:opacity-80 transition-opacity duration-500"></div>
              
              <!-- Başarı Rozeti -->
              <div class="absolute top-4 right-4 bg-blue-500/90 backdrop-blur-sm text-white text-sm font-bold px-3 py-1 rounded-full shadow-md z-20">
                Kas kütlesini artırdı
              </div>
              
              <!-- Kullanıcı Bilgisi -->
              <div class="absolute bottom-6 left-6 text-white z-10">
                <p class="font-bold text-2xl">Mehmet Y.</p>
                <div class="w-10 h-0.5 bg-blue-500 my-2 transform origin-left group-hover:scale-x-150 transition-transform duration-300"></div>
                <div class="flex items-center mt-1">
                  <div class="flex text-amber-400 mr-3">
                    <i class="fas fa-star"></i>
                    <i class="fas fa-star"></i>
                    <i class="fas fa-star"></i>
                    <i class="fas fa-star"></i>
                    <i class="fas fa-star-half-alt"></i>
                  </div>
                  <p class="text-sm text-white/80">2 ay önce</p>
                </div>
              </div>
            </div>
            
            <!-- İçerik Bölümü -->
            <div class="p-8 relative">
              <div class="absolute top-0 right-0 transform translate-x-1/4 -translate-y-1/4 w-24 h-24 bg-blue-100 rounded-full opacity-0 group-hover:opacity-10 blur-xl transition-opacity duration-500"></div>
              
              <div class="relative z-10">
                <i class="fas fa-quote-left text-3xl text-blue-200 opacity-50 absolute -top-1 -left-1"></i>
                <p class="text-gray-700 italic leading-relaxed text-lg relative z-10 pl-6">
                  "Protein ve karbonhidrat dengesini sağlamak için bu uygulamayı kullanıyorum. Makro besinlerimi takip etmek kas gelişimimi hızlandırdı. Spor salonunda çok daha verimli antrenmanlar yapabiliyorum."
                </p>
              </div>
            </div>
          </div>

          <!-- Başarı Hikayesi 3 -->
          <div class="group relative bg-white rounded-2xl shadow-xl overflow-hidden transform transition-all duration-500 hover:shadow-2xl hover:-translate-y-2">
            <!-- Profil Bölümü -->
            <div class="relative h-64 overflow-hidden">
              <img src="https://images.unsplash.com/photo-1579047440583-43a690fe2243?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" 
                   alt="Başarı hikayesi" 
                   class="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700 ease-in-out">
              
              <!-- Gradyan Overlay -->
              <div class="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent opacity-70 group-hover:opacity-80 transition-opacity duration-500"></div>
              
              <!-- Başarı Rozeti -->
              <div class="absolute top-4 right-4 bg-purple-500/90 backdrop-blur-sm text-white text-sm font-bold px-3 py-1 rounded-full shadow-md z-20">
                Sağlıklı alışkanlıklar
              </div>
              
              <!-- Kullanıcı Bilgisi -->
              <div class="absolute bottom-6 left-6 text-white z-10">
                <p class="font-bold text-2xl">Zeynep S.</p>
                <div class="w-10 h-0.5 bg-purple-500 my-2 transform origin-left group-hover:scale-x-150 transition-transform duration-300"></div>
                <div class="flex items-center mt-1">
                  <div class="flex text-amber-400 mr-3">
                    <i class="fas fa-star"></i>
                    <i class="fas fa-star"></i>
                    <i class="fas fa-star"></i>
                    <i class="fas fa-star"></i>
                    <i class="fas fa-star"></i>
                  </div>
                  <p class="text-sm text-white/80">6 ay önce</p>
                </div>
              </div>
            </div>
            
            <!-- İçerik Bölümü -->
            <div class="p-8 relative">
              <div class="absolute top-0 right-0 transform translate-x-1/4 -translate-y-1/4 w-24 h-24 bg-purple-100 rounded-full opacity-0 group-hover:opacity-10 blur-xl transition-opacity duration-500"></div>
              
              <div class="relative z-10">
                <i class="fas fa-quote-left text-3xl text-purple-200 opacity-50 absolute -top-1 -left-1"></i>
                <p class="text-gray-700 italic leading-relaxed text-lg relative z-10 pl-6">
                  "Diyabet riskim vardı ve doktorum beslenme düzenimi değiştirmemi önerdi. Bu uygulama sayesinde şeker tüketimimi kontrol altına aldım ve daha dengeli beslenmeye başladım. Kan değerlerim artık normal seviyede!"
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Sağlıklı Beslenme İpuçları Bölümü -->
    <div class="py-24 bg-gradient-to-b from-gray-50 to-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-16">
          <div class="inline-block">
            <h2 class="text-base text-green-600 font-semibold tracking-wide uppercase relative inline-block">
              Beslenme Rehberi
              <div class="absolute -bottom-1 left-0 w-full h-0.5 bg-green-500 transform scale-x-50 origin-center"></div>
            </h2>
          </div>
          <p class="mt-3 text-4xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-5xl">
            Sağlıklı Beslenme <span class="text-green-600">İpuçları</span>
          </p>
          <p class="mt-6 max-w-2xl text-xl text-gray-500 mx-auto">
            Daha sağlıklı bir yaşam için uzmanlarımızdan öneriler
          </p>
        </div>

        <div class="mt-16 grid gap-10 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          <!-- İpuçu 1 -->
          <div class="group relative bg-gradient-to-br from-green-50 to-green-100/60 rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 overflow-hidden">
            <!-- Dekoratif Şekil -->
            <div class="absolute -right-10 -bottom-10 w-40 h-40 bg-green-200 rounded-full opacity-20 group-hover:opacity-30 transition-opacity duration-500 blur-xl"></div>
            
            <div class="relative z-10">
              <div class="flex items-center justify-center h-16 w-16 rounded-full bg-gradient-to-br from-green-500 to-green-600 text-white mb-6 shadow-lg group-hover:shadow-green-300/30 transition-all duration-500 group-hover:scale-110">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              
              <h3 class="text-xl font-bold text-gray-900 mb-3 group-hover:text-green-700 transition-colors duration-300">Günlük Su Tüketimi</h3>
              
              <div class="w-10 h-0.5 bg-green-500 mb-4 transform origin-left group-hover:scale-x-150 transition-transform duration-300"></div>
              
              <p class="text-gray-700 leading-relaxed">
                Günde en az 8 bardak (yaklaşık 2 litre) su içmeyi hedefleyin. Su, metabolizmanızı hızlandırır ve toksinlerin atılmasına yardımcı olur.
              </p>
              
              <div class="mt-6">
                <NuxtLink to="/nutrition-guide" class="inline-flex items-center px-4 py-2 rounded-full bg-green-600 text-white font-medium hover:bg-green-700 transition-colors duration-300 shadow-md hover:shadow-lg">
                  Daha fazla bilgi <i class="fas fa-arrow-right ml-2"></i>
                </NuxtLink>
              </div>
            </div>
          </div>

          <!-- İpuçu 2 -->
          <div class="group relative bg-gradient-to-br from-amber-50 to-amber-100/60 rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 overflow-hidden">
            <!-- Dekoratif Şekil -->
            <div class="absolute -right-10 -bottom-10 w-40 h-40 bg-amber-200 rounded-full opacity-20 group-hover:opacity-30 transition-opacity duration-500 blur-xl"></div>
            
            <div class="relative z-10">
              <div class="flex items-center justify-center h-16 w-16 rounded-full bg-gradient-to-br from-amber-500 to-amber-600 text-white mb-6 shadow-lg group-hover:shadow-amber-300/30 transition-all duration-500 group-hover:scale-110">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                </svg>
              </div>
              
              <h3 class="text-xl font-bold text-gray-900 mb-3 group-hover:text-amber-700 transition-colors duration-300">Renkleri Tabağınıza Ekleyin</h3>
              
              <div class="w-10 h-0.5 bg-amber-500 mb-4 transform origin-left group-hover:scale-x-150 transition-transform duration-300"></div>
              
              <p class="text-gray-700 leading-relaxed">
                Farklı renklerde meyve ve sebzeler tüketin. Her renk farklı besin değerleri ve antioksidanlar içerir, böylece daha dengeli beslenirsiniz.
              </p>
              
              <div class="mt-6">
                <NuxtLink to="/nutrition-guide" class="inline-flex items-center px-4 py-2 rounded-full bg-amber-600 text-white font-medium hover:bg-amber-700 transition-colors duration-300 shadow-md hover:shadow-lg">
                  Daha fazla bilgi <i class="fas fa-arrow-right ml-2"></i>
                </NuxtLink>
              </div>
            </div>
          </div>

          <!-- İpuçu 3 -->
          <div class="group relative bg-gradient-to-br from-blue-50 to-blue-100/60 rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 overflow-hidden">
            <!-- Dekoratif Şekil -->
            <div class="absolute -right-10 -bottom-10 w-40 h-40 bg-blue-200 rounded-full opacity-20 group-hover:opacity-30 transition-opacity duration-500 blur-xl"></div>
            
            <div class="relative z-10">
              <div class="flex items-center justify-center h-16 w-16 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 text-white mb-6 shadow-lg group-hover:shadow-blue-300/30 transition-all duration-500 group-hover:scale-110">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              
              <h3 class="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-700 transition-colors duration-300">Öğün Zamanlaması</h3>
              
              <div class="w-10 h-0.5 bg-blue-500 mb-4 transform origin-left group-hover:scale-x-150 transition-transform duration-300"></div>
              
              <p class="text-gray-700 leading-relaxed">
                Düzenli aralıklarla yemek yiyin ve öğün atlamaktan kaçının. Bu, kan şekerinizi dengede tutar ve aşırı yemeyi önler.
              </p>
              
              <div class="mt-6">
                <NuxtLink to="/nutrition-guide" class="inline-flex items-center px-4 py-2 rounded-full bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors duration-300 shadow-md hover:shadow-lg">
                  Daha fazla bilgi <i class="fas fa-arrow-right ml-2"></i>
                </NuxtLink>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Features Section -->
    <div class="py-24 bg-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-16">
          <div class="inline-block">
            <h2 class="text-base text-green-600 font-semibold tracking-wide uppercase relative inline-block">
              Özellikler
              <div class="absolute -bottom-1 left-0 w-full h-0.5 bg-green-500 transform scale-x-50 origin-center"></div>
            </h2>
          </div>
          <p class="mt-3 text-4xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-5xl">
            Sağlıklı beslenmeyi <span class="text-green-600">kolaylaştırıyoruz</span>
          </p>
          <p class="mt-6 max-w-2xl text-xl text-gray-500 mx-auto">
            Modern özelliklerimizle beslenme alışkanlıklarınızı kolaylıkla takip edin
          </p>
        </div>

        <div class="mt-16">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-12">
            <!-- Özellik 1 -->
            <div class="group flex items-start p-6 bg-gradient-to-br from-gray-50 to-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-1">
              <div class="flex-shrink-0">
                <div class="flex items-center justify-center h-16 w-16 rounded-full bg-gradient-to-br from-green-500 to-green-600 text-white shadow-lg group-hover:shadow-green-200 transition-all duration-500 group-hover:scale-110">
                  <svg class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
              </div>
              <div class="ml-6">
                <h3 class="text-xl font-bold text-gray-900 group-hover:text-green-600 transition-colors duration-300">Besin Takibi</h3>
                <div class="w-10 h-0.5 bg-green-500 my-3 transform origin-left group-hover:scale-x-150 transition-transform duration-300"></div>
                <p class="text-gray-700 leading-relaxed">
                  Günlük öğünlerinizi kaydedin ve besin değerlerini otomatik hesaplayın. Barkod tarama, fotoğraf yükleme ve arama özellikleriyle hızlıca besin ekleyin.
                </p>
                <div class="mt-4">
                  <NuxtLink to="/ogun" class="inline-flex items-center text-green-600 hover:text-green-700 font-medium">
                    Öğün ekle <i class="fas fa-arrow-right ml-1"></i>
                  </NuxtLink>
                </div>
              </div>
            </div>

            <!-- Özellik 2 -->
            <div class="group flex items-start p-6 bg-gradient-to-br from-gray-50 to-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-1">
              <div class="flex-shrink-0">
                <div class="flex items-center justify-center h-16 w-16 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg group-hover:shadow-blue-200 transition-all duration-500 group-hover:scale-110">
                  <svg class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
              </div>
              <div class="ml-6">
                <h3 class="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-300">İstatistikler</h3>
                <div class="w-10 h-0.5 bg-blue-500 my-3 transform origin-left group-hover:scale-x-150 transition-transform duration-300"></div>
                <p class="text-gray-700 leading-relaxed">
                  Beslenme alışkanlıklarınızı analiz edin ve gelişiminizi takip edin. Görsel grafikler ve özetlerle beslenme durumunuzu kolayca görüntüleyin.
                </p>
                <div class="mt-4">
                  <NuxtLink to="/profil" class="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium">
                    İstatistikleri gör <i class="fas fa-arrow-right ml-1"></i>
                  </NuxtLink>
                </div>
              </div>
            </div>

            <!-- Özellik 3 -->
            <div class="group flex items-start p-6 bg-gradient-to-br from-gray-50 to-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-1">
              <div class="flex-shrink-0">
                <div class="flex items-center justify-center h-16 w-16 rounded-full bg-gradient-to-br from-purple-500 to-purple-600 text-white shadow-lg group-hover:shadow-purple-200 transition-all duration-500 group-hover:scale-110">
                  <svg class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v2m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                  </svg>
                </div>
              </div>
              <div class="ml-6">
                <h3 class="text-xl font-bold text-gray-900 group-hover:text-purple-600 transition-colors duration-300">Kişiselleştirme</h3>
                <div class="w-10 h-0.5 bg-purple-500 my-3 transform origin-left group-hover:scale-x-150 transition-transform duration-300"></div>
                <p class="text-gray-700 leading-relaxed">
                  Hedeflerinize göre özelleştirilmiş beslenme planları oluşturun. Kilo verme, kas kütlesi kazanma veya sağlıklı beslenme hedeflerinize uygun öneriler alın.
                </p>
                <div class="mt-4">
                  <NuxtLink to="/hedefler" class="inline-flex items-center text-purple-600 hover:text-purple-700 font-medium">
                    Hedeflerimi belirle <i class="fas fa-arrow-right ml-1"></i>
                  </NuxtLink>
                </div>
              </div>
            </div>

            <!-- Özellik 4 -->
            <div class="group flex items-start p-6 bg-gradient-to-br from-gray-50 to-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-1">
              <div class="flex-shrink-0">
                <div class="flex items-center justify-center h-16 w-16 rounded-full bg-gradient-to-br from-amber-500 to-amber-600 text-white shadow-lg group-hover:shadow-amber-200 transition-all duration-500 group-hover:scale-110">
                  <svg class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
                  </svg>
                </div>
              </div>
              <div class="ml-6">
                <h3 class="text-xl font-bold text-gray-900 group-hover:text-amber-600 transition-colors duration-300">Besin Veritabanı</h3>
                <div class="w-10 h-0.5 bg-amber-500 my-3 transform origin-left group-hover:scale-x-150 transition-transform duration-300"></div>
                <p class="text-gray-700 leading-relaxed">
                  Geniş besin veritabanımızdan yararlanın ve doğru besin değerlerine ulaşın. 5,000'den fazla besin içeren kapsamlı veritabanımızla beslenmenizi planlayın.
                </p>
                <div class="mt-4">
                  <NuxtLink to="/yiyecekler" class="inline-flex items-center text-amber-600 hover:text-amber-700 font-medium">
                    Besinleri keşfet <i class="fas fa-arrow-right ml-1"></i>
                  </NuxtLink>
                </div>
              </div>
            </div>
          </div>
          
          <div class="mt-16 text-center">
            <NuxtLink to="/register" class="inline-flex items-center px-8 py-4 rounded-full bg-gradient-to-r from-green-600 to-green-700 text-white text-lg font-medium hover:from-green-700 hover:to-green-800 transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-green-500/20 transform hover:-translate-y-1">
              Hemen Başlayın
              <i class="fas fa-arrow-right ml-3"></i>
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'IndexPage'
}
</script>