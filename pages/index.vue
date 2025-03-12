<template>
  <div class="bg-white">
    <!-- Hero Section -->
    <div class="relative overflow-hidden bg-gradient-to-r from-green-50 to-green-100">
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

    <!-- Hızlı Başlangıç Rehberi -->
    <div class="py-16 bg-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center">
          <h2 class="text-base text-green-600 font-semibold tracking-wide uppercase">Başlangıç Rehberi</h2>
          <p class="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            Nasıl Başlayacağım?
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
              <div class="relative flex flex-col items-center">
                <div class="flex items-center justify-center h-16 w-16 rounded-full bg-green-600 text-white text-2xl font-bold mb-4 z-10">
                  1
                </div>
                <h3 class="text-xl font-medium text-gray-900 mb-2">Hesap Oluşturun</h3>
                <p class="text-center text-gray-600">
                  Ücretsiz bir hesap oluşturun ve kişisel bilgilerinizi girin. Hedeflerinizi belirleyin.
                </p>
                <div class="mt-4">
                  <NuxtLink to="/register" class="text-green-600 hover:text-green-800 font-medium">Kayıt Ol →</NuxtLink>
                </div>
              </div>

              <!-- Adım 2 -->
              <div class="relative flex flex-col items-center">
                <div class="flex items-center justify-center h-16 w-16 rounded-full bg-green-600 text-white text-2xl font-bold mb-4 z-10">
                  2
                </div>
                <h3 class="text-xl font-medium text-gray-900 mb-2">Öğünlerinizi Ekleyin</h3>
                <p class="text-center text-gray-600">
                  Günlük öğünlerinizi kaydedin. Geniş besin veritabanımızdan yiyecekleri arayın veya kendi yiyeceklerinizi ekleyin.
                </p>
                <div class="mt-4">
                  <NuxtLink to="/ogun" class="text-green-600 hover:text-green-800 font-medium">Öğün Ekle →</NuxtLink>
                </div>
              </div>

              <!-- Adım 3 -->
              <div class="relative flex flex-col items-center">
                <div class="flex items-center justify-center h-16 w-16 rounded-full bg-green-600 text-white text-2xl font-bold mb-4 z-10">
                  3
                </div>
                <h3 class="text-xl font-medium text-gray-900 mb-2">Takip Edin ve Geliştirin</h3>
                <p class="text-center text-gray-600">
                  Beslenme alışkanlıklarınızı takip edin, raporları inceleyin ve hedeflerinize ulaşın.
                </p>
                <div class="mt-4">
                  <NuxtLink to="/profil" class="text-green-600 hover:text-green-800 font-medium">Profilim →</NuxtLink>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- İstatistikler Bölümü -->
    <div class="bg-green-600 py-12">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <!-- İstatistik 1 -->
          <div>
            <p class="text-4xl font-extrabold text-white">10,000+</p>
            <p class="mt-2 text-xl text-green-100">Kayıtlı Kullanıcı</p>
          </div>
          
          <!-- İstatistik 2 -->
          <div>
            <p class="text-4xl font-extrabold text-white">5,000+</p>
            <p class="mt-2 text-xl text-green-100">Besin Veritabanı</p>
          </div>
          
          <!-- İstatistik 3 -->
          <div>
            <p class="text-4xl font-extrabold text-white">1M+</p>
            <p class="mt-2 text-xl text-green-100">Kaydedilen Öğün</p>
          </div>
          
          <!-- İstatistik 4 -->
          <div>
            <p class="text-4xl font-extrabold text-white">4.8/5</p>
            <p class="mt-2 text-xl text-green-100">Kullanıcı Memnuniyeti</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Popüler Besinler Bölümü -->
    <div class="bg-gray-50 py-16">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center">
          <h2 class="text-base text-green-600 font-semibold tracking-wide uppercase">Besin Kataloğu</h2>
          <p class="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            Popüler Besinler
          </p>
          <p class="mt-4 max-w-2xl text-xl text-gray-500 mx-auto">
            En çok aranan ve takip edilen besinleri keşfedin
          </p>
        </div>

        <div class="mt-12 grid gap-6 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          <!-- Besin 1 -->
          <div class="bg-white rounded-lg shadow overflow-hidden hover:shadow-md transition-shadow">
            <img src="https://images.unsplash.com/photo-1607532941433-304659e8198a?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" alt="Avokado" class="w-full h-48 object-cover">
            <div class="p-4">
              <h3 class="text-lg font-medium text-gray-900">Avokado</h3>
              <div class="mt-2 flex justify-between text-sm text-gray-500">
                <span>100g</span>
                <span>160 kcal</span>
              </div>
              <div class="mt-3 grid grid-cols-3 gap-1 text-xs">
                <div class="bg-green-100 text-green-800 px-2 py-1 rounded text-center">
                  <span class="font-medium">Protein</span>
                  <p>2g</p>
                </div>
                <div class="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-center">
                  <span class="font-medium">Karb</span>
                  <p>9g</p>
                </div>
                <div class="bg-blue-100 text-blue-800 px-2 py-1 rounded text-center">
                  <span class="font-medium">Yağ</span>
                  <p>15g</p>
                </div>
              </div>
              <div class="mt-4">
                <a href="/yiyecekler" class="text-green-600 hover:text-green-800 text-sm font-medium">Detayları Gör →</a>
              </div>
            </div>
          </div>

          <!-- Besin 2 -->
          <div class="bg-white rounded-lg shadow overflow-hidden hover:shadow-md transition-shadow">
            <img src="https://images.unsplash.com/photo-1565299585323-38d6b0865b47?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" alt="Yulaf" class="w-full h-48 object-cover">
            <div class="p-4">
              <h3 class="text-lg font-medium text-gray-900">Yulaf</h3>
              <div class="mt-2 flex justify-between text-sm text-gray-500">
                <span>100g</span>
                <span>389 kcal</span>
              </div>
              <div class="mt-3 grid grid-cols-3 gap-1 text-xs">
                <div class="bg-green-100 text-green-800 px-2 py-1 rounded text-center">
                  <span class="font-medium">Protein</span>
                  <p>13g</p>
                </div>
                <div class="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-center">
                  <span class="font-medium">Karb</span>
                  <p>67g</p>
                </div>
                <div class="bg-blue-100 text-blue-800 px-2 py-1 rounded text-center">
                  <span class="font-medium">Yağ</span>
                  <p>7g</p>
                </div>
              </div>
              <div class="mt-4">
                <a href="/yiyecekler" class="text-green-600 hover:text-green-800 text-sm font-medium">Detayları Gör →</a>
              </div>
            </div>
          </div>

          <!-- Besin 3 -->
          <div class="bg-white rounded-lg shadow overflow-hidden hover:shadow-md transition-shadow">
            <img src="https://images.unsplash.com/photo-1615485290382-441e4d049cb5?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" alt="Somon" class="w-full h-48 object-cover">
            <div class="p-4">
              <h3 class="text-lg font-medium text-gray-900">Somon</h3>
              <div class="mt-2 flex justify-between text-sm text-gray-500">
                <span>100g</span>
                <span>208 kcal</span>
              </div>
              <div class="mt-3 grid grid-cols-3 gap-1 text-xs">
                <div class="bg-green-100 text-green-800 px-2 py-1 rounded text-center">
                  <span class="font-medium">Protein</span>
                  <p>20g</p>
                </div>
                <div class="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-center">
                  <span class="font-medium">Karb</span>
                  <p>0g</p>
                </div>
                <div class="bg-blue-100 text-blue-800 px-2 py-1 rounded text-center">
                  <span class="font-medium">Yağ</span>
                  <p>13g</p>
                </div>
              </div>
              <div class="mt-4">
                <a href="/yiyecekler" class="text-green-600 hover:text-green-800 text-sm font-medium">Detayları Gör →</a>
              </div>
            </div>
          </div>

          <!-- Besin 4 -->
          <div class="bg-white rounded-lg shadow overflow-hidden hover:shadow-md transition-shadow">
            <img src="https://images.unsplash.com/photo-1550828520-4cb496926fc9?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" alt="Kinoa" class="w-full h-48 object-cover">
            <div class="p-4">
              <h3 class="text-lg font-medium text-gray-900">Kinoa</h3>
              <div class="mt-2 flex justify-between text-sm text-gray-500">
                <span>100g</span>
                <span>368 kcal</span>
              </div>
              <div class="mt-3 grid grid-cols-3 gap-1 text-xs">
                <div class="bg-green-100 text-green-800 px-2 py-1 rounded text-center">
                  <span class="font-medium">Protein</span>
                  <p>14g</p>
                </div>
                <div class="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-center">
                  <span class="font-medium">Karb</span>
                  <p>64g</p>
                </div>
                <div class="bg-blue-100 text-blue-800 px-2 py-1 rounded text-center">
                  <span class="font-medium">Yağ</span>
                  <p>6g</p>
                </div>
              </div>
              <div class="mt-4">
                <a href="/yiyecekler" class="text-green-600 hover:text-green-800 text-sm font-medium">Detayları Gör →</a>
              </div>
            </div>
          </div>
        </div>

        <div class="mt-10 text-center">
          <NuxtLink to="/yiyecekler" class="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-green-600 hover:bg-green-700">
            Tüm Besinleri Gör
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clip-rule="evenodd" />
            </svg>
          </NuxtLink>
        </div>
      </div>
    </div>

    <!-- Kullanıcı Hikayeleri/Görüşleri Bölümü -->
    <div class="bg-white py-16">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center">
          <h2 class="text-base text-green-600 font-semibold tracking-wide uppercase">Kullanıcı Hikayeleri</h2>
          <p class="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            Kullanıcılarımız Ne Diyor?
          </p>
          <p class="mt-4 max-w-2xl text-xl text-gray-500 mx-auto">
            NutriTrack ile beslenme alışkanlıklarını değiştiren kullanıcılarımızın hikayeleri
          </p>
        </div>

        <div class="mt-12">
          <div class="grid grid-cols-1 gap-8 md:grid-cols-3">
            <!-- Kullanıcı Hikayesi 1 -->
            <div class="bg-white rounded-lg shadow-lg overflow-hidden">
              <div class="px-6 py-8">
                <div class="flex items-center">
                  <div class="flex-shrink-0">
                    <img class="h-12 w-12 rounded-full" src="https://randomuser.me/api/portraits/women/32.jpg" alt="Kullanıcı Fotoğrafı">
                  </div>
                  <div class="ml-4">
                    <h3 class="text-lg font-medium text-gray-900">Ayşe Yılmaz</h3>
                    <p class="text-sm text-gray-500">İstanbul</p>
                  </div>
                </div>
                <div class="mt-4">
                  <p class="text-gray-600">
                    "NutriTrack sayesinde 3 ayda 8 kilo verdim ve şeker tüketimimi kontrol altına aldım. Artık ne yediğimin farkındayım ve daha sağlıklı seçimler yapıyorum."
                  </p>
                </div>
                <div class="mt-4 flex">
                  <span class="text-green-500">★★★★★</span>
                </div>
              </div>
            </div>

            <!-- Kullanıcı Hikayesi 2 -->
            <div class="bg-white rounded-lg shadow-lg overflow-hidden">
              <div class="px-6 py-8">
                <div class="flex items-center">
                  <div class="flex-shrink-0">
                    <img class="h-12 w-12 rounded-full" src="https://randomuser.me/api/portraits/men/46.jpg" alt="Kullanıcı Fotoğrafı">
                  </div>
                  <div class="ml-4">
                    <h3 class="text-lg font-medium text-gray-900">Mehmet Kaya</h3>
                    <p class="text-sm text-gray-500">Ankara</p>
                  </div>
                </div>
                <div class="mt-4">
                  <p class="text-gray-600">
                    "Spor yaparken doğru beslenme konusunda zorlanıyordum. NutriTrack ile protein alımımı optimize ettim ve kas kütlemi artırdım. Harika bir uygulama!"
                  </p>
                </div>
                <div class="mt-4 flex">
                  <span class="text-green-500">★★★★★</span>
                </div>
              </div>
            </div>

            <!-- Kullanıcı Hikayesi 3 -->
            <div class="bg-white rounded-lg shadow-lg overflow-hidden">
              <div class="px-6 py-8">
                <div class="flex items-center">
                  <div class="flex-shrink-0">
                    <img class="h-12 w-12 rounded-full" src="https://randomuser.me/api/portraits/women/68.jpg" alt="Kullanıcı Fotoğrafı">
                  </div>
                  <div class="ml-4">
                    <h3 class="text-lg font-medium text-gray-900">Zeynep Demir</h3>
                    <p class="text-sm text-gray-500">İzmir</p>
                  </div>
                </div>
                <div class="mt-4">
                  <p class="text-gray-600">
                    "Diyabet hastası olarak besin takibi yapmam gerekiyordu. NutriTrack'in glisemik indeks özelliği sayesinde kan şekerimi daha iyi kontrol edebiliyorum."
                  </p>
                </div>
                <div class="mt-4 flex">
                  <span class="text-green-500">★★★★★</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Sağlıklı Beslenme İpuçları Bölümü -->
    <div class="py-16 bg-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center">
          <h2 class="text-base text-green-600 font-semibold tracking-wide uppercase">Beslenme Rehberi</h2>
          <p class="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            Sağlıklı Beslenme İpuçları
          </p>
          <p class="mt-4 max-w-2xl text-xl text-gray-500 mx-auto">
            Daha sağlıklı bir yaşam için uzmanlarımızdan öneriler
          </p>
        </div>

        <div class="mt-12 grid gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          <!-- İpucu 1 -->
          <div class="bg-green-50 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
            <div class="flex items-center justify-center h-12 w-12 rounded-md bg-green-500 text-white mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h3 class="text-lg font-medium text-gray-900 mb-2">Günlük Su Tüketimi</h3>
            <p class="text-gray-600">
              Günde en az 8 bardak (yaklaşık 2 litre) su içmeyi hedefleyin. Su, metabolizmanızı hızlandırır ve toksinlerin atılmasına yardımcı olur.
            </p>
            <div class="mt-4">
              <a href="/nutrition-guide" class="text-green-600 hover:text-green-800 font-medium">Daha fazla bilgi →</a>
            </div>
          </div>

          <!-- İpucu 2 -->
          <div class="bg-green-50 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
            <div class="flex items-center justify-center h-12 w-12 rounded-md bg-green-500 text-white mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
              </svg>
            </div>
            <h3 class="text-lg font-medium text-gray-900 mb-2">Renkleri Tabağınıza Ekleyin</h3>
            <p class="text-gray-600">
              Farklı renklerde meyve ve sebzeler tüketin. Her renk farklı besin değerleri ve antioksidanlar içerir, böylece daha dengeli beslenirsiniz.
            </p>
            <div class="mt-4">
              <a href="/nutrition-guide" class="text-green-600 hover:text-green-800 font-medium">Daha fazla bilgi →</a>
            </div>
          </div>

          <!-- İpucu 3 -->
          <div class="bg-green-50 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
            <div class="flex items-center justify-center h-12 w-12 rounded-md bg-green-500 text-white mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 class="text-lg font-medium text-gray-900 mb-2">Öğün Zamanlaması</h3>
            <p class="text-gray-600">
              Düzenli aralıklarla yemek yiyin ve öğün atlamaktan kaçının. Bu, kan şekerinizi dengede tutar ve aşırı yemeyi önler.
            </p>
            <div class="mt-4">
              <a href="/nutrition-guide" class="text-green-600 hover:text-green-800 font-medium">Daha fazla bilgi →</a>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Features Section -->
    <div class="py-12 bg-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="lg:text-center">
          <h2 class="text-base text-green-600 font-semibold tracking-wide uppercase">Özellikler</h2>
          <p class="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            Sağlıklı beslenmeyi kolaylaştırıyoruz
          </p>
        </div>

        <div class="mt-10">
          <div class="space-y-10 md:space-y-0 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-10">
            <div class="relative">
              <div class="absolute flex items-center justify-center h-12 w-12 rounded-md bg-green-500 text-white">
                <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <div class="ml-16">
                <h3 class="text-lg leading-6 font-medium text-gray-900">Besin Takibi</h3>
                <p class="mt-2 text-base text-gray-500">
                  Günlük öğünlerinizi kaydedin ve besin değerlerini otomatik hesaplayın.
                </p>
              </div>
            </div>

            <div class="relative">
              <div class="absolute flex items-center justify-center h-12 w-12 rounded-md bg-green-500 text-white">
                <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div class="ml-16">
                <h3 class="text-lg leading-6 font-medium text-gray-900">İstatistikler</h3>
                <p class="mt-2 text-base text-gray-500">
                  Beslenme alışkanlıklarınızı analiz edin ve gelişiminizi takip edin.
                </p>
              </div>
            </div>

            <div class="relative">
              <div class="absolute flex items-center justify-center h-12 w-12 rounded-md bg-green-500 text-white">
                <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v2m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                </svg>
              </div>
              <div class="ml-16">
                <h3 class="text-lg leading-6 font-medium text-gray-900">Kişiselleştirme</h3>
                <p class="mt-2 text-base text-gray-500">
                  Hedeflerinize göre özelleştirilmiş beslenme planları oluşturun.
                </p>
              </div>
            </div>

            <div class="relative">
              <div class="absolute flex items-center justify-center h-12 w-12 rounded-md bg-green-500 text-white">
                <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
                </svg>
              </div>
              <div class="ml-16">
                <h3 class="text-lg leading-6 font-medium text-gray-900">Besin Veritabanı</h3>
                <p class="mt-2 text-base text-gray-500">
                  Geniş besin veritabanımızdan yararlanın ve doğru besin değerlerine ulaşın.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// Component logic here if needed
</script>