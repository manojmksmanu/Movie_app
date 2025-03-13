import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: "#1a1a1a",
          borderColor:'red',
          borderWidth: 4,
          borderBottomWidth:0,
          height: 70,
          paddingBottom: 10,
          paddingTop: 5,
          position: "absolute",
          // bottom: 20,
          left: 20,
          right: 20,
          borderTopRightRadius: 20,
          borderTopLeftRadius: 20,
          elevation: 10,
          shadowColor: "#e21221",
          shadowOffset: { width: 0, height: 0 },
          shadowOpacity: 0.3,
          shadowRadius: 10,
          marginHorizontal:20,
          
        },
        tabBarActiveTintColor: "#e21221",
        tabBarInactiveTintColor: "#666666",
        headerStyle: {
          backgroundColor: "#1a1a1a",
          borderBottomWidth: 0,
        },
        headerTintColor: "#ffffff",
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: "600",
          marginBottom: 2,
        },
        tabBarItemStyle: {
          marginHorizontal: 10,
          // borderRadius: 10,
        },
        // Custom icon renderer
        tabBarIconStyle: {
          marginTop: 5,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ size, color, focused }) => (
            <View
              style={[
                styles.iconContainer,
                focused && styles.iconContainerActive,
              ]}
            >
              <Ionicons
                name="film-outline"
                size={size + 6}
                color={color}
                style={focused && { transform: [{ scale: 1.1 }] }}
              />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="shortlist"
        options={{
          title: "Shortlist",
          tabBarIcon: ({ size, color, focused }) => (
            <View
              style={[
                styles.iconContainer,
                focused && styles.iconContainerActive,
              ]}
            >
              <Ionicons
                name="bookmark-outline"
                size={size + 6}
                color={color}
                style={focused && { transform: [{ scale: 1.1 }] }}
              />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="movies"
        options={{
          title: "Movies",
          tabBarIcon: ({ size, color, focused }) => (
            <View
              style={[
                styles.iconContainer,
                focused && styles.iconContainerActive,
              ]}
            >
              <Ionicons
                name="film-outline"
                size={size + 6}
                color={color}
                style={focused && { transform: [{ scale: 1.1 }] }}
              />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="tv"
      
        options={{
          title: "TV",
          tabBarIcon: ({ size, color, focused }) => (
            <View
              style={[
                styles.iconContainer,
                focused && styles.iconContainerActive,
              ]}
            >
              <Ionicons
                name="tv-outline"
                size={size + 6}
                color={color}
                style={focused && { transform: [{ scale: 1.1 }] }}
              />
            </View>
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.05)",
  },
  iconContainerActive: {
    backgroundColor: "rgba(226, 18, 33, 0.15)",
    transform: [{ scale: 1.1 }],
  },
});
