import Job from "../models/Jobs";

export const createJob = async (req, res) => {
  try {
    const {
      title,
      company,
      type,
      domain,
      location,
      salary,
      description,
      requirements,
      responsibilities
    } = req.body;

    if (!title || !company || !type || !domain || !location) {
      return res.status(400).json({
        success: false,
        message: "Title, Company, Type, Domain, and Location are required.",
      });
    }

    const newJob = new Job({
      title,
      company,
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
