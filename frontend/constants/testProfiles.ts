export interface Profile {
  id: string;
  name: string;
  age: number;
  gender: 'male' | 'female' | 'other';
  bio: string;
  image: any; // In real app, this would be a URL
}

export const testProfiles: Profile[] = [
  {
    id: '1',
    name: 'Alex Thompson',
    age: 28,
    gender: 'male',
    bio: 'Software engineer by day, guitarist by night. Love hiking and good coffee.',
    image: require('../assets/images/react-logo.png'), // Using placeholder image
  },
  {
    id: '2',
    name: 'Sarah Chen',
    age: 25,
    gender: 'female',
    bio: 'Travel enthusiast. Always planning my next adventure.',
    image: require('../assets/images/react-logo.png'),
  },
  {
    id: '3',
    name: 'Jordan Riley',
    age: 30,
    gender: 'other',
    bio: 'Art curator and food lover. Lets explore local galleries together!',
    image: require('../assets/images/react-logo.png'),
  },
  {
    id: '4',
    name: 'Emma Watson',
    age: 27,
    gender: 'female',
    bio: 'Yoga instructor and meditation practitioner. Looking for mindful connections.',
    image: require('../assets/images/react-logo.png'),
  },
];

// Server endpoint for future implementation
