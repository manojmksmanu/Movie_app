import { View, Text, ScrollView } from 'react-native'
import React from 'react'
import { useTrendingMovies } from '@/services/homeApi';
import TrendingMoviesCarousel from '@/components/HomeTrendingMoviesCarousel';
import Movie from '@/components/HomeTrendingMovies';
import Shows from '@/components/HomeTrendingShows';

const index = () => {
    const { data, isLoading, error } = useTrendingMovies();


  return (
    <ScrollView style={{ backgroundColor: "#1A1A1A" }}>
      <TrendingMoviesCarousel />
      <Movie />
      <Shows />
      {/* <Text>index</Text> */}
      <View style={{ height: 70 }}></View>
    </ScrollView>
  );
}

export default index