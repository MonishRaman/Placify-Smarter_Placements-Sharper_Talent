import Settings from "../models/Settings.js";
import User from "../models/User.js";
import bcrypt from "bcryptjs";

// Helper function to get or create settings
const getOrCreateSettings = async (userId) => {
  let settings = await Settings.findOne({ userId });

  if (!settings) {
    settings = await Settings.create({
      userId,
      notifications: {
        emailNotifications: true,
        smsNotifications: false,
        placementUpdates: true,
        studentRegistrations: true,
        reportGeneration: false,
        systemMaintenance: true,
        emailConfig: {
          smtpServer: "",
          smtpPort: "",
          emailUsername: "",
          emailPassword: "",
        },
      },
      integrations: {
        resumeParserApi: "",
        thirdPartyApiKey: "",
        smsGateway: "twilio",
        emailProvider: "smtp",
      },
    });
  }

  return settings;
};

// Helper function to encrypt sensitive data
const encryptSensitiveData = async (data, fieldsToEncrypt) => {
  const encryptedData = { ...data };

  for (const field of fieldsToEncrypt) {
    if (encryptedData[field]) {
      encryptedData[field] = await bcrypt.hash(encryptedData[field], 10);
    }
  }

  return encryptedData;
};

// Default notification settings
const defaultNotifications = {
  emailNotifications: true,
  smsNotifications: false,
  placementUpdates: true,
  studentRegistrations: true,
  reportGeneration: false,
  systemMaintenance: true,
  emailConfig: {
    smtpServer: "",
    smtpPort: "",
    emailUsername: "",
    emailPassword: "",
  },
};

// Default integration settings
const defaultIntegrations = {
  resumeParserApi: "",
  thirdPartyApiKey: "",
  smsGateway: "twilio",
  emailProvider: "smtp",
};

// Get all settings for a user
export const getSettings = async (req, res) => {
  try {
    const userId = req.user.userId;

    // Get user profile data
    const user = await User.findById(userId).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Get or create settings
    const settings = await getOrCreateSettings(userId);

    res.json({
      profile: user,
      settings,
    });
  } catch (error) {
    console.error("Get settings error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Update notification settings
export const updateNotifications = async (req, res) => {
  try {
    const userId = req.user.userId;
    const notificationData = req.body;

    // Encrypt email password if provided
    const fieldsToEncrypt = [];
    if (
      notificationData.emailConfig &&
      notificationData.emailConfig.emailPassword
    ) {
      fieldsToEncrypt.push("emailConfig.emailPassword");
    }

    const encryptedNotificationData = await encryptSensitiveData(
      notificationData,
      fieldsToEncrypt
    );

    const settings = await getOrCreateSettings(userId);

    // Merge existing notifications with new data
    settings.notifications = {
      ...settings.notifications.toObject(),
      ...encryptedNotificationData,
    };

    await settings.save();

    res.json({
      message: "Notification settings updated successfully",
      settings: settings.notifications,
    });
  } catch (error) {
    console.error("Update notifications error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Update integration settings
export const updateIntegrations = async (req, res) => {
  try {
    const userId = req.user.userId;
    const integrationData = req.body;

    // Encrypt API keys
    const fieldsToEncrypt = ["resumeParserApi", "thirdPartyApiKey"];
    const encryptedIntegrationData = await encryptSensitiveData(
      integrationData,
      fieldsToEncrypt
    );

    const settings = await getOrCreateSettings(userId);

    // Merge existing integrations with new data
    settings.integrations = {
      ...settings.integrations.toObject(),
      ...encryptedIntegrationData,
    };

    await settings.save();

    res.json({
      message: "Integration settings updated successfully",
      settings: settings.integrations,
    });
  } catch (error) {
    console.error("Update integrations error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Upload logo
export const uploadLogo = async (req, res) => {
  try {
    const userId = req.user.userId;

    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    // Update user profile with new logo path
    const logoPath = `/uploads/${req.file.filename}`;

    await User.findByIdAndUpdate(userId, {
      profileImage: logoPath,
    });

    res.json({
      message: "Logo uploaded successfully",
      logoPath,
    });
  } catch (error) {
    console.error("Upload logo error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
