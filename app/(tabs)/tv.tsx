import React, { useState, useCallback, useRef, useEffect, memo } from "react";
import {
  View,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  TextInput,
  Text,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { useInfiniteQuery } from "@tanstack/react-query";
import MovieCard from "../../components/MovieCard";
import { Movie } from "../../types/movie";
import { Ionicons } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store/store";
import { toggleShortlist } from "../../store/movieSlice";
import { fetchTVSeriesPage, searchMovies } from "../../services/movieApi";
import LottieView from "lottie-react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import SkeletonPlaceholder from "react-native-skeleton-placeholder";

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

const { width } = Dimensions.get("window");
const CARD_WIDTH = width / 2 - 24;

// Simple series skeleton component
const SeriesSkeletonItem = () => (
  <View style={{ marginBottom: 8 }}>
    <SkeletonPlaceholder
      borderRadius={4}
      backgroundColor="#461616"
      highlightColor="#ff0000"
    >
      <SkeletonPlaceholder.Item>
        <SkeletonPlaceholder.Item
          width={CARD_WIDTH}
          height={CARD_WIDTH * 1.4}
          borderRadius={10}
        />
      </SkeletonPlaceholder.Item>
    </SkeletonPlaceholder>
  </View>
);

export default function TVSeriesScreen() {
  const dispatch = useDispatch();
  const shortlistedMovies = useSelector(
    (state: RootState) => state.movies.shortlistedMovies
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [selectedList, setSelectedList] = useState(List[0].listname);
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
      queryKey: ["tvseries", debouncedQuery, selectedList],
      queryFn: ({ pageParam = 1 }) =>
        debouncedQuery
          ? searchMovies(debouncedQuery, pageParam)
          : fetchTVSeriesPage({ pageParam, showList: selectedList }),
      getNextPageParam: (lastPage) =>
        lastPage.nextPage <= lastPage.totalPages
          ? lastPage.nextPage
          : undefined,
      staleTime: 5 * 60 * 1000,
      cacheTime: 10 * 60 * 1000,
      initialPageParam: 1,
    });

  const series = data?.pages.flatMap((page: any) => page.results) ?? [];

  const handleLoadMore = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const renderSeries = useCallback(
    ({ item, index }: { item: Movie; index: number }) => {
      if (isLoading) {
        return <SeriesSkeletonItem />;
      }

      return (
        <MemoizedMovieCard
          movie={item}
          isShortlisted={shortlistedMovies.some((m) => m.id === item.id)}
          onShortlist={() => dispatch(toggleShortlist(item))}
        />
      );
    },
    [shortlistedMovies, dispatch, isLoading]
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
  const handleListToggle = useCallback((listname: string) => {
    setSelectedList(listname);
    flatListRef.current?.scrollToOffset({ offset: 0, animated: false }); // Reset scroll
  }, []);

  return (
    <SafeAreaView style={styles.container}>
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
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery("")}>
            <Ionicons name="close-circle" size={20} color="#999" />
          </TouchableOpacity>
        )}
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
            activeOpacity={0.7}
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
        data={isLoading ? Array(10).fill({}) : series}
        renderItem={renderSeries}
        keyExtractor={(item, index) =>
          item?.id?.toString() || `skeleton-${index}`
        }
        numColumns={2}
        columnWrapperStyle={styles.columnWrapper}
        contentContainerStyle={[
          styles.listContent,
          series.length === 0 && !isLoading && styles.listContentEmpty,
        ]}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.3}
        initialNumToRender={6}
        maxToRenderPerBatch={8}
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
    height: 46,
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
    justifyContent: "space-between",
    marginVertical: 10,
    marginHorizontal: 16,
  },
  toggleButton: {
    paddingVertical: 8,
    paddingHorizontal: 8,
    borderRadius: 8,
    backgroundColor: "#2a2a2a",
    flex: 1,
    marginHorizontal: 4,
    alignItems: "center",
    justifyContent:'center'
    
  },
  toggleButtonActive: {
    backgroundColor: "#e21221",
  },
  toggleText: {
    color: "#ffffff",
    fontSize: 13,
    fontWeight: "600",
    textAlign: "center",
  
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
});
