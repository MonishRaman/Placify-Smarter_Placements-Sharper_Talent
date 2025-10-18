const handleVideo = async (req, res) => {
  try {
    const { videoBlob, interviewId } = req.body;

    if (!videoBlob || !interviewId) {
      return res.status(400).json({
        success: false,
        message: "Both videoBlob and interviewId are required",
      });
    }

    console.log("📹 Video Blob received:", videoBlob);
    console.log("📝 Interview ID:", interviewId);

    // Here you can later add actual video processing / storage logic

    res.status(200).json({
      success: true,
      message: "Video Blob uploaded successfully",
      interviewId,
    });
  } catch (error) {
    console.error("❌ Error in handleVideo:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to upload video blob",
      error: error.message,
    });
  }
};

export default handleVideo;
