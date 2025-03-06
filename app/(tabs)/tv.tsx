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
import MovieCard from "../../components/MovieCard"; // Reuse MovieCard (assuming it works for TV series)
import { Movie } from "../../types/movie"; // Adjust if TV series needs a different type
import { Ionicons } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store/store";
import { toggleShortlist } from "../../store/movieSlice";
import { fetchTVSeriesPage, searchMovies } from "../../services/movieApi"; // Import fetchTVSeriesPage
import LottieView from "lottie-react-native";

// Memoized MovieCard wrapper to prevent unnecessary re-renders
const MemoizedMovieCard = memo(MovieCard, (prevProps: any, nextProps: any) => {
  return (
    prevProps.movie.id === nextProps.movie.id &&
    prevProps.isShortlisted === nextProps.isShortlisted
  );
});

// TV series list options
const List = [
  { name: "Airing Today", listname: "airing_today" },
  { name: "On The Air", listname: "on_the_air" },
  { name: "Popular", listname: "popular" },
  { name: "Top Rated", listname: "top_rated" },
];

export default function TVSeriesScreen() {
  const dispatch = useDispatch();
  const shortlistedMovies = useSelector(
    (state: RootState) => state.movies.shortlistedMovies
  ); // Assuming shortlist works for TV series too
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [selectedList, setSelectedList] = useState(List[0].listname); // Default to "airing_today"
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
      queryKey: ["tvseries", debouncedQuery, selectedList], // Unique key for TV series
      queryFn: ({ pageParam = 1 }) =>
        debouncedQuery
          ? searchMovies(debouncedQuery, pageParam) // Reuse movie search (adjust if needed)
          : fetchTVSeriesPage({ pageParam, showList: selectedList }), // Fetch TV series
      getNextPageParam: (lastPage) =>
        lastPage.nextPage <= lastPage.totalPages
          ? lastPage.nextPage
          : undefined,
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
      initialPageParam: 1,
    });

  const series = data?.pages.flatMap((page) => page.results) ?? [];

  const handleLoadMore = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const renderSeries = useCallback(
    ({ item }: { item: Movie }) => (
      <MemoizedMovieCard
        movie={item} // Assuming MovieCard works with TV series data
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
      !isLoading && !series.length ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>
            {debouncedQuery ? "No series found" : "No series available"}
          </Text>
        </View>
      ) : null,
    [debouncedQuery, isLoading, series.length]
  );

  // Toggle list handler
  const handleListToggle = (listname: string) => {
    setSelectedList(listname);
    flatListRef.current?.scrollToOffset({ offset: 0, animated: false }); // Reset scroll
  };

  return (
    <View style={styles.container}>
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
          placeholder="Search TV series..."
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
            disabled={isLoading}
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

      {/* Series List */}
      <FlatList
        ref={flatListRef}
        data={series}
        renderItem={renderSeries}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        columnWrapperStyle={styles.columnWrapper}
        contentContainerStyle={[
          styles.listContent,
          series.length === 0 && styles.listContentEmpty,
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
    </View>
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
  },
  toggleButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
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
    justifyContent: "space-between",
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
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
  },
  loadingText: {
    color: "#ffffff",
    fontSize: 16,
    marginTop: 10,
  },
});
