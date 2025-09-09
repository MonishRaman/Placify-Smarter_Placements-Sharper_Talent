import mongoose from 'mongoose';

const interviewExperienceSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        email: {
            type: String,
            required: true,
            trim: true,
            lowercase: true,
        },
        company: {
            type: String,
            required: true,
            trim: true,
        },
        role: {
            type: String,
            required: true,
            trim: true,
        },
        interviewType: {
            type: String,
            required: true,
            enum: ['Technical', 'HR', 'Behavioral', 'Group Discussion', 'Case Study', 'Mixed'],
        },
        difficulty: {
            type: String,
            required: true,
            enum: ['Easy', 'Medium', 'Hard', 'Very Hard'],
        },
        rating: {
            type: Number,
            required: true,
            min: 1,
            max: 5,
            default: 5,
        },
        experience: {
            type: String,
            required: true,
            trim: true,
        },
        tips: {
            type: String,
            trim: true,
            default: '',
        },
        isApproved: {
            type: Boolean,
            default: false,
        },
        isPublic: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    }
);

// Add indexes for better query performance
interviewExperienceSchema.index({ company: 1, role: 1 });
interviewExperienceSchema.index({ interviewType: 1 });
interviewExperienceSchema.index({ difficulty: 1 });
interviewExperienceSchema.index({ rating: 1 });
interviewExperienceSchema.index({ isApproved: 1, isPublic: 1 });
interviewExperienceSchema.index({ createdAt: -1 });

// Virtual for getting company and role combination
interviewExperienceSchema.virtual('companyRole').get(function () {
    return `${this.company} - ${this.role}`;
});

// Virtual for getting formatted rating
interviewExperienceSchema.virtual('ratingStars').get(function () {
    return '⭐'.repeat(this.rating);
});

export default mongoose.model('InterviewExperience', interviewExperienceSchema);
