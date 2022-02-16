import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  TextInput,
  Image,
  ImageBackground,
  Pressable,
  Text,
  View,
  ActivityIndicator,
} from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Home() {
  const navigation = useNavigation();
  const [Login, setLogin] = useState("");
  const [load, setLoad] = useState(false);
  const [token, setToken] = useState("");
  const uid =
    "5e5240aebdae1725339e7552207896c0435af4ecc75cdf97803171c3cf1d6269";
  const secret =
    "6ddc4c67f9f0b4d2333818cfd5e6eadad4fd4d51de6bd8656e9a196e4ee06d4c";

  useEffect(() => {
    // getToken();
    GetToken();
  }, []);

  const GetToken = async () => {
    try {
      const data = await AsyncStorage.getItem("@storage_Key");
      const parseData = JSON.parse(data);
      const token = parseData?.access_token;
      const date = (parseData?.created_at + parseData?.expires_in) * 1000;
      if (!token || !date || Date.now() >= date) getToken();
      else setToken(token);
    } catch (er) {
      // if (er.name === "NotFoundError" || er.name === "ExpiredError")
      //   getToken();
      console.log(er);
    }
  };
  const getToken = () => {
    console.log("New TOKEN");
    axios
      .post(
        "https://api.intra.42.fr/oauth/token",
        {
          grant_type: "client_credentials",
          client_id: uid,
          client_secret: secret,
        },
        { timeout: 2000 }
      )
      .then(async (tk) => {
        console.log("-------------");
        console.log(tk.data);
        console.log("-------------");
        setToken(tk.data.access_token);
        try {
          await AsyncStorage.setItem("@storage_Key", JSON.stringify(tk.data));
        } catch (e) {
          // saving error
          console.log("error to save dataToken");
        }
      });
  };

  const ft_search = () => {
    console.log("here--------------------");
    setLoad(true);
    if (Login) {
      axios
        .get("https://api.intra.42.fr/v2/users/" + Login.toLocaleLowerCase(), {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((rs) => {
          // console.log(rs);
          navigation.navigate("Profile", {
            result: rs?.data,
          });
          setLoad(false);
          setLogin("");
        })
        .catch(() => {
          console.log("not found");
          setLoad(false);
          alert("User Doesn't Exist");
          setLogin("");
        });
    } else setLoad(false);
  };

  return (
    <ImageBackground
      source={require("../assets/background_login.jpg")}
      style={styles.bgImage}
    >
      <View>
        <View style={styles.imageView}>
          <Image
            style={styles.img}
            source={require("../assets/42_logoo.png")}
          />
        </View>
        {token && !load ? (
          <View>
            <TextInput
              style={styles.input}
              onChangeText={(e) => setLogin(e.trim())}
              value={Login}
              placeholder="Login"
              placeholderTextColor="#4c4c4c"
            />

            <Pressable
              style={styles.button}
              onPress={Login ? ft_search : () => {}}
            >
              <Text style={styles.text}>SEARCH</Text>
            </Pressable>
          </View>
        ) : (
          <ActivityIndicator size="large" color="#00babc" />
        )}
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  bgImage: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  input: {
    margin: 0,
    padding: 8,
    height: 40,
    width: 250,
    backgroundColor: "rgba(30,30,30,0.5)",
    color: "#c7c7c7",
    borderWidth: 1,
    borderColor: "#00babc",
    fontSize: 20,
    alignSelf: "center",
  },
  button: {
    paddingVertical: 12,
    width: 250,
    margin: 30,
    backgroundColor: "#00babc",
  },
  text: {
    fontSize: 25,
    fontWeight: "bold",
    letterSpacing: 0.25,
    color: "white",
    textAlign: "center",
  },
  imageView: {
    width: 300,
    padding: 30,
    alignItems: "center",
  },
  img: {
    alignItems: "center",
  },
});
