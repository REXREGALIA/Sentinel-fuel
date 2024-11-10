import React, { useState, useEffect } from 'react';
import { Save, Moon, Sun, Bell, User, Lock, Globe, HelpCircle, LogOut } from 'lucide-react';
import Navbar from './NavBar';
import { db, auth } from '../Firebase';
import { doc, getDoc, updateDoc, setDoc } from 'firebase/firestore';
import { updatePassword, signOut } from 'firebase/auth';
import { Toaster, toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

// Step 1: Define defaultSettings OUTSIDE the component
const defaultSettings = {
  theme: 'dark',
  notifications: true,
  emailNotifications: true,
  language: 'en'
};

function Settings() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [settings, setSettings] = useState(defaultSettings);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigate = useNavigate();

  // Step 2: Create function to fetch user settings
  const fetchUserSettings = async () => {
    try {
      setLoading(true);
      // Get current user
      const user = auth.currentUser;
      
      if (!user) {
        throw new Error('No user logged in');
      }

      // Get user document from Firestore
      const userDocRef = doc(db, 'users', user.uid);
      const userDoc = await getDoc(userDocRef);

      if (!userDoc.exists()) {
        // If no settings exist, create default ones
        await setDoc(userDocRef, {
          email: user.email,
          settings: defaultSettings,
          createdAt: new Date().toISOString()
        });
        setSettings(defaultSettings);
      } else {
        // If settings exist, use them
        const userData = userDoc.data();
        setSettings(userData.settings || defaultSettings);
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
      setError(error.message);
      toast.error('Failed to load settings');
    } finally {
      setLoading(false);
    }
  };

  // Step 3: Use useEffect to fetch settings on component mount
  useEffect(() => {
    fetchUserSettings();
  }, []);

  // Step 4: Function to save settings
  const saveSettings = async (newSettings) => {
    try {
      const user = auth.currentUser;
      if (!user) {
        throw new Error('No user logged in');
      }

      const userDocRef = doc(db, 'users', user.uid);
      
      // Create or update the user document
      await setDoc(userDocRef, {
        settings: newSettings,
        updatedAt: new Date().toISOString()
      }, { merge: true });

      setSettings(newSettings);
      toast.success('Settings saved successfully');
    } catch (error) {
      console.error('Error saving settings:', error);
      toast.error('Failed to save settings');
      throw error;
    }
  };

  const handleSettingChange = async (setting, value) => {
    try {
      const newSettings = {
        ...settings,
        [setting]: value
      };
      await saveSettings(newSettings);
    } catch (error) {
      console.error('Error updating setting:', error);
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
      navigate('/login');
    } catch (error) {
      console.error('Error signing out:', error);
      toast.error('Failed to log out. Please try again.');
    }
  };

  if (loading) return <div>Loading settings...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="bg-gray-100 dark:bg-gray-900 min-h-screen flex">
      <Toaster position="bottom-right" />
      <Navbar sidebarOpen={sidebarOpen} toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
      
      <main className="flex-1 p-6 lg:p-10">
        <h1 className="text-4xl font-bold mb-8 text-gray-800 dark:text-white">Settings</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Theme Settings */}
          <section className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-4 flex items-center text-gray-800 dark:text-white">
              <Sun className="mr-2" /> Appearance
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Theme</label>
                <select
                  value={settings.theme}
                  onChange={(e) => handleSettingChange('theme', e.target.value)}
                  className="w-full p-2 border rounded-md bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-white"
                >
                  <option value="dark">Dark</option>
                  <option value="light">Light</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Font Size</label>
                <select
                  value={settings.fontSize}
                  onChange={(e) => handleSettingChange('fontSize', null, e.target.value)}
                  className="w-full p-2 border rounded-md bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-white"
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
            <h2 className="text-2xl font-semibold mb-4 flex items-center text-gray-800 dark:text-white">
              <Bell className="mr-2" /> Notifications
            </h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-700 dark:text-gray-300">Email Notifications</span>
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
                <span className="text-gray-700 dark:text-gray-300">Push Notifications</span>
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
                <span className="text-gray-700 dark:text-gray-300">SMS Notifications</span>
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
            <h2 className="text-2xl font-semibold mb-4 flex items-center text-gray-800 dark:text-white">
              <User className="mr-2" /> Account
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">New Password</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full p-2 border rounded-md bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-white"
                  placeholder="Enter new password"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Confirm Password</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full p-2 border rounded-md bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-white"
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
            <h2 className="text-2xl font-semibold mb-4 flex items-center text-gray-800 dark:text-white">
              <Globe className="mr-2" /> General
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Language</label>
                <select
                  value={settings.language}
                  onChange={(e) => handleSettingChange('language', null, e.target.value)}
                  className="w-full p-2 border rounded-md bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-white"
                >
                  <option value="en">English</option>
                  <option value="es">Español</option>
                  <option value="fr">Français</option>
                  {/* Add more language options as needed */}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Data Usage</label>
                <select
                  value={settings.dataUsage}
                  onChange={(e) => handleSettingChange('dataUsage', null, e.target.value)}
                  className="w-full p-2 border rounded-md bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-white"
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