import mongoose from "mongoose";

const settingsSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  notifications: {
    emailNotifications: { type: Boolean, default: true },
    smsNotifications: { type: Boolean, default: false },
    placementUpdates: { type: Boolean, default: true },
    studentRegistrations: { type: Boolean, default: true },
    reportGeneration: { type: Boolean, default: false },
    systemMaintenance: { type: Boolean, default: true },
    emailConfig: {
      smtpServer: { type: String, default: '' },
      smtpPort: { type: String, default: '' },
      emailUsername: { type: String, default: '' },
      emailPassword: { type: String, default: '' } // This should be encrypted
    }
  },
  integrations: {
    resumeParserApi: { type: String, default: '' },
    thirdPartyApiKey: { type: String, default: '' },
    smsGateway: { type: String, default: 'twilio' },
    emailProvider: { type: String, default: 'smtp' }
  }
}, {
  timestamps: true
});

export default mongoose.model("Settings", settingsSchema);