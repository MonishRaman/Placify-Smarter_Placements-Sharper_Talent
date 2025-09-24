import Job from "../models/Jobs.js";

/* -------------------- Helpers -------------------- */

// Escape regex for safe search
const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/* -------------------- Controllers -------------------- */

// Create a new job
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
      responsibilities,
    } = req.body;

    if (!title || !type || !domain || !location) {
      return res.status(400).json({
        success: false,
        message: "Title, Type, Domain, and Location are required.",
      });
    }

    const newJob = new Job({
      title,
      company: req.user.userId, // auto-assign logged-in company
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

// Get open jobs with pagination
export const getJobs = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const totalJobs = await Job.countDocuments({ status: "Open" });
    const jobs = await Job.find({ status: "Open" })
      .populate({
        path: "company",
        select: "name email industry website employeeCount profileImage",
      })
      .skip(skip)
      .limit(limit);

    if (!jobs.length) {
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

// Update job (except company field)
export const updateJob = async (req, res) => {
  try {
    const { id: jobId } = req.params;
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

// Delete job
export const deleteJob = async (req, res) => {
  try {
    const { id: jobId } = req.params;
    const { userId, role } = req.user;

    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    if (job.company.toString() !== userId.toString() && role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Unauthorized. Only creator or admin can delete.",
      });
    }

    await job.deleteOne();

    res.status(200).json({
      success: true,
      message: "Job deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting job:", error);
    res.status(500).json({
      success: false,
      message: "Server Error: Could not delete job",
      error: error.message,
    });
  }
};

// Apply for a job (student only)
export const applyForJob = async (req, res) => {
  try {
    const { id: jobId } = req.params;
    const { userId, role } = req.user;
    const { resume } = req.body;

    if (role !== "student") {
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

    const alreadyApplied = job.applicants.some(
      (app) => app.user.toString() === userId.toString()
    );
    if (alreadyApplied) {
      return res.status(400).json({
        success: false,
        message: "You have already applied for this job.",
      });
    }

    job.applicants.push({ user: userId, resume, appliedAt: new Date() });
    await job.save();

    res.status(200).json({
      success: true,
      message: "Applied for job successfully.",
      jobId: job._id,
    });
  } catch (error) {
    console.error("Error applying for job:", error);
    res.status(500).json({
      success: false,
      message: "Server Error: Could not apply for job",
      error: error.message,
    });
  }
};

// Get applied jobs (student only)
export const getAppliedJobs = async (req, res) => {
  try {
    const { userId } = req.user;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const totalJobs = await Job.countDocuments({ "applicants.user": userId });
    const jobs = await Job.find({ "applicants.user": userId })
      .populate({ path: "company", select: "name website profileImage" })
      .skip(skip)
      .limit(limit);

    if (!jobs.length) {
      return res.status(404).json({
        success: false,
        message: "No applied jobs found.",
      });
    }

    const formattedJobs = jobs.map((job) => {
      const applicant = job.applicants.find(
        (app) => app.user.toString() === userId.toString()
      );
      return {
        ...job.toObject(),
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
    res.status(500).json({
      success: false,
      message: "Server Error: Could not fetch applied jobs",
      error: error.message,
    });
  }
};

// Withdraw application (student only)
export const withdrawApplication = async (req, res) => {
  try {
    const { id: jobId } = req.params;
    const { userId } = req.user;

    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ success: false, message: "Job not found" });
    }

    const alreadyApplied = job.applicants.some(
      (app) => app.user.toString() === userId.toString()
    );
    if (!alreadyApplied) {
      return res.status(400).json({
        success: false,
        message: "You have not applied for this job.",
      });
    }

    job.applicants = job.applicants.filter(
      (app) => app.user.toString() !== userId.toString()
    );
    await job.save();

    res.status(200).json({
      success: true,
      message: "Application withdrawn successfully.",
      jobId: job._id,
    });
  } catch (error) {
    console.error("Error withdrawing application:", error);
    res.status(500).json({
      success: false,
      message: "Server Error: Could not withdraw application",
      error: error.message,
    });
  }
};

// Get company jobs (with filters & pagination)
export const getCompanyJobs = async (req, res) => {
  try {
    const companyId = req.user.userId;
    const page = parseInt(req.query.page) || 1;
    const limit = Math.min(parseInt(req.query.limit) || 10, 50);
    const skip = (page - 1) * limit;

    const { status, title, description, fromDate, toDate } = req.query;

    const query = { company: companyId };
    if (status) query.status = status;
    if (title) query.title = new RegExp(escapeRegex(title.trim()), "i");
    if (description)
      query.description = new RegExp(escapeRegex(description.trim()), "i");

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
      Job.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit).populate({
        path: "company",
        select: "name email industry website employeeCount profileImage",
      }),
    ]);

    res.status(200).json({
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
    res.status(500).json({
      success: false,
      message: "Server Error: Could not fetch company jobs",
      error: error.message,
    });
  }
};
