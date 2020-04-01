import * as React from 'react';
import {View, StyleSheet} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
} from '@react-navigation/drawer';
import Usuario from '../usuarios';
import Cliente from '../cliente';
import Pedido from '../pedido';
import Menu_perfil from './drawer_perfil';
import {
  useTheme,
  Avatar,
  Title,
  Caption,
  Paragraph,
  Text,
  TouchableRipple,
  Switch,
} from 'react-native-paper';
import Icon from 'react-native-vector-icons/AntDesign';
import Animated from 'react-native-reanimated';

function CustomDrawerContent({progress, ...rest}) {
  const translateX = Animated.interpolate(progress, {
    inputRange: [0, 1],
    outputRange: [-100, 0],
  });

  return (
    <DrawerContentScrollView {...rest}>
      <Animated.View style={{transform: [{translateX}]}}>
        <View style={styles.drawerContent}>
          <Menu_perfil />
        </View>
        <DrawerItemList {...rest} />
      </Animated.View>
    </DrawerContentScrollView>
  );
}

const Drawer = createDrawerNavigator();

function MyDrawer() {
  return (
    <Drawer.Navigator
      drawerContent={props => <CustomDrawerContent {...props} />}
      drawerStyle={{
        backgroundColor: '#434343',
        width: 260,
      }}
      drawerContentOptions={{
        activeTintColor: '#F2994A',
        inactiveTintColor: '#CDCDCD',
      }}>
      <Drawer.Screen
        name="Usuario"
        component={Usuario}
        options={{
          drawerIcon: config => <Icon name="user" size={23} color="white" />,
        }}
      />
      <Drawer.Screen name="Cliente" component={Cliente} 
      options={{
        drawerIcon: config => <Icon name="smileo" size={23} color="white" />,
      }}/>
      <Drawer.Screen name="Pedido" component={Pedido} 
      options={{
        drawerIcon: config => <Icon name="carryout" size={23} color="white" />,
      }}/>
    </Drawer.Navigator>
  );
}

export default function Home() {
  return (
    <NavigationContainer>
      <MyDrawer />
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  drawerContent: {
    flex: 1,
  },
  row: {
    marginTop: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  section: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 15,
  },
  paragraph: {
    fontWeight: 'bold',
    marginRight: 3,
  },
  drawerSection: {
    marginTop: 15,
  },
  preference: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
});
