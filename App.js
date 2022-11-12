import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View,TouchableOpacity ,TouchableHighlight} from 'react-native';
import { theme } from './color';

export default function App() {
  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <View style={styles.header}>
        <TouchableOpacity activeOpacity={0}>
          <Text style={styles.btnText}>Work</Text>
        </TouchableOpacity>
        
        <Text style={styles.btnText}>Travel</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.bg,
  },
  header:{
    justifyContent : "space-between",
    flexDirection : "row",
    marginTop : 100,
    paddingHorizontal : 20,
  },
  btnText:{
    // color: theme.grey,
    color: "white",
    fontSize : 44,
    fontWeight : "600",
    // ㅇㅇ
  }
});
