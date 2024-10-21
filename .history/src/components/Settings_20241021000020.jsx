import React, { useState, useEffect } from 'react';
import { Save, Moon, Sun, Bell, User, Lock, Globe, HelpCircle, LogOut } from 'lucide-react';
import Navbar from './NavBar';
import { db, auth } from '../Firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { updatePassword, signOut } from 'firebase/auth';
import { Toaster, toast } from 'sonner';
import { useTheme } from '../ThemeContext';

function Settings() {
  const { theme, toggleTheme } = useTheme();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [settings, setSettings] = useState({
    language: 'en',
    notifications: {
      email: true,
      push: true,
      sms: false,
    },
    dataUsage: 'wifi',
    fontSize: 'medium',
  });
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  useEffect(() => {
    fetchUserSettings();
  }, []);

  const fetchUserSettings = async () => {
    try {
      const user = auth.currentUser;
      if (user) {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          setSettings(userDoc.data().settings || {});
        }
      }
    } catch (error) {
      console.error('Error fetching user settings:', error);
      toast.error('Failed to load settings. Please try again.');
    }
  };

  const handleSettingChange = (category, setting, value) => {
    setSettings(prevSettings => ({
      ...prevSettings,
      [category]: category === 'notifications'
        ? { ...prevSettings[category], [setting]: value }
        : value
    }));
  };

  const saveSettings = async () => {
    try {
      const user = auth.currentUser;
      if (user) {
        await updateDoc(doc(db, 'users', user.uid), { settings });
        toast.success('Settings saved successfully!');
      }
    } catch (error) {
      console.error('Error saving settings:', error);
      toast.error('Failed to save settings. Please try again.');
    }
  };

  const handlePasswordChange = async () => {
    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match.');
      return;
    }
    try {
      const user = auth.currentUser;
      await updatePassword(user, newPassword);
      toast.success('Password updated successfully!');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error) {
      console.error('Error updating password:', error);
      toast.error('Failed to update password. Please try again.');
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast.success('Logged out successfully!');
      // Redirect to login page or handle logout in your app's routing
    } catch (error) {
      console.error('Error signing out:', error);
      toast.error('Failed to log out. Please try again.');
    }
  };

  return (
    <div className={`min-h-screen flex ${theme === 'dark' ? 'dark' : ''}`}>
      <Toaster position="bottom-right" />
      <Navbar sidebarOpen={sidebarOpen} toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
      
      <main className="flex-1 p-6 lg:p-10 bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-white">
        <h1 className="text-4xl font-bold mb-8">Settings</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Theme Settings */}
          <section className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-4 flex items-center">
              <Sun className="mr-2" /> Appearance
            </h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span>Theme</span>
                <button
                  onClick={toggleTheme}
                  className="p-2 bg-gray-200 dark:bg-gray-700 rounded-full"
                >
                  {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
                </button>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Font Size</label>
                <select
                  value={settings.fontSize}
                  onChange={(e) => handleSettingChange('fontSize', null, e.target.value)}
                  className="w-full p-2 border rounded-md bg-gray-50 dark:bg-gray-700"
                >
                  <option value="small">Small</option>
                  <option value="medium">Medium</option>
                  <option value="large">Large</option>
                </select>
              </div>
            </div>
          </section>

          {/* Notification Settings */}
          <section className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-4 flex items-center">
              <Bell className="mr-2" /> Notifications
            </h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span>Email Notifications</span>
                <label className="switch">
                  <input
                    type="checkbox"
                    checked={settings.notifications.email}
                    onChange={(e) => handleSettingChange('notifications', 'email', e.target.checked)}
                  />
                  <span className="slider round"></span>
                </label>
              </div>
              <div className="flex items-center justify-between">
                <span>Push Notifications</span>
                <label className="switch">
                  <input
                    type="checkbox"
                    checked={settings.notifications.push}
                    onChange={(e) => handleSettingChange('notifications', 'push', e.target.checked)}
                  />
                  <span className="slider round"></span>
                </label>
              </div>
              <div className="flex items-center justify-between">
                <span>SMS Notifications</span>
                <label className="switch">
                  <input
                    type="checkbox"
                    checked={settings.notifications.sms}
                    onChange={(e) => handleSettingChange('notifications', 'sms', e.target.checked)}
                  />
                  <span className="slider round"></span>
                </label>
              </div>
            </div>
          </section>

          {/* Account Settings */}
          <section className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-4 flex items-center">
              <User className="mr-2" /> Account
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">New Password</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full p-2 border rounded-md bg-gray-50 dark:bg-gray-700"
                  placeholder="Enter new password"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Confirm Password</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full p-2 border rounded-md bg-gray-50 dark:bg-gray-700"
                  placeholder="Confirm new password"
                />
              </div>
              <button
                onClick={handlePasswordChange}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-300"
              >
                Change Password
              </button>
            </div>
          </section>

          {/* General Settings */}
          <section className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-4 flex items-center">
              <Globe className="mr-2" /> General
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Language</label>
                <select
                  value={settings.language}
                  onChange={(e) => handleSettingChange('language', null, e.target.value)}
                  className="w-full p-2 border rounded-md bg-gray-50 dark:bg-gray-700"
                >
                  <option value="en">English</option>
                  <option value="es">Español</option>
                  <option value="fr">Français</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Data Usage</label>
                <select
                  value={settings.dataUsage}
                  onChange={(e) => handleSettingChange('dataUsage', null, e.target.value)}
                  className="w-full p-2 border rounded-md bg-gray-50 dark:bg-gray-700"
                >
                  <option value="wifi">Wi-Fi Only</option>
                  <option value="cellular">Cellular Data</option>
                  <option value="both">Both Wi-Fi and Cellular</option>
                </select>
              </div>
            </div>
          </section>
        </div>

        <div className="mt-8 flex justify-between">
          <button
            onClick={saveSettings}
            className="bg-green-600 text-white py-2 px-6 rounded-md hover:bg-green-700 transition duration-300 flex items-center"
          >
            <Save className="mr-2" /> Save Settings
          </button>
          <button
            onClick={handleLogout}
            className="bg-red-600 text-white py-2 px-6 rounded-md hover:bg-red-700 transition duration-300 flex items-center"
          >
            <LogOut className="mr-2" /> Logout
          </button>
        </div>
      </main>
    </div>
  );
}

export default Settings;