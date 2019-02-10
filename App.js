import React from 'react';
import { StyleSheet, Text, View, TextInput, FlatList, Image, Button, Linking } from 'react-native';

export default class App extends React.Component {
  state = { 
    search: '',
    results: []
  };

  // api key a6777c00068f36f86fc5c379d021b86b 

  lookupRecipes() {
    var baseUrl = 'https://www.food2fork.com/api/'
    var endpoint = 'search'
    var apiKey = 'a6777c00068f36f86fc5c379d021b86b'
    var query = this.state.search

    fetch(baseUrl + endpoint + '?key=' + apiKey + '&q=' + query)
        .then(res => res.json())
        .then((myJson) => {
          this.setState({
            results: myJson.recipes
          })
        })
        .catch(err => console.log(err))
  }

  viewRecipe = (url) => {
    Linking.openURL(url)
  }

  _renderItem = ({item}) => {
      return (
        <View style={styles.recipe}>
          <Image
            style={{width: 250, height: 250}}
            source={{uri: item.image_url}}
          />
          <Text>{item.title}</Text>
          <Button
            onPress={() => this.viewRecipe(item.source_url)}
            title="View Recipe"
            color="#841584"
          />
        </View>
        )
  }

  render() {
    return (
      <View style={styles.container}>
        <Text>Welcome to Munch Recipes</Text>
        <TextInput
        style={styles.search}
        onChangeText={(search) => this.setState({search})}
        onEndEditing={() => this.lookupRecipes()}
        value={this.state.search}
        placeholder="Try 'Avocado' or 'Chicken,Quinoa'..."
      />
      <FlatList
        data={this.state.results}
        renderItem={this._renderItem}
      />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 50,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  search: {
    height: 40, 
    borderColor: 'gray', 
    borderWidth: 3,
    width: '90%'
  },
  recipe: {
    flex: 1,
    marginTop: 50,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  }
});