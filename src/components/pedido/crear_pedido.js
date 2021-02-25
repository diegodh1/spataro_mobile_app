import React, {Component} from 'react';
import {connect} from 'react-redux';
import {
  StyleSheet,
  SafeAreaView,
  View,
  ScrollView,
  Text,
  Modal,
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
import {Value} from 'react-native-reanimated';

class Crear_pedido extends Component {
  constructor(props) {
    super(props);
    let minDate = new Date();
    minDate.setDate(minDate.getDate() + 30);
    let enable_date = [
      minDate.getFullYear(),
      ('0' + (minDate.getMonth() + 1)).slice(-2),
      ('0' + minDate.getDate()).slice(-2),
    ].join('/');
    console.log(enable_date);
    this.state = {
      nombre_cliente: '',
      fecha: '',
      name: '',
      minDate: minDate,
      firma: '',
      observacion: '',
      cargando: false,
      clientes: [],
      clientes_aux: [],
      puntos_venta: [],
      punto_venta: '',
      searching: false,
      date: '',
      id_pedido: '',
      id_cliente: '',
      selected_cliente: {nombre: '', apellido: '', correo: '', id_cliente: ''},
      show_snack: false,
      message: '',
      show_firma: false,
      show_unidades: false,
      file: {uri: ''},
      base64: '',
      id_referencia: '',
      color: '',
      talla: '',
      precio_unitario: '',
      unidad_precio: '',
      referencias: [],
      colores_refencia: [],
      ref_color_tallas: [],
      referencias_aux: [],
      unidades: [],
      cantidad: 0,
      cartera: [],
      saldo: 0,
      saldo_aux: 0,
      bloqueado: 0,
      valor_compra: 0,
      item: {},
      informacion: {items: []},
      actualizando: false,
      show_dialog: false,
      estado_pedido: 'PENDIENTE',
      direccion_despacho: '',
      cupo_total: 0,
      total_facturas: 0,
      talla_34: 0,
      talla_35: 0,
      talla_36: 0,
      talla_37: 0,
      talla_38: 0,
      talla_39: 0,
      talla_40: 0,
      talla_41: 0,
      talla_42: 0,
      talla_43: 0,
      talla_44: 0,
      talla_45: 0,
      id_lista: '',
      tallas_item: {},
      codigo_erp: '',
    };
    this.state.tallas_item['34'] = true;
    this.state.tallas_item['35'] = true;
    this.state.tallas_item['36'] = true;
    this.state.tallas_item['37'] = true;
    this.state.tallas_item['38'] = true;
    this.state.tallas_item['39'] = true;
    this.state.tallas_item['40'] = true;
    this.state.tallas_item['41'] = true;
    this.state.tallas_item['42'] = true;
    this.state.tallas_item['43'] = true;
    this.state.tallas_item['44'] = true;
    this.state.tallas_item['45'] = true;
    this.bounce = this.bounce.bind(this);
  }

  search_cliente_n(value) {
    this.setState({nombre_cliente: value, searching: true, clientes_aux: []});
    if (value != '' && value != undefined && value != null) {
      setTimeout(() => {
        value.replace(' ', '%');
        fetch(this.props.ruta + '/client/search/' + value, {
          method: 'GET', // data can be `string` or {object}!
          headers: {
            Authorization: 'Bearer ' + this.props.token,
            'Content-Type': 'application/json',
          },
        })
          .then(res => res.json())
          .then(response => {
            this.setState({clientes: response.payload, searching: false});
            let clientes = [];
            for (let i = 0; i < response.payload.length; i++) {
              let nombre = response.payload[i].NombreTercero;
              clientes.push({
                label: nombre,
                value: response.payload[i].NitTercero,
                key: response.payload[i].NitTercero,
              });
            }
            clientes = [...new Set(clientes)];
            this.setState({clientes_aux: clientes});
          })
          .catch(error => {
            this.setState({clientes: [], searching: false});
            alert(error);
          });
      }, 200);
    } else {
      this.setState({clientes: [], searching: false});
    }
  }

  search_referencia(value) {
    this.setState({
      id_referencia: value,
      searching: true,
      colores_refencia: [],
      ref_color_tallas: [],
    });
    fetch(this.props.ruta + '/pedido/search/item', {
      method: 'POST',
      body: JSON.stringify({
        DescripcionErp: value,
      }), // data can be `string` or {object}!
      headers: {
        Authorization: 'Bearer ' + this.props.token,
        'Content-Type': 'application/json',
      },
    })
      .then(res => res.json())
      .then(response => {
        let temp = [];
        for (let i = 0; i < response.payload.length; i++) {
          temp.push({
            label: response.payload[i].DescripcionErp,
            value: response.payload[i].CodigoErp,
            key: response.payload[i].CodigoErp,
          });
        }
        this.setState({
          referencias_aux: response.payload,
          referencias: temp,
          searching: false,
        });
      })
      .catch(error => {
        this.setState({searching: false});
        alert(error);
      });
  }
  get_color_tallas(value) {
    this.setState({id_referencia: value, codigo_erp: value});
    this.search_color(value);
  }
  search_color(value) {
    this.setState({
      searching: true,
      ref_color_tallas: [],
    });
    console.log(value);
    fetch(
      this.props.ruta +
        '/pedido/get/color/' +
        value +
        '/' +
        this.state.id_lista,
      {
        method: 'GET', // data can be `string` or {object}!
        headers: {
          Authorization: 'Bearer ' + this.props.token,
          'Content-Type': 'application/json',
        },
      },
    )
      .then(res => res.json())
      .then(response => {
        let temp = [];
        for (let i = 0; i < response.payload.length; i++) {
          temp.push({
            label: response.payload[i].Ext1Color,
            value: response.payload[i],
            key: response.payload[i].Ext1,
          });
        }
        this.setState({
          colores_refencia: temp,
          searching: false,
        });
      })
      .catch(error => {
        this.setState({searching: false});
        alert(error);
      });
  }

  search_talla(value) {
    this.setState({
      color: value.Ext1,
      searching: true,
      ref_color_tallas: [],
    });

    fetch(
      this.props.ruta +
        '/pedido/get/talla/' +
        this.state.codigo_erp +
        '/' +
        this.state.id_lista +
        '/' +
        value.Ext1,
      {
        method: 'GET', // data can be `string` or {object}!
        headers: {
          Authorization: 'Bearer ' + this.props.token,
          'Content-Type': 'application/json',
        },
      },
    )
      .then(res => res.json())
      .then(response => {
        this.setState({
          ref_color_tallas: response.payload,
          searching: false,
        });
        let tallas_temp = this.state.tallas_item;
        for (let j = 0; j < response.payload.length; j++) {
          tallas_temp[response.payload[j].Ext2.trim()] = false;
        }
        this.setState({tallas_item: tallas_temp});
      })
      .catch(error => {
        this.setState({searching: false});
        alert(error);
      });
  }
  get_cartera_cliente(value) {
    fetch(
      this.props.ruta +
        '/client/cartera/' +
        this.state.id_cliente +
        '/' +
        value.IDSucursal,
      {
        method: 'GET', // data can be `string` or {object}!
        headers: {
          Authorization: 'Bearer ' + this.props.token,
          'Content-Type': 'application/json',
        },
      },
    )
      .then(res => res.json())
      .then(response => {
        this.setState({cartera: response.payload});
        this.get_saldo_cliente(value, response.payload);
      })
      .catch(error => {
        this.setState({cartera: []});
      });
  }

  get_saldo_cliente(value, cartera) {
    fetch(
      this.props.ruta +
        '/client/saldo/' +
        this.state.id_cliente +
        '/' +
        value.IDSucursal,
      {
        method: 'GET', // data can be `string` or {object}!
        headers: {
          Authorization: 'Bearer ' + this.props.token,
          'Content-Type': 'application/json',
        },
      },
    )
      .then(res => res.json())
      .then(response => {
        let cupo = response.payload.CupoCredito;
        let sum = 0;
        for (let i = 0; i < cartera.length; i++) {
          sum += cartera[i].Saldo;
        }
        cupo = cupo - sum;
        this.setState({
          saldo_aux: cupo,
          saldo: cupo,
          cupo_total: response.payload.CupoCredito,
          total_facturas: sum,
          bloqueado: response.payload.F201IndEstadoBloqueado,
        });
      })
      .catch(error => {
        this.setState({saldo: 0, saldo_aux: 0, bloqueado: 0});
      });
  }
  currencyFormat(num) {
    return '$' + num.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
  }
  dateFormat(date) {
    let temp = date.split('T');
    return temp[0];
  }
  get_cartera_saldo(value) {
    this.setState({
      punto_venta: value.F215Rowid,
      id_lista: value.IDListaPrecio,
    });
    this.get_cartera_cliente(value);
  }
  search_puntos_envio(value) {
    this.setState({
      puntos_venta: [],
    });
    fetch(this.props.ruta + '/pedido/get/puntos/' + value, {
      method: 'GET', // data can be `string` or {object}!
      headers: {
        Authorization: 'Bearer ' + this.props.token,
        'Content-Type': 'application/json',
      },
    })
      .then(res => res.json())
      .then(response => {
        let temp = [];
        for (let i = 0; i < response.payload.length; i++) {
          temp.push({
            label: response.payload[i].PuntoEnvio,
            value: response.payload[i],
            key: response.payload[i].F215Rowid,
          });
        }
        this.setState({
          puntos_venta: temp,
        });
      })
      .catch(error => {
        alert(error);
      });
  }
  async select_file() {
    try {
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.images],
      });
      this.setState({file: res});
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        // User cancelled the picker, exit any dialogs or menus and move on
      } else {
        throw err;
      }
    }
  }

  crear_pedido() {
    this.setState({cargando: true});
    const {id_cliente, date, observacion, direccion_despacho} = this.state;
    const {usuario} = this.props;
    let id_usuario = usuario.id_usuario;
    const ruta = this.state.file.uri;
    if (ruta !== '') {
      RNFS.readFile(ruta, 'base64') //substring(7) -> to remove the file://
        .then(res => this.setState({firma: res}));
    }

    let data = {
      InfoPedido: {
        PvcDocID: this.state.id_cliente,
        PvcDocVendedor: this.props.usuario.UserID,
        F215ID: '' + this.state.punto_venta,
        PvcNotas: this.state.observacion,
        PvcFechaEntrega: '',
        cupo_total: 0,
        total_facturas: 0,
        cartera: [],
        saldo: 0,
        saldo_aux: 0,
      },
      DetallePedido: [],
    };
    let fechaAux = '2021-02-14';
    for (let i = 0; i < this.state.unidades.length; i++) {
      let temp_fecha_und = this.state.unidades[i].PvcDetFechaEntrega.split('/');
      let temp_fecha_aux = fechaAux.split('-');
      if (parseFloat(temp_fecha_und[1]) >= parseFloat(temp_fecha_aux[1])) {
        if (parseFloat(temp_fecha_und[2]) >= parseFloat(temp_fecha_aux[2])) {
          let temp = this.state.unidades[i].PvcDetFechaEntrega.split('/');
          fechaAux = temp[0] + '-' + temp[1] + '-' + temp[2];
          data.InfoPedido.PvcFechaEntrega = fechaAux + 'T00:00:00Z';
        }
      }
      let temp2 = this.state.unidades[i].PvcDetFechaEntrega.split('/');
      data.DetallePedido.push({
        PvcDetFechaEntrega: temp2[0] + '' + temp2[1] + '' + temp2[2],
        PvcDetCant: parseInt('' + this.state.unidades[i].Unidades),
        PvcDetNota: 'NO TIENE',
        PvcDetReferencia: this.state.unidades[i].ReferenciaID,
        PvcDetExt1: this.state.unidades[i].Color,
        PvcDetExt2: this.state.unidades[i].Talla,
        PvcDetPrecioUnt: parseInt('' + this.state.unidades[i].PrecioUnitario),
      });
    }
    if (data.DetallePedido.length == 0) {
      this.setState({
        cargando: false,
        show_dialog: true,
        message: 'Por favor agregue items al pedido',
      });
    } else {
      fetch(this.props.ruta + '/pedido/crear', {
        method: 'POST',
        body: JSON.stringify(data), // data can be `string` or {object}!
        headers: {
          Authorization: 'Bearer ' + this.props.token,
          'Content-Type': 'application/json',
        },
      })
        .then(res => res.json())
        .then(response => {
          if (response.status == 201) {
            this.setState({
              referencias: [],
              colores_refencia: [],
              ref_color_tallas: [],
              referencias_aux: [],
              unidades: [],
              cantidad: 0,
              nombre_cliente: '',
              fecha: '',
              name: '',
              firma: '',
              observacion: '',
              cargando: false,
              clientes: [],
              clientes_aux: [],
              puntos_venta: [],
              punto_venta: '',
              selected_cliente: {
                nombre: '',
                apellido: '',
                correo: '',
                id_cliente: '',
              },
              cupo_total: 0,
              total_facturas: 0,
              cartera: [],
              saldo: 0,
              saldo_aux: 0,
            });
            this.setState({
              id_pedido: response.payload,
              cargando: false,
              show_dialog: true,
              message: response.message,
            });
          }
        })
        .catch(error => {
          this.setState({
            id_pedido: '',
            cargando: false,
            show_dialog: true,
            message:
              'No se pudo realizar el pedido, por favor verifique conexión a internet.',
          });
          alert(error);
        });
    }
  }

  add_items() {
    let temp = this.state.unidades;

    if (
      this.state.id_referencia == '' ||
      this.state.color == '' ||
      this.state.date == ''
    ) {
      alert('Debe seleccionar una referencia, color y fecha válida');
    } else {
      if (Number(this.state.talla_34) && this.state.talla_34 > 0) {
        this.add_items_aux(temp, '34', this.state.talla_34);
      }
      if (Number(this.state.talla_35) && this.state.talla_35 > 0) {
        this.add_items_aux(temp, '35', this.state.talla_35);
      }
      if (Number(this.state.talla_36) && this.state.talla_36 > 0) {
        this.add_items_aux(temp, '36', this.state.talla_36);
      }
      if (Number(this.state.talla_37) && this.state.talla_37 > 0) {
        this.add_items_aux(temp, '37', this.state.talla_37);
      }
      if (Number(this.state.talla_38) && this.state.talla_38 > 0) {
        this.add_items_aux(temp, '38', this.state.talla_38);
      }
      if (Number(this.state.talla_39) && this.state.talla_39 > 0) {
        this.add_items_aux(temp, '39', this.state.talla_39);
      }
      if (Number(this.state.talla_40) && this.state.talla_40 > 0) {
        this.add_items_aux(temp, '40', this.state.talla_40);
      }
      if (Number(this.state.talla_41) && this.state.talla_41 > 0) {
        this.add_items_aux(temp, '41', this.state.talla_41);
      }
      if (Number(this.state.talla_42) && this.state.talla_42 > 0) {
        this.add_items_aux(temp, '42', this.state.talla_42);
      }
      if (Number(this.state.talla_43) && this.state.talla_43 > 0) {
        this.add_items_aux(temp, '43', this.state.talla_43);
      }
      if (Number(this.state.talla_44) && this.state.talla_44 > 0) {
        this.add_items_aux(temp, '44', this.state.talla_44);
      }
      if (Number(this.state.talla_45) && this.state.talla_45 > 0) {
        this.add_items_aux(temp, '45', this.state.talla_45);
      }
    }
  }
  add_items_aux(temp, talla, cantidad) {
    let found = false;
    for (let i = 0; i < temp.length; i++) {
      if (
        this.state.id_referencia == temp[i].Referencia &&
        this.state.color == temp[i].Color &&
        talla == temp[i].Talla
      ) {
        temp[i].Unidades = cantidad;
        found = true;
        break;
      }
    }

    let aux = '0';
    for (let j = 0; j < this.state.referencias_aux.length; j++) {
      if (this.state.referencias_aux[j].CodigoErp == this.state.id_referencia) {
        aux = this.state.referencias_aux[j].F120Referencia.trim();
        break;
      }
    }
    if (!found) {
      let result = {};
      for (let i = 0; i < this.state.ref_color_tallas.length; i++) {
        if (this.state.ref_color_tallas[i].Ext2.trim() == talla) {
          result = this.state.ref_color_tallas[i];
          break;
        }
      }
      console.log(JSON.stringify(result));
      temp.push({
        ReferenciaID: aux,
        Referencia: result.Referencia,
        Color: result.Ext1.trim(),
        Talla: talla,
        Unidades: cantidad,
        PrecioUnitario: result.PrecioUnt,
        Precio: result.PrecioUnt * cantidad,
        PrecioUnidad: result.UndPrecio,
        PvcDetFechaEntrega: this.state.date,
      });
    }
    //descontar saldo
    let saldo_temp = this.state.saldo;
    let valor_c = 0;
    for (let i = 0; i < temp.length; i++) {
      saldo_temp -= temp[i].Precio;
      valor_c += temp[i].Precio;
    }
    this.setState({
      unidades: temp,
      saldo_aux: saldo_temp,
      valor_compra: valor_c,
    });
  }

  delete_item_pos(value) {
    console.log(value);
    let temp = [];
    let saldo_temp = this.state.saldo;
    let valor_c = 0;
    for (let i = 0; i < this.state.unidades.length; i++) {
      if (i != value) {
        temp.push(this.state.unidades[i]);
        saldo_temp -=
          this.state.unidades[i].PrecioUnitario *
          this.state.unidades[i].Unidades;
        valor_c += temp[i].PrecioUnitario * temp[i].Unidades;
      }
    }
    this.setState({
      unidades: temp,
      saldo_aux: saldo_temp,
      valor_compra: valor_c,
    });
  }

  handleSelectItem(item, index) {
    const {onDropdownClose} = this.props;
    onDropdownClose();
    console.log(item);
  }
  set_id_cliente = value => {
    this.setState({id_cliente: value, searching: true});
    for (let i = 0; i < this.state.clientes.length; i++) {
      if (this.state.clientes[i].NitTercero === value) {
        fetch(this.props.ruta + '/client/info/' + value, {
          method: 'GET', // data can be `string` or {object}!
          headers: {
            Authorization: 'Bearer ' + this.props.token,
            'Content-Type': 'application/json',
          },
        })
          .then(res => res.json())
          .then(response => {
            if (response.payload.length > 0) {
              this.setState({
                selected_cliente: {
                  nit: response.payload[0].NitCC,
                  email: response.payload[0].Email,
                  direccion: response.payload[0].Direccion,
                  telefono: response.payload[0].Telefono,
                  celular: response.payload[0].Celular,
                },
                searching: false,
              });
            }
          })
          .catch(error => {
            this.setState({
              selected_cliente: {
                nit: '',
                email: '',
                direccion: '',
                telefono: '',
                celular: '',
                saldo: 0,
                saldo_aux: 0,
              },
              searching: false,
            });
            alert(error);
          });
      }
    }
    this.setState({searching: false});
    this.search_puntos_envio(value);
  };
  set_id_consecutivo = value => {
    this.setState({id_consecutivo: value});
    let temp = this.state.ref_color_tallas;
    for (let i = 0; i < temp.length; i++) {
      if (temp[i].id_consecutivo == value) {
        this.setState({item: temp[i]});
      }
    }
  };
  set_cantidad = value => {
    this.setState({cantidad: value});
  };
  onDismissSnackBar = () => this.setState({show_snack: false});
  _hide_unidades = () => this.setState({show_unidades: false});
  _hide_firma = () => this.setState({show_firma: false});
  bounce() {
    this.refs.view.rubberBand();
    setTimeout(() => {
      this.props.navigation.navigate('Usuario');
    }, 500);
  }
  render() {
    const {usuario} = this.props;
    const placeholder = {
      label: 'Seleccionar un cliente...',
      value: null,
      color: '#9EA0A4',
    };
    const placeholder_ref = {
      label: 'Seleccionar una referencia...',
      value: null,
      color: '#9EA0A4',
    };
    const placeholder_color = {
      label: 'Seleccionar un color...',
      value: null,
      color: '#9EA0A4',
    };
    const placeholder_talla = {
      label: 'Seleccionar una talla...',
      value: null,
      color: '#9EA0A4',
    };

    const punto_venta_label = {
      label: 'Dirección de despacho...',
      value: null,
      color: '#9EA0A4',
    };
    const elevation = 4;
    const size = 40;
    return (
      <SafeAreaView>
        <ScrollView>
          <View>
            <Badge size={size} style={{backgroundColor: 'green'}}>
              {this.state.id_pedido}
            </Badge>
            {this.state.searching ? (
              <View style={styles.center_view}>
                <ActivityIndicator
                  animating={true}
                  style={{top: '35%', right: '20%', position: 'absolute'}}
                  color="red"
                />
                <Text style={{fontSize: 20, marginTop: '5%'}}>Buscando</Text>
              </View>
            ) : (
              <View style={styles.center_view}>
                <Text style={{fontSize: 20, marginTop: '5%'}}>
                  Buscar Cliente
                </Text>
              </View>
            )}

            <Searchbar
              placeholder="Buscar por Nombre o NIT"
              theme={{colors: {primary: '#ff8c00'}}}
              style={styles.input}
              onChangeText={text => this.search_cliente_n(text)}
              value={this.state.nombre_cliente}
            />
            <RNPickerSelect
              placeholder={placeholder}
              onValueChange={value => this.set_id_cliente(value)}
              items={this.state.clientes_aux}
              style={{
                ...pickerSelectStyles,
                iconContainer: {
                  top: 20,
                  right: 10,
                },
                placeholder: {
                  color: 'black',
                  fontSize: 16,
                },
              }}
            />
            <RNPickerSelect
              placeholder={punto_venta_label}
              onValueChange={value => this.get_cartera_saldo(value)}
              items={this.state.puntos_venta}
              style={{
                ...pickerSelectStyles,
                iconContainer: {
                  top: 20,
                  right: 10,
                },
                placeholder: {
                  color: 'black',
                  fontSize: 16,
                },
              }}
            />
            <View style={{width: '90%', marginLeft: '5%', marginTop: '3%'}}>
              <Title>Nro {this.state.selected_cliente.nit}</Title>
              <Paragraph>
                <Text style={{fontWeight: 'bold'}}>Correo: </Text>
                {this.state.selected_cliente.email == undefined
                  ? ''
                  : this.state.selected_cliente.email}
              </Paragraph>
              <Paragraph>
                <Text style={{fontWeight: 'bold'}}>Dirección: </Text>
                {this.state.selected_cliente.direccion == undefined
                  ? ''
                  : this.state.selected_cliente.direccion}
              </Paragraph>
              <Paragraph>
                <Text style={{fontWeight: 'bold'}}>Teléfono: </Text>
                {this.state.selected_cliente.telefono == undefined
                  ? ''
                  : this.state.selected_cliente.telefono}
              </Paragraph>
              <Paragraph>
                <Text style={{fontWeight: 'bold'}}>Celular: </Text>
                {this.state.selected_cliente.celular == undefined
                  ? ''
                  : this.state.selected_cliente.celular}
              </Paragraph>
              <Paragraph>
                <Text style={{fontWeight: 'bold'}}>Cupo Total: </Text>
                {this.state.selected_cliente.celular == undefined
                  ? ''
                  : this.currencyFormat(this.state.cupo_total)}
              </Paragraph>
              <Paragraph>
                <Text style={{fontWeight: 'bold'}}>Total Facturas: </Text>
                {this.state.selected_cliente.celular == undefined
                  ? ''
                  : this.currencyFormat(this.state.total_facturas)}
              </Paragraph>
              {this.state.saldo > 0 ? (
                <Paragraph style={{color: 'green'}}>
                  <Text style={{fontWeight: 'bold'}}>Saldo Disponible: </Text>
                  {this.currencyFormat(this.state.saldo)}
                </Paragraph>
              ) : (
                <Paragraph style={{color: 'red'}}>
                  <Text style={{fontWeight: 'bold'}}>Saldo Disponible: </Text>
                  {this.currencyFormat(this.state.saldo)}
                </Paragraph>
              )}
              <DataTable>
                <DataTable.Header>
                  <DataTable.Title>Factura</DataTable.Title>
                  <DataTable.Title>Cupo</DataTable.Title>
                  <DataTable.Title>Fecha Vencimiento</DataTable.Title>
                </DataTable.Header>
              </DataTable>
              {this.state.cartera.map((row, index) => (
                <DataTable.Row key={index}>
                  <DataTable.Cell>{row.NoDoc}</DataTable.Cell>
                  <DataTable.Cell>
                    {this.currencyFormat(row.Saldo)}
                  </DataTable.Cell>
                  <DataTable.Cell>
                    {this.dateFormat(row.FechaVence)}
                  </DataTable.Cell>
                </DataTable.Row>
              ))}
            </View>
            <Divider />
            <View>
              <Snackbar
                visible={this.state.show_snack}
                onDismiss={this.onDismissSnackBar}
                style={{backgroundColor: '#59B03B'}}
                theme={{colors: {accent: 'white'}}}
                action={{
                  label: 'OK',
                  onPress: () => {
                    this.setState({show_snack: false});
                  },
                }}>
                {this.state.message}
              </Snackbar>
            </View>
            <View style={{flex: 1, flexDirection: 'row'}}>
              <Button
                mode="outlined"
                style={{
                  width: '100%',
                  marginTop: '10%',
                  marginLeft: '2%',
                }}
                loading={this.state.cargando}
                theme={{colors: {primary: 'green'}}}
                onPress={() => this.setState({show_unidades: true})}>
                <Icon name="pen" size={35} />
                Unidades
              </Button>
            </View>
            <View>
              <TextInput
                mode="outlined"
                multiline={true}
                label="Ingresar Observación"
                theme={{colors: {primary: '#ff8c00'}}}
                style={styles.input}
                value={this.state.observacion}
                onChangeText={text => this.setState({observacion: text})}
              />
            </View>
            <Button
              mode="outlined"
              style={{
                width: '95%',
                marginTop: '5%',
                marginBottom: '2%',
                marginLeft: '2%',
                backgroundColor: 'green',
              }}
              loading={this.state.cargando}
              theme={{colors: {primary: 'white'}}}
              onPress={() => this.crear_pedido()}>
              <Icon name="account-check-outline" size={35} />
              Registrar Pedido
            </Button>
            <AwesomeAlert
              show={this.state.show_dialog}
              showProgress={false}
              title="Información"
              message={this.state.message}
              closeOnTouchOutside={true}
              closeOnHardwareBackPress={false}
              showConfirmButton={true}
              confirmText="Aceptar"
              confirmButtonColor="green"
              onConfirmPressed={() => {
                this.setState({show_dialog: false});
              }}
            />
            <Modal
              animationType="slide"
              visible={this.state.show_unidades}
              onRequestClose={() => {
                Alert.alert('Modal has been closed.');
              }}>
              <SafeAreaView>
                <ScrollView>
                  <View>
                    {this.state.searching ? (
                      <View style={styles.center_view}>
                        <ActivityIndicator
                          animating={true}
                          style={{
                            top: '35%',
                            position: 'absolute',
                            right: '20%',
                          }}
                          color="red"
                        />
                        <Text style={{fontSize: 20, marginTop: '5%'}}>
                          Buscando
                        </Text>
                      </View>
                    ) : (
                      <View style={styles.center_view}>
                        <Text style={{fontSize: 20, marginTop: '5%'}}>
                          Buscar Sugerencias
                        </Text>
                      </View>
                    )}
                    <TextInput
                      mode="outlined"
                      label="Buscar Referencia por nombre o referencia"
                      theme={{colors: {primary: '#ff8c00'}}}
                      style={styles.input}
                      value={this.state.id_referencia}
                      onChangeText={text => this.search_referencia(text)}
                    />
                    <RNPickerSelect
                      placeholder={placeholder_ref}
                      onValueChange={value => this.get_color_tallas(value)}
                      items={this.state.referencias}
                      style={{
                        ...pickerSelectStyles,
                        iconContainer: {
                          top: 20,
                          right: 10,
                        },
                        placeholder: {
                          color: 'black',
                          fontSize: 16,
                        },
                      }}
                    />
                    <RNPickerSelect
                      placeholder={placeholder_color}
                      onValueChange={value => this.search_talla(value)}
                      items={this.state.colores_refencia}
                      style={{
                        ...pickerSelectStyles,
                        iconContainer: {
                          top: 20,
                          right: 10,
                        },
                        placeholder: {
                          color: 'black',
                          fontSize: 16,
                        },
                      }}
                    />
                    <DatePicker
                      style={{width: '90%', marginTop: '5%', marginLeft: '3%'}}
                      date={this.state.date}
                      mode="date"
                      minDate={this.state.minDate}
                      placeholder="seleccionar Fecha Despacho"
                      format="YYYY/MM/DD"
                      confirmBtnText="Confirm"
                      cancelBtnText="Cancel"
                      customStyles={{
                        dateIcon: {
                          position: 'absolute',
                          left: 0,
                          top: 4,
                          marginLeft: 0,
                        },
                        dateInput: {
                          fontSize: '18',
                          marginLeft: 36,
                        },
                        // ... You can check the source to find the other keys.
                      }}
                      onDateChange={date => {
                        this.setState({date: date});
                      }}
                    />
                    <View
                      style={{flex: 1, flexDirection: 'row', marginTop: '5%'}}>
                      <TextInput
                        mode="outlined"
                        label="Talla 34"
                        disabled={this.state.tallas_item['34']}
                        theme={{colors: {primary: '#ff8c00'}}}
                        style={styles.inputTalla}
                        value={this.state.talla_34}
                        onChangeText={text => this.setState({talla_34: text})}
                      />
                      <TextInput
                        mode="outlined"
                        label="Talla 35"
                        disabled={this.state.tallas_item['35']}
                        theme={{colors: {primary: '#ff8c00'}}}
                        style={styles.inputTalla}
                        value={this.state.talla_35}
                        onChangeText={text => this.setState({talla_35: text})}
                      />
                      <TextInput
                        mode="outlined"
                        label="Talla 36"
                        disabled={this.state.tallas_item['36']}
                        theme={{colors: {primary: '#ff8c00'}}}
                        style={styles.inputTalla}
                        value={this.state.talla_36}
                        onChangeText={text => this.setState({talla_36: text})}
                      />
                    </View>
                    <View
                      style={{flex: 1, flexDirection: 'row', marginTop: '5%'}}>
                      <TextInput
                        mode="outlined"
                        label="Talla 37"
                        disabled={this.state.tallas_item['37']}
                        theme={{colors: {primary: '#ff8c00'}}}
                        style={styles.inputTalla}
                        value={this.state.talla_37}
                        onChangeText={text => this.setState({talla_37: text})}
                      />
                      <TextInput
                        mode="outlined"
                        label="Talla 38"
                        disabled={this.state.tallas_item['38']}
                        theme={{colors: {primary: '#ff8c00'}}}
                        style={styles.inputTalla}
                        value={this.state.talla_38}
                        onChangeText={text => this.setState({talla_38: text})}
                      />
                      <TextInput
                        mode="outlined"
                        label="Talla 39"
                        disabled={this.state.tallas_item['39']}
                        theme={{colors: {primary: '#ff8c00'}}}
                        style={styles.inputTalla}
                        value={this.state.talla_39}
                        onChangeText={text => this.setState({talla_39: text})}
                      />
                    </View>
                    <View
                      style={{flex: 1, flexDirection: 'row', marginTop: '5%'}}>
                      <TextInput
                        mode="outlined"
                        label="Talla 40"
                        disabled={this.state.tallas_item['40']}
                        theme={{colors: {primary: '#ff8c00'}}}
                        style={styles.inputTalla}
                        value={this.state.talla_40}
                        onChangeText={text => this.setState({talla_40: text})}
                      />
                      <TextInput
                        mode="outlined"
                        label="Talla 41"
                        disabled={this.state.tallas_item['41']}
                        theme={{colors: {primary: '#ff8c00'}}}
                        style={styles.inputTalla}
                        value={this.state.talla_41}
                        onChangeText={text => this.setState({talla_41: text})}
                      />
                      <TextInput
                        mode="outlined"
                        label="Talla 42"
                        disabled={this.state.tallas_item['42']}
                        theme={{colors: {primary: '#ff8c00'}}}
                        style={styles.inputTalla}
                        value={this.state.talla_42}
                        onChangeText={text => this.setState({talla_42: text})}
                      />
                    </View>
                    <View
                      style={{flex: 1, flexDirection: 'row', marginTop: '5%'}}>
                      <TextInput
                        mode="outlined"
                        label="Talla 43"
                        disabled={this.state.tallas_item['43']}
                        theme={{colors: {primary: '#ff8c00'}}}
                        style={styles.inputTalla}
                        value={this.state.talla_43}
                        onChangeText={text => this.setState({talla_43: text})}
                      />
                      <TextInput
                        mode="outlined"
                        label="Talla 44"
                        disabled={this.state.tallas_item['44']}
                        theme={{colors: {primary: '#ff8c00'}}}
                        style={styles.inputTalla}
                        value={this.state.talla_44}
                        onChangeText={text => this.setState({talla_44: text})}
                      />
                      <TextInput
                        mode="outlined"
                        label="Talla 45"
                        disabled={this.state.tallas_item['45']}
                        theme={{colors: {primary: '#ff8c00'}}}
                        style={styles.inputTalla}
                        value={this.state.talla_45}
                        onChangeText={text => this.setState({talla_45: text})}
                      />
                    </View>
                    <Button
                      mode="outlined"
                      style={{
                        width: '70%',
                        marginLeft: '15%',
                        borderRadius: 10,
                        marginTop: '5%',
                      }}
                      loading={this.state.cargando}
                      theme={{colors: {primary: '#e60000'}}}
                      onPress={() => this.add_items()}>
                      <Icon name="cart" size={35} />
                      Agregar
                    </Button>
                    <View>
                      {this.state.actualizando ? (
                        <View style={styles.center_view}>
                          <ActivityIndicator
                            animating={true}
                            style={{
                              top: '35%',
                              position: 'absolute',
                              right: '20%',
                            }}
                            color="red"
                          />
                          <Text style={{fontSize: 20, marginTop: '5%'}}>
                            actualizando
                          </Text>
                        </View>
                      ) : (
                        <View style={styles.center_view}>
                          <Text style={{fontSize: 20, marginTop: '5%'}}>
                            Información
                          </Text>
                        </View>
                      )}
                    </View>
                    <DataTable>
                      <DataTable.Header>
                        <DataTable.Title>Referencia</DataTable.Title>
                        <DataTable.Title>Color</DataTable.Title>
                        <DataTable.Title>Talla</DataTable.Title>
                        <DataTable.Title>Unidades</DataTable.Title>
                        <DataTable.Title>Precio Unitario</DataTable.Title>
                        <DataTable.Title>Precio Total</DataTable.Title>
                        <DataTable.Title>Fecha</DataTable.Title>
                        <DataTable.Title>Eliminar</DataTable.Title>
                      </DataTable.Header>
                    </DataTable>
                    {this.state.unidades.map((row, index) => (
                      <DataTable.Row
                        key={index}
                        onPress={() => this.delete_item_pos(index)}>
                        <DataTable.Cell>{row.Referencia}</DataTable.Cell>
                        <DataTable.Cell>{row.Color}</DataTable.Cell>
                        <DataTable.Cell>{row.Talla}</DataTable.Cell>
                        <DataTable.Cell>{row.Unidades}</DataTable.Cell>
                        <DataTable.Cell>
                          {this.currencyFormat(row.PrecioUnitario)}
                        </DataTable.Cell>
                        <DataTable.Cell>
                          {this.currencyFormat(row.Precio)}
                        </DataTable.Cell>
                        <DataTable.Cell>
                          {row.PvcDetFechaEntrega}
                        </DataTable.Cell>
                        <DataTable.Cell>
                          <Icon name="delete" size={30} color="red" />
                        </DataTable.Cell>
                      </DataTable.Row>
                    ))}
                    <Text
                      style={{
                        textAlign: 'center',
                        color: 'red',
                        marginTop: '2%',
                      }}>
                      {'Valor Compra: ' +
                        this.currencyFormat(this.state.valor_compra)}
                    </Text>
                    <Text
                      style={{
                        textAlign: 'center',
                        color: 'red',
                        marginTop: '2%',
                      }}>
                      {'Cupo: ' + this.currencyFormat(this.state.saldo_aux)}
                    </Text>
                    <Button
                      mode="outlined"
                      style={{
                        width: '100%',
                        marginTop: '5%',
                        backgroundColor: 'green',
                      }}
                      loading={this.state.cargando}
                      theme={{colors: {primary: 'white'}}}
                      onPress={() => this._hide_unidades()}>
                      <Icon name="check" size={35} />
                      Finalizar
                    </Button>
                  </View>
                </ScrollView>
              </SafeAreaView>
            </Modal>

            <Modal
              animationType="slide"
              visible={this.state.show_firma}
              onRequestClose={() => {
                Alert.alert('Modal has been closed.');
              }}>
              <Button
                mode="outlined"
                style={{
                  width: '100%',
                }}
                loading={this.state.cargando}
                theme={{colors: {primary: 'green'}}}
                onPress={() => this._hide_firma()}>
                <Icon name="check" size={35} />
                Finalizar
              </Button>
              {this.state.show_firma ? <Firma /> : null}
            </Modal>
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
)(Crear_pedido);

const styles = StyleSheet.create({
  text: {
    fontSize: 20,
    fontFamily: 'Gill Sans',
    textAlign: 'center',
    fontWeight: '600',
    margin: 10,
    color: 'black',
    backgroundColor: 'transparent',
  },
  header: {
    backgroundColor: 'red',
  },
  center_view: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    width: '95%',
    marginLeft: '2%',
    marginTop: '2%',
  },
  inputTalla: {
    width: '30%',
    marginLeft: '2%',
    marginTop: '2%',
  },
  select: {
    width: '95%',
    marginLeft: '2%',
    marginTop: '2%',
    backgroundColor: '#F7C877',
    color: 'black',
    height: 50,
  },
  autocompleteContainer: {
    flex: 1,
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
    zIndex: 1,
  },
  openButton: {
    borderRadius: 20,
    elevation: 2,
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
  fab: {
    width: '45%',
    marginLeft: '2%',
    backgroundColor: '#F0C02B',
    marginTop: '4%',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  strokeColorButton: {
    marginHorizontal: 2.5,
    marginVertical: 8,
    width: 30,
    height: 30,
    borderRadius: 15,
  },
  strokeWidthButton: {
    marginHorizontal: 2.5,
    marginVertical: 8,
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#39579A',
  },
  functionButton: {
    marginHorizontal: 2.5,
    marginVertical: 8,
    height: 30,
    width: 60,
    backgroundColor: '#39579A',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
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
