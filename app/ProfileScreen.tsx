import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import {
    Alert,
    Dimensions,
    Image,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { useProfile } from '../contexts/ProfileContexts';

const { width } = Dimensions.get('window');

export default function ProfileScreen() {
  const { profile, isLoading } = useProfile();

  const handleEditProfile = () => {
    router.push('/EditProfileScreen');
  };

  const handleBack = () => {
    router.back();
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Logout', style: 'destructive', onPress: () => router.replace('/AuthScreen') },
      ]
    );
  };

  if (isLoading || !profile) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading profile...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <Ionicons name="chevron-back" size={28} color="#FF4458" />
        </TouchableOpacity>
        
        <Text style={styles.headerTitle}>My Profile</Text>
        
        <TouchableOpacity onPress={handleEditProfile} style={styles.editButton}>
          <Ionicons name="create-outline" size={24} color="#FF4458" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Photo Section */}
        <View style={styles.photoSection}>
          <Image
            source={{ uri: profile.photos[0] }}
            style={styles.mainPhoto}
          />
          <View style={styles.photoGrid}>
            {profile.photos.slice(1, 4).map((photo, index) => (
              <Image
                key={index}
                source={{ uri: photo }}
                style={styles.gridPhoto}
              />
            ))}
            {profile.photos.length > 4 && (
              <View style={styles.morePhotos}>
                <Text style={styles.morePhotosText}>+{profile.photos.length - 4}</Text>
              </View>
            )}
          </View>
        </View>

        {/* Basic Info */}
        <View style={styles.basicInfo}>
          <View style={styles.nameAgeContainer}>
            <Text style={styles.name}>{profile.name}</Text>
            <Text style={styles.age}>, {profile.age}</Text>
          </View>
          
          <View style={styles.locationContainer}>
            <Ionicons name="location" size={16} color="#666" />
            <Text style={styles.location}>{profile.location}</Text>
          </View>
        </View>

        {/* Bio Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About Me</Text>
          <Text style={styles.bio}>{profile.bio}</Text>
        </View>

        {/* Details Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Details</Text>
          
          <View style={styles.detailItem}>
            <Ionicons name="briefcase" size={20} color="#FF4458" />
            <View style={styles.detailText}>
              <Text style={styles.detailLabel}>Work</Text>
              <Text style={styles.detailValue}>{profile.occupation}</Text>
            </View>
          </View>
          
          <View style={styles.detailItem}>
            <Ionicons name="school" size={20} color="#FF4458" />
            <View style={styles.detailText}>
              <Text style={styles.detailLabel}>Education</Text>
              <Text style={styles.detailValue}>{profile.education}</Text>
            </View>
          </View>
          
          <View style={styles.detailItem}>
            <Ionicons name="heart" size={20} color="#FF4458" />
            <View style={styles.detailText}>
              <Text style={styles.detailLabel}>Looking for</Text>
              <Text style={styles.detailValue}>{profile.lookingFor}</Text>
            </View>
          </View>
        </View>

        {/* Interests Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>My Interests</Text>
          <View style={styles.interestsContainer}>
            {profile.interests.map((interest, index) => (
              <View key={index} style={styles.interestTag}>
                <Text style={styles.interestText}>{interest}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Settings Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Settings</Text>
          
          <TouchableOpacity style={styles.settingItem}>
            <Ionicons name="notifications" size={22} color="#FF4458" />
            <Text style={styles.settingText}>Notifications</Text>
            <Ionicons name="chevron-forward" size={20} color="#ccc" />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.settingItem}>
            <Ionicons name="shield-checkmark" size={22} color="#FF4458" />
            <Text style={styles.settingText}>Privacy & Safety</Text>
            <Ionicons name="chevron-forward" size={20} color="#ccc" />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.settingItem}>
            <Ionicons name="location" size={22} color="#FF4458" />
            <Text style={styles.settingText}>Discovery Settings</Text>
            <Ionicons name="chevron-forward" size={20} color="#ccc" />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.settingItem}>
            <Ionicons name="help-circle" size={22} color="#FF4458" />
            <Text style={styles.settingText}>Help & Support</Text>
            <Ionicons name="chevron-forward" size={20} color="#ccc" />
          </TouchableOpacity>
        </View>

        {/* Logout Button */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Ionicons name="log-out" size={22} color="#FF4458" />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 18,
    color: '#666',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  editButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
  },
  photoSection: {
    backgroundColor: 'white',
    paddingBottom: 20,
  },
  mainPhoto: {
    width: width,
    height: width * 0.8,
    resizeMode: 'cover',
  },
  photoGrid: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingTop: 15,
    justifyContent: 'space-between',
  },
  gridPhoto: {
    width: (width - 80) / 3,
    height: (width - 80) / 3,
    borderRadius: 8,
  },
  morePhotos: {
    width: (width - 80) / 3,
    height: (width - 80) / 3,
    borderRadius: 8,
    backgroundColor: 'rgba(0,0,0,0.7)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  morePhotosText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  basicInfo: {
    backgroundColor: 'white',
    padding: 20,
    marginTop: 10,
  },
  nameAgeContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 10,
  },
  name: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
  },
  age: {
    fontSize: 28,
    fontWeight: '300',
    color: '#666',
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  location: {
    fontSize: 16,
    color: '#666',
    marginLeft: 5,
  },
  section: {
    backgroundColor: 'white',
    padding: 20,
    marginTop: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  bio: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  detailText: {
    marginLeft: 15,
    flex: 1,
  },
  detailLabel: {
    fontSize: 14,
    color: '#999',
    marginBottom: 2,
  },
  detailValue: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  interestsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  interestTag: {
    backgroundColor: '#FFE8EA',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#FF4458',
  },
  interestText: {
    fontSize: 14,
    color: '#FF4458',
    fontWeight: '500',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  settingText: {
    fontSize: 16,
    color: '#333',
    marginLeft: 15,
    flex: 1,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 20,
    marginTop: 10,
    marginBottom: 30,
  },
  logoutText: {
    fontSize: 16,
    color: '#FF4458',
    marginLeft: 15,
    fontWeight: '500',
  },
});