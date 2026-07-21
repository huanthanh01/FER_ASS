const Settings = require('../models/Settings');

const settingsController = {
  // Get Settings (will create default if doesn't exist)
  getSettings: async (req, res) => {
    try {
      let settings = await Settings.findOne();
      
      // Create default settings if not exists
      if (!settings) {
        settings = new Settings({});
        await settings.save();
      }
      
      res.json({ success: true, settings });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, error: 'Failed to fetch settings' });
    }
  },

  // Update Settings
  updateSettings: async (req, res) => {
    try {
      let settings = await Settings.findOne();
      
      if (!settings) {
        settings = new Settings({});
      }

      // Update fields
      const { 
        storeName, storeEmail, storePhone, storeAddress, logoUrl, 
        standardShippingFee, freeShippingThreshold 
      } = req.body;

      if (storeName !== undefined) settings.storeName = storeName;
      if (storeEmail !== undefined) settings.storeEmail = storeEmail;
      if (storePhone !== undefined) settings.storePhone = storePhone;
      if (storeAddress !== undefined) settings.storeAddress = storeAddress;
      if (logoUrl !== undefined) settings.logoUrl = logoUrl;
      if (standardShippingFee !== undefined) settings.standardShippingFee = Number(standardShippingFee);
      if (freeShippingThreshold !== undefined) settings.freeShippingThreshold = Number(freeShippingThreshold);

      await settings.save();
      
      res.json({ success: true, settings });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, error: 'Failed to update settings' });
    }
  }
};

module.exports = settingsController;
