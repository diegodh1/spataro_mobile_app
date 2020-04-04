import React, {Component} from 'react';
import {connect} from 'react-redux';
import {
  StyleSheet,
  TouchableWithoutFeedback,
  SafeAreaView,
  Switch,
  View,
  ScrollView,
  Picker,
  Text,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import * as Animatable from 'react-native-animatable';
import {
  TextInput,
  List,
  Button,
  HelperText,
  Snackbar,
  Divider,
  Searchbar,
  ActivityIndicator,
} from 'react-native-paper';
import ImagePicker from 'react-native-image-picker';

class Editar_cliente extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id_usuario: '',
      id_usuario_aux: '',
      name: '',
      last_name: '',
      email: '',
      activo: false,
      tipos_doc: [],
      visible_menu: false,
      show_error_doc: false,
      show_error_name: false,
      show_error_last: false,
      show_error_email: false,
      filePath: {data: ''},
      cargando: false,
      searching: false,
      show_snackbar: false,
      mensaje: '',
    };
  }

  componentDidMount() {
    fetch('http://192.168.1.86:4000/get_documentos', {
      method: 'POST',
      body: JSON.stringify({}), // data can be `string` or {object}!
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(res => res.json())
      .then(response => {
        this.setState({tipos_doc: response});
      })
      .catch(error => {
        alert(error);
      });
  }

  _onDismissSnackBar = () => this.setState({show_snackbar: false});
  comprobar_form = () => {
    if (!Number(this.state.id_usuario_aux))
      this.setState({show_error_doc: true});
    if (this.state.name.length < 1) this.setState({show_error_name: true});
    if (this.state.last_name.length < 1) this.setState({show_error_last: true});
    if (!this.state.email.includes('@'))
      this.setState({show_error_email: true});
    if (Number(this.state.id_usuario_aux))
      this.setState({show_error_doc: false});
    if (this.state.name.length > 1) this.setState({show_error_name: false});
    if (this.state.last_name.length > 1)
      this.setState({show_error_last: false});
    if (this.state.email.includes('@'))
      this.setState({show_error_email: false});
    setTimeout(() => {
      const {
        show_error_doc,
        show_error_name,
        show_error_last,
        show_error_email,
      } = this.state;
      if (
        !show_error_doc &&
        !show_error_name &&
        !show_error_last &&
        !show_error_email
      ) {
        alert('comprobado');
      }
    }, 100);
  };

  render() {
    const {usuario} = this.props;
    return (
      <SafeAreaView>
        <ScrollView>
          <Picker
            selectedValue={this.state.id_tipo_doc}
            style={styles.select}
            onValueChange={(itemValue, itemIndex) =>
              this.setState({id_tipo_doc: itemValue})
            }>
            {this.state.tipos_doc.map(row => (
              <Picker.Item label={row.id_tipo_doc} value={row.id_tipo_doc} />
            ))}
          </Picker>
          <TextInput
            mode="outlined"
            label="Nro. Documento"
            theme={{colors: {primary: '#ff8c00'}}}
            style={styles.input}
            value={this.state.id_usuario_aux}
            onChangeText={text => this.setState({id_usuario_aux: text})}
          />
          {this.state.show_error_doc ? (
            <HelperText type="error" visible={this.state.show_error_doc}>
              El numero de documento solo contiene numeros
            </HelperText>
          ) : null}
          <TextInput
            mode="outlined"
            label="Nombre"
            theme={{colors: {primary: '#ff8c00'}}}
            style={styles.input}
            value={this.state.name}
            onChangeText={text => this.setState({name: text})}
          />
          {this.state.show_error_name ? (
            <HelperText type="error" visible={this.state.show_error_name}>
              El nombre no puede ser vacio
            </HelperText>
          ) : null}
          <TextInput
            mode="outlined"
            label="Apellido"
            theme={{colors: {primary: '#ff8c00'}}}
            style={styles.input}
            value={this.state.last_name}
            onChangeText={text => this.setState({last_name: text})}
          />
          {this.state.show_error_last ? (
            <HelperText type="error" visible={this.state.show_error_last}>
              El Apellido no puede ser vacio
            </HelperText>
          ) : null}
          <TextInput
            mode="outlined"
            label="Correo"
            theme={{colors: {primary: '#ff8c00'}}}
            style={styles.input}
            value={this.state.email}
            onChangeText={text => this.setState({email: text})}
          />
          {this.state.show_error_email ? (
            <HelperText type="error" visible={this.state.show_error_email}>
              El correo debe ser valido ejemplo: asd@gmail.com
            </HelperText>
          ) : null}
          <TextInput
            mode="outlined"
            label="Correo"
            theme={{colors: {primary: '#ff8c00'}}}
            style={styles.input}
            value={this.state.email}
            onChangeText={text => this.setState({email: text})}
          />
          <Button
            mode="outlined"
            loading={this.state.cargando}
            theme={{colors: {primary: '#ff8c00'}}}
            onPress={() => this.comprobar_form()}>
            <Icon name="home-account" size={35} />
            Dirección
          </Button>
          <Button
            mode="outlined"
            loading={this.state.cargando}
            theme={{colors: {primary: '#ff8c00'}}}
            onPress={() => this.comprobar_form()}>
            <Icon name="phone-outline" size={35} />
            Telefono
          </Button>
          <Button
            mode="outlined"
            loading={this.state.cargando}
            theme={{colors: {primary: 'green'}}}
            onPress={() => this.comprobar_form()}>
            <Icon name="account-check-outline" size={35} />
            Crear usuario
          </Button>
          {this.state.show_snackbar &&
          this.state.mensaje === 'Registro realizado con éxito' ? (
            <Snackbar
              visible={this.state.show_snackbar}
              onDismiss={this._onDismissSnackBar}
              style={{backgroundColor: '#5AB82C'}}
              action={{
                label: 'OK',
                onPress: () => {
                  this.setState({show_snackbar: false, mensaje: ''});
                },
              }}>
              {this.state.mensaje}
            </Snackbar>
          ) : null}
          {this.state.show_snackbar &&
          this.state.mensaje !== 'Registro realizado con éxito' ? (
            <Snackbar
              visible={this.state.show_snackbar}
              onDismiss={this._onDismissSnackBar}
              style={{backgroundColor: '#E83A2C'}}
              action={{
                label: 'OK',
                onPress: () => {
                  this.setState({show_snackbar: false, mensaje: ''});
                },
              }}>
              {this.state.mensaje}
            </Snackbar>
          ) : null}
        </ScrollView>
      </SafeAreaView>
    );
  }
}

const mapStateToProps = state => {
  return {
    usuario: state.reducer.user,
  };
};
const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(Editar_cliente);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: '3%',
  },
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
    backgroundColor: '#434343',
  },
  input: {
    width: '95%',
    marginLeft: '2%',
    marginTop: '2%',
  },
  select: {
    width: '95%',
    marginLeft: '2%',
    marginTop: '2%',
    backgroundColor: '#F7C877',
    color:'black',
    height: 50
  },
});
