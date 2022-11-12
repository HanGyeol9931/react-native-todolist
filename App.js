import { StatusBar } from 'expo-status-bar';
import { StyleSheet, 
  Text,
  View,
  // 버튼 인데 불투명도 조절 가능
  TouchableOpacity,
  // 버튼 인데 배경색 바꿔줄수 있음
  // TouchableHighlight,
  // 버튼 인데 애니매이션은 없다
  // TouchableWithoutFeedback,
  // 새롭게 나온 터치 방식 
  // Pressable,
  // 인풋 형식
  TextInput,
  // ScrollView 스크롤 할수 있게 해준다.
  ScrollView,
  Alert
  } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Fontisto } from '@expo/vector-icons'; 
import React,{useState,useEffect} from 'react';
import { theme } from './color';
// async-storage(데이터 저장을 위해서 설치) 설치 명령어
// expo install @react-native-async-storage/async-storage

const STORAGE_KEY ="@toDos"
export default function App() {
  
  const [working,setWorking] = useState(true);
  const [text,setText] = useState("");
  const [toDos,setToDos] = useState({});
  useEffect(()=>{
    loadToDos()
  },[])
  const travel = ()=> setWorking(false);
  const work = ()=> setWorking(true); 
  const onChangeText = (payload) => setText(payload);
  const saveTodos = async(toSave)=>{
    await AsyncStorage.setItem(STORAGE_KEY,JSON.stringify(toSave))
  }
  const loadToDos = async()=>{
    const s = await AsyncStorage.getItem(STORAGE_KEY)
    // parse string으로 되있는거를 object로 만들어 준다.
   setToDos(JSON.parse(s))
  }
  
  const addToDo = async()=>{
    if(text === ""){
      return
    }
    const newTodos = {
      ...toDos,
      [Date.now()] : {text ,work : working }
    };
    setToDos(newTodos);
    await saveTodos(newTodos)
    setText("");
  }
  const deleteToDo = async(key)=>{
    Alert.alert(
      "삭제",
      "정말로 삭제하시겠습니까?",[
        {text : "네",  
        onPress : ()=>{
          const newToDos = {...toDos}
          delete newToDos[key]
          setToDos(newToDos);
          saveTodos(newToDos);
        }},
        {text : "아니요",style : "destructive",},
      ])
    return
    
  }
  console.log(toDos);
  return (
    <View style={styles.container}>
      {/* StatusBar : 시간 배터리 색상 */}
      <StatusBar style="auto" />
      <View style={styles.header}>
        {/* TouchableOpacity 버튼같은 느낌 activeOpacity를 통해서 불투명도를 정할수 있다. 
            TouchableHighlight는 underlayColor를 통해서 배경을 바꿀수 있다 .activeOpacity도 가능하다.
            TouchableOpacity,TouchableHighlight는 onPress ={()=>console.log("pressed")}를 통해서
        */}
        <TouchableOpacity onPress ={work}>
          <Text style={{...styles.btnText, color: working ? "white" : theme.grey }}>Work</Text>
        </TouchableOpacity> 
        <TouchableOpacity onPress ={travel}>
        <Text style={{...styles.btnText, color: !working ? "white" : theme.grey}} >Travel</Text>
        </TouchableOpacity>
      </View>
      <View>
        <TextInput 
        // keyboardType : 키보드 타입을 정할수 있다.
        // keyboardType="phone-pad"
        // returnKeyType : return을 바꿔줄수 있다.
        returnKeyType="send"
        // multiline : 여러줄을 사용할수 있다.
        // multiline
        // placeholderTextColor : placeholder 글자색을 바꿔줄수 있다.
        // placeholderTextColor="red"
        onSubmitEditing={addToDo}
        onChangeText={onChangeText}
        value={text}
        placeholder={working ? "Add a To Do" :  "Where do you want to go ?"} 
        style = {styles.input} />
      </View>
      <ScrollView>
          {Object.keys(toDos).map(key => 
          toDos[key].work === working ?        
          <View style={styles.toDo} key={key}>
            <Text style={styles.toDoText}>{toDos[key].text}</Text>
            <TouchableOpacity onPress={()=>{deleteToDo(key)}}>
              <Text><Fontisto name="trash" size={18} color={theme.grey} /></Text>
            </TouchableOpacity>
          </View> 
          :
          null
          )}
          
        </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.bg,
  },
  header:{
    // 가로 정렬
    flexDirection : "row",
    // flexDirection : "row" 이기 때문에 가로 정렬 스타일
    justifyContent : "space-between",
    marginTop : 100,
    // 패딩 왼쪽 오른쪽 패딩을 준다.
    paddingHorizontal : 20,
  },
  btnText:{
    fontSize : 44,
    fontWeight : "600",
  },
  input:{
    backgroundColor : "white",
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius : 30,
    marginVertical : 10,
    fontSize : 18,
  },
  toDo : {
    backgroundColor : theme.toDoBg,
    marginBottom: 10,
    paddingVertical :  20,
    paddingHorizontal : 20,
    borderRadius : 15,
    flexDirection : "row",
    alignItems :"center",
    justifyContent : "space-between"
  },
  toDoText : {
    color : "white",
    fontSize : 16,
    fontWeight :  "500",
  }
});
