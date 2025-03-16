import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  fetchMovieDetails,
  fetchMovieCast,
  fetchMovieVideos,
  fetchMovieRecommendations,
} from "../services/movieApi";
import { Ionicons } from "@expo/vector-icons";
import MovieCard from "../components/MovieCard";
import { Movie, CastMember, Video } from "../types/movie";
import YoutubePlayer from "react-native-youtube-iframe";
import LottieView from "lottie-react-native";

export default function SingleMovieScreen() {
  const [movie, setMovie] = useState<Movie | null>(null);
  const [cast, setCast] = useState<CastMember[]>([]);
  const [videos, setVideos] = useState<Video[]>([]);
  const [recommendations, setRecommendations] = useState<Movie[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const [movieData, castData, videoData, recoData] = await Promise.all([
        fetchMovieDetails(id),
        fetchMovieCast(id),
        fetchMovieVideos(id),
        fetchMovieRecommendations(id),
      ]);
      setMovie(movieData);
      setCast(castData);
      setVideos(videoData);
      setRecommendations(recoData);
      setLoading(false);
    };
    loadData();
  }, [id]);

  const renderCastItem = ({ item }: { item: CastMember }) => (
    <View style={styles.castItem}>
      <Image
        source={{
          uri: item.profile_path
            ? `https://image.tmdb.org/t/p/w200${item.profile_path}`
            : "https://via.placeholder.com/100",
        }}
        style={styles.castImage}
      />
      <Text style={styles.castName}>{item.name}</Text>
      <Text style={styles.castCharacter}>{item.character}</Text>
    </View>
  );

  const renderVideoItem = ({ item }: { item: Video }) => (
    <View style={styles.videoItem}>
      <YoutubePlayer
        height={280}
        width={360}
        videoId={item.key}
        play={false}
        initialPlayerParams={{
          controls: true,
        }}
      />
      <Text style={styles.videoTitle}>{item.name}</Text>
    </View>
  );

  const renderRecommendationItem = ({ item }: { item: Movie }) => (
    <MovieCard movie={item} />
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <LottieView
          source={require("../assets/lottie/Loading.json")}
          autoPlay
          loop
          style={{ width: 200, height: 200 }}
        />
        <Text style={styles.loadingText}>Loading Details...</Text>
      </View>
    );
  }

  if (!movie) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Movie not found</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Image
            source={{
              uri: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
            }}
            style={styles.poster}
            resizeMode="cover"
          />
          <LinearGradient
            colors={["transparent", "rgba(18, 18, 18, 0.9)"]}
            style={styles.headerGradient}
          />
          <View style={styles.headerOverlay}>
            <Text style={styles.title}>{movie.title}</Text>
            <Text style={styles.tagline}>{movie.tagline}</Text>
          </View>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={28} color="#ffffff" />
          </TouchableOpacity>
        </View>

        {/* Overview */}
        {movie.overview && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Overview</Text>
            <Text style={styles.overview}>{movie.overview}</Text>
          </View>
        )}

        {/* Metadata */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Details</Text>
          <View style={styles.metadataCard}>
            {movie.runtime && (
              <View style={styles.metadataRow}>
                <Ionicons name="time-outline" size={20} color="#e21221" />
                <Text style={styles.metadataText}> {movie.runtime} mins</Text>
              </View>
            )}
            {movie.release_date && (
              <View style={styles.metadataRow}>
                <Ionicons name="calendar-outline" size={20} color="#e21221" />
                <Text style={styles.metadataText}> {movie.release_date}</Text>
              </View>
            )}
            {movie.vote_average && (
              <View style={styles.metadataRow}>
                <Ionicons name="star-outline" size={20} color="#e21221" />
                <Text style={styles.metadataText}>
                  {" "}
                  {movie.vote_average.toFixed(1)}/10
                </Text>
              </View>
            )}
            {movie.genres.length > 0 && (
              <View style={styles.metadataRow}>
                <Ionicons name="film-outline" size={20} color="#e21221" />
                <Text style={styles.metadataText}>
                  {" "}
                  {movie.genres.map((g) => g.name).join(", ")}
                </Text>
              </View>
            )}
          </View>
        </View>

        {/* Cast */}
        {cast.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Top Cast</Text>
            <FlatList
              data={cast}
              renderItem={renderCastItem}
              keyExtractor={(item) => item.id.toString()}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.castList}
            />
          </View>
        )}

        {/* Videos */}
        {videos.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Trailers</Text>
            <FlatList
              data={videos}
              renderItem={renderVideoItem}
              keyExtractor={(item) => item.id}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.videoList}
            />
          </View>
        )}

        {/* Recommendations */}
        {recommendations.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Recommendations</Text>
            <FlatList
              data={recommendations}
              renderItem={renderRecommendationItem}
              keyExtractor={(item) => item.id.toString()}
              horizontal
              ItemSeparatorComponent={() => <View style={{ width: 16 }} />}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.recommendationList}
            />
          </View>
        )}
      </ScrollView>
    </View>
  );
}

// Styles remain unchanged
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#121212",
  },
  loadingText: {
    color: "#ffffff",
    fontSize: 16,
    marginTop: 10,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#121212",
  },
  errorText: {
    color: "#ffffff",
    fontSize: 18,
  },
  header: {
    position: "relative",
    height: 450,
  },
  poster: {
    width: "100%",
    height: "100%",
  },
  headerGradient: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: "60%",
  },
  headerOverlay: {
    position: "absolute",
    bottom: 20,
    left: 20,
    right: 20,
  },
  title: {
    color: "#ffffff",
    fontSize: 32,
    fontWeight: "800",
    textShadowColor: "#000",
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 5,
  },
  tagline: {
    color: "#e0e0e0",
    fontSize: 18,
    fontStyle: "italic",
    marginTop: 8,
  },
  backButton: {
    position: "absolute",
    top: 40,
    left: 20,
    backgroundColor: "rgba(226, 18, 33, 0.8)",
    borderRadius: 25,
    padding: 10,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    color: "#ffffff",
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 16,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  overview: {
    color: "#d0d0d0",
    fontSize: 16,
    lineHeight: 26,
    fontWeight: "400",
  },
  metadataCard: {
    backgroundColor: "#1e1e1e",
    padding: 16,
    borderRadius: 12,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  metadataRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  metadataText: {
    color: "#ffffff",
    fontSize: 16,
    marginLeft: 10,
  },
  castList: {
    paddingVertical: 10,
  },
  castItem: {
    width: 110,
    marginRight: 16,
    alignItems: "center",
  },
  castImage: {
    width: 90,
    height: 90,
    borderRadius: 45,
    borderWidth: 2,
    borderColor: "#e21221",
    backgroundColor: "#333",
  },
  castName: {
    color: "#ffffff",
    fontSize: 15,
    fontWeight: "600",
    marginTop: 8,
    textAlign: "center",
  },
  castCharacter: {
    color: "#a0a0a0",
    fontSize: 13,
    textAlign: "center",
  },
  videoList: {
    paddingVertical: 10,
  },
  videoItem: {
    width: 300,
    marginRight: 16,
  },
  videoTitle: {
    color: "#ffffff",
    fontSize: 15,
    fontWeight: "500",
    marginTop: 8,
  },
  recommendationList: {
    paddingVertical: 10,
  },
});
