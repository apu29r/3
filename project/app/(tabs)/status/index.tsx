import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { Plus, Eye } from 'lucide-react-native';

interface Status {
  id: string;
  name: string;
  avatar: string;
  time: string;
  viewed: boolean;
  isMyStatus?: boolean;
}

const MOCK_STATUSES: Status[] = [
  {
    id: 'my-status',
    name: 'My Status',
    avatar: 'https://images.pexels.com/photos/1674752/pexels-photo-1674752.jpeg?auto=compress&cs=tinysrgb&w=100',
    time: 'Tap to add status update',
    viewed: false,
    isMyStatus: true,
  },
  {
    id: '1',
    name: 'রহিম ভাই',
    avatar: 'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=100',
    time: '30 minutes ago',
    viewed: false,
  },
  {
    id: '2',
    name: 'সারা আপু',
    avatar: 'https://images.pexels.com/photos/762020/pexels-photo-762020.jpeg?auto=compress&cs=tinysrgb&w=100',
    time: '1 hour ago',
    viewed: true,
  },
  {
    id: '3',
    name: 'করিম উদ্দিন',
    avatar: 'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=100',
    time: '2 hours ago',
    viewed: false,
  },
];

export default function StatusScreen() {
  const [statuses] = useState<Status[]>(MOCK_STATUSES);

  const myStatus = statuses.find(s => s.isMyStatus);
  const otherStatuses = statuses.filter(s => !s.isMyStatus);
  const recentUpdates = otherStatuses.filter(s => !s.viewed);
  const viewedUpdates = otherStatuses.filter(s => s.viewed);

  const renderStatusItem = (item: Status, showAddIcon = false) => (
    <TouchableOpacity key={item.id} style={styles.statusItem} activeOpacity={0.7}>
      <View style={styles.avatarContainer}>
        <Image source={{ uri: item.avatar }} style={styles.avatar} />
        {showAddIcon && (
          <View style={styles.addIcon}>
            <Plus size={16} color="#ffffff" />
          </View>
        )}
        {!item.viewed && !item.isMyStatus && <View style={styles.unviewedRing} />}
      </View>
      <View style={styles.statusInfo}>
        <Text style={styles.statusName}>{item.name}</Text>
        <Text style={styles.statusTime}>{item.time}</Text>
      </View>
      {!item.isMyStatus && (
        <View style={styles.viewIcon}>
          <Eye size={16} color="#8e8e93" />
        </View>
      )}
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>স্ট্যাটাস</Text>
      </View>

      {myStatus && (
        <View style={styles.section}>
          {renderStatusItem(myStatus, true)}
        </View>
      )}

      {recentUpdates.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>সাম্প্রতিক আপডেট</Text>
          {recentUpdates.map(item => renderStatusItem(item))}
        </View>
      )}

      {viewedUpdates.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>দেখা হয়েছে</Text>
          {viewedUpdates.map(item => renderStatusItem(item))}
        </View>
      )}
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
  section: {
    paddingVertical: 8,
  },
  sectionTitle: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    fontSize: 14,
    fontWeight: '600',
    color: '#8e8e93',
    textTransform: 'uppercase',
    backgroundColor: '#f8f8f8',
  },
  statusItem: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    alignItems: 'center',
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 12,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  addIcon: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#25D366',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#ffffff',
  },
  unviewedRing: {
    position: 'absolute',
    top: -3,
    left: -3,
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 3,
    borderColor: '#25D366',
  },
  statusInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  statusName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 2,
  },
  statusTime: {
    fontSize: 14,
    color: '#8e8e93',
  },
  viewIcon: {
    padding: 8,
  },
});