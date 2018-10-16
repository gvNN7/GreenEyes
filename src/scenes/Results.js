import React, { Component } from 'react';
import { Card, CardItem, Body, Left,} from 'native-base';
import {Icon} from 'react-native-elements'
import ActionButton from 'react-native-action-button';
import {
	Platform,
	ScrollView,
	StyleSheet,
	Text,
	Image,
	View,
	PixelRatio,
	Animated,
	AsyncStorage
} from 'react-native';
 
export default class Results extends Component
{
	constructor() {
    super();
      this.state = {  
				index: 0,
        Disable_Button: false,
        isOpen: false,
        isDisabled: false,
      }
	}
	
	static navigationOptions = {
    header: null,
	};
  
  render(){
		this.state.results.map((item, index) => {
			return(
			<View >
					<ScrollView>
						<View style = {{ flex: 1, padding: 2 }}>
							<Card key={index}>
								<CardItem>
									<Left>
										<Icon name='book'/>
											<Body>
												<Text>Doença detectada: {item.popularName}</Text>
												<Text note>Nome científico: {item.scientificName}</Text>
											</Body>
									</Left>
								</CardItem>
								<CardItem cardBody button onPress={() => {('guest')}}>
									<Image source={require('../doenca1.jpeg') }
										style={{height: 110, width: null, flex: 1 }}
									/>
								</CardItem>
								<CardItem>
									<Left>
										<Icon name='insert-chart'/>
										<Text>Porcentagem de precisão: {item.precision}</Text>
									</Left>
								</CardItem>
							</Card>
						</View>
					</ScrollView>
					<ActionButton 
						buttonColor="#00BCD4" 
						renderIcon={() => <Icon name="arrow-back" />} 
						onPress={() => this.props.navigation.goBack()} />
				</View>
			);
		});
	}
}

const styles = StyleSheet.create({
  MainContainer:{
			flex: 1,
			backgroundColor: '#eee',
			justifyContent: 'center',
			paddingTop: (Platform.OS == 'ios') ? 20 : 0
		},
 
		Animated_View_Style:{
			flex: 1, 
			justifyContent: 'center',
    },
    
  avatar: {
    borderRadius: 75,
    width: 150,
    height: 150
  },
  container: {
    flex: 1,
    backgroundColor : '#BDBDBD'
  },
  actionButtonIcon: {
    fontSize: 20,
    height: 22,
    color: 'white',
  },

  btn: {
    margin: 10,
    backgroundColor: "#3B5998",
    color: "white",
    padding: 10
  },

  modal: {
    justifyContent: 'center',
    alignItems: 'center'
  },

  modal3: {
    height: 300,
    width: 300
  },
  
  text: {
    color: "black",
    fontSize: 22
  },
  itemStyle: {
    fontSize: 15,
    height: 75,
    color: 'black',
    textAlign: 'center',

  },
  picker: {
    width: 200
  },

  avatarContainer: {
    borderColor: '#9B9B9B',
    borderWidth: 1 / PixelRatio.get(),
    justifyContent: 'center',
    alignItems: 'center'
  },
  avatar: {
    borderRadius: 75,
    width: 150,
    height: 150
  }  
}
);