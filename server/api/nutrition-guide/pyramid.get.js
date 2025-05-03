import { defineEventHandler } from 'h3';

export default defineEventHandler(async (event) => {
  // Besin piramidi verisi statik olduğu için doğrudan dönebiliriz
  return {
    levels: [
      {
        name: 'Tahıllar',
        description: 'Günde 6-11 porsiyon',
        foods: ['ekmek', 'pirinç', 'makarna', 'tahıl'],
        color: '#FFD700',
        recommendations: [
          'Tam tahıllı ürünleri tercih edin',
          'İşlenmiş tahıllardan kaçının',
          'Günlük lif alımınızı destekler'
        ]
      },
      {
        name: 'Sebzeler',
        description: 'Günde 3-5 porsiyon',
        foods: ['yeşil yapraklılar', 'havuç', 'domates', 'patates'],
        color: '#90EE90',
        recommendations: [
          'Çeşitli renklerde sebzeler tüketin',
          'Mevsiminde tüketmeye özen gösterin',
          'Pişirirken besin değerlerini koruyun'
        ]
      },
      {
        name: 'Meyveler',
        description: 'Günde 2-4 porsiyon',
        foods: ['elma', 'muz', 'portakal', 'üzüm'],
        color: '#FF6B6B',
        recommendations: [
          'Taze meyveleri tercih edin',
          'Meyve sularından ziyade bütün meyve tüketin',
          'Şeker içeriğine dikkat edin'
        ]
      },
      {
        name: 'Süt Ürünleri',
        description: 'Günde 2-3 porsiyon',
        foods: ['süt', 'yoğurt', 'peynir'],
        color: '#87CEEB',
        recommendations: [
          'Az yağlı süt ürünlerini tercih edin',
          'Probiyotik içeren ürünleri tüketin',
          'Kalsiyum için önemli bir kaynaktır'
        ]
      },
      {
        name: 'Protein',
        description: 'Günde 2-3 porsiyon',
        foods: ['et', 'balık', 'yumurta', 'kurubaklagil'],
        color: '#DEB887',
        recommendations: [
          'Yağsız etleri tercih edin',
          'Haftada 2-3 kez balık tüketin',
          'Bitkisel protein kaynaklarını da ekleyin'
        ]
      },
      {
        name: 'Yağlar ve Tatlılar',
        description: 'Az miktarda',
        foods: ['yağ', 'şeker', 'tatlı'],
        color: '#FFB6C1',
        recommendations: [
          'Sağlıklı yağları tercih edin',
          'Şeker tüketimini sınırlayın',
          'Trans yağlardan kaçının'
        ]
      }
    ]
  };
});
