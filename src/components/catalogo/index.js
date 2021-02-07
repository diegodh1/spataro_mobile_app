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
} from 'react-native';
import * as Animatable from 'react-native-animatable';
import {Appbar} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {Image, Dimensions} from 'react-native';
import ImageZoom from 'react-native-image-pan-zoom';
import NumberFormat from 'react-number-format';

class Catalogo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      referencias: [],
      items_fotos: [],
      items_fotos_aux: [],
      id_coleccion: '',
      id_item: '',
      item:{},
      url:''
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
              label: response.payload[i].CategoriaID,
              value: response.payload[i].CategoriaID,
              key: response.payload[i].CategoriaID,
            });
          }
          this.setState({referencias: temp});
        }
      })
      .catch(error => {
        alert(error);
      });
  }
  getItemsColeccion = value => {
    this.setState({id_coleccion: value});
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
              label: response.payload[i].Descripcion,
              value: response.payload[i].CodigoErp,
              key: response.payload[i].CodigoErp,
            });
            response.payload[i].PrecioUnt = response.payload[i].PrecioUnt.toLocaleString('en-US', {
              style: 'currency',
              currency: 'USD',
            });
          }
          this.setState({items_fotos_aux: temp, items_fotos: response.payload});
        }
      })
      .catch(error => {
        alert(error);
      });
  };

  getFotoItem = value => {
    this.setState({id_item: value});
    for(let i = 0; i < this.state.items_fotos.length; i++){
      if(this.state.items_fotos[i].CodigoErp == value){
        this.setState({url:this.state.items_fotos[i].Ruta, item:this.state.items_fotos[i]})
        break
      }
    }
  };

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
              style={{width: 320, height: 320}}
              source={{
                uri:this.state.url,
              }}
            />
          </ImageZoom>
          <View
          style={{marginLeft: '2%'}}>
            <Text>Referencia: {this.state.item.Referencia}</Text>
            <Text>Descripcion: {this.state.item.Descripcion}</Text>
            <Text>Precio: ${this.state.item.PrecioUnt}</Text>
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
});
