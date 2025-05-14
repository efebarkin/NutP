/**
 * Besin filtreleme fonksiyonu
 * @param {Object} query - Sorgu parametreleri
 * @returns {Array} MongoDB filtre dizisi
 */
export function filterFoods(query) {
    if (!query || typeof query !== 'object') {
        return [];
    }

    const filters = [];

    // Protein filtresi
    const minProtein = parseFloat(query.minProtein);
    const maxProtein = parseFloat(query.maxProtein);

    if (!isNaN(minProtein) || !isNaN(maxProtein)) {
        const proteinFilter = {};
        
        if (!isNaN(minProtein)) {
            proteinFilter['$gte'] = minProtein;
        }
        
        if (!isNaN(maxProtein)) {
            proteinFilter['$lte'] = maxProtein;
        }
        
        if (Object.keys(proteinFilter).length > 0) {
            filters.push({ 'nutrients.protein.value': proteinFilter });
        }
    }

    // Protein kategorisi filtresi (düşük, orta, yüksek)
    if (query.protein) {
        switch(query.protein) {
            case 'low':
                filters.push({ 'nutrients.protein.value': { $lt: 10 } });
                break;
            case 'medium':
                filters.push({ 'nutrients.protein.value': { $gte: 10, $lt: 20 } });
                break;
            case 'high':
                filters.push({ 'nutrients.protein.value': { $gte: 20 } });
                break;
        }
    }

    // Kalori filtresi eklenebilir
    const minCalories = parseFloat(query.minCalories);
    const maxCalories = parseFloat(query.maxCalories);

    if (!isNaN(minCalories) || !isNaN(maxCalories)) {
        const caloriesFilter = {};
        
        if (!isNaN(minCalories)) {
            caloriesFilter['$gte'] = minCalories;
        }
        
        if (!isNaN(maxCalories)) {
            caloriesFilter['$lte'] = maxCalories;
        }
        
        if (Object.keys(caloriesFilter).length > 0) {
            filters.push({ 'nutrients.energy.value': caloriesFilter });
        }
    }

    return filters;
}

