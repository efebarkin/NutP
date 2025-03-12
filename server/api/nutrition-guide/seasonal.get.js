import { eventHandler } from 'h3';

export default eventHandler(async (event) => {
  const seasonalFoods = {
    spring: [
      {
        name: 'Kuşkonmaz',
        benefits: ['A vitamini', 'Folat', 'Demir'],
        season: 'İlkbahar',
        nutritionalValue: {
          calories: 20,
          protein: 2.2,
          carbs: 3.9,
          fiber: 2.1
        },
        tips: [
          'Taze kuşkonmazın uçları sıkı olmalı',
          'Hafif buharda pişirin',
          'Zeytinyağı ile servis yapın'
        ]
      },
      {
        name: 'Enginar',
        benefits: ['Antioksidan', 'Lif', 'K vitamini'],
        season: 'İlkbahar',
        nutritionalValue: {
          calories: 47,
          protein: 3.3,
          carbs: 10.5,
          fiber: 5.4
        },
        tips: [
          'Taze enginarın yaprakları sıkı olmalı',
          'Limonlu suda bekletin',
          'Zeytinyağlı veya etli pişirin'
        ]
      }
      // Diğer ilkbahar sebze ve meyveleri
    ],
    summer: [
      {
        name: 'Domates',
        benefits: ['C vitamini', 'Likopen', 'Potasyum'],
        season: 'Yaz',
        nutritionalValue: {
          calories: 18,
          protein: 0.9,
          carbs: 3.9,
          fiber: 1.2
        },
        tips: [
          'Oda sıcaklığında saklayın',
          'Salatalarda taze tüketin',
          'Güneşte olgunlaşmış olanları tercih edin'
        ]
      },
      {
        name: 'Karpuz',
        benefits: ['A vitamini', 'C vitamini', 'Likopen'],
        season: 'Yaz',
        nutritionalValue: {
          calories: 30,
          protein: 0.6,
          carbs: 7.6,
          fiber: 0.4
        },
        tips: [
          'Olgunluğunu kontrol edin',
          'Soğuk tüketin',
          'Taze kesilmiş tercih edin'
        ]
      }
      // Diğer yaz sebze ve meyveleri
    ],
    autumn: [
      {
        name: 'Nar',
        benefits: ['Antioksidan', 'C vitamini', 'K vitamini'],
        season: 'Sonbahar',
        nutritionalValue: {
          calories: 83,
          protein: 1.7,
          carbs: 18.7,
          fiber: 4
        },
        tips: [
          'Ağır ve parlak olanları seçin',
          'Suda ayıklayın',
          'Taze sıkılmış suyunu için'
        ]
      },
      {
        name: 'Balkabağı',
        benefits: ['A vitamini', 'Lif', 'Potasyum'],
        season: 'Sonbahar',
        nutritionalValue: {
          calories: 26,
          protein: 1,
          carbs: 6.5,
          fiber: 0.5
        },
        tips: [
          'Sert ve lekesiz olanları seçin',
          'Çorba yapın',
          'Fırında pişirin'
        ]
      }
      // Diğer sonbahar sebze ve meyveleri
    ],
    winter: [
      {
        name: 'Portakal',
        benefits: ['C vitamini', 'Folat', 'Potasyum'],
        season: 'Kış',
        nutritionalValue: {
          calories: 47,
          protein: 0.9,
          carbs: 11.8,
          fiber: 2.4
        },
        tips: [
          'Ağır ve sıkı olanları seçin',
          'Taze sıkın',
          'Kabuğunu rendeleyip kullanın'
        ]
      },
      {
        name: 'Lahana',
        benefits: ['C vitamini', 'K vitamini', 'Lif'],
        season: 'Kış',
        nutritionalValue: {
          calories: 25,
          protein: 1.3,
          carbs: 5.8,
          fiber: 2.5
        },
        tips: [
          'Sıkı ve ağır olanları seçin',
          'Çiğ veya az pişmiş tüketin',
          'Turşusunu yapın'
        ]
      }
      // Diğer kış sebze ve meyveleri
    ]
  };

  // Mevcut mevsimi belirle
  const currentMonth = new Date().getMonth() + 1;
  let currentSeason;

  if ([12, 1, 2].includes(currentMonth)) currentSeason = 'winter';
  else if ([3, 4, 5].includes(currentMonth)) currentSeason = 'spring';
  else if ([6, 7, 8].includes(currentMonth)) currentSeason = 'summer';
  else currentSeason = 'autumn';

  return {
    currentSeason,
    seasonalFoods
  };
});
