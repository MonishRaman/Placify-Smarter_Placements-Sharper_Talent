import InterviewExperience from '../models/InterviewExperience.js';

// Create a new interview experience
export const createInterviewExperience = async (req, res) => {
    try {
        const {
            name,
            email,
            company,
            role,
            interviewType,
            difficulty,
            rating,
            experience,
            tips
        } = req.body;

        // Validate required fields
        if (!name || !email || !company || !role || !interviewType || !difficulty || !rating || !experience) {
            return res.status(400).json({
                success: false,
                message: 'All required fields must be provided',
                required: ['name', 'email', 'company', 'role', 'interviewType', 'difficulty', 'rating', 'experience']
            });
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                success: false,
                message: 'Please provide a valid email address'
            });
        }

        // Validate rating range
        if (rating < 1 || rating > 5) {
            return res.status(400).json({
                success: false,
                message: 'Rating must be between 1 and 5'
            });
        }

        // Create new interview experience
        const newExperience = new InterviewExperience({
            name,
            email,
            company,
            role,
            interviewType,
            difficulty,
            rating: parseInt(rating),
            experience,
            tips: tips || ''
        });

        const savedExperience = await newExperience.save();

        res.status(201).json({
            success: true,
            message: 'Interview experience submitted successfully! Thank you for sharing.',
            data: savedExperience
        });

    } catch (error) {
        console.error('Error creating interview experience:', error);

        // Handle duplicate key error or validation errors
        if (error.name === 'ValidationError') {
            const errors = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({
                success: false,
                message: 'Validation error',
                errors
            });
        }

        res.status(500).json({
            success: false,
            message: 'Internal server error. Please try again later.',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

// Get all interview experiences (with filtering and pagination)
export const getAllInterviewExperiences = async (req, res) => {
    try {
        const {
            page = 1,
            limit = 10,
            sortBy = 'createdAt',
            sortOrder = 'desc'
        } = req.query;

        // Basic filter for public and approved experiences only
        const filter = { 
            isPublic: true,
            isApproved: true 
        };

        // Calculate pagination
        const skip = (parseInt(page) - 1) * parseInt(limit);
        const sortOptions = { [sortBy]: sortOrder === 'desc' ? -1 : 1 };

        // Execute query
        const experiences = await InterviewExperience.find(filter)
            .select('-email') // Exclude email from public responses
            .sort(sortOptions)
            .skip(skip)
            .limit(parseInt(limit))
            .lean();

        // Get total count for pagination
        const total = await InterviewExperience.countDocuments(filter);
        const totalPages = Math.ceil(total / parseInt(limit));

        res.status(200).json({
            success: true,
            data: experiences,
            pagination: {
                currentPage: parseInt(page),
                totalPages,
                totalItems: total,
                itemsPerPage: parseInt(limit),
                hasNextPage: parseInt(page) < totalPages,
                hasPrevPage: parseInt(page) > 1
            }
        });

    } catch (error) {
        console.error('Error fetching interview experiences:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching interview experiences',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

// Get a single interview experience by ID
export const getInterviewExperienceById = async (req, res) => {
    try {
        const { id } = req.params;

        const experience = await InterviewExperience.findById(id)
            .select('-email')
            .lean();

        if (!experience) {
            return res.status(404).json({
                success: false,
                message: 'Interview experience not found'
            });
        }

        if (!experience.isPublic || !experience.isApproved) {
            return res.status(403).json({
                success: false,
                message: 'This interview experience is not publicly available'
            });
        }

        res.status(200).json({
            success: true,
            data: experience
        });

    } catch (error) {
        console.error('Error fetching interview experience:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching interview experience',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};


// Get statistics for dashboard
export const getInterviewStats = async (req, res) => {
    try {
        const stats = await InterviewExperience.aggregate([
            {
                $match: { isPublic: true, isApproved: true }
            },
            {
                $group: {
                    _id: null,
                    totalExperiences: { $sum: 1 },
                    averageRating: { $avg: '$rating' },
                    companyCount: { $addToSet: '$company' },
                    interviewTypes: {
                        $push: {
                            type: '$interviewType',
                            difficulty: '$difficulty',
                            rating: '$rating'
                        }
                    }
                }
            },
            {
                $project: {
                    _id: 0,
                    totalExperiences: 1,
                    averageRating: { $round: ['$averageRating', 2] },
                    uniqueCompanies: { $size: '$companyCount' },
                    interviewTypes: 1
                }
            }
        ]);

        // Get top companies
        const topCompanies = await InterviewExperience.aggregate([
            {
                $match: { isPublic: true, isApproved: true }
            },
            {
                $group: {
                    _id: '$company',
                    count: { $sum: 1 },
                    averageRating: { $avg: '$rating' }
                }
            },
            {
                $sort: { count: -1 }
            },
            {
                $limit: 5
            },
            {
                $project: {
                    company: '$_id',
                    experienceCount: '$count',
                    averageRating: { $round: ['$averageRating', 2] },
                    _id: 0
                }
            }
        ]);

        res.status(200).json({
            success: true,
            data: {
                overview: stats[0] || {
                    totalExperiences: 0,
                    averageRating: 0,
                    uniqueCompanies: 0,
                    interviewTypes: []
                },
                topCompanies
            }
        });

    } catch (error) {
        console.error('Error fetching interview stats:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching interview statistics',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};
// // Get interview experiences by company
// export const getExperiencesByCompany = async (req, res) => {
//     try {
//         const { company } = req.params;
//         const { limit = 10, sortBy = 'createdAt', sortOrder = 'desc' } = req.query;

//         const experiences = await InterviewExperience.find({
//             company: { $regex: company, $options: 'i' },
//             isPublic: true,
//             isApproved: true
//         })
//             .select('-email')
//             .sort({ [sortBy]: sortOrder === 'desc' ? -1 : 1 })
//             .limit(parseInt(limit))
//             .lean();

//         res.status(200).json({
//             success: true,
//             data: experiences,
//             count: experiences.length
//         });

//     } catch (error) {
//         console.error('Error fetching experiences by company:', error);
//         res.status(500).json({
//             success: false,
//             message: 'Error fetching experiences by company',
//             error: process.env.NODE_ENV === 'development' ? error.message : undefined
//         });
//     }
// };

// // Admin function to approve/reject experiences
// export const updateExperienceStatus = async (req, res) => {
//     try {
//         const { id } = req.params;
//         const { isApproved, isPublic } = req.body;

//         const experience = await InterviewExperience.findByIdAndUpdate(
//             id,
//             {
//                 ...(typeof isApproved !== 'undefined' && { isApproved }),
//                 ...(typeof isPublic !== 'undefined' && { isPublic })
//             },
//             { new: true }
//         );

//         if (!experience) {
//             return res.status(404).json({
//                 success: false,
//                 message: 'Interview experience not found'
//             });
//         }

//         res.status(200).json({
//             success: true,
//             message: 'Experience status updated successfully',
//             data: experience
//         });

//     } catch (error) {
//         console.error('Error updating experience status:', error);
//         res.status(500).json({
//             success: false,
//             message: 'Error updating experience status',
//             error: process.env.NODE_ENV === 'development' ? error.message : undefined
//         });
//     }
// };
