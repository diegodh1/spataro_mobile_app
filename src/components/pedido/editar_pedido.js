import React, {Component} from 'react';
import {connect} from 'react-redux';
import {
  StyleSheet,
  SafeAreaView,
  View,
  ScrollView,
  Text,
  Modal,
  Image,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {
  TextInput,
  Button,
  Snackbar,
  Divider,
  Searchbar,
  DataTable,
  ActivityIndicator,
  Paragraph,
  Title,
  Badge,
  IconButton,
  Colors,
} from 'react-native-paper';
import RNPickerSelect from 'react-native-picker-select';
import DatePicker from 'react-native-datepicker';
import RNFS from 'react-native-fs';
import DocumentPicker from 'react-native-document-picker';
import Firma from './firma';
import AwesomeAlert from 'react-native-awesome-alerts';

class Editar_pedido extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searching: false,
      nro_pedido: '',
      fecha_despacho: '',
      observaciones: '',
      punto_envio: {},
      valor_total: 0,
      cliente: {},
      unidades: [],
      unidades_aux: [],
    };
    this.bounce = this.bounce.bind(this);
  }
  bounce() {
    this.refs.view.rubberBand();
    setTimeout(() => {
      this.props.navigation.navigate('Usuario');
    }, 500);
  }
  search_pedido() {
    this.setState({searching: true});
    if (!Number(this.state.nro_pedido)) {
      this.setState({searching: false});
      alert('El nro de pedido debe ser un número');
    } else {
      this.setState({
        pedido: {},
      });
      fetch(this.props.ruta + '/pedido/search/' + this.state.nro_pedido, {
        method: 'GET', // data can be `string` or {object}!
        headers: {
          Authorization: 'Bearer ' + this.props.token,
          'Content-Type': 'application/json',
        },
      })
        .then(res => res.json())
        .then(response => {
          if (response.status == 200) {
            let fecha = response.payload.Pedido.PvcFechaEntrega.split('T');
            this.setState({
              fecha_despacho: fecha[0],
              observaciones: response.payload.Pedido.PvcNotas,
            });
            let sum = 0;
            for (let i = 0; i < response.payload.Detalle.length; i++) {
              sum +=
                response.payload.Detalle[i].PvcDetCant *
                response.payload.Detalle[i].PvcDetPrecioUnt;
            }
            this.setState({
              searching: false,
              cliente: response.payload.Cliente,
              punto_envio: response.payload.PuntoEnvio,
              unidades: response.payload.Detalle,
              unidades_aux: response.payload.DetallesItems,
              valor_total: sum,
            });
          } else {
            this.setState({searching: false});
            console.log('error');
          }
        })
        .catch(error => {
          this.setState({searching: false});
          alert(error);
        });
    }
  }
  currencyFormat(num) {
    return '$' + num.toFixed(0).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
  }
  formatDate(value) {
    let temp = value.split('');
    return (
      temp[6] +
      '' +
      temp[7] +
      '/' +
      temp[4] +
      '' +
      temp[5] +
      '/' +
      temp[0] +
      '' +
      temp[1] +
      '' +
      temp[2] +
      '' +
      temp[3]
    );
  }
  dateFormatAux(value) {
    let temp = value.split('-')
    if(value == ""){
      return ""
    }
    return temp[2]+"/"+temp[1]+"/"+temp[0];
  }
  render() {
    return (
      <SafeAreaView>
        <ScrollView>
          <View>
            {this.state.searching ? (
              <View style={styles.center_view}>
                <ActivityIndicator
                  animating={true}
                  style={{top: '35%', right: '20%', position: 'absolute'}}
                  color="red"
                />
                <Text style={{fontSize: 20, marginTop: '5%'}}>Buscando</Text>
              </View>
            ) : null}
          </View>
          <View style={{flex: 1, flexDirection: 'row', marginTop: '5%'}}>
            <TextInput
              mode="outlined"
              multiline={false}
              label="Buscar Nro Pedido"
              theme={{colors: {primary: 'red'}}}
              style={{width: '75%', marginLeft: '5%'}}
              value={this.state.nro_pedido}
              onChangeText={text => this.setState({nro_pedido: text})}
            />
            <IconButton
              icon="magnify"
              color={Colors.red500}
              size={45}
              onPress={() => this.search_pedido()}
            />
          </View>
          <View style={{marginLeft: '5%'}}>
            <Title>Fecha de Despacho</Title>
            <Paragraph style={{color: 'green'}}>
              {this.dateFormatAux(this.state.fecha_despacho)}
            </Paragraph>
            <Title>Observaciones</Title>
            <Paragraph>{this.state.observaciones}</Paragraph>
            <Title>Información del Cliente</Title>
            <Paragraph>{'NIT: ' + (this.state.cliente.NitTercero == undefined? "": this.state.cliente.NitTercero)}</Paragraph>
            <Paragraph>
              {'NOMBRE: ' + (this.state.cliente.NombreTercero == undefined? "": this.state.cliente.NombreTercero)}
            </Paragraph>
            <Title>Información del Punto de envío</Title>
            <Paragraph>
              {'ID Sucursal: ' + (this.state.punto_envio.IDSucursal == undefined? "": this.state.punto_envio.IDSucursal)}
            </Paragraph>
            <Paragraph>
              {'Punto de Envío: ' + (this.state.punto_envio.PuntoEnvio == undefined? "": this.state.punto_envio.PuntoEnvio)}
            </Paragraph>
            <Title style={{textAlign: 'center'}}>Detalle del Pedido</Title>
            <DataTable>
              <DataTable.Header>
                <DataTable.Title>Referencia</DataTable.Title>
                <DataTable.Title>Color</DataTable.Title>
                <DataTable.Title>Talla</DataTable.Title>
                <DataTable.Title>Unidades</DataTable.Title>
                <DataTable.Title>Precio Unitario</DataTable.Title>
                <DataTable.Title>Precio Total</DataTable.Title>
                <DataTable.Title>Fecha</DataTable.Title>
              </DataTable.Header>
            </DataTable>
            {this.state.unidades.map((row, index) => (
              <DataTable.Row
                key={index}
                onPress={() => this.delete_item_pos(index)}>
                <DataTable.Cell>
                  {this.state.unidades_aux[index].Descripcion}
                </DataTable.Cell>
                <DataTable.Cell>
                  {this.state.unidades_aux[index].Ext1Color}
                </DataTable.Cell>
                <DataTable.Cell>{row.PvcDetExt2}</DataTable.Cell>
                <DataTable.Cell>{row.PvcDetCant}</DataTable.Cell>
                <DataTable.Cell>
                  {this.currencyFormat(row.PvcDetPrecioUnt)}
                </DataTable.Cell>
                <DataTable.Cell>
                  {this.currencyFormat(row.PvcDetPrecioUnt * row.PvcDetCant)}
                </DataTable.Cell>
                <DataTable.Cell>
                  {this.formatDate(row.PvcDetFechaEntrega)}
                </DataTable.Cell>
              </DataTable.Row>
            ))}
            <Paragraph style={{textAlign: 'center', color: 'green',marginTop:'5%'}}>
              {'Valor Total de los items: ' +
                this.currencyFormat(this.state.valor_total)}
            </Paragraph>
          </View>
        </ScrollView>
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
)(Editar_pedido);

const styles = StyleSheet.create({
  center_view: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 4,
    color: 'black',
    paddingRight: 30, // to ensure the text is never behind the icon
  },
  inputAndroid: {
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 0.5,
    borderColor: 'purple',
    borderRadius: 8,
    color: 'black',
    width: '95%',
    marginLeft: '2%',
    marginTop: '5%',
    paddingRight: 30, // to ensure the text is never behind the icon
  },
});
