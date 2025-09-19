import mongoose from "mongoose";

const couponSchema = new mongoose.Schema(
    {
        code: {
            type: String,
            required: true,
            unique: true,
            uppercase: true,
            trim: true,
        },
        name: {
            type: String,
            required: true,
            trim: true,
        },
        description: {
            type: String,
            default: "",
        },
        discountType: {
            type: String,
            enum: ["percentage", "fixed"],
            required: true,
        },
        discountValue: {
            type: Number,
            required: true,
            min: 0,
        },
        minimumAmount: {
            type: Number,
            default: 0,
            min: 0,
        },
        maximumDiscount: {
            type: Number,
            default: null,
            min: 0,
        },
        applicableRoles: [{
            type: String,
            enum: ["admin", "company", "employee", "student", "institution"],
        }],
        usageLimit: {
            type: Number,
            default: null, // null means unlimited
            min: 1,
        },
        usageCount: {
            type: Number,
            default: 0,
            min: 0,
        },
        isActive: {
            type: Boolean,
            default: true,
        },
        validFrom: {
            type: Date,
            default: Date.now,
        },
        validUntil: {
            type: Date,
            default: null,
        },
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
    },
    { timestamps: true }
);

// Add indexes for better performance

couponSchema.index({ isActive: 1 });
couponSchema.index({ applicableRoles: 1 });
couponSchema.index({ validFrom: 1, validUntil: 1 });

// Virtual to check if coupon is currently valid
couponSchema.virtual('isCurrentlyValid').get(function () {
    const now = new Date();
    return this.isActive &&
        (!this.validUntil || this.validUntil > now) &&
        this.validFrom <= now &&
        (!this.usageLimit || this.usageCount < this.usageLimit);
});

// Method to increment usage count
couponSchema.methods.incrementUsage = function () {
    this.usageCount += 1;
    return this.save();
};

const Coupon = mongoose.model("Coupon", couponSchema);
export default Coupon;