import {
  StyleSheet,
  View,
  ImageBackground,
  Text,
  ScrollView,
  FlatList,
  SafeAreaView,
  Image,
} from "react-native";
import ModalDropdown from "react-native-modal-dropdown";
import React, { useState } from "react";
import { useRoute } from "@react-navigation/native";
import useOrientation from "../hooks/useOrientation";
import * as Progress from "react-native-progress";
// import { Icon } from "rreact-native-elements";
import Icon from "react-native-vector-icons/FontAwesome";

export default function Profile() {
  const route = useRoute();
  const result = route?.params.result;
  // console.log(result);
  const orientation = useOrientation();
  let arr = [];
  result?.cursus_users.map((el, key) => arr.push(el.cursus.name));
  const [value, setvalue] = useState(2);
  // console.log("-----------------------------------------");
  // console.log(result.image_url);
  // console.log("-----------------------------------------");

  /* ------------------------------ PROJECTS LIST --------------------------------- */
  const renderProjectsList = ({ item }) => {
    return (
      <View style={styles.pList} key={item.id}>
        <Text style={styles.pListText}>
          -- {item.project.slug} - {item.final_mark ? item.final_mark : 0}%
        </Text>
        {item["validated?"] ? (
          <Icon name="check" color="#5cb85c" size={25} />
        ) : (
          <Icon name="close" color="#a94442" size={25} />
        )}
      </View>
    );
  };

  /* ------------------------------ SKILLS LIST --------------------------------- */
  const renderSkillsList = ({ item }) => {
    return (
      <View
        key={item.id}
        style={
          orientation === "portrait"
            ? ""
            : {
                flexDirection: "row",
                width: "60%",
              }
        }
      >
        <Text style={styles.pListText}>
          -- {item.name} - level: {item.level.toFixed(2)}%
        </Text>
        <Progress.Bar
          progress={item.level % 1}
          style={styles.skillsBar}
          width={300}
          color={"#00babc"}
        />
      </View>
    );
  };

  return (
    <ImageBackground
      source={require("../assets/background_login.jpg")}
      style={styles.bgImage}
    >
      <ScrollView>
        <SafeAreaView style={{ alignItems: "center" }}>
          <View style={styles.profileTop}>
            {/* ------------------------------ PICTURE & LOCATION --------------------------------- */}
            <View>
              <View style={styles.profileImgBorder}>
                <Image
                  style={styles.profileImg}
                  source={{ uri: result.image_url }}
                />
              </View>
              <View style={styles.status}>
                {result?.location ? (
                  <View style={{ alignItems: "center" }}>
                    <Text style={styles.statusText}>Available</Text>
                    <Text style={styles.statusText}>{result?.location}</Text>
                  </View>
                ) : (
                  <Text
                    style={{
                      textAlign: "center",
                      fontWeight: "bold",
                      fontSize: 16,
                      color: "#fff",
                    }}
                  >
                    Unavailable
                  </Text>
                )}
              </View>
            </View>
            {/* ------------------------------ PROFILE INFO --------------------------------- */}
            <View style={styles.profileInfo}>
              <Text style={{ color: "#00babc" }}>
                {result?.login ? result?.login : <></>}
              </Text>
              <Text style={styles.profileDetails}>
                {result?.first_name ? result?.first_name : <></>}
                {result?.last_name ? result?.last_name : <></>}
              </Text>
              <Text style={styles.profileDetails}>
                Wallet : {result?.wallet ? result?.wallet : <></>} ₳
              </Text>
              <Text style={styles.profileDetails}>
                Evaluation points :
                {result?.correction_point ? result?.correction_point : <></>}
              </Text>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  flexWrap: "wrap",
                  width: "100%",
                  marginTop: 10,
                }}
              >
                <Text style={styles.profileDetails}>Cursus :</Text>
                <ModalDropdown
                  options={arr}
                  animated={true}
                  defaultIndex={2}
                  defaultValue="42Cursus"
                  onSelect={(e) => setvalue(e)}
                  textStyle={{ color: "#fff", fontSize: 18 }}
                  renderRightComponent={() => (
                    <Icon
                      name="chevron-down"
                      size={15}
                      style={{ color: "#00babc", marginLeft: 5 }}
                    />
                  )}
                />
              </View>
              <Text style={styles.profileDetails}>
                Grade :
                {result.cursus_users[value]?.grade
                  ? result.cursus_users[value]?.grade
                  : "Novice"}
              </Text>
            </View>
          </View>
          {/* ------------------------------ LEVEL --------------------------------- */}
          {result.cursus_users[value]?.level ? (
            <View style={styles.level}>
              <Text style={styles.levelText}>
                Level : {result.cursus_users[value]?.level} %
              </Text>
              <Progress.Bar
                style={styles.levelBar}
                progress={result.cursus_users[value]?.level % 1}
                width={orientation === "portrait" ? 370 : 700}
                color={"#00babc"}
                height={10}
              />
            </View>
          ) : (
            <></>
          )}
          {/* ------------------------------ SKILLS --------------------------------- */}
          {result?.cursus_users[value]?.skills ? (
            <View style={styles.projects}>
              <Text style={styles.pText}>Skills</Text>
              <FlatList
                nestedScrollEnabled
                data={result?.cursus_users[value]?.skills}
                renderItem={renderSkillsList}
                keyExtractor={(item) => item.id}
              />
            </View>
          ) : (
            <></>
          )}
          {/* ------------------------------ PROJECTS --------------------------------- */}
          {result?.projects_users ? (
            <View style={styles.projects}>
              <Text style={styles.pText}>Projects</Text>
              <FlatList
                nestedScrollEnabled
                data={result?.projects_users}
                renderItem={renderProjectsList}
                keyExtractor={(item) => item.id}
              />
            </View>
          ) : (
            <></>
          )}
        </SafeAreaView>
      </ScrollView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  bgImage: {
    flex: 1,
  },
  profileTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
  },
  profileImgBorder: {
    width: 200,
    height: 200,
    backgroundColor: "#00babc",
    borderRadius: 1225,
    margin: 10,
  },
  profileImg: {
    width: 190,
    height: 190,
    borderRadius: 1225,
    margin: 5,
  },
  status: {
    marginLeft: 20,
    width: 180,
    alignItems: "center",
  },
  statusText: {
    color: "#fff",
  },
  profileInfo: {
    marginTop: 15,
    width: "50%",
  },

  profileDetails: {
    marginTop: 10,
    marginRight: 10,
    color: "#fff",
    fontSize: 20,
  },
  level: {
    alignItems: "center",
    marginTop: 10,
  },
  levelText: {
    color: "#fff",
    fontSize: 15,
  },
  levelBar: {
    color: "#00babc",
    marginTop: 10,
    marginBottom: 15,
  },
  projects: {
    height: 500,
    width: "90%",
    backgroundColor: "#00babc4f",
    marginBottom: 20,
    borderRadius: 10,
    padding: 20,
  },
  pText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 25,
  },
  pList: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    height: 40,
  },
  pListText: {
    color: "#fff",
    fontSize: 15,
    width: "90%",
  },
  skillsBar: {
    alignSelf: "center",
    marginTop: 5,
  },
});
