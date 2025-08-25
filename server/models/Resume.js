import mongoose from "mongoose";

const resumeSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        fullName: {
            type: String,
            required: true,
            trim: true
        },
        email: {
            type: String,
            required: true,
            lowercase: true,
            trim: true
        },
        phone: {
            type: String,
            required: true,
            trim: true
        },
        summary: {
            type: String,
            trim: true
        },
        skills: [{
            type: String,
            trim: true
        }],
        education: [
            {
                institution: {
                    type: String,
                    trim: true
                },
                degree: {
                    type: String,
                    trim: true
                },
                startDate: {
                    type: String,
                    trim: true
                },
                endDate: {
                    type: String,
                    trim: true
                },
                description: {
                    type: String,
                    trim: true
                },
                _id: { type: mongoose.Schema.Types.ObjectId, auto: true }
            },
        ],
        workExperience: [
            {
                company: {
                    type: String,
                    trim: true
                },
                role: {
                    type: String,
                    trim: true
                },
                startDate: {
                    type: String,
                    trim: true
                },
                endDate: {
                    type: String,
                    trim: true
                },
                description: {
                    type: String,
                    trim: true
                },
                _id: { type: mongoose.Schema.Types.ObjectId, auto: true }
            },
        ],
        projects: [
            {
                title: {
                    type: String,
                    trim: true
                },
                description: {
                    type: String,
                    trim: true
                },
                techStack: [{
                    type: String,
                    trim: true
                }],
                link: {
                    type: String,
                    trim: true
                },
                _id: { type: mongoose.Schema.Types.ObjectId, auto: true }
            },
        ],
        // Additional metadata
        isActive: {
            type: Boolean,
            default: true
        },
        version: {
            type: Number,
            default: 1
        }
    },
    {
        timestamps: true,
        // Add index for better query performance
        indexes: [
            { userId: 1 },
            { userId: 1, isActive: 1 }
        ]
    }
);

// Pre-save middleware to ensure data consistency
resumeSchema.pre('save', function (next) {
    // Remove empty strings from skills array
    if (this.skills) {
        this.skills = this.skills.filter(skill => skill && skill.trim().length > 0);
    }

    // Remove empty education entries
    if (this.education) {
        this.education = this.education.filter(edu =>
            edu.institution || edu.degree || edu.startDate || edu.endDate || edu.description
        );
    }

    // Remove empty work experience entries
    if (this.workExperience) {
        this.workExperience = this.workExperience.filter(work =>
            work.company || work.role || work.startDate || work.endDate || work.description
        );
    }

    // Remove empty project entries
    if (this.projects) {
        this.projects = this.projects.filter(project =>
            project.title || project.description || (project.techStack && project.techStack.length > 0) || project.link
        );
    }

    next();
});

const Resume = mongoose.model("Resume", resumeSchema);
export default Resume;
