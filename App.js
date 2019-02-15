import React from 'react';
import { StyleSheet, Text, View, TextInput, FlatList, Image, Button, Linking, Alert } from 'react-native';

export default class App extends React.Component {
  state = { 
    search: '',
    results: [],
    groceries: [],
    showGroceryList: false
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

  getIngredients = (rId) => {
    var baseUrl = 'https://www.food2fork.com/api/'
    var endpoint = 'get'
    var apiKey = 'a6777c00068f36f86fc5c379d021b86b'

    fetch(baseUrl + endpoint + '?key=' + apiKey + '&rId=' + rId)
        .then(res => res.json())
        .then((myJson) => {
          this.setState({
            groceries: [
              ...this.state.groceries, ...myJson.recipe.ingredients
            ]
          })
          // Works on both iOS and Android
          Alert.alert(
            'Grocery List Updated',
            'The ingredients for this recipe have been added to your grocery list.',
            [
              {text: 'View Grocery List', onPress: this.viewGroceryList},
              {text: 'Go Back', onPress: () => console.log('OK Pressed')},
            ],
            {cancelable: false},
          );
        })
        .catch(err => console.log(err))
  }

  viewGroceryList = () => this.setState({ showGroceryList: true })
  viewMainScreen = () => this.setState({ showGroceryList: false })

  _renderGroceryItem = ({item}) => {
    return (
      <View style={styles.recipe}>
        <Text>{item}</Text>
        {/* <Button
          onPress={() => this.removeGroceryItem(item)}
          title="Delete Grocery Item"
          color="#841584"
        /> */}
      </View>
      )
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
          <Button
            onPress={() => this.getIngredients(item.recipe_id)}
            title="Add To Grocery List"
            color="#841584"
          />
        </View>
        )
  }

  render() {
    if(this.state.showGroceryList) {
      // render our grocery list screen
      return (
        <View style={styles.container}>
          <Text>Your Grocery List</Text>
        <Button
              onPress={this.viewMainScreen}
              title="Back to Main Screen"
              color="#841584"
            />
            {this.state.groceries.length == 0 ? <Text>Your grocery list is empty</Text> : null}
        <FlatList
          data={this.state.groceries}
          renderItem={this._renderGroceryItem}
        />
        </View>
      );
    } else {
      // render our main screen
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
        <Button
              onPress={this.viewGroceryList}
              title="View Grocery List"
              color="#841584"
            />
        <FlatList
          data={this.state.results}
          renderItem={this._renderItem}
        />
        </View>
      );
    }
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