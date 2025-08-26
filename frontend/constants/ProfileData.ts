export interface UserProfile {
  id: string;
  name: string;
  age: number;
  bio: string;
  location: string;
  occupation: string;
  education: string;
  photos: string[];
  interests: string[];
  lookingFor: string;
  distance?: number;
}

export const TEST_USER_PROFILE: UserProfile = {
  id: '1',
  name: 'Sarah Johnson',
  age: 26,
  bio: 'Adventure seeker who loves hiking, photography, and trying new coffee shops. Always up for spontaneous road trips! ✨',
  location: 'San Francisco, CA',
  occupation: 'UX Designer',
  education: 'Stanford University',
  photos: [
    'https://images.unsplash.com/photo-1494790108755-2616b612b526?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&h=687',
    'https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&h=687',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&h=687',
    'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&h=687'
  ],
  interests: ['Photography', 'Hiking', 'Coffee', 'Travel', 'Art', 'Yoga'],
  lookingFor: 'Long-term relationship'
};

export const TEST_POTENTIAL_MATCHES: UserProfile[] = [
  {
    id: '2',
    name: 'Alex Chen',
    age: 28,
    bio: 'Software engineer by day, chef by night. Love building apps and cooking new recipes!',
    location: 'San Francisco, CA',
    occupation: 'Software Engineer',
    education: 'UC Berkeley',
    photos: [
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=687&h=687',
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=crop&w=687&h=687'
    ],
    interests: ['Coding', 'Cooking', 'Gaming', 'Rock Climbing'],
    lookingFor: 'Something serious',
    distance: 2
  },
  {
    id: '3',
    name: 'Emily Rodriguez',
    age: 24,
    bio: 'Artist and yoga instructor. Spreading good vibes and creativity wherever I go 🎨',
    location: 'Oakland, CA',
    occupation: 'Artist & Yoga Instructor',
    education: 'Art Institute',
    photos: [
      'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=687&h=687',
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&auto=format&fit=crop&w=687&h=687'
    ],
    interests: ['Art', 'Yoga', 'Meditation', 'Nature', 'Music'],
    lookingFor: 'New connections',
    distance: 8
  }
];