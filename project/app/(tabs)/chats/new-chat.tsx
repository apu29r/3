import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput, Image } from 'react-native';
import { router } from 'expo-router';
import { Search, Users, UserPlus } from 'lucide-react-native';

interface Contact {
  id: string;
  name: string;
  phone: string;
  avatar: string;
  status: string;
}

const MOCK_CONTACTS: Contact[] = [
  {
    id: '5',
    name: 'আবুল কালাম',
    phone: '+8801711223344',
    avatar: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=100',
    status: 'ব্যস্ত আছি',
  },
  {
    id: '6',
    name: 'ফাতিমা খাতুন',
    phone: '+8801611334455',
    avatar: 'https://images.pexels.com/photos/1181519/pexels-photo-1181519.jpeg?auto=compress&cs=tinysrgb&w=100',
    status: 'Available',
  },
  {
    id: '7',
    name: 'করিম উদ্দিন',
    phone: '+8801511445566',
    avatar: 'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=100',
    status: 'খুশি',
  },
  {
    id: '8',
    name: 'রুবিনা আক্তার',
    phone: '+8801411556677',
    avatar: 'https://images.pexels.com/photos/762020/pexels-photo-762020.jpeg?auto=compress&cs=tinysrgb&w=100',
    status: 'কাজে ব্যস্ত',
  },
];

export default function NewChatScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [contacts] = useState<Contact[]>(MOCK_CONTACTS);

  const filteredContacts = contacts.filter(contact =>
    contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    contact.phone.includes(searchQuery)
  );

  const startChat = (contactId: string) => {
    router.push(`/chats/chat/${contactId}`);
  };

  const renderContact = ({ item }: { item: Contact }) => (
    <TouchableOpacity
      style={styles.contactItem}
      onPress={() => startChat(item.id)}
      activeOpacity={0.7}
    >
      <Image source={{ uri: item.avatar }} style={styles.avatar} />
      <View style={styles.contactInfo}>
        <Text style={styles.contactName}>{item.name}</Text>
        <Text style={styles.contactStatus}>{item.status}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <View style={styles.searchInput}>
          <Search size={20} color="#8e8e93" style={styles.searchIcon} />
          <TextInput
            placeholder="Search contacts..."
            placeholderTextColor="#8e8e93"
            value={searchQuery}
            onChangeText={setSearchQuery}
            style={styles.textInput}
          />
        </View>
      </View>

      <View style={styles.quickActions}>
        <TouchableOpacity style={styles.quickAction}>
          <View style={styles.quickActionIcon}>
            <Users size={24} color="#25D366" />
          </View>
          <Text style={styles.quickActionText}>নতুন গ্রুপ</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.quickAction}>
          <View style={styles.quickActionIcon}>
            <UserPlus size={24} color="#25D366" />
          </View>
          <Text style={styles.quickActionText}>নতুন যোগাযোগ</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.contactsHeader}>
        <Text style={styles.contactsTitle}>যোগাযোগ</Text>
      </View>

      <FlatList
        data={filteredContacts}
        keyExtractor={(item) => item.id}
        renderItem={renderContact}
        style={styles.contactsList}
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
  searchContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e5e5',
  },
  searchInput: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  searchIcon: {
    marginRight: 8,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    color: '#000000',
  },
  quickActions: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e5e5',
  },
  quickAction: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  quickActionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  quickActionText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000000',
  },
  contactsHeader: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#f8f8f8',
  },
  contactsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#8e8e93',
    textTransform: 'uppercase',
  },
  contactsList: {
    flex: 1,
  },
  contactItem: {
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
  contactInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  contactName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 2,
  },
  contactStatus: {
    fontSize: 14,
    color: '#8e8e93',
  },
});