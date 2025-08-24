import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { TEST_USER_PROFILE, UserProfile } from '../constants/ProfileData';

interface ProfileContextType {
  profile: UserProfile | null;
  isLoading: boolean;
  error: string | null;
  updateProfile: (data: Partial<UserProfile>) => Promise<boolean>;
  refreshProfile: () => Promise<void>;
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

interface ProfileProviderProps {
  children: ReactNode;
}

export const ProfileProvider: React.FC<ProfileProviderProps> = ({ children }) => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadProfile = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // For now, use test data. When API is ready, uncomment the API call below
      // const response = await ApiService.getProfile('1');
      // if (response.success && response.data) {
      //   setProfile(response.data);
      // } else {
      //   setError(response.error || 'Failed to load profile');
      // }
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      setProfile(TEST_USER_PROFILE);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const updateProfile = async (data: Partial<UserProfile>): Promise<boolean> => {
    if (!profile) return false;
    
    setIsLoading(true);
    setError(null);
    
    try {
      // For now, update local state. When API is ready, uncomment the API call below
      // const response = await ApiService.updateProfile(profile.id, data);
      // if (response.success && response.data) {
      //   setProfile(response.data);
      //   return true;
      // } else {
      //   setError(response.error || 'Failed to update profile');
      //   return false;
      // }
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      setProfile({ ...profile, ...data });
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const refreshProfile = async () => {
    await loadProfile();
  };

  useEffect(() => {
    loadProfile();
  }, []);

  const value: ProfileContextType = {
    profile,
    isLoading,
    error,
    updateProfile,
    refreshProfile,
  };

  return (
    <ProfileContext.Provider value={value}>
      {children}
    </ProfileContext.Provider>
  );
};

export const useProfile = (): ProfileContextType => {
  const context = useContext(ProfileContext);
  if (context === undefined) {
    throw new Error('useProfile must be used within a ProfileProvider');
  }
  return context;
};