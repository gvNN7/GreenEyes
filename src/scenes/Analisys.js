import React, { Component } from 'react';
import ActionButton from 'react-native-action-button';
import Modal from 'react-native-modalbox'
import ImagePicker from 'react-native-image-picker'
import { Text, Icon } from 'react-native-elements'
import {
  Platform,
  ScrollView,
  StyleSheet,
  Image,
  View,
  Picker,
  Alert,
  Button,
  PixelRatio,
  ProgressBarAndroid,
  TouchableOpacity
} from 'react-native';
//import OpenCV from '../NativeModules/OpenCV';
import { CardList } from 'react-native-card-list';
import { Right } from 'native-base';
import store from 'react-native-simple-store'

export default class Analisys extends Component {
  constructor() {
    super();
    this.state = {
      Disable_Button: false,
      i: null,
      idDisease1: 0,
      idDisease2: 0,
      idDisease3: 0,
      analisys1: 'Processando imagem!',
      analisys2: 'Processando imagem!',
      analisys3: 'Processando imagem!',
      percent1: 'Ver Mais',
      percent2: 'Ver Mais',
      percent3: 'Ver Mais',
      isOpen: false,
      isDisabled: false,
      cardPhoto: null,
      source64: '',
      source: null,
      analisysDate: '',
      idResult: 0,
      add: false,
      statusAnalisys: false,
      results: [],
      id: 0,
      progress: 0,
      indeterminate: false,
      title: "Analise ID: ",
      timer: null,
      loading: true,
      aux: 0,
      cards: [],
    }
    const diseaseInfo = {id: 0};
  }

  static navigationOptions = {
    header: null,
  };

  AddNewCard = () => {
    this.setState({ status: '' });
    this.refs.modal3.close();
    var options = {
      title: 'Selecione uma opção:',
      takePhotoButtonTitle: 'Tirar Foto',
      chooseFromLibraryButtonTitle: 'Escolher da galeria',
      cancelButtonTitle: 'Cancelar',
      storageOptions: {
        skipBackup: true,
        path: 'images'
      },
    };

    ImagePicker.showImagePicker(options, (response) => {
      if (this.state.loading) {
        var progress = <ProgressBarAndroid styleAttr="Small" progress={this.state.progress} />
      }
      console.log('Response = ', response);
      let source = { uri: response.uri };
      this.setState({ cardPhoto: source, add: true, source64: response.data, analisysDate: new Date().getDate() + '/' + new Date().getMonth() + '/' + new Date().getFullYear() });
      this.setState(this.state.cards[this.state.id] = {
        id: this.state.id.toString(),
        title: 'Analise id: ' + this.state.id,
        picture: this.state.cardPhoto,
        content: <View>
          <Text h4>Doenças detectadas: </Text>
          <View style={styles.analisys}>
            <Icon backgroundColor='transparent' name='bug-report'></Icon>
            <Text> {this.state.analisys1}</Text>
            <Right>
              <View flexDirection='row'>
                <ProgressBarAndroid styleAttr="Small"/>
                <TouchableOpacity
                  onPress={() => {this.getDisease(this.state.idDisease1)}}>
                  <Text style={{ color: 'blue' }}>{this.state.percent1}</Text>
                </TouchableOpacity>
              </View>
            </Right>
          </View>
          <View style={styles.analisys}>
            <Icon name='bug-report'></Icon>
            <Text> {this.state.analisys2}</Text>
            <Right>
              <View flexDirection='row'>
                {this.progress}
                <TouchableOpacity
                  onPress={() => {this.getDisease(this.state.idDisease2)}}>
                  <Text style={{ color: 'blue' }}>{this.state.percent2}</Text>
                </TouchableOpacity>
              </View>
            </Right>
          </View>
          <View style={styles.analisys}>
            <Icon name='bug-report'></Icon>
            <Text> {this.state.analisys3}</Text>
            <Right>
              <View flexDirection='row'>
                {this.progress}
                <TouchableOpacity
                  onPress={() => {this.getDisease(this.state.idDisease3)}}> 
                  <Text style={{ color: 'blue' }}>{this.state.percent3}</Text>
                </TouchableOpacity>
              </View>
            </Right>
          </View>
          <Text h4>Você sabia?</Text>
          <Text>A sua análise além de lhe ajudar a identificar a doença que
          está afetando o seu cultivo, está contribuindo junto com o crescimento
                    de nosso banco de imagens?! </Text>
          <Text>Portanto, desfrute o máximo que o
                    Aplicativo GreenEyes pode te oferecer!</Text>
        </View>
      });
      this.setState({ id: parseInt(this.state.id) + 1 });
      this.sendImage();

    });
  }

  sendImage() {
    console.log("log do sendImage:" + this.props.screenProps.token.token)
    fetch('http://192.168.43.163:5000/api/gyresources/images/', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + this.props.screenProps.token.token
      },
      body: JSON.stringify({
        id: 1,
        idDisease: 50,
        url: this.state.source64,
        description: '',
        source: 'cameraRoll',
        size: 1
      }),
    }).then((response) => response.json())
      .then(response => {
        if (response.status_code == 200 || response.status_code == 201) {
          Alert.alert(title = 'Imagem enviada!')
          this.setState({ idImagem: response.response.id });
          console.log(response.status_code + ',' + response.message)
          this.addAnalysis();
        }
      }).catch(error => {
        Alert.alert(title = 'Erro!: ' + response.message)
        console.error(error);
      });
  }

  addAnalysis() {
    console.log("Cheguei no addAnalisys");
    fetch('http://192.168.43.163:5000/api/gyresources/analysis/', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + this.props.screenProps.token.token
      },
      body: JSON.stringify({
        id: 0,
        idImage: this.state.idImagem,
        idClassifier: 1,
        idUser: 1
      }),
    }).then((response) => response.json())
      .then(response => {
          console.log(response);
          this.setState();
          this.roda();
          console.log('Token: ' + this.props.screenProps.token.token + ', Id: ' + this.state.idImagem + ', Message from API: ' + response.message);          
          Alert.alert(title = 'Realizando análise!');
        
     }).catch( (error) =>{ 
       
        Alert.alert(title = 'Error: '+error);
     });
  }

  roda(){
    var runningcounter = 0;
    var res = '';     
    var _this = this;
    var interval = setInterval(function()  {
      runningcounter += 1;
      if(runningcounter == 4 ){
        clearInterval(interval); 
      }
      _this.analisysComplete();
    }, 15000);
  }

  analisysComplete = function() {
    Alert.alert("Iniciando consulta!");
    var res ='';
      console.log("Log do analisysComplete");
      fetch('http://192.168.43.163:5000/api/gyresources/analysis/?action=searchByID&id=2775', {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'dataType': 'json'
      }
      }).then((response) => response.text())
      .then(response => {
        res = response;
        var counter = {};
        response = JSON.parse(response);
        if (response.response.analysis_results.length > 0) {
          Alert.alert("Quase terminando!")
          
          counter[response.response.analysis_results[0].disease.id] = 0;
          console.log("COUNTER_V2: "+Object.keys(counter)+" , TIPO"+typeof counter);
          for(var i = 0; i < response.response.analysis_results.length; i++) {

            //if (!(JSON.stringify(response.response.analysis_results[i].disease.id) in Object.keys(counter))) {
            if (!(counter.hasOwnProperty(JSON.stringify(response.response.analysis_results[i].disease.id)))) {
                counter[response.response.analysis_results[i].disease.id] = 1
              console.log('Inseri 1: '+JSON.stringify(response.response.analysis_results[i].disease.id));
            }
            else {
              counter[response.response.analysis_results[i].disease.id] += 1
              console.log('Inseri +=1: '+JSON.stringify(response.response.analysis_results[i].disease.id));
            }
            console.log("COUNTER_V3: "+Object.keys(counter));
          }

          var greater = [response.response.analysis_results[0].disease.id, response.response.analysis_results[0].disease.id, response.response.analysis_results[0].disease.id];
          console.log('COUNTER: '+JSON.stringify(counter));
          for (var i = 0; i < greater.length; i++) {
            var index = 0
            var aux = 0
            for (var key in counter) {
              if (counter[key] > aux)
                index = key
                aux = counter[key]
            }
            greater[i] = index
            delete counter[index]
          }
          console.log('APARECE MAIS: '+JSON.stringify(greater));

          var diseases = [];
          for (var j = 0; j < greater.length; j++) {
            for (var i = 0; i < response.response.analysis_results.length; i++) {
              if (response.response.analysis_results[i].disease.id == greater[j]) {
                diseases.push(response.response.analysis_results[i].disease)
                break
              }
            }
          }
          console.log('DOENÇA: '+JSON.stringify(diseases));
          if(diseases[0] == null){
            this.setState({analisys1: "Saudável", analisys2: "", analisys3: ""});
          }else{
            this.setState({analisys1: diseases[0].scientificName});
            store.push('diseaseInfo', diseases[0].id);
            this.setState(this.state.cards[parseInt(this.state.id)-1] = {
              id: (parseInt(this.state.id)-1).toString(),
              title: 'Analise id: ' + (parseInt(this.state.id)-1).toString(),
              picture: this.state.cardPhoto,
              content: <View>
                <Text h4>Doenças detectadas: </Text>
                <View style={styles.analisys}>
                  <Icon backgroundColor='transparent' name='bug-report'></Icon>
                  <Text> {this.state.analisys1}</Text>
                  <Right>
                    <View flexDirection='row'>
                      {this.progress}
                      <TouchableOpacity
                        onPress={() => {this.props.navigation.navigate('Disease', {diseaseInfo: diseases[0].id})}}>
                        <Text style={{ color: 'blue' }}>{this.state.percent1}</Text>
                      </TouchableOpacity>
                    </View>
                  </Right>
                </View>
                <Text h4>Você sabia?</Text>
                <Text>A sua análise além de lhe ajudar a identificar a doença que
                está afetando o seu cultivo, está contribuindo junto com o crescimento
                          de nosso banco de imagens?! </Text>
                <Text>Portanto, desfrute o máximo que o
                          Aplicativo GreenEyes pode te oferecer!</Text>
              </View>
            });
            if(diseases[1] == null){
              this.setState({analisys2: "Saudável", analisys3: ""});
            }else{
              this.setState({analisys2: diseases[1].scientificName});
              store.push('diseaseInfo', diseases[1].id);
              this.setState(this.state.cards[parseInt(this.state.id)-1] = {
                id: (parseInt(this.state.id)-1).toString(),
                title: 'Analise id: ' + parseInt(this.state.id)-1,
                picture: this.state.cardPhoto,
                content: <View>
                  <Text h4>Doenças detectadas: </Text>
                  <View style={styles.analisys}>
                    <Icon backgroundColor='transparent' name='bug-report'></Icon>
                    <Text> {this.state.analisys2}</Text>
                    <Right>
                      <View flexDirection='row'>
                        {this.progress}
                        <TouchableOpacity
                          onPress={() => {this.props.navigation.navigate('Disease', {diseaseInfo: diseases[1].id})}}>
                          <Text style={{ color: 'blue' }}>{this.state.percent1}</Text>
                        </TouchableOpacity>
                      </View>
                    </Right>
                  </View>
                  <Text h4>Você sabia?</Text>
                  <Text>A sua análise além de lhe ajudar a identificar a doença que
                  está afetando o seu cultivo, está contribuindo junto com o crescimento
                            de nosso banco de imagens?! </Text>
                  <Text>Portanto, desfrute o máximo que o
                            Aplicativo GreenEyes pode te oferecer!</Text>
                </View>
              });
              if(diseases[2] == null){
                this.setState({analisys3: "Saudável"});
              }else{
                this.setState({analisys3: diseases[2].scientificName})
                store.push('diseaseInfo', diseases[2].id);
                this.setState(this.state.cards[parseInt(this.state.id)-1] = {
                  id: (parseInt(this.state.id)-1).toString(),
                  title: 'Analise id: ' + parseInt(this.state.id)-1,
                  picture: this.state.cardPhoto,
                  content: <View>
                    <Text h4>Doenças detectadas: </Text>
                    <View style={styles.analisys}>
                      <Icon backgroundColor='transparent' name='bug-report'></Icon>
                      <Text> {this.state.analisys2}</Text>
                      <Right>
                        <View flexDirection='row'>
                          {this.progress}
                          <TouchableOpacity
                            onPress={() => {this.props.navigation.navigate('Disease', {diseaseInfo: diseases[2].id})}}>
                            <Text style={{ color: 'blue' }}>{this.state.percent1}</Text>
                          </TouchableOpacity>
                        </View>
                      </Right>
                    </View>
                    <Text h4>Você sabia?</Text>
                    <Text>A sua análise além de lhe ajudar a identificar a doença que
                    está afetando o seu cultivo, está contribuindo junto com o crescimento
                              de nosso banco de imagens?! </Text>
                    <Text>Portanto, desfrute o máximo que o
                              Aplicativo GreenEyes pode te oferecer!</Text>
                  </View>
                });
              }
            }
          }
         console.log("Sorteado.")
        }
        else{
          Alert.alert("Análise quase conclúida!");
        }
      }).catch((error) => {
        console.log("Erro: "+error)
      });
    
  }

  render() {
    return (
      <View style={styles.MainContainer}>
        <ScrollView>
          <View
            paddingTop={15}
            padding={25}>
            <Text h3 >Minhas Análises </Text>

          </View>
          <CardList cards={this.state.cards} />
        </ScrollView>
        <ActionButton
          buttonColor="#00BCD4"
          renderIcon={() => <Icon name="add" />}
          onPress={() => this.refs.modal3.open()} />

        <Modal style={[styles.modal, styles.modal3]}
          position={"center"}
          ref={"modal3"} isDisabled={this.state.isDisabled}>
          <View>
            <Text>
              Selecione a planta a ser classificada:
          </Text>
            <Picker
              style={styles.picker}
              mode="dropdown"
              itemStyle={styles.itemStyle}>
              <Picker.Item label='Tomate' value="tomate" />
            </Picker>
            <Button onPress={
              this.AddNewCard
            } title="Confirmar">
              <View style={[styles.avatar, styles.avatarContainer, { marginBottom: 20 }]}>
                {
                  this.state.cardPhoto === null ? <Text>Tire uma foto</Text> :
                    <Image style={styles.avatar} source={this.state.cardPhoto} />
                }
              </View>
            </Button>
          </View>
        </Modal>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  MainContainer: {
    flex: 1,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    paddingTop: (Platform.OS == 'ios') ? 20 : 0
  },
  analisys: {
    flexDirection: 'row',

  },
  avatar: {
    borderRadius: 75,
    width: 150,
    height: 150
  },
  container: {
    flex: 1,
    backgroundColor: '#BDBDBD'
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
