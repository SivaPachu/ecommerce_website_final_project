import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema(
  {
    orderId: { type: String, required: true, unique: true },
    userEmail: { type: String, default: 'guest@nexusgear.in' },
    items: [
      {
        id: String,
        title: String,
        salePrice: Number,
        qty: Number,
        image: String
      }
    ],
    subtotal: { type: Number, required: true },
    deliveryCharge: { type: Number, default: 0 },
    codFee: { type: Number, default: 0 },
    totalAmount: { type: Number, required: true },
    addressDetails: { type: String, required: true },
    paymentMethod: { type: String, required: true },
    placedAt: { type: String, required: true }
  },
  { timestamps: true }
);

export default mongoose.model('Order', orderSchema);