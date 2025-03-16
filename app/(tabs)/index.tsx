import { View, ScrollView } from "react-native";
import React, { useState, useEffect } from "react";
import { useTrendingMovies } from "@/services/homeApi";
import TrendingMoviesCarousel from "@/components/HomeTrendingMoviesCarousel";
import Movie from "@/components/HomeTrendingMovies";
import Shows from "@/components/HomeTrendingShows";
import LottieView from "lottie-react-native";

const Index = () => {
  const { data, isLoading, error } = useTrendingMovies();
  const [loading, setLoading] = useState(true);
  

  useEffect(() => {
    if (!isLoading) {
      setLoading(false);
    }
  }, [isLoading]);

  return (
    <View style={{ flex: 1, backgroundColor: "#1A1A1A" }}>
      <ScrollView>
        <TrendingMoviesCarousel setLoading={setLoading} />
        <Movie  />
        <Shows  />
        <View style={{ height: 70 }} />
      </ScrollView>
    </View>
  );
};

export default Index;
