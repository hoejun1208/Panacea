//gpt 채팅 화면
import React, { useState, useRef, useEffect } from 'react'
import { View, Text, StyleSheet, TextInput, Platform, TouchableOpacity, InteractionManager, findNodeHandle, AccessibilityInfo } from 'react-native'

// 서버통신
import axios from 'axios';
import ServerPort from '../../Components/ServerPort';
const IP = ServerPort();

import MessageList from '../../Components/MessageList';

import Icon from '@expo/vector-icons/MaterialCommunityIcons';
//색 모음
import { theme } from '../../theme';
import Search from '../../Components/Search';
import { useFocusEffect } from '@react-navigation/native';
// import { Platform } from 'react-native';

const messages = [];
function Gpt({ navigation, route }) {
  const screanReaderFocus = useRef(null);
  // useFocusEffect(() => {
  //   InteractionManager.runAfterInteractions(() => {
  //     const reactTag = findNodeHandle(screanReaderFocus.current);
  //     if (reactTag) {
  //       console.log("findNodeHandle")
  //       AccessibilityInfo.setAccessibilityFocus(reactTag);
  //     }
  //   })
  // }, []);
  // 사용자가 보낸 메세지 전부 axios통신보내버리기
  const [message, setMessage] = useState(''); // 사용자 메시지 입력
  const [conversations, setConversations] = useState([]); // 대화 목록
  // 사용자가 보낸 데이터를 저장할 배열
  const sendMessageToServer = async (mesasage) => {

    messages.push({ role: 'user', content: message });
    setMessage(''); // 메시지 입력 초기화

    const newConversation = [
      { role: 'user', content: message }, // 사용자 메시지
    ];
    setConversations(prevConversations => [...prevConversations, newConversation]);

    try {
      const res = await axios.post(`${IP}/chat/question`, messages);
      console.log("chatgpt sendMessage...", message);
      console.log('메시지 전송 완료', res.data);

      const newConversation = [
        { role: 'assistant', content: res.data }, // 어시스턴트의 응답
      ];
      messages.push({ role: 'assistant', content: res.data })
      setConversations(prevConversations => [...prevConversations, newConversation]);
      console.log(conversations)
      console.log("COMPLEATE")
      // setMessage(''); // 메시지 입력 초기화
    } catch (error) {
      console.log("chat gpt메세지 보내기 실패,,,", error);
      console.log("뭐보냄?...", message);
    }
  };

  useEffect(() => {
    console.log("chat gpt useEffect", conversations);
    if(conversations.length > 0){

      AccessibilityInfo.announceForAccessibility(conversations[conversations.length-1][0].content);
    }

  },[conversations]);

  return (
    <View style={{ flex: 1 }}>
      <MessageList conversations={conversations} />
      {/* 입력 창 */}
      <View style={styles.TextInputcontainer}>
        <View style={styles.innerContainer}>

          <View style={styles.inputAndMicrophone}>
            {/* <TouchableOpacity style={styles.emoticonButton}>
                  <Icon name="emoticon-outline" size={23} color={theme.colors.description} />
                </TouchableOpacity> */}
            <TextInput
              multiline
              ref={screanReaderFocus}
              placeholder='상담하고 싶은 내용을 입력해 주세요'
              style={styles.input}
              value={message} // 현재 message 값을 입력 값으로 설정
              onChangeText={text => setMessage(text)}
              accessibilityLabel='상담하고 싶은 내용을 입력해 주세요'
            />

            {/* <TouchableOpacity style={styles.rightIconButtonStyle}>
                  <Icon name="paperclip" size={23} color={theme.colors.description} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.rightIconButtonStyle}>
                  <Icon name="camera" size={23} color={theme.colors.description} />
                </TouchableOpacity> */}
          </View>

          {/* 일단 잠들어 있어라,,,, 돈 나간다!!!!!! */}
          <TouchableOpacity style={styles.sendButton} onPress={() => sendMessageToServer(message)} accessibilityLabel='메세지 전송' accessibilityRole='button'>
            <Icon name={message ? "send" : "send"} size={23} color={theme.colors.white} />
          </TouchableOpacity>
        </View>
      </View>
    </View>



  )
}

export default Gpt;

const styles = StyleSheet.create({
  TextInputcontainer: {
    justifyContent: 'center',
    backgroundColor: theme.colors.white
  },
  innerContainer: {
    paddingHorizontal: 10,
    marginHorizontal: 10,
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    paddingVertical: 10
  },
  inputAndMicrophone: {
    flexDirection: 'row',
    backgroundColor: theme.colors.inputBackground,
    flex: 3,
    marginRight: 10,
    paddingVertical: Platform.OS === "ios" ? 10 : 0,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  emoticonButton: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingLeft: 10,
  },
  rightIconButtonStyle: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingRight: 15,
    paddingLeft: 10,
    borderLeftWidth: 1,
    borderLeftColor: '#fff'
  },
  input: {
    backgroundColor: '#ffffff',
    paddingLeft: 20,
    color: theme.colors.inputText,
    flex: 3,
    fontSize: 15,
    height: 50,
    alignSelf: 'center',
    borderRadius: 30,
    borderWidth: 1,
    borderColor: '#9a9b9c'
  },
  sendButton: {
    backgroundColor: '#51868C',
    borderRadius: 50,
    height: 50,
    width: 50,
    alignItems: 'center',
    justifyContent: 'center'

  }
});