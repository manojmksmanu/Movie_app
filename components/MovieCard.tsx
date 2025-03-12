import React from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  Pressable,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Movie } from "../types/movie";
import { useDispatch, useSelector } from "react-redux";
import { toggleShortlist } from "../store/movieSlice";
import { RootState } from "../store/store";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";


const { width } = Dimensions.get("window");
const CARD_WIDTH = width / 2 - 24;

export default function MovieCard({ movie }: any) {
  const dispatch = useDispatch();
  const shortlistedMovies = useSelector(
    (state: RootState) => state.movies.shortlistedMovies
  );
  const isShortlisted = shortlistedMovies.some((m) => m.id === movie.id);
  const router = useRouter();

  const handleShortlist = () => {
    dispatch(toggleShortlist(movie));
  };

  return (
    <View style={styles.card}>
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() =>
          router.navigate({
            pathname: "/singleMovie",
            params: { id: movie.id },
          })
        }
        style={styles.cardTouchable}
      >
        <Image
          source={{
            uri: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
          }}
          style={styles.poster}
        />
        <Pressable
          style={styles.shortlistButton}
          onPress={handleShortlist}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons
            name={isShortlisted ? "bookmark" : "bookmark-outline"}
            size={24}
            color={isShortlisted ? "#e21221" : "#ffffff"}
          />
        </Pressable>
        <LinearGradient
          colors={["rgba(150, 0, 0, 0.9)", "rgba(247, 27, 27, 0.7)"]}
          start={{ x: 0.2, y: 0.5 }}
          end={{ x: 0.1, y: 0.1 }}
          style={styles.content}
        >
          <Text style={styles.title} numberOfLines={2}>
             {movie?.title ? movie?.title : movie?.name}
          </Text>
          <View style={styles.bottomRow}>
            <Text style={styles.rating}>★ {movie.vote_average.toFixed(1)}</Text>
            <TouchableOpacity
              style={styles.readMoreButton}
              onPress={() =>
                router.navigate({
                  pathname: "/singleMovie",
                  params: { id: movie.id },
                })
              }
            >
              <Text style={styles.readMoreText}>Read More</Text>
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: CARD_WIDTH,
    backgroundColor: "#2a2a2a",
    borderRadius: 12,
    marginBottom: 16,
    overflow: "hidden",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  cardTouchable: {
    width: "100%",
  },
  poster: {
    width: CARD_WIDTH,
    height: CARD_WIDTH * 1.5,
    resizeMode: "cover",
  },
  content: {
    padding: 12,
    position: "absolute",
    bottom: 0,
    right: 0,
    left: 0,
    borderTopLeftRadius:30,
    justifyContent: "space-between",
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    color: "#ffffff",
    marginBottom: 8,
  },
  bottomRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  rating: {
    fontSize: 14,
    color: "#ffd700",
    fontWeight: "bold", // Added for better visibility
  },
  shortlistButton: {
    position: "absolute",
    right: 8,
    top: 8,
    backgroundColor: "rgba(0,0,0,0.5)",
    borderRadius: 20,
    padding: 6,
    zIndex: 10,
  },
  readMoreButton: {
    backgroundColor: "rgba(255,255,255,0.2)", // Changed to semi-transparent white
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.3)", // Added subtle border
  },
  readMoreText: {
    color: "#ffffff",
    fontSize: 12,
    fontWeight: "500",
  },
});
