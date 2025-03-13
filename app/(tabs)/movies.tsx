import React, { useState, useCallback, useRef, useEffect, memo } from "react";
import {
  View,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  TextInput,
  Text,
  TouchableOpacity,
} from "react-native";
import { useInfiniteQuery } from "@tanstack/react-query";
import MovieCard from "../../components/MovieCard";
import { Movie } from "../../types/movie";
import { Ionicons } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store/store";
import { toggleShortlist } from "../../store/movieSlice";
import {
  fetchMoviesPage,
  fetchMoviesPageType,
  searchMovies,
} from "../../services/movieApi";
import LottieView from "lottie-react-native";
import { SafeAreaView } from "react-native-safe-area-context";




// Memoized MovieCard wrapper to prevent unnecessary re-renders
const MemoizedMovieCard = memo(MovieCard, (prevProps: any, nextProps: any) => {
  return (
    prevProps.movie.id === nextProps.movie.id &&
    prevProps.isShortlisted === nextProps.isShortlisted
  );
});

// Movie list options
const List = [
  { name: "Now Playing", listname: "now_playing" },
  { name: "Popular", listname: "popular" },
  { name: "Top Rated", listname: "top_rated" },
  { name: "Upcoming", listname: "upcoming" },
];

export default function MoviesScreen() {
  const dispatch = useDispatch();
  const shortlistedMovies = useSelector(
    (state: RootState) => state.movies.shortlistedMovies
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [selectedList, setSelectedList] = useState(List[0].listname); // Default to "now_playing"
  const flatListRef = useRef<FlatList>(null);

  // Optimized debounce with useCallback
  const handleDebounce = useCallback((query: string) => {
    setDebouncedQuery(query);
    if (query) {
      flatListRef.current?.scrollToOffset({ offset: 0, animated: false });
    }
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => handleDebounce(searchQuery), 300);
    return () => clearTimeout(timeout);
  }, [searchQuery, handleDebounce]);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useInfiniteQuery({
      queryKey: ["movies", debouncedQuery, selectedList], // Include selectedList in queryKey
      queryFn: ({ pageParam = 1 }) =>
        debouncedQuery
          ? searchMovies(debouncedQuery, pageParam)
          : fetchMoviesPageType({ pageParam, showList: selectedList }), // Pass selectedList
      getNextPageParam: (lastPage) =>
        lastPage.nextPage <= lastPage.totalPages
          ? lastPage.nextPage
          : undefined,
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
      initialPageParam: 1,
    });

  const movies = data?.pages.flatMap((page) => page.results) ?? [];

  const handleLoadMore = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const renderMovie = useCallback(
    ({ item }: { item: Movie }) => (
      <MemoizedMovieCard
        movie={item}
        isShortlisted={shortlistedMovies.some((m) => m.id === item.id)}
        onShortlist={() => dispatch(toggleShortlist(item))}
      />
    ),
    [shortlistedMovies, dispatch]
  );

  const ListFooter = useCallback(
    () =>
      isFetchingNextPage ? (
        <ActivityIndicator
          size="large"
          color="#e21221"
          style={styles.footerLoader}
        />
      ) : null,
    [isFetchingNextPage]
  );

  const ListEmpty = useCallback(
    () =>
      !isLoading && !movies.length ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>
            {debouncedQuery ? "No movies found" : "No movies available"}
          </Text>
        </View>
      ) : null,
    [debouncedQuery, isLoading, movies.length]
  );

  // Toggle list handler
  const handleListToggle = (listname: string) => {
    setSelectedList(listname);
    flatListRef.current?.scrollToOffset({ offset: 0, animated: false }); // Reset scroll
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Full-screen Loading Indicator */}
      {isLoading && (
        <View style={styles.loadingOverlay}>
            <LottieView
                      source={require("../../assets/lottie/Loading.json")}
                      autoPlay
                      loop
                      style={{ width: 200, height: 200 }}
                    />
        </View>
      )}

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Ionicons
          name="search"
          size={20}
          color="#ffffff"
          style={styles.searchIcon}
        />
        <TextInput
          style={styles.searchInput}
          placeholder="Search movies..."
          placeholderTextColor="#999"
          value={searchQuery}
          onChangeText={setSearchQuery}
          autoCapitalize="none"
          returnKeyType="search"
        />
      </View>

      {/* Toggle Buttons */}
      <View style={styles.toggleContainer}>
        {List.map((item) => (
          <TouchableOpacity
            key={item.listname}
            style={[
              styles.toggleButton,
              selectedList === item.listname && styles.toggleButtonActive,
            ]}
            onPress={() => handleListToggle(item.listname)}
            disabled={isLoading} // Disable buttons during loading
          >
            <Text
              style={[
                styles.toggleText,
                selectedList === item.listname && styles.toggleTextActive,
              ]}
            >
              {item.name}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Movie List */}
      <FlatList
        ref={flatListRef}
        data={movies}
        renderItem={renderMovie}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        columnWrapperStyle={styles.columnWrapper}
        contentContainerStyle={[
          styles.listContent,
          movies.length === 0 && styles.listContentEmpty,
        ]}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.3}
        initialNumToRender={10}
        maxToRenderPerBatch={10}
        windowSize={5}
        ListFooterComponent={ListFooter}
        ListEmptyComponent={ListEmpty}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#2a2a2a",
    marginHorizontal: 16,
    marginVertical: 10,
    borderRadius: 8,
    paddingHorizontal: 12,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 40,
    color: "#ffffff",
    fontSize: 16,
  },
  toggleContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginVertical: 10,
    marginHorizontal: 16,
    gap: 5,
  },
  toggleButton: {
    paddingVertical: 8,
    paddingHorizontal: 8,
    borderRadius: 10,
    backgroundColor: "#2a2a2a",
  },
  toggleButtonActive: {
    backgroundColor: "#e21221",
  },
  toggleText: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "600",
  },
  toggleTextActive: {
    color: "#ffffff",
  },
  columnWrapper: {
    justifyContent: "space-evenly",
    paddingHorizontal: 8,
  },
  listContent: {
    paddingHorizontal: 8,
    paddingBottom: 20,
  },
  listContentEmpty: {
    flexGrow: 1,
  },
  footerLoader: {
    marginVertical: 20,
  },
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  emptyText: {
    color: "#ffffff",
    fontSize: 16,
    textAlign: "center",
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject, // Full-screen overlay
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10, // On top of everything
  },
  loadingText: {
    color: "#ffffff",
    fontSize: 16,
    marginTop: 10,
  },
});
