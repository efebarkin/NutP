import { eventHandler, readBody } from 'h3';
import { ErrorTypes } from '~/server/utils/error';

export default eventHandler(async (event) => {
  try {
    const metrics = await readBody(event);
    const { gender, age, weight, height, neck, waist, hip } = metrics;

    // Input validasyonu
    if (!gender || !age || !weight || !height || !neck || !waist || (gender === 'female' && !hip)) {
      throw ErrorTypes.BAD_REQUEST('Tüm ölçümler gereklidir');
    }

    if (age < 18 || age > 100) {
      throw ErrorTypes.BAD_REQUEST('Yaş 18-100 arasında olmalıdır');
    }

    if (weight < 30 || weight > 300) {
      throw ErrorTypes.BAD_REQUEST('Kilo 30-300 kg arasında olmalıdır');
    }

    if (height < 130 || height > 230) {
      throw ErrorTypes.BAD_REQUEST('Boy 130-230 cm arasında olmalıdır');
    }

    // U.S. Navy Method formülü ile vücut yağ oranı hesaplama
    let bodyFat;
    if (gender === 'male') {
      bodyFat = 495 / (1.0324 - 0.19077 * Math.log10(waist - neck) + 0.15456 * Math.log10(height)) - 450;
    } else {
      bodyFat = 495 / (1.29579 - 0.35004 * Math.log10(waist + hip - neck) + 0.22100 * Math.log10(height)) - 450;
    }

    // BMI hesaplama
    const heightInMeters = height / 100;
    const bmi = weight / (heightInMeters * heightInMeters);

    // Vücut tipi belirleme
    let bodyType;
    if (bmi < 18.5) bodyType = 'Zayıf';
    else if (bmi < 25) bodyType = 'Normal';
    else if (bmi < 30) bodyType = 'Kilolu';
    else bodyType = 'Obez';

    // Vücut yağ oranı kategorisi
    let bodyFatCategory;
    if (gender === 'male') {
      if (bodyFat < 6) bodyFatCategory = 'Temel Yağ';
      else if (bodyFat < 14) bodyFatCategory = 'Atletik';
      else if (bodyFat < 18) bodyFatCategory = 'Fit';
      else if (bodyFat < 25) bodyFatCategory = 'Normal';
      else bodyFatCategory = 'Yüksek';
    } else {
      if (bodyFat < 14) bodyFatCategory = 'Temel Yağ';
      else if (bodyFat < 21) bodyFatCategory = 'Atletik';
      else if (bodyFat < 25) bodyFatCategory = 'Fit';
      else if (bodyFat < 32) bodyFatCategory = 'Normal';
      else bodyFatCategory = 'Yüksek';
    }

    // İdeal kilo hesaplama (Hamwi formülü)
    const baseHeight = gender === 'male' ? 152 : 152;
    const baseWeight = gender === 'male' ? 48 : 45;
    const weightPerCm = gender === 'male' ? 1.1 : 0.9;
    
    const heightDiff = Math.max(0, height - baseHeight);
    const idealWeight = baseWeight + (heightDiff * weightPerCm);
    
    // Önerileri oluştur
    const recommendations = {
      nutrition: [],
      exercise: [],
      lifestyle: []
    };

    // BMI'ye göre öneriler
    if (bmi < 18.5) {
      recommendations.nutrition.push(
        'Günlük kalori alımınızı artırın',
        'Protein açısından zengin besinler tüketin',
        'Sağlıklı yağlar ve kompleks karbonhidratlar ekleyin'
      );
      recommendations.exercise.push(
        'Kuvvet antrenmanlarına odaklanın',
        'Aşırı kardiyodan kaçının',
        'Kas kütlesi kazanımı için ağırlık çalışın'
      );
    } else if (bmi >= 25) {
      recommendations.nutrition.push(
        'Kalori alımınızı kontrol edin',
        'İşlenmiş gıdalardan kaçının',
        'Lifli besinler tüketin'
      );
      recommendations.exercise.push(
        'Düzenli kardiyovasküler egzersiz yapın',
        'HIIT antrenmanları deneyin',
        'Günlük adım sayınızı artırın'
      );
    }

    // Genel öneriler
    recommendations.lifestyle.push(
      'Düzenli uyku düzeni oluşturun',
      'Stres yönetimi için meditasyon yapın',
      'Günlük su tüketiminizi artırın'
    );

    return {
      metrics: {
        bodyFat: Math.round(bodyFat * 10) / 10,
        bmi: Math.round(bmi * 10) / 10,
        bodyType,
        bodyFatCategory,
        idealWeight: Math.round(idealWeight * 10) / 10
      },
      recommendations
    };

  } catch (error) {
    console.error('Body calculator error:', error);
    throw error;
  }
});
