import React from 'react';
import { StyleSheet, Text, View, TextInput, FlatList, Image, Button, Linking, Alert } from 'react-native';

export default class App extends React.Component {
  state = {
    search: '',
    results: [],
    savedRecipes: [],
    showGroceryList: false
  };

  // api key a6777c00068f36f86fc5c379d021b86b 

  lookupRecipes() {
    var baseUrl = 'https://www.food2fork.com/api/'
    var endpoint = 'search'
    var apiKey = 'f573a959a36eeefaed9f8562e4601dd0'
    var query = this.state.search

    fetch(baseUrl + endpoint + '?key=' + apiKey + '&q=' + query)
      .then(res => res.json())
      .then((myJson) => {
        this.setState({
          results: myJson.recipes
        })
        console.log(myJson.recipes)
      })
      .catch(err => console.log(err))
  }

  viewRecipe = (url) => {
    Linking.openURL(url)
  }

  saveRecipe = (recipe) => {
    this.setState({
      savedRecipes: [
        ...this.state.savedRecipes, recipe
      ]
    })
    // Works on both iOS and Android
    Alert.alert(
      'Saved Recipes List Updated',
      'The recipe has been added to your list.',
      [
        { text: 'View Saved Recipes', onPress: this.viewSavedRecipes },
        { text: 'Go Back', onPress: () => console.log('OK Pressed') },
      ],
      { cancelable: false },
    );
  }

  removeRecipe = (rId) => {
    let newSavedRecipes = this.state.savedRecipes.filter(recipe => recipe.recipe_id != rId)
    this.setState({ savedRecipes: newSavedRecipes })
  }

  viewSavedRecipes = () => this.setState({ showGroceryList: true })
  viewMainScreen = () => this.setState({ showGroceryList: false })

  _renderSavedRecipe = ({ item }) => {
    return (
      <View id={item.id} style={styles.recipe}>
        <Image
          style={{ width: 250, height: 250 }}
          source={{ uri: item.image_url }}
        />
        <Text>{item.title}</Text>
        <Button
          onPress={() => this.viewRecipe(item.source_url)}
          title="View Recipe"
          color="#841584"
          style={styles.buttons}
        />
        <Button
          onPress={() => this.removeRecipe(item.recipe_id)}
          title="Remove Recipe"
          color="#841584"
          style={styles.buttons}
        />
      </View>
    )
  }
  _renderItem = ({ item }) => {
    return (
      <View id={item.id} style={styles.recipe}>
        <Image
          style={{ width: 250, height: 250 }}
          source={{ uri: item.image_url }}
        />
        <Text>{item.title}</Text>
        <Button
          onPress={() => this.viewRecipe(item.source_url)}
          title="View Recipe"
          color="#841584"
          style={styles.buttons}
        />
        <Button
          onPress={() => this.saveRecipe(item)}
          title="Save Recipe"
          color="#841584"
          style={styles.buttons}
        />
      </View>
    )
  }

  _keyExtractor = (item, index) => item.recipe_id;

  render() {
    if (this.state.showGroceryList) {
      // render our grocery list screen
      return (
        <View style={styles.container}>
          <Text>Your Saved Recipes</Text>
          <Button
            onPress={this.viewMainScreen}
            title="Back to Main Screen"
            color="#841584"
          />
          {this.state.savedRecipes.length == 0 ? <Text>You haven't saved any recipes yet.</Text> : null}
          <FlatList
            data={this.state.savedRecipes}
            renderItem={this._renderSavedRecipe}
            keyExtractor={this._keyExtractor}
          />
        </View>
      );
    } else {
      // render our main screen
      return (
        <View style={styles.container}>
          <Image
            source={require('./assets/logo.png')}
          />
          <Text>Welcome to Munch Recipes</Text>
          <TextInput
            style={styles.search}
            onChangeText={(search) => this.setState({ search })}
            onEndEditing={() => this.lookupRecipes()}
            value={this.state.search}
            placeholder="Try 'Avocado' or 'Chicken,Quinoa'..."
          />
          <Button
            onPress={this.viewSavedRecipes}
            title="View Saved Recipes"
            color="#841584"
          />
          <FlatList
            data={this.state.results}
            renderItem={this._renderItem}
            keyExtractor={this._keyExtractor}
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
  },
  buttons: {
    marginTop: 5
  }
});