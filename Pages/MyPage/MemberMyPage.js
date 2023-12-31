// 회원가입한 후 보이는 mypage화면
import axios from 'axios';
import React, { useEffect, useState, useRef } from 'react';
import {
  SafeAreaView, StyleSheet, View, Image, InteractionManager,
  findNodeHandle, AccessibilityInfo, TouchableOpacity, Dimensions
} from 'react-native';
import { Text, DefaultTheme, Button, Surface } from 'react-native-paper';
import * as KakaoLogin from '@react-native-seoul/kakao-login';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MainButtonStyle } from '../css/MainButtonCSS'
import LottieView from 'lottie-react-native';
import 'react-native-gesture-handler';  // navigation

// 서버 포트
import ServerPort from '../../Components/ServerPort';
const IP = ServerPort();

function MemberMyPage({ route, navigation }) {
  const { data } = route.params;
  console.log("MemberMyPage data : ", data);
  const { myVariable } = route.params; // 전달받은 변수 값 가져오기
  console.log("MemberMyPage myVariable : ", myVariable);

  const [id, setId] = useState('');
  const [email, setEmail] = useState('');
  const [nickname, setNickname] = useState('');
  const [img, setImg] = useState('');
  const [birth, setBirth] = useState('');
  const [gender, setGender] = useState('');
  const [widthdraw, setWidthdraw] = useState(false);

  const screanReaderFocus = useRef(null);

  const customTheme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      primary: '#51868C',
    },
  };

  const fetchUserData = async () => {
    const getToken = await AsyncStorage.getItem('token');
    const res = await axios.post(`${IP}/user/info`, {
      token: getToken
    });
    const flag = res.data;
    console.log("flag : ", flag)
    if (res.data === false) {
      console.log("왜안됨")
    } else {
      setId(flag.uid);
      setEmail(flag.email);
      setNickname(flag.nickname);
      setImg(flag.profile);
      setBirth(flag.birth);
      setGender(flag.gender);
    }
  };

  useEffect(() => {
    console.log("여기 탈퇴 불린값", widthdraw);
    if(widthdraw){
      route.params.setLoggedIn(false);
      navigation.navigate("bottom");
      setWidthdraw(false);
    }
  },[widthdraw])

  useEffect(() => { 
    InteractionManager.runAfterInteractions(() => {
      const reactTag = findNodeHandle(screanReaderFocus.current);
      if (reactTag) {
        AccessibilityInfo.setAccessibilityFocus(reactTag);
      }
    })
    const { data } = route.params;
    if (data) {
      setId(data.id);
      setEmail(data.email);
      setNickname(data.nickname);
      setBirth(data.birth);
      setGender(data.gender);
      setImg(data.img);
      console.log("id: ", data.id);
      console.log("nickname: ", data.nickname);
    } else {
      fetchUserData();
    }
    if (myVariable) {
      route.params.setLoggedIn(false);
      navigation.navigate("bottom");
      myVariable = 'false'
    }
  }, [myVariable, route.params]);

  const handleLogout = async () => {    //로그아웃
    const loginType = await AsyncStorage.getItem('loginType');
    const token = await AsyncStorage.getItem('token'); // 로컬 스토리지에서 토큰을 삭제
    console.log("토큰 확인점 : ", token);
    await AsyncStorage.removeItem('token'); // 로컬 스토리지에서 토큰을 삭제
    const token2 = await AsyncStorage.getItem('token'); // 로컬 스토리지에서 토큰을 삭제
    console.log("토큰 확인점 : ", token2);
    console.log("유형 확인점 : ", loginType);
    if (loginType === "Ka") {
      KakaoLogin.logout()
        .then(() => {
          console.log("Logout Success");
        })
        .catch((error) => {
          console.log("Logout Fail", error.message);
        });
    }
    await AsyncStorage.removeItem('loginType'); // 로컬 스토리지에서 토큰을 삭제
    route.params.setLoggedIn(false);
    navigation.navigate("bottom");
  }

  return (
    <View style={{ flex: 1, backgroundColor: 'white', alignItems: 'center' }}>
      <SafeAreaView style={styles.box}>
        <Surface style={styles.memberbox}>

          <View style={{ flex: 1, marginBottom: 10, marginTop: 10 }}>
            <Image source={{ uri: img }} style={{ flex: 1, borderRadius: 20, marginLeft: 10 }} />
          </View>

          <View style={{ flex: 1, justifyContent: 'center', padding: 10 }}>
            <View ref={screanReaderFocus} accessibilityLabel="프로필 조회하기">
              <Button
                importantForAccessibility="no-hide-descendants"
                mode="outlined"
                style={[styles.button, styles.down]}
                labelStyle={{ fontSize: 17, color: '#51868C' }}
                theme={customTheme}
                onPress={() => {
                  navigation.navigate("MemberInfo", {
                    userData: {
                      id,
                      email,
                      nickname,
                      birth,
                      gender,
                      img
                    },
                    widthdraw: widthdraw,
                    setWidthdraw: setWidthdraw
                  }
                  )
                }}>프로필 조회</Button>
            </View>

            <Button
              accessibilityLabel='로그아웃 하기'
              mode="outlined"
              style={styles.button}
              labelStyle={{ fontSize: 17, color: '#51868C' }}
              theme={customTheme}
              onPress={handleLogout}>로그아웃</Button>
          </View>
        </Surface>

        <TouchableOpacity style={[MainButtonStyle.button, MainButtonStyle.down, styles.button2]}
          onPress={() => navigation.navigate('BookMarkScreen')}
        >
          <View style={MainButtonStyle.textContainer} accessibilityLabel="즐겨찾기 조회하기">
            <Text style={MainButtonStyle.text} importantForAccessibility="no-hide-descendants">즐겨찾기 조회 &gt; </Text>
          </View>
          <LottieView
            source={require('../../assets/bookmark.json') /** 움직이는 LottieView */}
            style={MainButtonStyle.mainSerachImage}
            autoPlay loop
          />
        </TouchableOpacity>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    flex: 1,
    justifyContent: "center",
    marginHorizontal: 8,
  },
  myinfocontainer: {
    backgroundColor: '#fff',
    justifyContent: 'center',
    flex: 0.3,
    padding: 10,
    borderWidth: 1,
    marginBottom: 5,
    elevation: 5, // 그림자 효과 크기
    shadowColor: 'black', // 그림자 색상
    shadowOpacity: 0.5, // 그림자 투명도
    shadowRadius: 5, // 그림자 둥근 정도
    shadowOffset: {
      width: 0, // 그림자 X축 위치
      height: 2, // 그림자 Y축 위치
    },
  },
  memberbox: {
    flex: 0.3,
    flexDirection: 'row',
    marginBottom: 25,
    backgroundColor: '#fff',
    borderRadius: 35,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  bookmarkbox: {
    justifyContent: 'center',
    flex: 0.5,
    marginBottom: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  bookmarktitle: {
    flex: 0.4,
    // padding: 5,
    borderBottomColor: '#ddd',
  },
  bookmarkimgcontainer: {
    flex: 3,
    padding: 10,
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    marginBottom: 5,
    elevation: 3, // 그림자 효과 크기
    shadowOffset: {
      width: 0,
      height: 2,
    },
  },
  button: {
    marginLeft: 11
  },
  down: {
    marginBottom: 15
  },
  button2: {
    elevation: 3,
  }
});

export default MemberMyPage;