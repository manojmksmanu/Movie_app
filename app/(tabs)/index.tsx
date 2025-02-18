import React, { useState, useCallback, useRef, useEffect } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  TextInput,
  Text,
} from 'react-native';
import { useInfiniteQuery } from '@tanstack/react-query';
import MovieCard from '../../components/MovieCard';
import { Movie } from '../../types/movie';
import { Ionicons } from '@expo/vector-icons';
import debounce from 'lodash/debounce';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { toggleShortlist } from '../../store/movieSlice';
import { fetchMoviesPage, searchMovies } from '../../services/movieApi';

export default function MoviesScreen() {
  const dispatch = useDispatch();
  const shortlistedMovies = useSelector(
    (state: RootState) => state.movies.shortlistedMovies
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const flatListRef = useRef<FlatList<Movie>>(null);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(searchQuery);
      setIsSearching(!!searchQuery);
      flatListRef.current?.scrollToOffset({ offset: 0, animated: true });
    }, 500);

    return () => clearTimeout(handler);
  }, [searchQuery]);

  const handleSearch = useCallback((text: string) => {
    setSearchQuery(text);
  }, []);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isFetching,
  } = useInfiniteQuery({
    queryKey: ['movies', debouncedQuery],
    queryFn: ({ pageParam = 1 }) =>
      debouncedQuery
        ? searchMovies(debouncedQuery, pageParam)
        : fetchMoviesPage({ pageParam }),
    getNextPageParam: (lastPage) =>
      lastPage.nextPage <= lastPage.totalPages ? lastPage.nextPage : undefined,
    staleTime: 60000,
    keepPreviousData: true,
  });

  const movies = data?.pages.flatMap((page: any) => page.results) ?? [];

  const handleLoadMore = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const renderMovie = useCallback(
    ({ item }: { item: Movie }) => (
      <MovieCard
        movie={item}
        isShortlisted={shortlistedMovies.some((m) => m.id === item.id)}
        onShortlist={() => dispatch(toggleShortlist(item))}
      />
    ),
    [shortlistedMovies, dispatch]
  );

  const keyExtractor = useCallback((item: Movie) => item.id.toString(), []);

  const ListEmptyComponent = useCallback(() => {
    if (isSearching && !isLoading) {
      return (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No movies found</Text>
        </View>
      );
    }
    return null;
  }, [isSearching, isLoading]);

  const ListFooterComponent = useCallback(() => {
    if (isFetchingNextPage || (isFetching && isSearching)) {
      return (
        <View style={styles.footerLoader}>
          <ActivityIndicator size="large" color="#e21221" />
        </View>
      );
    }
    return null;
  }, [isFetchingNextPage, isFetching, isSearching]);

  return (
    <View style={styles.container}>
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
          onChangeText={handleSearch}
        />
        {isFetching && isSearching && (
          <ActivityIndicator
            size="small"
            color="#e21221"
            style={styles.searchLoader}
          />
        )}
      </View>

      <FlatList
        ref={flatListRef}
        data={movies}
        renderItem={renderMovie}
        keyExtractor={keyExtractor}
        numColumns={2}
        columnWrapperStyle={styles.columnWrapper}
        contentContainerStyle={styles.listContent}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        keyboardShouldPersistTaps="handled"
        ListFooterComponent={ListFooterComponent}
        ListEmptyComponent={ListEmptyComponent}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2a2a2a',
    margin: 16,
    borderRadius: 8,
    paddingHorizontal: 12,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchLoader: {
    marginLeft: 8,
  },
  searchInput: {
    flex: 1,
    height: 40,
    color: '#ffffff',
    fontSize: 16,
  },
  columnWrapper: {
    justifyContent: 'space-evenly',
  },
  listContent: {
    padding: 16,
  },
  footerLoader: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 40,
  },
  emptyText: {
    color: '#ffffff',
    fontSize: 16,
  },
});
