<template>
  <div class="container mx-auto px-4 py-8">
    <div class="max-w-6xl mx-auto">
      <!-- Başlık Bölümü -->
      <div class="text-center mb-12">
        <h1 class="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Beslenme Rehberi</h1>
        <p class="text-xl text-gray-600 max-w-3xl mx-auto">
          Sağlıklı yaşam için temel beslenme bilgileri, mevsimsel öneriler ve pratik ipuçları
        </p>
      </div>

      <!-- Ana İçerik -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <!-- Temel Beslenme Kartı -->
        <div class="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow transform hover:-translate-y-1 transition-all duration-300">
          <div class="mb-4">
            <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
              <i class="fas fa-apple-alt text-2xl text-green-600"></i>
            </div>
            <h2 class="text-xl font-semibold text-gray-900 mb-2">Temel Beslenme İlkeleri</h2>
            <p class="text-gray-600">Sağlıklı beslenmenin temel prensipleri ve günlük besin ihtiyaçları</p>
          </div>
          <ul class="space-y-3 text-gray-700">
            <li class="flex items-center">
              <i class="fas fa-check text-green-500 mr-2"></i>
              Dengeli ve çeşitli beslenme
            </li>
            <li class="flex items-center">
              <i class="fas fa-check text-green-500 mr-2"></i>
              Porsiyon kontrolü
            </li>
            <li class="flex items-center">
              <i class="fas fa-check text-green-500 mr-2"></i>
              Öğün düzeni ve zamanlaması
            </li>
          </ul>
          <button @click="expandSection('temel')" class="mt-4 text-blue-600 hover:text-blue-700 transition-colors">
            Detaylı Bilgi
          </button>
        </div>

        <!-- Besin Grupları Kartı -->
        <div class="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow transform hover:-translate-y-1 transition-all duration-300">
          <div class="mb-4">
            <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <i class="fas fa-carrot text-2xl text-blue-600"></i>
            </div>
            <h2 class="text-xl font-semibold text-gray-900 mb-2">Besin Grupları</h2>
            <p class="text-gray-600">Temel besin grupları ve sağlığımız için önemi</p>
          </div>
          <ul class="space-y-3 text-gray-700">
            <li class="flex items-center">
              <i class="fas fa-check text-blue-500 mr-2"></i>
              Protein kaynakları
            </li>
            <li class="flex items-center">
              <i class="fas fa-check text-blue-500 mr-2"></i>
              Karbonhidratlar ve lifler
            </li>
            <li class="flex items-center">
              <i class="fas fa-check text-blue-500 mr-2"></i>
              Sağlıklı yağlar
            </li>
          </ul>
          <button @click="expandSection('besinler')" class="mt-4 text-blue-600 hover:text-blue-700 transition-colors">
            Detaylı Bilgi
          </button>
        </div>

        <!-- Özel Durumlar Kartı -->
        <div class="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow transform hover:-translate-y-1 transition-all duration-300">
          <div class="mb-4">
            <div class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
              <i class="fas fa-heartbeat text-2xl text-purple-600"></i>
            </div>
            <h2 class="text-xl font-semibold text-gray-900 mb-2">Özel Durumlar</h2>
            <p class="text-gray-600">Farklı yaşam tarzları ve sağlık durumları için beslenme önerileri</p>
          </div>
          <ul class="space-y-3 text-gray-700">
            <li class="flex items-center">
              <i class="fas fa-check text-purple-500 mr-2"></i>
              Sporcu beslenmesi
            </li>
            <li class="flex items-center">
              <i class="fas fa-check text-purple-500 mr-2"></i>
              Vejetaryen/Vegan beslenme
            </li>
            <li class="flex items-center">
              <i class="fas fa-check text-purple-500 mr-2"></i>
              Kilo kontrolü
            </li>
          </ul>
          <button @click="expandSection('ozel')" class="mt-4 text-blue-600 hover:text-blue-700 transition-colors">
            Detaylı Bilgi
          </button>
        </div>
      </div>

      <!-- Mevsimsel Beslenme Önerileri -->
      <div class="mt-16">
        <h2 class="text-3xl font-bold text-gray-900 mb-6 text-center">Mevsimsel Beslenme Önerileri</h2>
        <div class="bg-white rounded-xl shadow-md p-6 border border-gray-100">
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div class="bg-gradient-to-b from-green-50 to-green-100 rounded-lg p-5 transform hover:-translate-y-1 transition-all duration-300">
              <div class="flex justify-center mb-4">
                <div class="w-16 h-16 bg-green-200 rounded-full flex items-center justify-center">
                  <i class="fas fa-seedling text-2xl text-green-600"></i>
                </div>
              </div>
              <h3 class="text-xl font-semibold text-center mb-3">İlkbahar</h3>
              <ul class="space-y-2 text-gray-700">
                <li class="flex items-start">
                  <i class="fas fa-leaf text-green-500 mr-2 mt-1"></i>
                  <span>Kuşkonmaz, enginar, bezelye</span>
                </li>
                <li class="flex items-start">
                  <i class="fas fa-leaf text-green-500 mr-2 mt-1"></i>
                  <span>Çilek, kiraz</span>
                </li>
                <li class="flex items-start">
                  <i class="fas fa-leaf text-green-500 mr-2 mt-1"></i>
                  <span>Taze otlar ve yeşillikler</span>
                </li>
              </ul>
            </div>
            
            <div class="bg-gradient-to-b from-yellow-50 to-yellow-100 rounded-lg p-5 transform hover:-translate-y-1 transition-all duration-300">
              <div class="flex justify-center mb-4">
                <div class="w-16 h-16 bg-yellow-200 rounded-full flex items-center justify-center">
                  <i class="fas fa-sun text-2xl text-yellow-600"></i>
                </div>
              </div>
              <h3 class="text-xl font-semibold text-center mb-3">Yaz</h3>
              <ul class="space-y-2 text-gray-700">
                <li class="flex items-start">
                  <i class="fas fa-leaf text-yellow-500 mr-2 mt-1"></i>
                  <span>Domates, salatalık, biber</span>
                </li>
                <li class="flex items-start">
                  <i class="fas fa-leaf text-yellow-500 mr-2 mt-1"></i>
                  <span>Karpuz, kavun, şeftali</span>
                </li>
                <li class="flex items-start">
                  <i class="fas fa-leaf text-yellow-500 mr-2 mt-1"></i>
                  <span>Yaz kabakları ve patlıcan</span>
                </li>
              </ul>
            </div>
            
            <div class="bg-gradient-to-b from-orange-50 to-orange-100 rounded-lg p-5 transform hover:-translate-y-1 transition-all duration-300">
              <div class="flex justify-center mb-4">
                <div class="w-16 h-16 bg-orange-200 rounded-full flex items-center justify-center">
                  <i class="fas fa-leaf text-2xl text-orange-600"></i>
                </div>
              </div>
              <h3 class="text-xl font-semibold text-center mb-3">Sonbahar</h3>
              <ul class="space-y-2 text-gray-700">
                <li class="flex items-start">
                  <i class="fas fa-leaf text-orange-500 mr-2 mt-1"></i>
                  <span>Balkabağı, yer elması</span>
                </li>
                <li class="flex items-start">
                  <i class="fas fa-leaf text-orange-500 mr-2 mt-1"></i>
                  <span>Üzüm, elma, armut</span>
                </li>
                <li class="flex items-start">
                  <i class="fas fa-leaf text-orange-500 mr-2 mt-1"></i>
                  <span>Mantar çeşitleri</span>
                </li>
              </ul>
            </div>
            
            <div class="bg-gradient-to-b from-blue-50 to-blue-100 rounded-lg p-5 transform hover:-translate-y-1 transition-all duration-300">
              <div class="flex justify-center mb-4">
                <div class="w-16 h-16 bg-blue-200 rounded-full flex items-center justify-center">
                  <i class="fas fa-snowflake text-2xl text-blue-600"></i>
                </div>
              </div>
              <h3 class="text-xl font-semibold text-center mb-3">Kış</h3>
              <ul class="space-y-2 text-gray-700">
                <li class="flex items-start">
                  <i class="fas fa-leaf text-blue-500 mr-2 mt-1"></i>
                  <span>Lahana, karnabahar, brokoli</span>
                </li>
                <li class="flex items-start">
                  <i class="fas fa-leaf text-blue-500 mr-2 mt-1"></i>
                  <span>Turunçgiller, nar</span>
                </li>
                <li class="flex items-start">
                  <i class="fas fa-leaf text-blue-500 mr-2 mt-1"></i>
                  <span>Kök sebzeler</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <!-- Beslenme İpuçları -->
      <div class="mt-16">
        <h2 class="text-3xl font-bold text-gray-900 mb-6 text-center">Günlük Beslenme İpuçları</h2>
        <div class="bg-white rounded-xl shadow-md p-6 border border-gray-100">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="bg-gradient-to-r from-blue-50 to-green-50 p-6 rounded-lg transform hover:-translate-y-1 transition-all duration-300">
              <h3 class="text-xl font-semibold mb-4 flex items-center">
                <span class="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                  <i class="fas fa-utensils text-blue-600"></i>
                </span>
                Sağlıklı Yemek Alışkanlıkları
              </h3>
              <ul class="space-y-3">
                <li class="flex items-start">
                  <i class="fas fa-check-circle text-green-500 mr-2 mt-1"></i>
                  <span>Yavaş yiyin ve her lokmayı iyice çiğneyin</span>
                </li>
                <li class="flex items-start">
                  <i class="fas fa-check-circle text-green-500 mr-2 mt-1"></i>
                  <span>Öğün atlamayın, özellikle kahvaltıyı ihmal etmeyin</span>
                </li>
                <li class="flex items-start">
                  <i class="fas fa-check-circle text-green-500 mr-2 mt-1"></i>
                  <span>Tabağınızın yarısını sebzelerle doldurun</span>
                </li>
                <li class="flex items-start">
                  <i class="fas fa-check-circle text-green-500 mr-2 mt-1"></i>
                  <span>Günde en az 2 litre su için</span>
                </li>
              </ul>
            </div>
            
            <div class="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-lg transform hover:-translate-y-1 transition-all duration-300">
              <h3 class="text-xl font-semibold mb-4 flex items-center">
                <span class="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mr-3">
                  <i class="fas fa-brain text-purple-600"></i>
                </span>
                Bilinçli Beslenme
              </h3>
              <ul class="space-y-3">
                <li class="flex items-start">
                  <i class="fas fa-check-circle text-purple-500 mr-2 mt-1"></i>
                  <span>Yemek yerken ekrandan uzak durun</span>
                </li>
                <li class="flex items-start">
                  <i class="fas fa-check-circle text-purple-500 mr-2 mt-1"></i>
                  <span>Açlık ve tokluk sinyallerinize dikkat edin</span>
                </li>
                <li class="flex items-start">
                  <i class="fas fa-check-circle text-purple-500 mr-2 mt-1"></i>
                  <span>Duygusal yeme davranışlarını fark edin</span>
                </li>
                <li class="flex items-start">
                  <i class="fas fa-check-circle text-purple-500 mr-2 mt-1"></i>
                  <span>Besin etiketlerini okumayı alışkanlık haline getirin</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <!-- Sık Sorulan Sorular -->
      <div class="mt-16 mb-16">
        <h2 class="text-3xl font-bold text-gray-900 mb-6 text-center">Sık Sorulan Sorular</h2>
        <div class="bg-white rounded-xl shadow-md p-6 border border-gray-100">
          <div class="space-y-4">
            <div class="border border-gray-200 rounded-lg overflow-hidden">
              <button @click="toggleFaq(1)" class="w-full flex justify-between items-center p-4 bg-gray-50 hover:bg-gray-100 transition-colors">
                <span class="font-medium text-gray-800">Günde kaç öğün yemek en sağlıklısıdır?</span>
                <i :class="[activeFaq === 1 ? 'fa-chevron-up' : 'fa-chevron-down', 'fas transition-transform']"></i>
              </button>
              <div v-if="activeFaq === 1" class="p-4 bg-white">
                <p class="text-gray-700">
                  Günde 3 ana öğün ve 2-3 ara öğün tüketmek metabolizmanızı aktif tutmak ve kan şekerinizi dengede tutmak için idealdir. 
                  Ancak herkesin metabolizması ve yaşam tarzı farklıdır, bu nedenle size en uygun beslenme düzenini bulmak için bir 
                  beslenme uzmanına danışmanız faydalı olabilir.
                </p>
              </div>
            </div>
            
            <div class="border border-gray-200 rounded-lg overflow-hidden">
              <button @click="toggleFaq(2)" class="w-full flex justify-between items-center p-4 bg-gray-50 hover:bg-gray-100 transition-colors">
                <span class="font-medium text-gray-800">Hangi besinler bağışıklık sistemini güçlendirir?</span>
                <i :class="[activeFaq === 2 ? 'fa-chevron-up' : 'fa-chevron-down', 'fas transition-transform']"></i>
              </button>
              <div v-if="activeFaq === 2" class="p-4 bg-white">
                <p class="text-gray-700">
                  Bağışıklık sistemini güçlendiren besinler arasında C vitamini açısından zengin turunçgiller, kırmızı biber; 
                  E vitamini içeren kuruyemişler ve tohumlar; çinko içeren deniz ürünleri, et ve baklagiller; probiyotik içeren 
                  fermente gıdalar (yoğurt, kefir, turşu); ve antioksidan açısından zengin renkli sebze ve meyveler bulunur. 
                  Ayrıca sarımsak, zencefil ve zerdeçal gibi bazı baharatlar da bağışıklık sistemini destekler.
                </p>
              </div>
            </div>
            
            <div class="border border-gray-200 rounded-lg overflow-hidden">
              <button @click="toggleFaq(3)" class="w-full flex justify-between items-center p-4 bg-gray-50 hover:bg-gray-100 transition-colors">
                <span class="font-medium text-gray-800">Gluten ve süt ürünlerinden kaçınmalı mıyım?</span>
                <i :class="[activeFaq === 3 ? 'fa-chevron-up' : 'fa-chevron-down', 'fas transition-transform']"></i>
              </button>
              <!-- Gluten ve süt ürünleri SSS devamı -->
              <div v-if="activeFaq === 3" class="p-4 bg-white">
                <p class="text-gray-700 mb-3">
                  Gluten ve süt ürünlerinden kaçınmak, sadece çölyak hastalığı, gluten hassasiyeti veya laktoz intoleransı gibi 
                  özel sağlık durumlarında gereklidir. Sağlık probleminiz yoksa bu besinleri diyetinizden çıkarmak için bilimsel bir gerekçe yoktur.
                </p>
                <ul class="list-disc pl-5 mb-3 text-gray-700 space-y-1">
                  <li><strong>Gluten:</strong> Buğday, arpa ve çavdar gibi tahıllarda bulunan bir proteindir. Çölyak hastalığı olmayan kişilerde glutensiz diyet, bazı besin eksikliklerine yol açabilir.</li>
                  <li><strong>Süt ürünleri:</strong> Kalsiyum, protein ve D vitamini açısından zengindir. Laktoz intoleransı durumunda laktozsuz süt ürünleri veya bitki bazlı alternatifler tercih edilebilir.</li>
                </ul>
                <p class="text-gray-700">
                  Herhangi bir besin grubunu diyetinizden çıkarmadan önce bir sağlık uzmanına danışmanız önerilir. Gereksiz kısıtlamalar, 
                  besin çeşitliliğini azaltabilir ve bazı mikro besin eksikliklerine yol açabilir.
                </p>
              </div>
            </div>

            <!-- Ek SSS soruları -->
            <div class="border border-gray-200 rounded-lg overflow-hidden">
              <button @click="toggleFaq(4)" class="w-full flex justify-between items-center p-4 bg-gray-50 hover:bg-gray-100 transition-colors">
                <span class="font-medium text-gray-800">Kilo vermek için en etkili beslenme stratejisi nedir?</span>
                <i :class="[activeFaq === 4 ? 'fa-chevron-up' : 'fa-chevron-down', 'fas transition-transform']"></i>
              </button>
              <div v-if="activeFaq === 4" class="p-4 bg-white">
                <p class="text-gray-700 mb-3">
                  Kilo vermek için en etkili strateji, kalori açığı oluşturmaktır - yani harcadığınızdan daha az kalori almak. Ancak, sağlıklı ve kalıcı kilo kaybı için şunlara dikkat etmelisiniz:
                </p>
                <ul class="list-disc pl-5 mb-3 text-gray-700 space-y-1">
                  <li><strong>Aşırı kısıtlamadan kaçının:</strong> Günlük kalori ihtiyacınızın %20-25'inden fazla kısıtlama yapmayın. Çok düşük kalorili diyetler metabolizmayı yavaşlatabilir.</li>
                  <li><strong>Protein alımını artırın:</strong> Kas kaybını önlemek ve tokluk hissini artırmak için yeterli protein tüketin (vücut ağırlığının her kg'ı için 1.6-2.2 g).</li>
                  <li><strong>Kompleks karbonhidratlar tercih edin:</strong> Tam tahıllar, sebzeler ve meyveler gibi lif içeriği yüksek besinler, kan şekerini dengeler ve daha uzun süre tok tutar.</li>
                  <li><strong>Sağlıklı yağları ihmal etmeyin:</strong> Avokado, zeytinyağı, kuruyemişler gibi sağlıklı yağlar, hormon dengesini destekler ve tokluk hissi verir.</li>
                </ul>
                <p class="text-gray-700">
                  Hızlı sonuç vaat eden popüler diyetlerden ziyade, uzun vadede sürdürülebilir beslenme alışkanlıkları geliştirmek daha etkilidir. Kişiselleştirilmiş bir beslenme planı için bir diyetisyen ile çalışmak en sağlıklı yaklaşımdır.
                </p>
              </div>
            </div>

            <div class="border border-gray-200 rounded-lg overflow-hidden">
              <button @click="toggleFaq(5)" class="w-full flex justify-between items-center p-4 bg-gray-50 hover:bg-gray-100 transition-colors">
                <span class="font-medium text-gray-800">Protein tozu ve besin takviyeleri kullanmalı mıyım?</span>
                <i :class="[activeFaq === 5 ? 'fa-chevron-up' : 'fa-chevron-down', 'fas transition-transform']"></i>
              </button>
              <div v-if="activeFaq === 5" class="p-4 bg-white">
                <p class="text-gray-700 mb-3">
                  Protein tozları ve besin takviyeleri, dengeli bir beslenmenin yerini tutamaz ancak bazı durumlarda faydalı olabilir:
                </p>
                <ul class="list-disc pl-5 mb-3 text-gray-700 space-y-1">
                  <li><strong>Protein tozları:</strong> Yoğun antrenman yapan sporcular, vejetaryenler/veganlar veya günlük protein ihtiyacını karşılamakta zorlananlar için pratik bir çözüm olabilir.</li>
                  <li><strong>Vitamin ve mineral takviyeleri:</strong> Belirli bir besin eksikliği olan, özel bir diyet uygulayan veya belirli sağlık durumları olan kişiler için doktor önerisiyle kullanılabilir.</li>
                  <li><strong>Omega-3 takviyeleri:</strong> Yeterli miktarda yağlı balık tüketmeyenler için faydalı olabilir.</li>
                </ul>
                <p class="text-gray-700">
                  Takviyeler kullanmadan önce bir sağlık uzmanına danışmak önemlidir. Mümkün olduğunca besin ihtiyaçlarınızı gerçek gıdalardan karşılamaya çalışın, çünkü doğal besinler, takviyelerde bulunmayan fitokimyasallar ve sinerjik besin öğeleri içerir.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Beslenme Kaynakları Bölümü -->
      <div class="mt-16">
        <h2 class="text-3xl font-bold text-gray-900 mb-6 text-center">Güvenilir Beslenme Kaynakları</h2>
        <p class="text-center text-gray-700 max-w-3xl mx-auto mb-8">Beslenme konusunda bilgi edinirken güvenilir kaynaklara başvurmak önemlidir. İşte size yardımcı olabilecek bazı kaynaklar:</p>
        
        <div class="bg-white rounded-xl shadow-md p-6 border border-gray-100">
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div class="bg-gradient-to-r from-blue-50 to-indigo-50 p-5 rounded-lg transform hover:-translate-y-1 transition-all duration-300">
              <div class="flex justify-center mb-4">
                <div class="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                  <i class="fas fa-book-medical text-2xl text-blue-600"></i>
                </div>
              </div>
              <h3 class="text-xl font-semibold text-center mb-3">Bilimsel Kaynaklar</h3>
              <ul class="space-y-2 text-gray-700">
                <li class="flex items-start">
                  <i class="fas fa-external-link-alt text-blue-500 mr-2 mt-1"></i>
                  <span>Türkiye Beslenme Rehberi (TÜBER)</span>
                </li>
                <li class="flex items-start">
                  <i class="fas fa-external-link-alt text-blue-500 mr-2 mt-1"></i>
                  <span>Amerikan Diyetetik Derneği</span>
                </li>
                <li class="flex items-start">
                  <i class="fas fa-external-link-alt text-blue-500 mr-2 mt-1"></i>
                  <span>Dünya Sağlık Örgütü Beslenme Rehberleri</span>
                </li>
                <li class="flex items-start">
                  <i class="fas fa-external-link-alt text-blue-500 mr-2 mt-1"></i>
                  <span>PubMed ve Google Scholar Akademik Makaleler</span>
                </li>
              </ul>
            </div>
            
            <div class="bg-gradient-to-r from-green-50 to-teal-50 p-5 rounded-lg transform hover:-translate-y-1 transition-all duration-300">
              <div class="flex justify-center mb-4">
                <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                  <i class="fas fa-user-md text-2xl text-green-600"></i>
                </div>
              </div>
              <h3 class="text-xl font-semibold text-center mb-3">Profesyonel Destek</h3>
              <ul class="space-y-2 text-gray-700">
                <li class="flex items-start">
                  <i class="fas fa-check-circle text-green-500 mr-2 mt-1"></i>
                  <span>Diyetisyen ve beslenme uzmanları</span>
                </li>
                <li class="flex items-start">
                  <i class="fas fa-check-circle text-green-500 mr-2 mt-1"></i>
                  <span>Spor beslenmesi uzmanları</span>
                </li>
                <li class="flex items-start">
                  <i class="fas fa-check-circle text-green-500 mr-2 mt-1"></i>
                  <span>Üniversite hastaneleri beslenme klinikleri</span>
                </li>
                <li class="flex items-start">
                  <i class="fas fa-check-circle text-green-500 mr-2 mt-1"></i>
                  <span>Sağlık Bakanlığı beslenme programları</span>
                </li>
              </ul>
            </div>
            
            <div class="bg-gradient-to-r from-amber-50 to-yellow-50 p-5 rounded-lg transform hover:-translate-y-1 transition-all duration-300">
              <div class="flex justify-center mb-4">
                <div class="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center">
                  <i class="fas fa-laptop text-2xl text-amber-600"></i>
                </div>
              </div>
              <h3 class="text-xl font-semibold text-center mb-3">Dijital Kaynaklar</h3>
              <ul class="space-y-2 text-gray-700">
                <li class="flex items-start">
                  <i class="fas fa-star text-amber-500 mr-2 mt-1"></i>
                  <span>Beslenme ve sağlık uygulamaları</span>
                </li>
                <li class="flex items-start">
                  <i class="fas fa-star text-amber-500 mr-2 mt-1"></i>
                  <span>Beslenme uzmanlarının podcast'leri</span>
                </li>
                <li class="flex items-start">
                  <i class="fas fa-star text-amber-500 mr-2 mt-1"></i>
                  <span>Bilimsel beslenme blogları</span>
                </li>
                <li class="flex items-start">
                  <i class="fas fa-star text-amber-500 mr-2 mt-1"></i>
                  <span>Çevrimiçi beslenme kursları</span>
                </li>
              </ul>
            </div>
          </div>
          
          <div class="mt-8 text-center">
            <p class="text-gray-700 italic mb-4">
              "Beslenme bilgisi arayışınızda her zaman bilimsel temelli kaynaklara başvurun ve popüler diyetlere karşı eleştirel düşünün."
            </p>
            <button class="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              Beslenme Danışmanlığı Randevusu Al
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'NutritionGuide',
  data() {
    return {
      activeFaq: null,
      expandedSections: []
    }
  },
  methods: {
    toggleFaq(id) {
      this.activeFaq = this.activeFaq === id ? null : id
    },
    expandSection(section) {
      if (!this.expandedSections.includes(section)) {
        this.expandedSections.push(section)
      }
      
      // Burada ilgili bölümün detaylı içeriğini göstermek için bir modal açılabilir
      // veya sayfanın ilgili bölümüne scroll yapılabilir
      alert(`${section} bölümü için detaylı bilgi gösterilecek`)
    },
    
  },
  head() {
    return {
      title: 'Beslenme Rehberi | Sağlıklı Yaşam İçin Beslenme Önerileri',
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: 'Sağlıklı beslenme rehberi, mevsimsel beslenme önerileri, besin grupları ve özel durumlar için beslenme tavsiyeleri.'
        }
      ]
    }
  }
}
</script>

<style scoped>
/* Özel stil tanımlamaları buraya eklenebilir */
.container {
  max-width: 1280px;
}

/* Animasyonlar */
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
.animate-fadeIn {
  animation: fadeIn 0.5s ease-in-out;
}
@keyframes float {
  0% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
  100% { transform: translateY(0px); }
}

.animate-float {
  animation: float 3s ease-in-out infinite;
}


.fade-in {
  animation: fadeIn 0.5s ease-in-out;
}

/* Responsive düzenlemeler */
@media (max-width: 768px) {
  .text-4xl {
    font-size: 2rem;
  }
  
  .text-3xl {
    font-size: 1.75rem;
  }
}
</style>