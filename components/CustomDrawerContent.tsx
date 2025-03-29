import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
} from 'react-native';
import {
  DrawerContentScrollView,
  DrawerItem,
} from '@react-navigation/drawer';
import { Ionicons } from '@expo/vector-icons';

export default function CustomDrawerContent(props) {
  // 模擬 Google 使用者資料
  const user = {
    name: '王子儀',
    avatar: 'https://i.pravatar.cc/150?img=3',
  };

  return (
    <DrawerContentScrollView
      {...props}
      contentContainerStyle={styles.container}
    >
      <View style={styles.header}>
        <Image source={{ uri: user.avatar }} style={styles.avatar} />
        <Text style={styles.name}>{user.name}</Text>
        <TouchableOpacity style={styles.vipButton}>
          <Text style={styles.vipText}>理財小達人</Text>
        </TouchableOpacity>
      </View>

      <DrawerItem
        label="統計報表"
        labelStyle={styles.menuText}
        icon={({ color }) => (
          <Ionicons name="bar-chart" size={24} color={color} style={styles.icon} />
        )}
        onPress={() => props.navigation.navigate('Statistics')}
      />
    </DrawerContentScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#1E1E1E',
    flex: 1,
  },
  header: {
    alignItems: 'center',
    paddingVertical: 24,
    borderBottomColor: '#333',
    borderBottomWidth: 1,
    marginBottom: 16,
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    marginBottom: 8,
  },
  name: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  vipButton: {
    backgroundColor: '#444',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
    marginTop: 8,
  },
  vipText: {
    color: '#facc15',
    fontSize: 12,
    fontWeight: 'bold',
  },
  icon: {
    marginRight: -12,
  },
  menuText: {
    color: 'white',
    fontSize: 16,
  },
});

