import React, {useEffect, useState} from 'react';
import { View, Image, StyleSheet, ImageBackground, Text } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import { Feather as Icon } from '@expo/vector-icons';
import { RectButton } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';
import locationApi from '../../services/locations';

const Home = () => {
  const navigation = useNavigation();

  const handleNavigateToMap = () => {
    navigation.navigate('Points', { city, uf });
  };

  const [uf, setUF] = useState('0');
  const [city, setCity] = useState('0');
  const [ufList, setUfList] = useState<IBGEUFResponse[]>([]);
  const [cityList, setCityList] = useState<IBGECityResponse[]>([]);

  useEffect(() => {
    locationApi.get('estados', {
      params: { orderBy: 'nome' },
    }).then(({ data }) => setUfList(data || []));
  }, []);

  useEffect(() => {
    if (uf === '0') {
      setCityList([]);
      return;
    }

    locationApi.get(`estados/${uf}/municipios`, {
      params: { orderBy: 'nome' },
    }).then(({ data }) => setCityList(data || []));
  }, [uf]);

  return (
    <ImageBackground
      source={require('../../assets/home-background.png')}
      style={styles.container}
      imageStyle={{ width: 274, height: 368 }}
    >
      <View style={styles.main}>
      <Image source={require('../../assets/logo.png')} />
      <Text style={styles.title}>Seu marketplace de coleta de resíduos</Text>
      <Text style={styles.description}>Ajudamos pessoas a encontrarem pontos de coleta de forma eficiente</Text>
      </View>

      <View style={styles.footer}>
        <RNPickerSelect
          onValueChange={(v) => setUF(v)}
          value={uf}
          items={[
            { value: '0', label: 'Selecione um Estado' },
            ...ufList.map((u) => ({ label: u.nome, value: u.sigla }))
          ]}
        />
        <RNPickerSelect
          onValueChange={(v) => setCity(v)}
          value={city}
          items={[
            { value: '0', label: 'Selecione uma Cidade' },
            ...cityList.map((c) => ({ label: c.nome, value: c.nome }))
          ]}
        />

        <RectButton style={styles.button} onPress={handleNavigateToMap}>
          <View style={styles.buttonIcon}>
            <Icon name="arrow-right" color="#fff" size={24}></Icon>
          </View>
          <Text style={styles.buttonText}>Entrar</Text>
        </RectButton>
      </View>
    </ImageBackground>
  )
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 32,
  },

  main: {
    flex: 1,
    justifyContent: 'center',
  },

  title: {
    color: '#322153',
    fontSize: 32,
    fontFamily: 'Ubuntu_700Bold',
    maxWidth: 260,
    marginTop: 64,
  },

  description: {
    color: '#6C6C80',
    fontSize: 16,
    marginTop: 16,
    fontFamily: 'Roboto_400Regular',
    maxWidth: 260,
    lineHeight: 24,
  },

  footer: {},

  select: {},

  input: {
    height: 60,
    backgroundColor: '#FFF',
    borderRadius: 10,
    marginBottom: 8,
    paddingHorizontal: 24,
    fontSize: 16,
  },

  button: {
    backgroundColor: '#34CB79',
    height: 60,
    flexDirection: 'row',
    borderRadius: 10,
    overflow: 'hidden',
    alignItems: 'center',
    marginTop: 8,
  },

  buttonIcon: {
    height: 60,
    width: 60,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    justifyContent: 'center',
    alignItems: 'center'
  },

  buttonText: {
    flex: 1,
    justifyContent: 'center',
    textAlign: 'center',
    color: '#FFF',
    fontFamily: 'Roboto_500Medium',
    fontSize: 16,
  }
});

export default Home;
