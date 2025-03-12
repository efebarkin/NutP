import { defineStore } from 'pinia';

export const useBodyMetricsStore = defineStore('bodyMetrics', {
  state: () => ({
    measurements: null,
    recommendations: null,
    loading: false,
    error: null
  }),

  actions: {
    calculateBodyFat(metrics) {
      const { gender, age, weight, height, neck, waist, hip } = metrics;
      
      // U.S. Navy Method formülü
      let bodyFat;
      if (gender === 'male') {
        bodyFat = 495 / (1.0324 - 0.19077 * Math.log10(waist - neck) + 0.15456 * Math.log10(height)) - 450;
      } else {
        bodyFat = 495 / (1.29579 - 0.35004 * Math.log10(waist + hip - neck) + 0.22100 * Math.log10(height)) - 450;
      }

      // BMI hesaplama
      const heightInMeters = height / 100;
      const bmi = weight / (heightInMeters * heightInMeters);

      // Önerileri oluştur
      const recommendations = this.generateRecommendations(bodyFat, bmi, age, gender);

      this.measurements = {
        ...metrics,
        bodyFat,
        bmi
      };

      this.recommendations = recommendations;

      return {
        measurements: this.measurements,
        recommendations: this.recommendations
      };
    },

    generateRecommendations(bodyFat, bmi, age, gender) {
      const recommendations = {
        status: '',
        nutrition: [],
        exercise: [],
        lifestyle: []
      };

      // Vücut yağ oranına göre durum değerlendirmesi
      if (gender === 'male') {
        if (bodyFat < 6) recommendations.status = 'Çok Düşük';
        else if (bodyFat < 14) recommendations.status = 'Atletik';
        else if (bodyFat < 18) recommendations.status = 'Normal';
        else if (bodyFat < 25) recommendations.status = 'Yüksek';
        else recommendations.status = 'Çok Yüksek';
      } else {
        if (bodyFat < 14) recommendations.status = 'Çok Düşük';
        else if (bodyFat < 21) recommendations.status = 'Atletik';
        else if (bodyFat < 25) recommendations.status = 'Normal';
        else if (bodyFat < 32) recommendations.status = 'Yüksek';
        else recommendations.status = 'Çok Yüksek';
      }

      // Duruma göre öneriler
      switch (recommendations.status) {
        case 'Çok Düşük':
          recommendations.nutrition.push(
            'Protein alımını artırın',
            'Sağlıklı yağları diyetinize ekleyin',
            'Kompleks karbonhidratları tercih edin'
          );
          recommendations.exercise.push(
            'Ağırlık çalışmalarına odaklanın',
            'Aşırı kardiyodan kaçının'
          );
          break;

        case 'Atletik':
          recommendations.nutrition.push(
            'Mevcut beslenme düzeninizi koruyun',
            'Protein alımınızı sürdürün'
          );
          recommendations.exercise.push(
            'Dengeli antrenman programınıza devam edin',
            'Dinlenmeye önem verin'
          );
          break;

        case 'Normal':
          recommendations.nutrition.push(
            'Dengeli beslenmeyi sürdürün',
            'Porsiyon kontrolüne dikkat edin'
          );
          recommendations.exercise.push(
            'Haftada 3-4 gün egzersiz yapın',
            'Kardiyo ve kuvvet dengesini koruyun'
          );
          break;

        case 'Yüksek':
        case 'Çok Yüksek':
          recommendations.nutrition.push(
            'Kalori alımınızı kontrol edin',
            'İşlenmiş gıdalardan kaçının',
            'Lifli besinleri artırın'
          );
          recommendations.exercise.push(
            'Düzenli kardiyo egzersizleri yapın',
            'Kuvvet antrenmanları ekleyin',
            'Günlük aktivite seviyenizi artırın'
          );
          break;
      }

      // Genel yaşam tarzı önerileri
      recommendations.lifestyle.push(
        'Düzenli uyku düzenine sahip olun',
        'Stres yönetimine önem verin',
        'Günlük su tüketiminizi artırın'
      );

      return recommendations;
    }
  }
});
