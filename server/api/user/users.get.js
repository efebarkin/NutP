import UserService from '~/server/services/userService.js';

export default defineEventHandler(async (event) => {
    // URL'den query parametrelerini al
    const query = getQuery(event);
    const searchTerm = query.search || '';
    
    // Filtreleme parametrelerini al
    const filters = {
        role: query.role || null,
        status: query.status || null,
        dateFrom: query.dateFrom || null,
        dateTo: query.dateTo || null
    };
    
    // Filtreleme veya arama yapılacak mı kontrol et
    const hasFilters = Object.values(filters).some(val => val !== null);
    const hasSearch = searchTerm && searchTerm.trim() !== '';
    
    // Hem arama hem filtreleme varsa
    if (hasSearch && hasFilters) {
        return UserService.filterAndSearchUsers(searchTerm, filters, 100);
    }
    // Sadece arama varsa
    else if (hasSearch) {
        return UserService.searchUsers(searchTerm, 100);
    }
    // Sadece filtreleme varsa
    else if (hasFilters) {
        return UserService.filterUsers(filters, 100);
    }
    // Hiçbiri yoksa tüm kullanıcıları getir
    else {
        return UserService.getAllUsers();
    }
});