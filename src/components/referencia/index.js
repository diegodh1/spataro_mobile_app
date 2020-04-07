import React, {Component, Fragment} from 'react';
import {connect} from 'react-redux';
import {success_login, error_login} from '../../actions';
import {
  Text,
  View,
  StyleSheet,
  Image,
  TouchableWithoutFeedback,
} from 'react-native';
import {Input} from 'react-native-elements';
import LinearGradient from 'react-native-linear-gradient';
import * as Animatable from 'react-native-animatable';
import {Appbar} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import DocumentPicker from 'react-native-document-picker';
import {Button, ToggleButton, Snackbar} from 'react-native-paper';
import RNFS from 'react-native-fs';
import FormData from 'form-data';

class Referencia extends Component {
  //declaramos el constructor
  constructor(props) {
    super(props);
    this.state = {
      user: '',
      file: {name: ''},
      snack: false,
      loading: false,
      message: '',
      tipo: 'UND',
      base64: '',
    };
    this.bounce = this.bounce.bind(this);
  }
  bounce() {
    this.refs.view.rubberBand();
    setTimeout(() => {
      this.props.navigation.navigate('Usuario');
    }, 500);
  }

  async select_file() {
    try {
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.allFiles],
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
  _onDismissSnackBar = () => this.setState({snack: false});

  upload_file() {
    let data = new FormData();
    this.setState({loading: true});
    const ruta = this.state.file.uri;
    if (this.state.file.name !== '') {
      RNFS.readFile(ruta, 'base64') //substring(7) -> to remove the file://
        .then((res) => this.setState({base64: res}));
      setTimeout(() => {
        fetch('http://192.168.1.86:4000/guardar_referencia', {
          method: 'POST',
          body: JSON.stringify({
            file: this.state.base64,
            tipo: this.state.tipo,
          }),
          headers: {
            'Content-Type': 'application/json',
          },
        })
          .then((res) => res.json())
          .then((response) => {
            if (response.mensaje === 'Registros Realizados') {
              this.setState({
                snack: true,
                loading: false,
                message: 'Registros Realizados',
                tipo: '',
              });
            } else {
              this.setState({
                snack: true,
                loading: false,
                message: response.mensaje,
              });
            }
          })
          .catch((error) => {
            alert(error);
            this.setState({
              snack: true,
              loading: false,
              message: error,
            });
          });
      }, 300);
    } else {
      this.setState({
        snack: true,
        message: 'Seleccione el archivo y el tipo',
        loading: false,
      });
    }
  }

  render() {
    const {usuario} = this.props;
    return (
      <View>
        <Appbar.Header style={styles.header}>
          <Icon
            name="format-list-bulleted"
            size={40}
            color="#ff8c00"
            onPress={() => this.props.navigation.openDrawer()}
          />
          <Appbar.Content title="Referencia" subtitle="crear, eliminar y editar referencias" />
          <TouchableWithoutFeedback onPress={this.bounce}>
            <Animatable.View ref="view">
              <Icon name="chevron-left" size={50} color="#ff8c00" />
            </Animatable.View>
          </TouchableWithoutFeedback>
        </Appbar.Header>
        <Text style={styles.text}>Actualizar Referencias y Colores</Text>

        <Button
          mode="outlined"
          style={{width: '100%', marginTop: '10%'}}
          theme={{colors: {primary: '#ff8c00'}}}
          onPress={() => this.select_file()}>
          <Icon name="file-table" size={35} />
          Seleccionar Excel
        </Button>
        <Text
          style={{marginTop: '10%', textAlign: 'center', fontWeight: 'bold'}}>
          Archivo: {this.state.file.name}
        </Text>
        <Text
          style={{marginTop: '10%', textAlign: 'center', fontWeight: 'bold'}}>
          SELECCIONE UNIDADES O METROS
        </Text>
        <ToggleButton.Row
          style={{marginTop: '10%', marginLeft: '40%'}}
          onValueChange={(value) => this.setState({tipo: value})}
          value={this.state.tipo}>
          <ToggleButton icon="alpha-u-box-outline" value="UND" />
          <ToggleButton icon="alpha-m-box-outline" value="MTS" />
        </ToggleButton.Row>
        {this.state.snack && this.state.message === 'Registros Realizados' ? (
          <Snackbar
            visible={this.state.snack}
            onDismiss={this._onDismissSnackBar}
            style={{backgroundColor: '#4B0082'}}
            action={{
              label: 'OK',
              onPress: () => {
                this.setState({snack: false, message: ''});
              },
            }}>
            {this.state.message}
          </Snackbar>
        ) : null}
        {this.state.snack && this.state.message !== 'Registros Realizados' ? (
          <Snackbar
            visible={this.state.snack}
            onDismiss={this._onDismissSnackBar}
            style={{backgroundColor: '#E83A2C'}}
            action={{
              label: 'OK',
              onPress: () => {
                this.setState({snack: false, message: ''});
              },
            }}>
            {this.state.message}
          </Snackbar>
        ) : null}
        <Button
          loading={this.state.loading}
          mode="outlined"
          style={{width: '70%', marginTop: '10%', marginLeft: '13%'}}
          theme={{colors: {primary: 'green'}}}
          onPress={() => this.upload_file()}>
          <Icon name="cloud-upload" size={35} />
          Actualizar
        </Button>
      </View>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    usuario: state.reducer.user,
  };
};
const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(Referencia);

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
    marginTop: '10%',
    color: 'black',
    fontWeight: 'bold',
    backgroundColor: 'transparent',
  },
  header: {
    backgroundColor: '#434343',
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
});
