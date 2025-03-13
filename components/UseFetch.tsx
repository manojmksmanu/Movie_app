import { useState, useEffect } from 'react';
import axios from 'axios';
import { Text, View } from 'react-native';

const UseFetch = () => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const url = `https://api.themoviedb.org/3/movie/popular?language=en-US&page=1`;

        const response = await axios.get(url, {
          headers: {
            accept: 'application/json',
            Authorization:
              'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJkZmMwZTViODZkMjZiNjYzZjMwZGI4Njg1ZDgwYjUxYiIsInN1YiI6IjYzZjIzYzBkYTI0YzUwMDBhMTNkMDhjZCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.V0LM3lbW5-j0xG2HQYYR2kYltowJK7fNSEcwnLy22Kc',
          },
        });
        console.log('Response: manoj', response.data);
        setData(response.data);
      } catch (error:any) {
        console.error('Error fetching data:', error);
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <View>
      <Text> testing api </Text>
    </View>
  );
};

export default UseFetch;
