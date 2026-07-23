import React, { useState, useEffect } from 'react';
import { HiOutlineShoppingBag, HiOutlineTruck, HiOutlineUser, HiOutlineSave } from 'react-icons/hi';
import { getSettings, updateSettings } from '../../api/settingsApi';
import { updateUserProfile, changeUserPassword } from '../../api/authApi';
import { useAppContext } from '../../context/AppContext';
import { toast } from 'react-toastify';

export default function AdminSettingsPage() {
  const { currentAdmin } = useAppContext();
  const [activeTab, setActiveTab] = useState('store');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Settings State
  const [settings, setSettings] = useState({
    storeName: '',
    storeEmail: '',
    storePhone: '',
    storeAddress: '',
    logoUrl: '',
    standardShippingFee: 0,
    freeShippingThreshold: 0
  });
  const [initialSettings, setInitialSettings] = useState(null);

  // Profile State
  const [profile, setProfile] = useState({
    fullname: '',
    email: '',
    phoneNumber: ''
  });
  const [initialProfile, setInitialProfile] = useState(null);

  // Password State
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  useEffect(() => {
    fetchData();
    if (currentAdmin) {
      const initialProf = {
        fullname: currentAdmin.fullname || '',
        email: currentAdmin.email || '',
        phoneNumber: currentAdmin.phoneNumber || ''
      };
      setProfile(initialProf);
      setInitialProfile(initialProf);
    }
  }, [currentAdmin]);

  const fetchData = async () => {
    setIsLoading(true);
    const res = await getSettings();
    if (res.success && res.settings) {
      setSettings(res.settings);
      setInitialSettings(res.settings);
    } else if (res.error) {
      toast.error(res.error);
    }
    setIsLoading(false);
  };

  const handleSettingsChange = (e) => {
    const { name, value } = e.target;
    setSettings(prev => ({ ...prev, [name]: value }));
  };

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordForm(prev => ({ ...prev, [name]: value }));
  };

  const hasSettingsChanged = () => {
    if (!initialSettings) return false;
    return (
      settings.storeName !== initialSettings.storeName ||
      settings.storeEmail !== initialSettings.storeEmail ||
      settings.storePhone !== initialSettings.storePhone ||
      settings.storeAddress !== initialSettings.storeAddress ||
      settings.logoUrl !== initialSettings.logoUrl ||
      Number(settings.standardShippingFee) !== Number(initialSettings.standardShippingFee) ||
      Number(settings.freeShippingThreshold) !== Number(initialSettings.freeShippingThreshold)
    );
  };

  const hasProfileChanged = () => {
    if (!initialProfile) return false;
    return (
      profile.fullname !== initialProfile.fullname ||
      profile.email !== initialProfile.email ||
      profile.phoneNumber !== initialProfile.phoneNumber
    );
  };

  const handleSaveSettings = async (e) => {
    e.preventDefault();
    if (!hasSettingsChanged()) {
      toast.info('No changes detected');
      return;
    }
    setIsSaving(true);
    const res = await updateSettings(settings);
    if (res.success) {
      toast.success('Store settings updated successfully');
      setInitialSettings(settings);
    } else {
      toast.error(res.error);
    }
    setIsSaving(false);
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    if (!currentAdmin) return;
    if (!hasProfileChanged()) {
      toast.info('No changes detected');
      return;
    }
    setIsSaving(true);
    const res = await updateUserProfile(currentAdmin.id, profile.fullname, profile.email, profile.phoneNumber);
    if (res.success) {
      toast.success('Admin profile updated successfully. Please refresh to see changes globally.');
      setInitialProfile(profile);
    } else {
      toast.error(res.error);
    }
    setIsSaving(false);
  };

  const handleSavePassword = async (e) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      return toast.error('New passwords do not match');
    }
    if (!currentAdmin) return;
    
    setIsSaving(true);
    const res = await changeUserPassword(currentAdmin.id, passwordForm.currentPassword, passwordForm.newPassword);
    if (res.success) {
      toast.success('Password changed successfully');
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } else {
      toast.error(res.error);
    }
    setIsSaving(false);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white tracking-tight">System Settings</h1>
        <p className="text-slate-400 mt-2">Manage your store preferences, shipping rates, and admin account.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        
        {/* Vertical Tabs Navigation */}
        <div className="w-full md:w-64 flex-shrink-0 space-y-1">
          <button 
            onClick={() => setActiveTab('store')}
            className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-all ${
              activeTab === 'store' 
                ? 'bg-orange-500/10 text-orange-500 border border-orange-500/20 shadow-sm' 
                : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200 border border-transparent'
            }`}
          >
            <HiOutlineShoppingBag className={`w-5 h-5 ${activeTab === 'store' ? 'text-orange-500' : 'text-slate-500'}`} />
            Store Information
          </button>
          
          <button 
            onClick={() => setActiveTab('shipping')}
            className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-all ${
              activeTab === 'shipping' 
                ? 'bg-orange-500/10 text-orange-500 border border-orange-500/20 shadow-sm' 
                : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200 border border-transparent'
            }`}
          >
            <HiOutlineTruck className={`w-5 h-5 ${activeTab === 'shipping' ? 'text-orange-500' : 'text-slate-500'}`} />
            Shipping & Tax
          </button>

          <button 
            onClick={() => setActiveTab('profile')}
            className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-all ${
              activeTab === 'profile' 
                ? 'bg-orange-500/10 text-orange-500 border border-orange-500/20 shadow-sm' 
                : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200 border border-transparent'
            }`}
          >
            <HiOutlineUser className={`w-5 h-5 ${activeTab === 'profile' ? 'text-orange-500' : 'text-slate-500'}`} />
            Admin Profile
          </button>
        </div>

        {/* Tab Content Area */}
        <div className="flex-1 bg-slate-900 border border-slate-800 rounded-2xl p-6 md:p-8 shadow-xl relative overflow-hidden">
          {/* Decorative Glow */}
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-orange-500/5 rounded-full blur-3xl pointer-events-none"></div>

          {/* Store Info Tab */}
          {activeTab === 'store' && (
            <div className="animate-fade-in relative z-10">
              <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
                <HiOutlineShoppingBag className="w-6 h-6 text-slate-400" />
                Store Information
              </h2>
              <form onSubmit={handleSaveSettings} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-slate-300">Store Name</label>
                    <input type="text" name="storeName" value={settings.storeName} onChange={handleSettingsChange} className="w-full bg-slate-950 border border-slate-700 text-white rounded-lg px-4 py-2.5 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-colors" />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-slate-300">Contact Email</label>
                    <input type="email" name="storeEmail" value={settings.storeEmail} onChange={handleSettingsChange} className="w-full bg-slate-950 border border-slate-700 text-white rounded-lg px-4 py-2.5 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-colors" />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-slate-300">Hotline / Phone Number</label>
                    <input type="text" name="storePhone" value={settings.storePhone} onChange={handleSettingsChange} className="w-full bg-slate-950 border border-slate-700 text-white rounded-lg px-4 py-2.5 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-colors" />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-slate-300">Logo URL</label>
                    <input type="text" name="logoUrl" value={settings.logoUrl} onChange={handleSettingsChange} placeholder="https://..." className="w-full bg-slate-950 border border-slate-700 text-white rounded-lg px-4 py-2.5 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-colors" />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <label className="block text-sm font-medium text-slate-300">Store Address</label>
                    <textarea name="storeAddress" value={settings.storeAddress} onChange={handleSettingsChange} rows="2" className="w-full bg-slate-950 border border-slate-700 text-white rounded-lg px-4 py-2.5 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-colors resize-none"></textarea>
                  </div>
                </div>
                <div className="pt-4 border-t border-slate-800 flex justify-end">
                  <button type="submit" disabled={isSaving || !hasSettingsChanged()} className="flex items-center gap-2 bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-500 hover:to-orange-400 text-white px-6 py-2.5 rounded-lg font-medium transition-all shadow-lg shadow-orange-500/20 disabled:opacity-50 disabled:pointer-events-none">
                    <HiOutlineSave className="w-5 h-5" />
                    {isSaving ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Shipping Tab */}
          {activeTab === 'shipping' && (
            <div className="animate-fade-in relative z-10">
              <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
                <HiOutlineTruck className="w-6 h-6 text-slate-400" />
                Shipping & Tax
              </h2>
              <form onSubmit={handleSaveSettings} className="space-y-6">
                <div className="bg-slate-800/30 border border-slate-700/50 rounded-xl p-5">
                  <p className="text-sm text-slate-400 mb-4">Configure the shipping fees that will be applied to customer orders during checkout.</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-slate-300">Standard Shipping Fee ($)</label>
                      <input type="number" step="0.01" min="0" name="standardShippingFee" value={settings.standardShippingFee} onChange={handleSettingsChange} className="w-full bg-slate-950 border border-slate-700 text-white rounded-lg px-4 py-2.5 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-colors font-mono text-lg" />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-slate-300">Free Shipping Threshold ($)</label>
                      <input type="number" step="0.01" min="0" name="freeShippingThreshold" value={settings.freeShippingThreshold} onChange={handleSettingsChange} className="w-full bg-slate-950 border border-slate-700 text-white rounded-lg px-4 py-2.5 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors font-mono text-lg text-emerald-400" />
                      <p className="text-xs text-slate-500">Orders above this amount will get free shipping.</p>
                    </div>
                  </div>
                </div>
                <div className="pt-4 flex justify-end">
                  <button type="submit" disabled={isSaving || !hasSettingsChanged()} className="flex items-center gap-2 bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-500 hover:to-orange-400 text-white px-6 py-2.5 rounded-lg font-medium transition-all shadow-lg shadow-orange-500/20 disabled:opacity-50 disabled:pointer-events-none">
                    <HiOutlineSave className="w-5 h-5" />
                    {isSaving ? 'Saving...' : 'Save Settings'}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <div className="animate-fade-in relative z-10 space-y-10">
              
              {/* Profile Info Form */}
              <section>
                <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
                  <HiOutlineUser className="w-6 h-6 text-slate-400" />
                  Personal Information
                </h2>
                <form onSubmit={handleSaveProfile} className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-slate-300">Full Name</label>
                      <input type="text" name="fullname" value={profile.fullname} onChange={handleProfileChange} required className="w-full bg-slate-950 border border-slate-700 text-white rounded-lg px-4 py-2.5 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-colors" />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-slate-300">Email Address</label>
                      <input type="email" name="email" value={profile.email} onChange={handleProfileChange} required className="w-full bg-slate-950 border border-slate-700 text-white rounded-lg px-4 py-2.5 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-colors" />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <label className="block text-sm font-medium text-slate-300">Phone Number</label>
                      <input type="text" name="phoneNumber" value={profile.phoneNumber} onChange={handleProfileChange} className="w-full bg-slate-950 border border-slate-700 text-white rounded-lg px-4 py-2.5 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-colors md:w-1/2" />
                    </div>
                  </div>
                  <div className="flex justify-start">
                    <button type="submit" disabled={isSaving || !hasProfileChanged()} className="bg-slate-800 hover:bg-slate-700 text-white px-6 py-2 rounded-lg font-medium transition-colors border border-slate-700 disabled:opacity-50 disabled:pointer-events-none">
                      Update Profile
                    </button>
                  </div>
                </form>
              </section>

              <hr className="border-slate-800" />

              {/* Password Form */}
              <section>
                <h3 className="text-lg font-medium text-white mb-4">Change Password</h3>
                <form onSubmit={handleSavePassword} className="space-y-5 max-w-md">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-slate-300">Current Password</label>
                    <input type="password" name="currentPassword" value={passwordForm.currentPassword} onChange={handlePasswordChange} required className="w-full bg-slate-950 border border-slate-700 text-white rounded-lg px-4 py-2.5 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-colors" />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-slate-300">New Password</label>
                    <input type="password" name="newPassword" value={passwordForm.newPassword} onChange={handlePasswordChange} required minLength={6} className="w-full bg-slate-950 border border-slate-700 text-white rounded-lg px-4 py-2.5 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-colors" />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-slate-300">Confirm New Password</label>
                    <input type="password" name="confirmPassword" value={passwordForm.confirmPassword} onChange={handlePasswordChange} required minLength={6} className="w-full bg-slate-950 border border-slate-700 text-white rounded-lg px-4 py-2.5 focus:border-rose-500 focus:ring-1 focus:ring-rose-500 transition-colors" />
                  </div>
                  <div className="flex justify-start pt-2">
                    <button type="submit" disabled={isSaving} className="bg-rose-500/10 text-rose-500 border border-rose-500/20 hover:bg-rose-500 hover:text-white px-6 py-2 rounded-lg font-medium transition-colors disabled:opacity-70">
                      Update Password
                    </button>
                  </div>
                </form>
              </section>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
