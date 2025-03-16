import React from "react";
import { View, StyleSheet, FlatList, Text } from "react-native";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import MovieCard from "../../components/MovieCard";
import { Movie } from "../../types/movie";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ShortlistScreen() {
  const shortlistedMovies = useSelector(
    (state: RootState) => state.movies.shortlistedMovies
  );

  const renderMovie = ({ item }: { item: Movie }) => <MovieCard movie={item} />;

  if (shortlistedMovies.length === 0) {
    return (
      <View style={[styles.container, styles.emptyContainer]}>
        <Text style={styles.emptyText}>No movies shortlisted yet</Text>
        <Text style={styles.emptySubtext}>
          Tap the bookmark icon on any movie to add it to your shortlist
        </Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={shortlistedMovies}
        renderItem={renderMovie}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        columnWrapperStyle={styles.columnWrapper}
        contentContainerStyle={styles.listContent}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
    display: "flex",
    justifyContent: "center",
    flexDirection: "row",
    paddingBottom: 80,
  },
  columnWrapper: {
    justifyContent: "space-between",
  },
  listContent: {
    padding: 16,
  },
  emptyContainer: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  emptyText: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 8,
  },
  emptySubtext: {
    color: "#999999",
    fontSize: 14,
    textAlign: "center",
  },
});
