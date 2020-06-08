import React, { useEffect, useState, ChangeEvent } from 'react';
import { Feather as Icon } from '@expo/vector-icons'
import { Text, ImageBackground, View, Image, StyleSheet } from 'react-native';
import { RectButton } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';
import RNPickerSelect from 'react-native-picker-select';
import api from '../../services/api';

interface IBGEStateResponse {
  sigla: string;
}

interface IBGECityResponse {
  nome: string;
}

interface SelectValues {
  label: string;
  value: string;
}

const Home = () => {
  const navigation = useNavigation();

  const [states, setStates] = useState<SelectValues[]>([]);
  const [selectedState, setSelectedState] = useState('0');
  const [cities, setCity] = useState<SelectValues[]>([]);
  const [selectedCity, setSelectedCity] = useState('0');

  useEffect(() => {
    api.get<IBGEStateResponse[]>('https://servicodados.ibge.gov.br/api/v1/localidades/estados').then(response => {
        setStates(response.data.map(uf => { return { label: uf.sigla, value: uf.sigla } }).sort((a,b) => a.label>b.label ? 1 : -1));
    })
  }, []);

  useEffect(() => {
      if (selectedState === '0') {
          return;
      }

      api.get<IBGECityResponse[]>(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedState}/municipios`).then(response => {
          setCity(response.data.map(city => { return { label: city.nome, value: city.nome } }));
      })
  }, [selectedState]);

  function handleNavigateToPoints() {
    navigation.navigate('Points', {
      state: selectedState,
      city: selectedCity,
    });
  }

  return (
    <ImageBackground style={styles.container} source={require('../../assets/home-background.png')} imageStyle={{ width: 274, height: 368}} > 
      <View style={styles.main}>
        <Image source={require('../../assets/logo.png')} />
        <Text style={styles.title}>Seu marketplace de coleta de resíduos</Text>
        <Text style={styles.description}>Ajudamos pessoas a encontrarem pontos de coleta de forma eficiente</Text>
      </View>

      <View style={styles.footer}>
        <RNPickerSelect
          placeholder={{
            label: 'Selecione seu estado'
          }}
          style={pickerSelectStyles}
          onValueChange={(value) => setSelectedState(value)}
          items={states}
          Icon={() => {
            return <Icon name="chevron-down" color="#000" size={26} />
          }}
        />
        <RNPickerSelect
          placeholder={{
            label: 'Selecione primeiro o estado'
          }}
          style={pickerSelectStyles}
          onValueChange={(value) => setSelectedCity(value)}
          items={cities}
          Icon={() => {
            return <Icon name="chevron-down" color="#000" size={26} />
          }}
        />

        <RectButton style={styles.button} onPress={handleNavigateToPoints}>
          <View style={styles.buttonIcon}>
            <Text>
              <Icon name="arrow-right" color="#FFF" size={24} />
            </Text>
          </View>
          <Text style={styles.buttonText}>
            Entrar
          </Text>
        </RectButton>
      </View>
    </ImageBackground>
  );
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

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    height: 60,
    backgroundColor: '#FFF',
    borderRadius: 10,
    marginBottom: 8,
    paddingHorizontal: 24,
    fontSize: 16,

  },
  inputAndroid: {
    height: 60,
    backgroundColor: '#FFF',
    borderRadius: 10,
    marginBottom: 8,
    paddingHorizontal: 24,
    fontSize: 16,
  },
  iconContainer: {
    top: 16,
    right: 14,
  }
});

export default Home;