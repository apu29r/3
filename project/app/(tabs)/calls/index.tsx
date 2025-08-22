import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image } from 'react-native';
import { Phone, Video, PhoneIncoming, PhoneOutgoing, PhoneMissed } from 'lucide-react-native';

interface CallRecord {
  id: string;
  name: string;
  avatar: string;
  type: 'incoming' | 'outgoing' | 'missed';
  callType: 'voice' | 'video';
  time: string;
  duration?: string;
}

const MOCK_CALLS: CallRecord[] = [
  {
    id: '1',
    name: 'রহিম ভাই',
    avatar: 'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=100',
    type: 'outgoing',
    callType: 'voice',
    time: '2 hours ago',
    duration: '12:34',
  },
  {
    id: '2',
    name: 'সারা আপু',
    avatar: 'https://images.pexels.com/photos/762020/pexels-photo-762020.jpeg?auto=compress&cs=tinysrgb&w=100',
    type: 'incoming',
    callType: 'video',
    time: 'Yesterday',
    duration: '8:45',
  },
  {
    id: '3',
    name: 'করিম উদ্দিন',
    avatar: 'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=100',
    type: 'missed',
    callType: 'voice',
    time: '2 days ago',
  },
  {
    id: '4',
    name: 'অফিস টিম',
    avatar: 'https://images.pexels.com/photos/1181424/pexels-photo-1181424.jpeg?auto=compress&cs=tinysrgb&w=100',
    type: 'incoming',
    callType: 'video',
    time: '3 days ago',
    duration: '25:12',
  },
];

export default function CallsScreen() {
  const [calls] = useState<CallRecord[]>(MOCK_CALLS);

  const getCallIcon = (type: string, callType: string) => {
    const color = type === 'missed' ? '#ff3b30' : '#25D366';
    const size = 16;

    if (type === 'incoming') {
      return <PhoneIncoming size={size} color={color} />;
    } else if (type === 'outgoing') {
      return <PhoneOutgoing size={size} color={color} />;
    } else {
      return <PhoneMissed size={size} color={color} />;
    }
  };

  const renderCallItem = ({ item }: { item: CallRecord }) => (
    <TouchableOpacity style={styles.callItem} activeOpacity={0.7}>
      <Image source={{ uri: item.avatar }} style={styles.avatar} />
      <View style={styles.callInfo}>
        <View style={styles.callHeader}>
          <Text style={[
            styles.callerName,
            item.type === 'missed' && styles.missedCall
          ]}>
            {item.name}
          </Text>
          <TouchableOpacity style={styles.callButton}>
            {item.callType === 'video' ? (
              <Video size={20} color="#25D366" />
            ) : (
              <Phone size={20} color="#25D366" />
            )}
          </TouchableOpacity>
        </View>
        <View style={styles.callDetails}>
          <View style={styles.callType}>
            {getCallIcon(item.type, item.callType)}
            <Text style={styles.callTime}>{item.time}</Text>
          </View>
          {item.duration && (
            <Text style={styles.duration}>{item.duration}</Text>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>কল সমূহ</Text>
      </View>
      
      <FlatList
        data={calls}
        keyExtractor={(item) => item.id}
        renderItem={renderCallItem}
        style={styles.callsList}
        showsVerticalScrollIndicator={false}
      />
    </View>
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
  callsList: {
    flex: 1,
  },
  callItem: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: '#e8e8e8',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  callInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  callHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  callerName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    flex: 1,
  },
  missedCall: {
    color: '#ff3b30',
  },
  callButton: {
    padding: 8,
  },
  callDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  callType: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  callTime: {
    fontSize: 14,
    color: '#8e8e93',
    marginLeft: 6,
  },
  duration: {
    fontSize: 14,
    color: '#8e8e93',
  },
});