import React, { useState, useEffect } from 'react';
import { Image, View, Text, TextInput, Button, FlatList, StyleSheet, Alert, TouchableOpacity, ScrollView } from 'react-native';
import * as Location from 'expo-location';
import MapView, { Marker } from 'react-native-maps';
import logo from './assets/favicon.png';
import logo1 from './assets/lv.png';


const PaginaInicial = () => (
  <View style={styles.pagina}>
    <Text style={styles.textoPagina}>
      <Image style={styles.images} source={logo1} /> {"\n\n\n\n"}
      {"\n"}SEU APLICATIVO DE CARONAS COMPARTILHADAS!{"\n"}{"\n"}
      {"\n"}Abra o menu e cadastre sua rota!
    </Text>
  </View>
);

const Sobrenos = () => (
  <View style={styles.pagina2}>
    <Text style={styles.images}><Image style={styles.images1} source={logo} /> </Text>
    <Text style={styles.textoPagina1}>
    Quem Somos?{"\n"}
Nós somos estudantes do terceiro período do curso de Análise e Desenvolvimento de Sistemas do SENAC Pernambuco, envolvidos no projeto Embarque Digital.{"\n"}{"\n"}
Este é um projeto para a disciplina de Desenvolvimento Mobile. O foco do nosso projeto é desenvolver um aplicativo em React Native + API CRUD em NodeJS com MongoDB, que facilitará o compartilhamento de caronas entre os colaboradores de uma empresa. 
{"\n"}{"\n"}Alunos: Adonis Vinicius, Alan Vitor, Cícero Antônio, Esmeralda Freire, João Victor Santos, Luis Vinicius, Mateus Caik. 
    </Text>
  </View>
);

const Tecnologias = () => (
  <View style={styles.pagina}>
    <Text style={styles.textoPagina1}>
      {"\n"}<Text style={styles.textoPagina}>TECNOLOGIAS UTILIZADAS:</Text>{"\n"}{"\n"}
      HTML, CSS, JavaScript.{"\n"}
      React Native.{"\n"}
      NodeJS. {"\n"}
      {"\n"}<Text style={styles.textoPagina}>BANCO DE DADOS:</Text>{"\n"}
      MongoDB. {"\n"}
      {"\n"}<Text style={styles.textoPagina}>VERSÃO:</Text>{"\n"}
      1.1.0. {"\n"}
    </Text>
  </View>
);

const Oaplicativo = () => (
  <View style={styles.pagina}>
    <Text style={styles.textoPagina}>
      {"\n"}O Aplicativo de Caronas para o Trabalho (RideShare) é uma ferramenta prática e inovadora destinada a transformar a maneira como os colaboradores se deslocam até seus locais de trabalho. {"\n"}
      Com a utilização deste aplicativo, os usuários podem encontrar colegas que façam rotas similares e assim, compartilhar viagens de carro, o que não apenas economiza em custos de transporte, como também contribui para a redução da emissão de poluentes e congestionamentos nas estradas.{"\n"}
      {"\n"} Cadastre sua rota agora, abrindo o menu e clicando em "cadastrar sua rota"!
    </Text>
  </View>
);

const App = () => {
  const [menuAberto, setMenuAberto] = useState(false);
  const [paginaAtual, setPaginaAtual] = useState('Página Inicial');
  const [denuncias, setDenuncias] = useState([]);
  const [nome, setNome] = useState('');
  const [rota, setRota] = useState('');
  const [placa, setPlaca] = useState('');
  const [veiculo, setVeiculo] = useState('');
  const [hora, setHora] = useState('');
  const [zap, setZap] = useState('');
  const [local, setLocal] = useState(null);
  const [location, setLocation] = useState(null);

  useEffect(() => {
    fetchDenuncias();
    getCurrentLocation();
  }, []);

  const getCurrentLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permissão de localização negada');
      return;
    }

    let locationData = await Location.getCurrentPositionAsync({});
    setLocation(locationData);
    setLocal({
      latitude: locationData.coords.latitude,
      longitude: locationData.coords.longitude,
    });
  };

  const fetchDenuncias = async () => {
    try {
      const response = await fetch('http://192.168.1.2:3000/denuncias');
      const data = await response.json();
      setDenuncias(data);
    } catch (error) {
      console.error(error);
    }
  };

  const addDenuncia = async () => {
    if (!nome || !rota || !veiculo || !placa || !hora || !zap || !local) {
      Alert.alert('Erro', 'Preencha todos os campos e aguarde a localização ser obtida');
      return;
    }

    const denuncia = { nome, rota, veiculo, placa, hora, zap, local };

    try {
      const response = await fetch('http://192.168.1.2:3000/denuncias', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(denuncia),
      });
      if (response.ok) {
        fetchDenuncias();
        setNome('');
        setRota('');
        setVeiculo('');
        setPlaca('');
        setHora('');
        setZap('');
      }
    } catch (error) {
      console.error(error);
    }
  };

  const deleteDenuncia = async (id) => {
    try {
      const response = await fetch(`http://192.168.1.2:3000/denuncias/${id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        fetchDenuncias();
      }
    } catch (error) {
      console.error(error);
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.item}>
      <Text style={styles.title}>{item.nome}</Text>
      <Text>{item.rota}</Text>
      <Text>{item.veiculo}</Text>
      <Text>{item.placa}</Text>
      <Text>{item.hora}</Text>
      <Text>{item.zap}</Text>
      <Text>Local: {item.local.latitude}, {item.local.longitude}</Text>
      <Button title="Excluir" onPress={() => deleteDenuncia(item._id)} />
    </View>
  );

  const toggleMenu = () => {
    setMenuAberto(!menuAberto);
  };

  const navegarPara = (pagina) => {
    setPaginaAtual(pagina);
    setMenuAberto(false);
  };

  const renderizarPagina = () => {
    switch (paginaAtual) {
      case 'Página Inicial':
        return <PaginaInicial />;
      case 'Sobre Nos':
        return <Sobrenos />;
      case 'Tecnologias':
        return <Tecnologias />;
      case 'Oaplicativo':
        return <Oaplicativo />;
      case 'Registrar Rotas':
        return (
          <ScrollView>
            <View style={styles.locationContainer}>
              {location && (
                <>
                  <Text style={styles.subtitle}>Veja Sua Localização Aqui!</Text>
                  <Text>Latitude: {location.coords.latitude}</Text>
                  <Text>Longitude: {location.coords.longitude}</Text>
                  <MapView
                    style={styles.map}
                    initialRegion={{
                      latitude: location.coords.latitude,
                      longitude: location.coords.longitude,
                      latitudeDelta: 0.0922,
                      longitudeDelta: 0.0421,
                    }}
                  >
                    <Marker
                      coordinate={{
                        latitude: location.coords.latitude,
                        longitude: location.coords.longitude,
                      }}
                      title="Você Está Aqui!"
                    />
                  </MapView>
                </>
              )}
            </View>
            <View>
              <Text style={styles.header}>Registre sua rota Aqui!</Text>
              <TextInput
                style={styles.input}
                placeholder="Nome"
                value={nome}
                onChangeText={setNome}
              />
              <TextInput
                style={styles.input}
                placeholder="Rota"
                value={rota}
                onChangeText={setRota}
              />
              <TextInput
                style={styles.input}
                placeholder="Veiculo"
                value={veiculo}
                onChangeText={setVeiculo}
              />
              <TextInput
                style={styles.input}
                placeholder="Placa"
                value={placa}
                onChangeText={setPlaca}
              />
              <TextInput
                style={styles.input}
                placeholder="Hora"
                value={hora}
                onChangeText={setHora}
              />
              <TextInput
                style={styles.input}
                placeholder="WhatsApp"
                value={zap}
                onChangeText={setZap}
              />
              <Button title="Registrar Rotas" onPress={addDenuncia} />
              <FlatList
                data={denuncias}
                renderItem={renderItem}
                keyExtractor={(item) => item._id.toString()}
              />
            </View>
          </ScrollView>
        );
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.headerText}>RIDESHARE</Text>
        <TouchableOpacity onPress={toggleMenu} style={styles.menuButton}>
          <Text style={styles.menuText}>{menuAberto ? 'Menu' : 'Menu'}</Text>
        </TouchableOpacity>
      </View>
      {menuAberto && (
        <View style={styles.menu}>
          <TouchableOpacity style={styles.menuItem} onPress={() => navegarPara('Página Inicial')}>
            <Text>Página Inicial</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem} onPress={() => navegarPara('Sobre Nos')}>
            <Text>Sobre Nós</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem} onPress={() => navegarPara('Tecnologias')}>
            <Text>Tecnologia</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem} onPress={() => navegarPara('Oaplicativo')}>
            <Text>O Aplicativo</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem} onPress={() => navegarPara('Registrar Rotas')}>
            <Text>Registrar Rotas</Text>
          </TouchableOpacity>
        </View>
      )}
      <View style={styles.content}>{renderizarPagina()}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: '#F3EFEE', 
    paddingTop: 50,
    paddingHorizontal: 20,
  },
  headerContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000', 
  },
  menuButton: {
    position: 'absolute',
    right: 20,
  },
  menuText: {
    fontSize: 16,
    color: '#FF9600', 
  },
  menu: {
    marginTop: 10,
    backgroundColor: '#e0e0e0',
    padding: 10,
    borderRadius: 5,
    width: 150,
  },
  menuItem: {
    padding: 5,
    marginBottom: 5,
  },
  content: {
    width: '100%',
    flex: 1,
    padding: 20,
  },
  pagina: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    backgroundColor: '#F3EFEE', 
    padding: 20,
  },
  pagina2: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    backgroundColor: '#F3EFEE', 
    padding: 20,
  },
  textoPagina: {
    fontSize: 16,
    textAlign: 'center',
    color: '#000',
  },
  images: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 20,
  },
  images1: {
    width: 300,
    height: 300,
    borderRadius: 150,
  },
  images2: {
    width: 500,
    height: 500,
    borderRadius: 250,
  },
  textoPagina1: {
    fontSize: 16,
    textAlign: 'left',
    padding: 20,
    color: '#000',  
  },
  locationContainer: {
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#000', 
  },
  map: {
    width: '100%',
    height: 300,
    marginBottom: 10,
    borderRadius: 20, 
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
    color: '#000', 
  },
  input: {
    height: 40,
    borderColor: '#000', 
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    width: '100%',
    color: '#000', 
    backgroundColor: '#fff', 
  },
  item: {
    backgroundColor: '#e0e0e0',
    padding: 20,
    marginVertical: 8,
    borderRadius: 5,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000', 
  },
});

export default App;
