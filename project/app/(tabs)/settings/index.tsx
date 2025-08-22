import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Switch } from 'react-native';
import { User, Bell, Shield, CircleHelp as HelpCircle, Globe, Palette, ChevronRight, CreditCard as Edit3 } from 'lucide-react-native';

export default function SettingsScreen() {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [darkModeEnabled, setDarkModeEnabled] = useState(false);

  const SettingsItem = ({ 
    icon: Icon, 
    title, 
    subtitle, 
    onPress, 
    showSwitch = false, 
    switchValue, 
    onSwitchChange 
  }: {
    icon: any;
    title: string;
    subtitle?: string;
    onPress?: () => void;
    showSwitch?: boolean;
    switchValue?: boolean;
    onSwitchChange?: (value: boolean) => void;
  }) => (
    <TouchableOpacity 
      style={styles.settingsItem} 
      onPress={onPress}
      disabled={showSwitch}
      activeOpacity={showSwitch ? 1 : 0.7}
    >
      <View style={styles.settingsIcon}>
        <Icon size={22} color="#25D366" />
      </View>
      <View style={styles.settingsInfo}>
        <Text style={styles.settingsTitle}>{title}</Text>
        {subtitle && <Text style={styles.settingsSubtitle}>{subtitle}</Text>}
      </View>
      {showSwitch ? (
        <Switch
          value={switchValue}
          onValueChange={onSwitchChange}
          trackColor={{ false: '#e5e5e5', true: '#25D366' }}
          thumbColor={switchValue ? '#ffffff' : '#ffffff'}
        />
      ) : (
        <ChevronRight size={20} color="#8e8e93" />
      )}
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>সেটিংস</Text>
      </View>

      {/* Profile Section */}
      <View style={styles.profileSection}>
        <Image 
          source={{ uri: 'https://images.pexels.com/photos/1674752/pexels-photo-1674752.jpeg?auto=compress&cs=tinysrgb&w=100' }}
          style={styles.profileAvatar}
        />
        <View style={styles.profileInfo}>
          <Text style={styles.profileName}>আমার নাম</Text>
          <Text style={styles.profileStatus}>আমি ব্যস্ত আছি...</Text>
        </View>
        <TouchableOpacity style={styles.editProfile}>
          <Edit3 size={20} color="#25D366" />
        </TouchableOpacity>
      </View>

      {/* Settings Categories */}
      <View style={styles.settingsSection}>
        <SettingsItem
          icon={User}
          title="অ্যাকাউন্ট"
          subtitle="নিরাপত্তা, দুই ধাপের যাচাইকরণ"
        />
        <SettingsItem
          icon={Shield}
          title="গোপনীয়তা"
          subtitle="শেষ দেখার সময়, প্রোফাইল ফটো"
        />
        <SettingsItem
          icon={Bell}
          title="নোটিফিকেশন"
          subtitle="বার্তা, গ্রুপ ও কল টোন"
          showSwitch={true}
          switchValue={notificationsEnabled}
          onSwitchChange={setNotificationsEnabled}
        />
        <SettingsItem
          icon={Palette}
          title="ডার্ক মোড"
          subtitle="অন্ধকার থিম ব্যবহার করুন"
          showSwitch={true}
          switchValue={darkModeEnabled}
          onSwitchChange={setDarkModeEnabled}
        />
        <SettingsItem
          icon={Globe}
          title="ভাষা"
          subtitle="বাংলা"
        />
        <SettingsItem
          icon={HelpCircle}
          title="সাহায্য"
          subtitle="সাহায্য কেন্দ্র, যোগাযোগ করুন"
        />
      </View>

      {/* App Info */}
      <View style={styles.appInfo}>
        <Text style={styles.appName}>Sohoj Calling</Text>
        <Text style={styles.appVersion}>সংস্করণ 1.0.0</Text>
        <Text style={styles.appDescription}>
          সহজ ও নিরাপদ মেসেজিং অ্যাপ
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e5e5',
    backgroundColor: '#25D366',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e5e5',
  },
  profileAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 16,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 4,
  },
  profileStatus: {
    fontSize: 14,
    color: '#8e8e93',
  },
  editProfile: {
    padding: 8,
  },
  settingsSection: {
    paddingVertical: 8,
  },
  settingsItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 0.5,
    borderBottomColor: '#e8e8e8',
  },
  settingsIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  settingsInfo: {
    flex: 1,
  },
  settingsTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000000',
    marginBottom: 2,
  },
  settingsSubtitle: {
    fontSize: 14,
    color: '#8e8e93',
  },
  appInfo: {
    paddingHorizontal: 16,
    paddingVertical: 32,
    alignItems: 'center',
  },
  appName: {
    fontSize: 20,
    fontWeight: '600',
    color: '#25D366',
    marginBottom: 8,
  },
  appVersion: {
    fontSize: 14,
    color: '#8e8e93',
    marginBottom: 8,
  },
  appDescription: {
    fontSize: 14,
    color: '#8e8e93',
    textAlign: 'center',
  },
});