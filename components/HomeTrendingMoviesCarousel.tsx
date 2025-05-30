import { useTrendingMovies } from "@/services/homeApi";
import React, { useEffect } from "react";
import {
  View,
  Image,
  Text,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import Carousel from "react-native-reanimated-carousel";
import { LinearGradient } from "expo-linear-gradient";
import { AntDesign } from "@expo/vector-icons";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";
import SkeletonPlaceholder from "react-native-skeleton-placeholder";
import { useRouter } from "expo-router";

const { width, height } = Dimensions.get("window");

const TrendingMoviesCarousel = ({ setLoading }: { setLoading: any }) => {
  const { data, isLoading, error } = useTrendingMovies();
  const router = useRouter();
  useEffect(() => {
    setLoading(isLoading);
  }, [isLoading]);


  if (error) return <Text style={styles.error}>Error: {error.message}</Text>;

  return (
    <View style={styles.container}>
      {!isLoading && data ? (
        <Carousel
          loop
          width={width}
          height={height * 0.6}
          autoPlay
          autoPlayInterval={4000}
          scrollAnimationDuration={1000}
          data={data.results}
          renderItem={({ item }: { item: any }) => (
            <TouchableOpacity activeOpacity={0.9}>
              <Animated.View
                style={styles.card}
                entering={FadeIn.duration(800)}
                exiting={FadeOut.duration(600)}
              >
                {/* Movie Image */}
                <Image
                  source={{
                    uri: `https://image.tmdb.org/t/p/w780${item.backdrop_path}`,
                  }}
                  style={styles.image}
                />

                {/* Movie Details - Now separate from the gradient */}
                <LinearGradient
                  colors={["rgba(150, 0, 0, 0.9)", "rgba(247, 27, 27, 0.7)"]}
                  start={{ x: 0.2, y: 0.5 }}
                  end={{ x: 0.1, y: 0.1 }}
                  style={styles.infoContainer}
                >
                  <Text style={styles.title}>{item.title || item.name}</Text>
                  <View style={styles.row}>
                    <AntDesign name="star" size={18} color="#FFD700" />
                    <Text style={styles.rating}>
                      {item.vote_average.toFixed(1)}
                    </Text>
                  </View>
                  <Text style={styles.description} numberOfLines={2}>
                    {item.overview || "No description available"}
                  </Text>
                  {/* Explore Button */}
                  <TouchableOpacity
                    style={styles.exploreButton}
                    onPress={() =>
                      router.navigate({
                        pathname: "/singleMovie",
                        params: { id: item.id },
                      })
                    }
                  >
                    <Text style={styles.exploreText}>Explore</Text>
                  </TouchableOpacity>
                </LinearGradient>
              </Animated.View>
            </TouchableOpacity>
          )}
        />
      ) : (
        <SkeletonPlaceholder
          borderRadius={4}
          backgroundColor="#461616"
          highlightColor="#ff0000"
        >
          <SkeletonPlaceholder.Item
            flexDirection="row"
            alignItems="center"
            gap={10}
          >
            <SkeletonPlaceholder.Item width={width} height={height * 0.6} />
          </SkeletonPlaceholder.Item>
        </SkeletonPlaceholder>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
  },
  card: {
    position: "relative",
    width: width,
    height: height * 0.6,
    justifyContent: "flex-end",
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: "100%",
  },

  infoContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 2,
    padding: 20,
    borderTopRightRadius: 60,
  },
  title: {
    color: "#fff",
    fontSize: 26,
    fontWeight: "bold",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 5,
  },
  rating: {
    color: "#FFD700",
    fontSize: 18,
    marginLeft: 5,
  },
  description: {
    color: "#ccc",
    fontSize: 14,
    fontStyle: "italic",
    marginBottom: 10,
  },
  exploreButton: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    alignSelf: "flex-start",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.5)",
  },
  exploreText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  loading: {
    textAlign: "center",
    fontSize: 18,
    color: "gray",
  },
  error: {
    textAlign: "center",
    fontSize: 18,
    color: "red",
  },
});

export default TrendingMoviesCarousel;
