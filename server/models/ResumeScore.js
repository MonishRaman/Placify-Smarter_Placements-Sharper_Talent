import mongoose from "mongoose";
import crypto from "crypto";

const resumeScoreSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true
        },
        resumeId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Resume",
            required: false // Optional since users can upload resume without saving to Resume collection
        },
        score: {
            type: Number,
            required: true,
            min: 0,
            max: 100
        },
        // Detailed breakdown of scores
        scoreBreakdown: {
            keywordMatch: {
                score: { type: Number, min: 0, max: 100 },
                details: mongoose.Schema.Types.Mixed
            },
            skillsRelevance: {
                score: { type: Number, min: 0, max: 100 },
                details: mongoose.Schema.Types.Mixed
            },
            experienceRelevance: {
                score: { type: Number, min: 0, max: 100 },
                details: mongoose.Schema.Types.Mixed
            },
            educationRelevance: {
                score: { type: Number, min: 0, max: 100 },
                details: mongoose.Schema.Types.Mixed
            },
            formatAndStructure: {
                score: { type: Number, min: 0, max: 100 },
                details: mongoose.Schema.Types.Mixed
            }
        },
        // Job description metadata
        jobTitle: {
            type: String,
            trim: true
        },
        companyName: {
            type: String,
            trim: true
        },
        jobDescriptionHash: {
            type: String, // Hash of job description to detect similar job postings
            index: true
        },
        // Analysis metadata
        resumeFileName: {
            type: String,
            trim: true
        },
        analysisVersion: {
            type: String,
            default: "1.0" // Track which version of scoring algorithm was used
        },
        processingTime: {
            type: Number // Time taken for analysis in milliseconds
        },
        // Gemini AI analysis (optional)
        aiAnalysis: {
            feedback: String,
            suggestions: [String],
            strengths: [String],
            improvements: [String]
        },
        // Metadata for tracking
        isActive: {
            type: Boolean,
            default: true
        }
    },
    {
        timestamps: true,
        // Add compound indexes for better query performance
        indexes: [
            { userId: 1, createdAt: -1 }, // For user score history (latest first)
            { userId: 1, score: -1 }, // For finding best scores
            { userId: 1, jobDescriptionHash: 1 }, // For similar job analysis
            { createdAt: -1 }, // For admin analytics
            { userId: 1, isActive: 1, createdAt: -1 } // Most common query pattern
        ]
    }
);

// Pre-save middleware to calculate job description hash
resumeScoreSchema.pre('save', function (next) {
    if (this.isModified('jobTitle') || this.isModified('companyName')) {
        // Create a simple hash for job similarity detection
        const content = `${this.jobTitle || ''}|${this.companyName || ''}`.toLowerCase();
        this.jobDescriptionHash = crypto
            .createHash('md5')
            .update(content)
            .digest('hex');
    }
    next();
});

// Static methods for analytics
resumeScoreSchema.statics.getUserStats = async function (userId) {
    const pipeline = [
        { $match: { userId: new mongoose.Types.ObjectId(userId), isActive: true } },
        {
            $group: {
                _id: null,
                totalScores: { $sum: 1 },
                averageScore: { $avg: "$score" },
                bestScore: { $max: "$score" },
                worstScore: { $min: "$score" },
                latestScore: { $last: "$score" },
                firstScore: { $first: "$score" }
            }
        }
    ];

    const result = await this.aggregate(pipeline);
    return result[0] || {
        totalScores: 0,
        averageScore: 0,
        bestScore: 0,
        worstScore: 0,
        latestScore: 0,
        firstScore: 0
    };
};

resumeScoreSchema.statics.getScoreProgress = async function (userId, limit = 10) {
    return await this.find({
        userId: new mongoose.Types.ObjectId(userId),
        isActive: true
    })
        .select('score jobTitle companyName createdAt scoreBreakdown.keywordMatch.score scoreBreakdown.skillsRelevance.score')
        .sort({ createdAt: -1 })
        .limit(limit);
};

const ResumeScore = mongoose.model("ResumeScore", resumeScoreSchema);
export default ResumeScore;
