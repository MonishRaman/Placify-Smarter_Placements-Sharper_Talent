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
      company: req.user._id, // <-- automatically assign from logged-in user
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
    const jobs = await Job.find().populate({
      path: "company",
      select: "name email industry website  employeeCount profileImage"

    });

    if (!jobs || jobs.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No jobs found.",
      });
    }

    res.status(200).json({
      success: true,
      count: jobs.length,
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


