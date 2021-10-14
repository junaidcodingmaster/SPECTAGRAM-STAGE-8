import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  SafeAreaView,
  Platform,
  StatusBar,
  Dimensions,
  Switch,
  ScrollView,
} from "react-native";
import { RFValue } from "react-native-responsive-fontsize";

import firebase from "firebase";


const coverWdth = Dimensions.get("screen").width;
const profileImageSize = 160;
const AllTextColor = "white";

export default class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: {
        profile_image: "",
        name: "",
        first_name: "",
        last_name: "",
        full_name: "",
        email: "",

      },
      isEnabled: false,
      light_theme: true,
    };
  }

  componentDidMount() {
    this.fetchUser(); 
  }

  toggleSwitch() {
    const previous_state = this.state.isEnabled;
    const theme = !this.state.isEnabled ? "dark" : "light";
    var updates = {};
    updates["/users/" + firebase.auth().currentUser.uid + "/current_theme"] =
      theme;
    firebase.database().ref().update(updates);
    this.setState({ isEnabled: !previous_state, light_theme: previous_state });
  }

  async fetchUser() {
    let theme, name, image, full_name, first_name, last_name, email, rawName;
    await firebase
      .database()
      .ref("/users/" + firebase.auth().currentUser.uid)
      .on("value", function (snapshot) {
        theme = snapshot.val().current_theme;
        image = snapshot.val().profile_picture;
        full_name = `${snapshot.val().first_name} ${snapshot.val().last_name}`;
        first_name = snapshot.val().first_name;
        last_name = snapshot.val().last_name;
        email = snapshot.val().gmail;
        name = full_name.toString().trim().slice(0, 5)+Math.floor(Math.random() * 100) + 1;     
      });
    this.setState({
      user: {
        profile_image: image,
        full_name: full_name,
        first_name: first_name,
        last_name: last_name,
        name: name,
        email: email,
      },
      light_theme: theme === "light" ? true : false,
      isEnabled: theme === "light" ? false : true,
    });
  }

  render() {
    return (
      <View style={styles.container}>
        <SafeAreaView style={styles.droidSafeArea} />
        <ScrollView>
          <View>
            <View style={styles.profileBackgroundContainer}>
              <Image
                source={require("../assets/spectagram_profile_background.png")}
                style={styles.profileBackground}
              />
            </View>
            <View style={styles.profileImageContainer}>
              <Image
                source={{ uri: this.state.user.profile_image }}
                style={styles.profileImage}
              />
            </View>
            <View style={styles.userNameContainer}>
              <Text style={styles.userNameText}>{this.state.user.name}</Text>
            </View>
          </View>
          <View style={styles.profileInfo}>
            <View style={styles.nameContainer}>
              <Text style={styles.nameTitle}>Name :</Text>
              <Text style={styles.nameText}>{this.state.user.full_name}</Text>
            </View>
            <View style={styles.emailContainer}>
              <Text style={styles.emailTitle}>Email :</Text>
              <Text style={styles.emailText}>{this.state.user.email}</Text>
            </View>
            <View style={styles.firstNameContainer}>
              <Text style={styles.firstNameTitle}>First Name :</Text>
              <Text style={styles.firstNameText}>
                {this.state.user.first_name}
              </Text>
            </View>
            <View style={styles.lastNameContainer}>
              <Text style={styles.lastNameTitle}>Last Name :</Text>
              <Text style={styles.lastNameText}>
                {this.state.user.last_name}
              </Text>
            </View>
            <View style={styles.lastNameContainer}>
              <Text style={styles.lastNameTitle}>User Name :</Text>
              <Text style={styles.lastNameText}>
                {this.state.user.name}
              </Text>
            </View>
          </View>
          <View style={styles.themeContainer}>
            <Text style={styles.themeText}>Dark Theme</Text>
            <Switch
              style={{
                transform: [{ scaleX: 1.3 }, { scaleY: 1.3 }],
              }}
              trackColor={{ false: "#767577", true: "white" }}
              thumbColor={this.state.isEnabled ? "#ee8249" : "#f4f3f4"}
              ios_backgroundColor="#3e3e3e"
              onValueChange={() => this.toggleSwitch()}
              value={this.state.isEnabled}
            />
          </View>
          <View style={{ height: 100 }} />
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
  },
  droidSafeArea: {
    marginTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  profileBackground: {
    height: 350,
    width: coverWdth,
  },
  profileImageContainer: {
    marginTop: -235,
    alignItems: "center",
    justifyContent: "center",
  },
  profileImage: {
    width: profileImageSize,
    height: profileImageSize,
    borderRadius: 100,
    marginLeft: 15,
  },
  userNameContainer: {
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    marginLeft: 15,
    marginTop: 5,
  },
  userNameText: {
    color: "black",
    fontSize: 25,
    fontWeight: "bold",
  },
  profileInfo: {
    marginTop: 40,
  },
  nameContainer: {
    marginLeft: 10,
  },
  nameTitle: {
    fontSize: 25,
    color: AllTextColor,
  },
  nameText: {
    fontSize: 17,
    marginTop: 5,
    color: AllTextColor,
  },
  emailContainer: {
    marginLeft: 10,
    marginTop: 15,
  },
  emailTitle: {
    fontSize: 25,
    color: AllTextColor,
  },
  emailText: {
    fontSize: 17,
    marginTop: 5,
    color: AllTextColor,
  },
  firstNameContainer: {
    marginLeft: 10,
    marginTop: 15,
  },
  firstNameTitle: {
    fontSize: 25,
    color: AllTextColor,
  },
  firstNameText: {
    fontSize: 17,
    marginTop: 5,
    color: AllTextColor,
  },
  lastNameContainer: {
    marginLeft: 10,
    marginTop: 15,
  },
  lastNameTitle: {
    fontSize: 25,
    color: AllTextColor,
  },
  lastNameText: {
    fontSize: 17,
    marginTop: 5,
    color: AllTextColor,
  },
  themeContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 20,
  },
  themeText: {
    color: AllTextColor,
    fontSize: RFValue(20),
    marginRight: RFValue(15),
  },
});
