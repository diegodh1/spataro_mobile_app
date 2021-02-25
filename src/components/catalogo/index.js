import React, {Component, Fragment} from 'react';
import {connect} from 'react-redux';
import {
  Text,
  View,
  StyleSheet,
  TouchableWithoutFeedback,
  SafeAreaView,
  ScrollView,
  Picker,
  ActivityIndicator,
} from 'react-native';
import * as Animatable from 'react-native-animatable';
import {Appbar, Button} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {Image, Dimensions} from 'react-native';
import ImageZoom from 'react-native-image-pan-zoom';
import NumberFormat from 'react-number-format';
import Share from 'react-native-share';

class Catalogo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      referencias: [],
      items_fotos: [],
      items_fotos_aux: [],
      id_coleccion: '',
      id_item: '',
      base64: '',
      item: {},
      descripcion: '',
      precio: 0,
      url: '',
      cargando: false,
    };
    this.bounce = this.bounce.bind(this);
  }

  componentDidMount() {
    fetch(this.props.ruta + '/catalogo/get/colecciones', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + this.props.token,
      },
    })
      .then(res => res.json())
      .then(response => {
        if (response.status == 200) {
          let temp = [];
          for (let i = 0; i < response.payload.length; i++) {
            temp.push({
              label: response.payload[i],
              value: response.payload[i],
              key: response.payload[i],
            });
          }
          this.setState({referencias: temp});
        }
      })
      .catch(error => {
        alert(error);
      });
  }
  shareImage = () => {
    const shareOptions = {
      message: 'Romulo Calzado\n'+this.state.descripcion+'. Precio: '+this.currencyFormat(this.state.precio),
      url: 'data:image/png;base64,' + this.state.base64,
    };
    try {
      const ShareResponse = Share.open(shareOptions);
      console.log(JSON.stringify(ShareResponse));
    } catch (error) {
      console.log('Error =>', error);
    }
  };
  getItemsColeccion = value => {
    this.setState({id_coleccion: value, base64: ''});
    fetch(this.props.ruta + '/catalogo/get/fotos/' + value, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + this.props.token,
      },
    })
      .then(res => res.json())
      .then(response => {
        if (response.status == 200) {
          let temp = [];
          for (let i = 0; i < response.payload.length; i++) {
            temp.push({
              label: response.payload[i],
              value: response.payload[i],
              key: response.payload[i],
            });
          }
          this.setState({items_fotos_aux: temp});
        }
      })
      .catch(error => {
        alert(error);
      });
  };

  getFotoItem = value => {
    this.setState({id_item: value, cargando: true});
    fetch(
      this.props.ruta +
        '/catalogo/get/fotos/' +
        this.state.id_coleccion +
        '/' +
        value,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + this.props.token,
        },
      },
    )
      .then(res => res.json())
      .then(response => {
        if (response.status == 200) {
          this.setState({
            cargando: false,
            base64: response.payload.Base64,
            descripcion: response.payload.Descripcion,
            precio: response.payload.Precio,
          });
        }
      })
      .catch(error => {
        this.setState({cargando: false});
        alert(error);
      });
  };
  currencyFormat(num) {
    return '$' + num.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
  }
  bounce() {
    this.refs.view.rubberBand();
    setTimeout(() => {
      this.props.navigation.navigate('Usuario');
    }, 500);
  }
  render() {
    return (
      <SafeAreaView>
        <ScrollView>
          <Appbar.Header style={styles.header}>
            <Icon
              name="format-list-bulleted"
              size={40}
              color="white"
              onPress={() => this.props.navigation.openDrawer()}
            />
            <Appbar.Content
              title="Catalogo"
              subtitle="Visualización de Catalogo"
            />
            <TouchableWithoutFeedback onPress={this.bounce}>
              <Animatable.View ref="view">
                <Icon name="chevron-left" size={50} color="white" />
              </Animatable.View>
            </TouchableWithoutFeedback>
          </Appbar.Header>
        </ScrollView>
        <View>
          <View
            style={{
              borderWidth: 1,
              borderColor: 'gray',
              marginLeft: '2%',
              marginRight: '3%',
              marginTop: '4%',
              borderRadius: 4,
            }}>
            <Text style={{marginLeft: '2%'}}>Seleccionar Colección</Text>
            <Picker
              selectedValue={this.state.id_coleccion}
              onValueChange={(itemValue, itemIndex) =>
                this.getItemsColeccion(itemValue)
              }>
              {this.state.referencias.map(row => (
                <Picker.Item label={row.label} value={row.key} />
              ))}
            </Picker>
          </View>
          <View
            style={{
              borderWidth: 1,
              borderColor: 'gray',
              marginLeft: '2%',
              marginRight: '3%',
              marginTop: '4%',
              borderRadius: 4,
            }}>
            <Picker
              selectedValue={this.state.id_item}
              onValueChange={(itemValue, itemIndex) =>
                this.getFotoItem(itemValue)
              }>
              {this.state.items_fotos_aux.map(row => (
                <Picker.Item label={row.label} value={row.key} />
              ))}
            </Picker>
          </View>
          <ImageZoom
            cropWidth={350}
            cropHeight={400}
            imageWidth={320}
            imageHeight={320}>
            <Image
              style={{width: '100%', height: '100%'}}
              source={{
                uri: 'data:image/png;base64,' + this.state.base64,
              }}
            />
          </ImageZoom>
          <View style={{marginLeft: '2%'}}>
          <Text style={{fontWeight:'bold'}}>Descripción: {this.state.descripcion}</Text>
          <Text style={{fontWeight:'bold'}}>Precio: {this.currencyFormat(this.state.precio)}</Text>
            {!this.state.cargando ? (
              <Button
                mode="outlined"
                style={{
                  width: '50%',
                  marginTop: '5%',
                  marginBottom: '2%',
                  marginLeft: '25%',
                }}
                loading={this.state.cargando}
                theme={{colors: {primary: 'green'}}}
                onPress={() => this.shareImage()}
                icon="share-variant">
                Compartir
              </Button>
            ) : (
              <Button
                mode="outlined"
                style={{
                  width: '50%',
                  marginTop: '5%',
                  marginBottom: '2%',
                  marginLeft: '25%',
                }}
                loading={this.state.cargando}
                theme={{colors: {primary: 'red'}}}
                icon="share-variant">
                Cargando...
              </Button>
            )}
          </View>
        </View>
      </SafeAreaView>
    );
  }
}

const mapStateToProps = state => {
  return {
    usuario: state.reducer.user,
    token: state.reducer.token,
    ruta: state.reducer.ruta,
  };
};
const mapDispatchToProps = {};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Catalogo);

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#e60000',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  horizontal: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10,
  },
});
