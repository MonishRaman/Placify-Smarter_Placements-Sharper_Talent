
import Job from "../models/Jobs.js";


export const createJob = async (req, res) => {
  try {
    const {
      title,
      type,
      domain,
      location,
      salary,
      description,
      requirements,
      responsibilities
    } = req.body;

    if (!title || !type || !domain || !location) {
      return res.status(400).json({
        success: false,
        message: "Title, Type, Domain, and Location are required.",
      });
    }

    const newJob = new Job({
      title,
      company: req.user.userId, // <-- automatically assign from logged-in user
      type,
      domain,
      location,
      salary,
      description,
      requirements,
      responsibilities,
    });

    const savedJob = await newJob.save();

    res.status(201).json({
      success: true,
      message: "Job created successfully!",
      job: savedJob,
    });

  } catch (error) {
    console.error("Error creating job:", error);
    res.status(500).json({
      success: false,
      message: "Server Error: Could not create job.",
    });
  }
};



export const getJobs = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    // Skip calculate
    const skip = (page - 1) * limit;

    // Total jobs count 
    const totalJobs = await Job.countDocuments({ status: "Open" });

    // Jobs fetch with pagination
    const jobs = await Job.find({ status: "Open" })
      .populate({
        path: "company",
        select: "name email industry website employeeCount profileImage",
      })
      .skip(skip)
      .limit(limit);

    if (!jobs || jobs.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No open jobs found.",
      });
    }

    res.status(200).json({
      success: true,
      count: jobs.length,
      totalJobs,
      currentPage: page,
      totalPages: Math.ceil(totalJobs / limit),
      jobs,
    });
  } catch (error) {
    console.error("Error fetching jobs:", error.message);
    res.status(500).json({
      success: false,
      message: "Server Error: Could not fetch jobs.",
      error: error.message,
    });
  }
};



// PUT /api/jobs/:id - Update job (except company)
export const updateJob = async (req, res) => {
  try {
    const jobId = req.params.id;

    // destructure request body
    const {
      title,
      type,
      domain,
      location,
      salary,
      description,
      requirements,
      responsibilities,
      status,
    } = req.body;

    // build update object (without company)
    const updateData = {
      title,
      type,
      domain,
      location,
      salary,
      description,
      requirements,
      responsibilities,
      status,
    };

    // filter out undefined fields
    Object.keys(updateData).forEach(
      (key) => updateData[key] === undefined && delete updateData[key]
    );

    const updatedJob = await Job.findByIdAndUpdate(jobId, updateData, {
      new: true,
      runValidators: true,
    }).populate({
      path: "company",
      select: "name email industry website employeeCount profileImage",
    });

    if (!updatedJob) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Job updated successfully",
      job: updatedJob,
    });
  } catch (error) {
    console.error("Error updating job:", error.message);
    res.status(500).json({
      success: false,
      message: "Server Error: Could not update job.",
      error: error.message,
    });
  }
};
export const deleteJob = async (req, res) => {
  try {
    const jobId = req.params.id;
    const userId = req.user.userId;
    const userRole = req.user.role; // e.g., 'company', 'admin'

    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    // Only creator company or admin can delete
    if (
      job.company.toString() !== userId.toString() &&
      userRole !== "admin"
    ) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized. Only creator or admin can delete.",
      });
    }

    await job.deleteOne();

    return res.status(200).json({
      success: true,
      message: "Job deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting job:", error);
    return res.status(500).json({
      success: false,
      message: "Server Error: Could not delete job",
      error: error.message,
    });
  }
};

export const applyForJob = async (req, res) => {
  try {
    const jobId = req.params.id;
    const userId = req.user.userId;
    const userRole = req.user.role; // e.g., 'student'
    const { resume } = req.body; // resume: string (resumeId or link)

    if (userRole !== "student") {
      return res.status(403).json({
        success: false,
        message: "Only students can apply for jobs.",
      });
    }

    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    // Prevent duplicate application
    const alreadyApplied = job.applicants.some(
      (app) => app.user.toString() === userId.toString()
    );
    if (alreadyApplied) {
      return res.status(400).json({
        success: false,
        message: "You have already applied for this job.",
      });
    }

    // Add applicant
    job.applicants.push({
      user: userId,
      resume: resume,
      appliedAt: new Date(),
    });
    await job.save();

    return res.status(200).json({
      success: true,
      message: "Applied for job successfully.",
      jobId: job._id,
    });
  } catch (error) {
    console.error("Error applying for job:", error);
    return res.status(500).json({
      success: false,
      message: "Server Error: Could not apply for job",
      error: error.message,
    });
  }
};


// GET /api/jobs/applied?page=1&limit=10  (STUDENT ONLY)
export const getAppliedJobs = async (req, res) => {
  try {
    const userId = req.user.userId;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Total count for pagination
    const totalJobs = await Job.countDocuments({ "applicants.user": userId });

    const jobs = await Job.find({ "applicants.user": userId })
      .populate({
        path: "company",
        select: "name website profileImage", // सिर्फ ज़रूरी fields
      })
      .skip(skip)
      .limit(limit);

    if (!jobs || jobs.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No applied jobs found.",
      });
    }

    // student-specific data निकालना
    const formattedJobs = jobs.map((job) => {
      const applicant = job.applicants.find(
        (app) => app.user.toString() === userId.toString()
      );

      return {
        _id: job._id,
        title: job.title,
        type: job.type,
        domain: job.domain,
        location: job.location,
        salary: job.salary,
        description: job.description,         
        requirements: job.requirements,       
        responsibilities: job.responsibilities, 
        company: job.company,   
        appliedAt: applicant?.appliedAt,
        resume: applicant?.resume,
      };
    });

    res.status(200).json({
      success: true,
      count: formattedJobs.length,
      totalJobs,
      currentPage: page,
      totalPages: Math.ceil(totalJobs / limit),
      jobs: formattedJobs,
    });
  } catch (error) {
    console.error("Error fetching applied jobs:", error);
    return res.status(500).json({
      success: false,
      message: "Server Error: Could not fetch applied jobs",
      error: error.message,
    });
  }
};



// DELETE /api/jobs/:id/withdraw  (STUDENT ONLY)
export const withdrawApplication = async (req, res) => {
  try {
    const jobId = req.params.id;
    const userId = req.user.userId;

    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    // Check if student applied before
    const alreadyApplied = job.applicants.some(
      (app) => app.user.toString() === userId.toString()
    );
    if (!alreadyApplied) {
      return res.status(400).json({
        success: false,
        message: "You have not applied for this job.",
      });
    }

    // Remove student from applicants array
    job.applicants = job.applicants.filter(
      (app) => app.user.toString() !== userId.toString()
    );
    await job.save();

    return res.status(200).json({
      success: true,
      message: "Application withdrawn successfully.",
      jobId: job._id,
    });
  } catch (error) {
    console.error("Error withdrawing application:", error);
    return res.status(500).json({
      success: false,
      message: "Server Error: Could not withdraw application",
      error: error.message,
    });
  }
};

// ...existing code...
// Logged-in company can see ONLY its own posted jobs with optional filters (title, description, date range)
export const getCompanyJobs = async (req, res) => {
  try {
    const companyId = req.user.userId;
    const page = parseInt(req.query.page) || 1;
    const limit = Math.min(parseInt(req.query.limit) || 10, 50);
    const skip = (page - 1) * limit;

    const {
      status,
      title,
      description,
      fromDate,
      toDate,
    } = req.query;

    const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

    const query = { company: companyId };
    if (status) query.status = status;

    if (title) {
      query.title = new RegExp(escapeRegex(title.trim()), "i");
    }
    if (description) {
      query.description = new RegExp(escapeRegex(description.trim()), "i");
    }

    if (fromDate || toDate) {
      query.createdAt = {};
      if (fromDate) query.createdAt.$gte = new Date(fromDate);
      if (toDate) {
        const end = new Date(toDate);
        end.setHours(23, 59, 59, 999);
        query.createdAt.$lte = end;
      }
    }

    const [totalJobs, jobs] = await Promise.all([
      Job.countDocuments(query),
      Job.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate({
          path: "company",
          select: "name email industry website employeeCount profileImage",
        })
    ]);

    return res.status(200).json({
      success: true,
      filters: {
        status: status || null,
        title: title || null,
        description: description || null,
        fromDate: fromDate || null,
        toDate: toDate || null,
      },
      count: jobs.length,
      totalJobs,
      currentPage: page,
      totalPages: Math.ceil(totalJobs / limit),
      jobs,
    });
  } catch (error) {
    console.error("Error fetching company jobs:", error);
    return res.status(500).json({
      success: false,
      message: "Server Error: Could not fetch company jobs",
      error: error.message,
    });
  }
};



