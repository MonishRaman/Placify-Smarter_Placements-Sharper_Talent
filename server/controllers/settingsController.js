import Settings from "../models/Settings.js";
import User from "../models/User.js";
import bcrypt from "bcryptjs";

/* -------------------- Helper Functions -------------------- */

// Get or create settings for a user
const getOrCreateSettings = async (userId) => {
  let settings = await Settings.findOne({ userId });

  if (!settings) {
    settings = await Settings.create({
      userId,
      notifications: { ...defaultNotifications },
      integrations: { ...defaultIntegrations },
    });
  }

  return settings;
};

// Encrypt sensitive fields
const encryptSensitiveData = async (data, fieldsToEncrypt) => {
  const encryptedData = { ...data };

  for (const field of fieldsToEncrypt) {
    if (encryptedData[field]) {
      encryptedData[field] = await bcrypt.hash(encryptedData[field], 10);
    }
  }

  return encryptedData;
};

/* -------------------- Default Settings -------------------- */

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

const defaultIntegrations = {
  resumeParserApi: "",
  thirdPartyApiKey: "",
  smsGateway: "twilio",
  emailProvider: "smtp",
};

/* -------------------- Controller Functions -------------------- */

// Get user profile and settings
export const getSettings = async (req, res) => {
  try {
    const { userId } = req.user;

    const user = await User.findById(userId).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });

    const settings = await getOrCreateSettings(userId);

    res.json({ profile: user, settings });
  } catch (error) {
    console.error("Get settings error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Update notification settings
export const updateNotifications = async (req, res) => {
  try {
    const { userId } = req.user;
    const notificationData = req.body;

    const fieldsToEncrypt = notificationData?.emailConfig?.emailPassword
      ? ["emailConfig.emailPassword"]
      : [];

    const encryptedNotificationData = await encryptSensitiveData(
      notificationData,
      fieldsToEncrypt
    );

    const settings = await getOrCreateSettings(userId);

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
    const { userId } = req.user;
    const integrationData = req.body;

    const fieldsToEncrypt = ["resumeParserApi", "thirdPartyApiKey"];
    const encryptedIntegrationData = await encryptSensitiveData(
      integrationData,
      fieldsToEncrypt
    );

    const settings = await getOrCreateSettings(userId);

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

// Upload profile logo
export const uploadLogo = async (req, res) => {
  try {
    const { userId } = req.user;

    if (!req.file) return res.status(400).json({ message: "No file uploaded" });

    const logoPath = `/uploads/${req.file.filename}`;
    await User.findByIdAndUpdate(userId, { profileImage: logoPath });

    res.json({ message: "Logo uploaded successfully", logoPath });
  } catch (error) {
    console.error("Upload logo error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
