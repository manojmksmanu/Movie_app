import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  Pressable,
  Dimensions,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Movie } from '../types/movie';
import { useDispatch, useSelector } from 'react-redux';
import { toggleShortlist } from '../store/movieSlice';
import { RootState } from '../store/store';

interface MovieCardProps {
  movie: Movie;
}

const { width } = Dimensions.get('window');
const CARD_WIDTH = width / 2 - 24;

export default function MovieCard({ movie }: MovieCardProps) {
  const dispatch = useDispatch();
  const shortlistedMovies = useSelector(
    (state: RootState) => state.movies.shortlistedMovies
  );
  const isShortlisted = shortlistedMovies.some((m) => m.id === movie.id);

  const handleShortlist = () => {
    dispatch(toggleShortlist(movie));
  };

  return (
    <View style={styles.card}>
      <Image
        source={{
          uri: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
        }}
        style={styles.poster}
      />
      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={2}>
          {movie.title}
        </Text>
        <Text style={styles.rating}>
          ★ {movie.vote_average.toFixed(1)}
        </Text>
        <Pressable
          style={[styles.shortlistButton, Platform.OS === 'web' && styles.webShortlistButton]}
          onPress={handleShortlist}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
          <Ionicons
            name={isShortlisted ? 'bookmark' : 'bookmark-outline'}
            size={24}
            color={isShortlisted ? '#e21221' : '#ffffff'}
          />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: CARD_WIDTH,
    backgroundColor: '#2a2a2a',
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  poster: {
    width: '100%',
    height: CARD_WIDTH * 1.5,
    resizeMode: 'cover',
  },
  content: {
    padding: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 4,
  },
  rating: {
    fontSize: 14,
    color: '#ffd700',
    marginBottom: 8,
  },
  shortlistButton: {
    position: 'absolute',
    right: 12,
    bottom: 12,
    padding: 8,
  },
  webShortlistButton: {
    cursor: 'pointer',
  },
});