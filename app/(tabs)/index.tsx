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
      {/* Loader */}
      {loading && (
        <View
          style={{
            position: "absolute",
            zIndex: 100,
            top: 0,
            bottom: 0,
            right: 0,
            left: 0,
            backgroundColor: "rgba(0,0,0,0.7)", // Background blur effect
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <LottieView
            source={require("../../assets/lottie/Loading.json")}
            autoPlay
            loop
            style={{ width: 200, height: 200 }}
          />
        </View>
      )}

      {/* Main Content */}
      <ScrollView>
        <TrendingMoviesCarousel setLoading={setLoading} />
        <Movie setLoading={setLoading} />
        <Shows setLoading={setLoading} />
        <View style={{ height: 70 }} />
      </ScrollView>
    </View>
  );
};

export default Index;
