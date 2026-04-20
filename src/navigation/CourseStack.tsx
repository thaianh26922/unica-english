import React, { memo } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { CourseStackParamList } from './types';
import { CoursesScreen } from '../screens/CoursesScreen';
import { CourseDetailScreen } from '../screens/CourseDetailScreen';
import { LessonScreen } from '../screens/LessonScreen';

const Stack = createNativeStackNavigator<CourseStackParamList>();

export const CourseStack = memo(function CourseStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="courses" component={CoursesScreen} />
      <Stack.Screen name="course" component={CourseDetailScreen} />
      <Stack.Screen name="lesson" component={LessonScreen} />
    </Stack.Navigator>
  );
});

