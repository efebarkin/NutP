import mongoose from 'mongoose';

const waterSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Kullanıcı zorunludur.'],
        index: true
    },
    amount: {
        value: {
            type: Number,
            required: [true, 'Miktar zorunludur.'],
            min: [1, 'Miktar 1 den büyük olmalıdır.'],
            max: [10000, 'Miktar 10000 dan büyük olamaz.'],
        },
        unit: {
            type: String,
            enum: {
                values: ['ml', 'l', 'bardak'],
                message: 'Geçersiz birim'
            },
            default: 'ml',
            required: [true, 'Birim zorunludur.'],
        },
    },
    consumedAt: {
        type: Date,
        required: [true, 'Tüketim tarihi zorunludur.'],
        default: Date.now
    },
}, {
    timestamps: true
});

waterSchema.virtual('amountInML').get(function () {
    if (!this.amount || typeof this.amount.value === 'undefined' || !this.amount.unit) {
        return null;
    }

    switch (this.amount.unit) {
        case 'ml':
            return this.amount.value;
        case 'l':
            return this.amount.value * 1000;
        case 'bardak':
            return this.amount.value * 200;
        default:
            return null;
    }
});

waterSchema.set('toJSON', {
    virtuals: true
});

waterSchema.set('toObject', {
    virtuals: true
});

export const Water = mongoose.model('Water', waterSchema);
