import { useNavigation, useRoute } from '@react-navigation/native';
import { useState, useContext } from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, Octicons } from '@expo/vector-icons';
import { FitnessItems } from '../Context';

const FitScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  
  // State management for tracking exercise index
  const [index, setIndex] = useState(0);
  
  // Extract exercises from route parameters (defensive checks)
  const exercise = route?.params?.exercises || [];
  const current = exercise[index] || {};

  // Extract context values
  const { completed, setCompleted, calories, setCalories, minutes, setMinutes, workout, setWorkout } = useContext(FitnessItems);

  const handleDone = () => {
    // Update workout stats
    setCompleted([...completed, current?.name]);
    setWorkout(workout + 1);
    setMinutes(minutes + 2.5);
    setCalories(calories + 6.3);

    // Navigate based on the index
    if (index + 1 >= exercise.length) {
      navigation.navigate('Home');
    } else {
      navigation.navigate('Rest');
      setTimeout(() => {
        setIndex(index + 1);
      }, 2000);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      {/* Exercise Image */}
      <Image style={{ width: '100%', height: 400 }} source={{ uri: current.image }} />

      {/* Exercise Name and Sets */}
      <Text style={{ marginLeft: 'auto', marginRight: 'auto', fontSize: 30, fontWeight: 'bold', marginTop: 30 }}>
        {current?.name} <Octicons name="question" size={22} color="#6d6868" />
      </Text>
      <Text style={{ marginLeft: 'auto', marginRight: 'auto', fontSize: 45, fontWeight: 'bold', marginTop: 10 }}>
        x{current?.sets}
      </Text>

      {/* Done Button */}
      <TouchableOpacity onPress={handleDone} style={{ backgroundColor: '#198f51', marginLeft: 'auto', marginRight: 'auto', marginTop: 50, borderRadius: 30, padding: 10, width: '90%' }}>
        <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 20, textAlign: 'center' }}>
          <Ionicons name="checkmark-circle" size={24} color="white" /> DONE
        </Text>
      </TouchableOpacity>

      {/* Previous and Skip Buttons */}
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, marginTop: 25 }}>
        {/* Previous Button */}
        <TouchableOpacity
          disabled={index === 0}
          onPress={() => {
            navigation.navigate('Rest');
            setTimeout(() => setIndex(index - 1), 2000);
          }}
          style={{ borderRadius: 30, padding: 10, width: '42%' }}
        >
          <Text style={{ color: '#6d6868', fontWeight: 'bold', fontSize: 18, textAlign: 'center' }}>
            <Ionicons name="play-skip-back" size={22} color="#6d6868" /> PREV
          </Text>
        </TouchableOpacity>

        {/* Skip Button */}
        <TouchableOpacity
          onPress={() => {
            if (index + 1 >= exercise.length) {
              navigation.navigate('Home');
            } else {
              navigation.navigate('Rest');
              setTimeout(() => setIndex(index + 1), 2000);
            }
          }}
          style={{ borderRadius: 30, padding: 10, width: '42%' }}
        >
          <Text style={{ color: '#3f3d3d', fontWeight: 'bold', fontSize: 18, textAlign: 'center' }}>
            <Ionicons name="play-skip-forward" size={22} color="#3f3d3d" /> SKIP
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default FitScreen;
