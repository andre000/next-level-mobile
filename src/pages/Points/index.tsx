import React, { useState, useEffect }  from 'react';
import Constants from 'expo-constants';
import { Feather as Icon } from '@expo/vector-icons';
import { View, StyleSheet, Image, TouchableOpacity, Text, ScrollView, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { SvgUri } from 'react-native-svg';
import api from '../../services/api';

const Points = () => {
  const navigator = useNavigation();
  const handleNavigationBack = () => {
    navigator.goBack();
  };

  const handleNavigationToDetail = (id: number) => {
    navigator.navigate('Detail', { point_id: id });
  }

  const [itemList, setItemList] = useState<Item[]>([]);
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [initialPosition, setInitialPosition] = useState<[number, number]>([0, 0]);
  const [points, setPoints] = useState<Point[]>([]);

  useEffect(() => {
    api.get('/items').then(({ data }) => {
      setItemList(data);
    });
  }, []);

  useEffect(() => {
    api.get('/points', {
      params: {
        city: 'Botucatu',
      },
    }).then(({ data }) => {
      setPoints(data);
    });
  }, []);

  useEffect(() => {
    const loadPosition = async () => {
      const { status } = await Location.requestPermissionsAsync();
      if (!status) {
        Alert.alert('Ooooops!', 'Precisamos de sua permissão para obter a localização.');
        return;
      }

      const { coords: { latitude, longitude } } = await Location.getCurrentPositionAsync();
      setInitialPosition([latitude, longitude]);
    };

    loadPosition();
  }, [])

  const handleSelectedItems = (id: number) => {
    if (selectedItems.includes(id)) {
      return setSelectedItems(selectedItems.filter((i) => i !== id));
    }

    return setSelectedItems([
      ...selectedItems,
      id,
    ]);
  };


  const itemListEl = itemList.map((i) => (
    <TouchableOpacity
      key={i.id}
      style={[
        styles.item,
        selectedItems.includes(i.id) && styles.selectedItem,
      ]}
      onPress={() => handleSelectedItems(i.id)}
      activeOpacity={0.6}
    >
      <SvgUri width={42} height={42} uri={i.image} />
      <Text style={styles.itemTitle}>{i.title}</Text>
    </TouchableOpacity>
  ));

  const markersEl = points.map((m) => (
    <Marker
      key={m.id}
      style={styles.mapMarker}
      coordinate={{
        latitude: Number(m.latitude),
        longitude: Number(m.longitude),
      }}
      onPress={() => handleNavigationToDetail(m.id)}
    >
      <View style={styles.mapMarkerContainer}>
        <Image
          style={styles.mapMarkerImage}
          source={{ uri: m.image }}
        />
        <Text style={styles.mapMarkerTitle}>{m.name}</Text>
      </View>
    </Marker>
  ));


  return (
    <>
      <View style={styles.container}>
        <TouchableOpacity onPress={handleNavigationBack}>
          <Icon name="arrow-left" size={20} color="#34cb79"></Icon>
        </TouchableOpacity>

        <Text style={styles.title}>Bem vindo</Text>
        <Text style={styles.description}>Encontre no mapa um ponto de coleta</Text>

        <View style={styles.mapContainer}>
          {initialPosition[0] !== 0 && <MapView
            style={styles.map}
            loadingEnabled={initialPosition[0] === 0}
            initialRegion={{
              latitude: initialPosition[0],
              longitude: initialPosition[1],
              latitudeDelta: 0.014,
              longitudeDelta: 0.014,
            }}
          >
            { markersEl }
          </MapView>}
        </View>
      </View>
      <View style={styles.itemsContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{
            paddingHorizontal: 20
          }}
        >
          { itemListEl }
        </ScrollView>
      </View>
    </>
  )
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 32,
    paddingTop: 20 + Constants.statusBarHeight,
  },

  title: {
    fontSize: 20,
    fontFamily: 'Ubuntu_700Bold',
    marginTop: 24,
  },

  description: {
    color: '#6C6C80',
    fontSize: 16,
    marginTop: 4,
    fontFamily: 'Roboto_400Regular',
  },

  mapContainer: {
    flex: 1,
    width: '100%',
    borderRadius: 10,
    overflow: 'hidden',
    marginTop: 16,
  },

  map: {
    width: '100%',
    height: '100%',
  },

  mapMarker: {
    width: 90,
    height: 80,
  },

  mapMarkerContainer: {
    width: 90,
    height: 70,
    backgroundColor: '#34CB79',
    flexDirection: 'column',
    borderRadius: 8,
    overflow: 'hidden',
    alignItems: 'center'
  },

  mapMarkerImage: {
    width: 90,
    height: 45,
    resizeMode: 'cover',
  },

  mapMarkerTitle: {
    flex: 1,
    fontFamily: 'Roboto_400Regular',
    color: '#FFF',
    fontSize: 13,
    lineHeight: 23,
  },

  itemsContainer: {
    flexDirection: 'row',
    marginTop: 16,
    marginBottom: 32,
  },

  item: {
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#eee',
    height: 120,
    width: 120,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 16,
    marginRight: 8,
    alignItems: 'center',
    justifyContent: 'space-between',

    textAlign: 'center',
  },

  selectedItem: {
    borderColor: '#34CB79',
    borderWidth: 2,
  },

  itemTitle: {
    fontFamily: 'Roboto_400Regular',
    textAlign: 'center',
    fontSize: 13,
  },
});

export default Points;
