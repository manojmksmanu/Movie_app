import { View, Text, ScrollView } from 'react-native'
import React from 'react'
import { useTrendingMovies } from '@/services/homeApi';
import TrendingMoviesCarousel from '@/components/HomeTrendingMoviesCarousel';
import Movie from '@/components/HomeTrendingMovies';

const index = () => {
    const { data, isLoading, error } = useTrendingMovies();


  return (
    <ScrollView>
      <TrendingMoviesCarousel/>
      <Movie/>
      {/* <Text>index</Text> */}
      <View style={{height:30}}>

      </View>
    </ScrollView>
  )
}

export default index