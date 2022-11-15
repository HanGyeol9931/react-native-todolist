import { StatusBar } from 'expo-status-bar';
import Checkbox from 'expo-checkbox';
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
import { Fontisto,Entypo } from '@expo/vector-icons'; 
import React,{useState,useEffect} from 'react';
import { theme } from './color';
// async-storage(데이터 저장을 위해서 설치) 설치 명령어
// expo install @react-native-async-storage/async-storage

const STORAGE_KEY ="@toDos"
const STORAGE_KEY2 ="@working"
const STORAGE_KEY3 ="@changeChecked"
const STORAGE_KEY4 ="@placeholderText"
export default function App() {
  const [isChecked, setChecked] = useState(false);
  const [working,setWorking] = useState(true);
  const [changeChecked,setChangeChecked] = useState(true);
  const [text,setText] = useState("");
  const [placeholderText,setPlaceholderText] = useState("")
  const [toDos,setToDos] = useState({});
  useEffect(()=>{
    loadToDos()
    loadWorking()
    loadChangeChecked()
  },[])
  useEffect(()=>{
    saveWorking(working)
  },[working])
  useEffect(()=>{
    saveChangeChecked(changeChecked,placeholderText)
  },[changeChecked])
  const travel = ()=> setWorking(false);
  const work = ()=> setWorking(true); 
  const onChangeText = (payload) => setText(payload);
  const saveTodos = async(toSave)=>{
    // STORAGE_KEY를 AsyncStorage에 스트링 형식으로 저장을 시킨다.
    await AsyncStorage.setItem(STORAGE_KEY,JSON.stringify(toSave))
  }
  const saveWorking = async(toSave)=>{
    await AsyncStorage.setItem(STORAGE_KEY2,JSON.stringify(toSave))
  }
  const saveChangeChecked = async(toSave,placeholderText)=>{
    await AsyncStorage.setItem(STORAGE_KEY3,JSON.stringify(toSave))
    await AsyncStorage.setItem(STORAGE_KEY4,JSON.stringify(placeholderText))
  }
  const loadToDos = async()=>{
    const s = await AsyncStorage.getItem(STORAGE_KEY)
    // 이거 안하면 처음 들어왔을때 s에 null값이 들어오면서 에러남
    if(s == null){
      return
    }
    else{
      setToDos(JSON.parse(s))
    }
    // parse string으로 되있는거를 object로 만들어 준다.
  }
  const loadWorking = async()=>{
    const s = await AsyncStorage.getItem(STORAGE_KEY2)
    setWorking(JSON.parse(s))
  }
  const loadChangeChecked = async()=>{
    const s = await AsyncStorage.getItem(STORAGE_KEY3)
    const s2 = await AsyncStorage.getItem(STORAGE_KEY4)
    console.log("누구냐 넌 ?",JSON.parse(s));
    if(s == null){
      setChangeChecked(true)
      return
    }else{
      setChangeChecked(JSON.parse(s))
      setPlaceholderText(JSON.parse(s2))
    }
  }
  const pencilChangeToDo = (key)=>{
    if(changeChecked){
      const newToDos = {...toDos}
      toDos[key].change = !changeChecked;
      setChangeChecked(!changeChecked)
      setPlaceholderText(toDos[key].text)
      setToDos(newToDos);
      saveTodos(newToDos);
    }
    else{
      Alert.alert("안내","이미 변경하고 있는 내용이 있습니다.")
      return
    }
    setText("")
  }
  const checkChangeToDo = (key)=>{
    if(text === ""){
      Alert.alert("안내","내용을 입력하세요")
      return
    }
    else{
      const newToDos = {...toDos}
      toDos[key].text = text;
      toDos[key].change = !changeChecked;
      setChangeChecked(!changeChecked)
      setToDos(newToDos);
      saveTodos(newToDos);
    }
    setText("")

    // setChangeChecked(!changeChecked)
  }

 
  const addToDo = async()=>{
    if(text === ""){
      return
    }
    const newTodos = {
      // 기존에 있던 toDos를 불러와서 [Date.now()] : {text ,work : working }를 추가하는 작업
      ...toDos,
      [Date.now()] : {text ,work : working,check : isChecked ,change : changeChecked }
    };
    // 추가된 newTodos를 ToDos로 만들어 줌
    setToDos(newTodos);
    await saveTodos(newTodos)
    setText("");
  }
  const checkToDo = async(key)=>{
    const newToDos = {...toDos}
    toDos[key].check = !toDos[key].check
      setToDos(newToDos);
      saveTodos(newToDos);
  }
  const deleteToDo = async(key)=>{
    Alert.alert(
      "삭제",
      "정말로 삭제하시겠습니까?",[
        {text : "네",  
        onPress : ()=>{
          const newToDos = {...toDos}
          // delete : 객체 삭제
          delete newToDos[key]
          setToDos(newToDos);
          saveTodos(newToDos);
        }},
        {text : "아니요",style : "destructive",},
      ])
    return
    
  }
  
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
        {changeChecked ?
        <TextInput returnKeyType="send"onSubmitEditing={addToDo}onChangeText={onChangeText}value={text}placeholder={working ? "Add a To Do" :  "Where do you want to go ?"} style = {styles.input} />
        :
        <TextInput returnKeyType="send"onChangeText={onChangeText}value={text}placeholder={placeholderText} style = {styles.input} />
      }
        {/* // keyboardType : 키보드 타입을 정할수 있다.
        // keyboardType="phone-pad"
        // returnKeyType : return을 바꿔줄수 있다.
        // multiline : 여러줄을 사용할수 있다.
        // multiline
        // placeholderTextColor : placeholder 글자색을 바꿔줄수 있다.
        // placeholderTextColor="red"
        // onSubmitEditing 전송버튼을 눌렀을때 실행되는 함수 */}
      </View>
      <ScrollView>
          {Object.keys(toDos).map(key => 
          toDos[key].work === working ?        
          <View style={styles.toDo} key={key}>
            <Text style={{... styles.toDoText,textDecorationLine : toDos[key].check ? "line-through" :  "none"  }}>{toDos[key].text}</Text>
            <View style={styles.icon}>
              <TouchableOpacity>
                {toDos[key].change ?
                <Text style={styles.pencil}>  
                  <Entypo name="pencil" onPress={()=>{pencilChangeToDo(key)}} size={23} color={theme.grey} />
                </Text>
                :
                <Text style={styles.pencil}>  
                  <Entypo name="check" size={23} onPress={()=>{checkChangeToDo(key)}} color={theme.grey} />
                </Text>
                }
              </TouchableOpacity>
              <TouchableOpacity>
                <Text style={styles.box}>
                  <Checkbox style={styles.checkbox} value={toDos[key].check} onValueChange={()=>{checkToDo(key)}} />
                </Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={()=>{deleteToDo(key)}}>  
                <Text>  
                  <Fontisto name="trash" size={18} color={theme.grey} />
                </Text>
              </TouchableOpacity>
            </View>
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
    
  },
  checkbox: {
    width : 18,
    height : 18,
    borderColor : theme.grey,
  },
  box : {
    marginTop : 4,
    marginRight : 10,
  },  
  icon : {
    flexDirection : "row",
  },
  pencil :{
    marginRight : 10,
  }

});
