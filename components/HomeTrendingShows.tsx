import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  FlatList,
} from "react-native";
import { Dimensions } from "react-native";
import { useTrendingMoviesByDays, useTrendingTvByDays } from "@/services/homeApi";
import { LinearGradient } from "expo-linear-gradient";
import SkeletonPlaceholder from "react-native-skeleton-placeholder";
import { useRouter } from "expo-router";

const { width, height } = Dimensions.get("window");

const Shows = () => {
  const [dayWeek, setDayWeek] = useState("day");
  const { data: movies, isLoading, error } = useTrendingTvByDays(dayWeek);
  const router = useRouter();

  const cardWidth = width * 0.40;

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Oops! Something went wrong</Text>
        <Text style={styles.errorMessage}>{error.message}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header Section */}
      <View style={styles.header}>
        <Text style={styles.title}>Trending Shows</Text>
        <View style={styles.toggleContainer}>
          {["day", "week"].map((period) => (
            <TouchableOpacity
              key={period}
              style={[
                styles.toggleButton,
                dayWeek === period && styles.activeButton,
              ]}
              onPress={() => setDayWeek(period)}
            >
              <Text
                style={[
                  styles.toggleText,
                  dayWeek === period && styles.activeText,
                ]}
              >
                {period.charAt(0).toUpperCase() + period.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Movie Cards */}
      <View style={styles.cardsContainer}>
        <FlatList
          data={isLoading ? Array(10).fill({}) : movies || []}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.listContainer}
          keyExtractor={(item) => item?.id?.toString()}
          snapToInterval={cardWidth}
          decelerationRate="fast"
          renderItem={({ item }) =>
            !isLoading ? (
              <TouchableOpacity
                activeOpacity={0.9}
                style={[
                  styles.cardWrapper,
                  { width: cardWidth, height: cardWidth * 1.4 },
                ]}
              >
                <TouchableOpacity
                  onPress={() =>
                    router.navigate({
                      pathname: "/singleMovie",
                      params: { id: item.id },
                    })
                  }
                  style={styles.card}
                >
                  <Image
                    source={{
                      uri: `https://image.tmdb.org/t/p/w500${item.poster_path}`,
                    }}
                    style={styles.poster}
                    resizeMode="cover"
                  />
                </TouchableOpacity>
              </TouchableOpacity>
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
                  <SkeletonPlaceholder.Item
                    width={cardWidth}
                    height={cardWidth * 1.4}
                    borderRadius={12}
                  />
                </SkeletonPlaceholder.Item>
              </SkeletonPlaceholder>
            )
          }
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  
    paddingTop: 20,
  },
  // Header Styles
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 15,
    marginBottom: 15,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#FFFFFF",
    letterSpacing: 0.5,
  },
  toggleContainer: {
    flexDirection: "row",
    backgroundColor: "#2D2D2D",
    borderRadius: 25,
    padding: 4,
  },
  toggleButton: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  activeButton: {
    backgroundColor: "red",
  },
  toggleText: {
    color: "#BBBBBB",
    fontSize: 16,
    fontWeight: "500",
  },
  activeText: {
    color: "white",
    fontWeight: "700",
  },
  // Cards Container
  cardsContainer: {
    marginVertical: 10,
  },
  listContainer: {
    paddingHorizontal: 10,
    gap:10
  },
  // Card Styles
  cardWrapper: {
    paddingHorizontal: 5,
  },
  card: {
    flex: 1,
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: "#2D2D2D",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  poster: {
    width: "100%",
    height: "100%",
    position: "absolute",
  },
  gradient: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: "40%",
    padding: 8,
    justifyContent: "flex-end",
  },
  movieTitle: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "700",
    textAlign: "left",
    marginBottom: 2,
    textShadowColor: "rgba(0, 0, 0, 0.75)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  rating: {
    color: "#FFD700",
    fontSize: 12,
    fontWeight: "600",
  },
  // Loading/Error States
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#1A1A1A",
  },
  loadingText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "500",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#1A1A1A",
    padding: 20,
  },
  errorText: {
    color: "#FF4444",
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 10,
  },
  errorMessage: {
    color: "#BBBBBB",
    fontSize: 16,
    textAlign: "center",
  },
});

export default Shows;
