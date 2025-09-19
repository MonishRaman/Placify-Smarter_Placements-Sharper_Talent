import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
    {
        transactionId: {
            type: String,
            required: true,
            unique: true,
        },
        userId: {
            type: String,
            default: "anonymous",
        },
        amount: {
            type: Number,
            required: true,
            min: 0,
        },
        originalAmount: {
            type: Number,
            required: true,
            min: 0,
        },
        discount: {
            type: Number,
            default: 0,
            min: 0,
        },
        couponCode: {
            type: String,
            default: null,
        },
        status: {
            type: String,
            enum: ["pending", "success", "failed", "cancelled"],
            default: "pending",
        },
        paymentMethod: {
            type: String,
            enum: ["credit_card", "debit_card", "upi", "net_banking", "wallet"],
            default: "credit_card",
        },
        currency: {
            type: String,
            default: "INR",
        },
        description: {
            type: String,
            default: "",
        },
        metadata: {
            type: mongoose.Schema.Types.Mixed,
            default: {},
        },
    },
    { timestamps: true }
);

// Add indexes for better performance

paymentSchema.index({ userId: 1 });
paymentSchema.index({ status: 1 });
paymentSchema.index({ createdAt: -1 });

const Payment = mongoose.model("Payment", paymentSchema);
export default Payment;