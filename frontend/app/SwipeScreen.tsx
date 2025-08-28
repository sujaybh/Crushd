import { Ionicons } from '@expo/vector-icons'; // Make sure to install @expo/vector-icons
import React, { useRef, useState } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, useWindowDimensions, View } from 'react-native';
import Swiper from 'react-native-deck-swiper';
import { API_ENDPOINTS } from '../constants/appConfig';
import { Profile, testProfiles } from '../constants/testProfiles';

export default function SwipeScreen() {
  const { width, height } = useWindowDimensions();
  const [profiles, setProfiles] = useState<Profile[]>(testProfiles);
  const [allSwiped, setAllSwiped] = useState(false);
  const swiperRef = useRef(null);

  const onSwiped = (type: string) => {
    console.log(`Swiped ${type}`);
  };

  const onSwipedAll = () => {
    console.log('No more cards!');
    setAllSwiped(true);
  };

  const fetchProfiles = async () => {
    try {
      const response = await fetch(API_ENDPOINTS.BASE_URL + API_ENDPOINTS.PROFILES);
      const data = await response.json();
      setProfiles(data);
    } catch (error) {
      console.error('Error fetching profiles:', error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={[styles.swiperContainer, { height: height * 0.7 }]}>
        <Swiper
          ref={swiperRef}
          cards={profiles}
          renderCard={(card: Profile) => (
            <View style={[styles.card, { width: width * 0.9, height: '100%' }]}>
              <Image 
                source={card.image} 
                style={styles.image}
                resizeMode="cover"
              />
              <View style={styles.textContainer}>
                <Text style={styles.name}>{card.name}, {card.age}</Text>
                <Text style={styles.bio}>{card.bio}</Text>
              </View>
            </View>
          )}
          onSwipedLeft={() => onSwiped('left')}
          onSwipedRight={() => onSwiped('right')}
          onSwipedAll={onSwipedAll}
          cardIndex={0}
          backgroundColor={'transparent'}
          stackSize={3}
          infinite={false}
          animateOverlayLabelsOpacity
          overlayLabels={{
            left: {
              title: 'NOPE',
              style: styles.overlayLabel
            },
            right: {
              title: 'LIKE',
              style: styles.overlayLabel
            }
          }}
        />
      </View>

      {allSwiped ? (
        <View style={styles.messageContainer}>
          <Text style={styles.messageText}>No more profiles available!</Text>
        </View>
      ) : (
        <View style={styles.buttonsContainer}>
          <TouchableOpacity 
            style={[styles.button, styles.nopeButton]}
            onPress={() => swiperRef.current.swipeLeft()}>
            <Ionicons name="close" size={40} color="#F06795" />
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.button, styles.likeButton]}
            onPress={() => swiperRef.current.swipeRight()}>
            <Ionicons name="checkmark" size={40} color="#64EDCC" />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  swiperContainer: {
    flex: 1,
  },
  card: {
    borderRadius: 20,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  image: {
    width: '100%',
    height: '70%',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  textContainer: {
    padding: 15,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  bio: {
    fontSize: 16,
    color: '#666',
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    padding: 20,
  },
  button: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  nopeButton: {
    borderWidth: 2,
    borderColor: '#F06795',
  },
  likeButton: {
    borderWidth: 2,
    borderColor: '#64EDCC',
  },
  overlayLabel: {
    backgroundColor: 'transparent',
    borderColor: 'transparent',
    color: 'white',
    fontSize: 45,
    fontWeight: 'bold',
    padding: 10,
  },
  messageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  messageText: {
    fontSize: 18,
    color: '#666',
  },
});