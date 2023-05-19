// 회원가입한 후 보이는 mypage화면
import axios from 'axios';
import React, {useEffect,useState} from 'react';
import { SafeAreaView, StyleSheet, View, Image, Alert, useIsFocused } from 'react-native';
import { Text, TextInput, Button, Title, Surface } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';

// navigation
import 'react-native-gesture-handler';

// 외부에서 불러온 것들
import Man from '../../assets/man.jpg'
import Icon from 'react-native-vector-icons/FontAwesome';
import BookMarkModal from '../BookMark/BookMarkModal';

// 약목록 보여주는 component
import List from '../../Components/Lists';

// 서버 포트
import ServerPort from '../../Components/ServerPort';
const IP = ServerPort();

function MemberMyPage({ route,navigation}) {
  const { data } = route.params;
  console.log("data : ", data);

  const [id, setId] = useState('');
  const [email, setEmail] = useState('');
  const [nickname, setNickname] = useState('');
  const [img, setImg] = useState('');
  const [birth, setBirth] = useState('');
  const [gender, setGender] = useState('');

  const fetchUserData = async () => {
    const getToken = await AsyncStorage.getItem('token');
    const res = await axios.post(`${IP}/user/info`, {
      token: getToken
    });
    const flag = res.data;
    console.log("flag : ", flag)
    console.log("flag profile : ", flag.profile);
    if (res.data === false) {
      Alert.alert(
        '',
        '로그인을 완료해 주세요',
        [
          {
            text: '확인',
            onPress: () => { navigation.navigate("Login") }
          }
        ],
        { cancelable: false }
      );
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
    const { data } = route.params;
    if (data) {
      setId(data.id);
      setEmail(data.email);
      setNickname(data.nickname);
      setBirth(data.birth);
      setGender(data.gender);
      setImg(data.img);
      console.log("nickname: ", data.nickname);
    } else {
      fetchUserData();
    }
  }, [route.params]);

  const handleLogout = async () => {    //로그아웃
    const token = await AsyncStorage.getItem('token');
    await AsyncStorage.removeItem('token'); // 로컬 스토리지에서 토큰을 삭제
    if(token === null) {
      Alert.alert(
        '',
        '로그아웃 되었습니다',
        [
          {
            text: '확인',
            onPress: () => { navigation.navigate("bottom"); route.params.setLoggedIn(false); }
          }
        ],
        { cancelable: false }
      );
    }
  }

  return (
    <SafeAreaView style={styles.box}>
      <Surface style={styles.memberbox}>
        <View style={{ flex: 1, marginBottom:10, marginTop:10 }}>
        <Image source={{ uri: img }} style={{flex: 1}} />
        </View>
        <View style={{ flex: 1, justifyContent: 'center', padding: 10 }}>
          <Button
            mode="outlined"
            style={[styles.button, styles.down]}
            labelStyle={{ fontSize: 18, color: '#ffffff' }}
            onPress={() => { navigation.navigate("MemberInfo", {
              userData: {
                id,
                email,
                nickname,
                birth,
                gender,
                img
              }
            }) }}>프로필 관리</Button>
          <Button
            mode="outlined"
            style={styles.button}
            labelStyle={{ fontSize: 18, color: '#ffffff' }}
            onPress={handleLogout}
          >로그아웃</Button>
        </View>
      </Surface>

      <Surface style={styles.bookmarkbox}>
        <View style={styles.bookmarktitle}>
          <Title style={{ fontSize: 20 }}>즐겨찾기한 약</Title>
        </View>
        <View style={styles.bookmarkimgcontainer}>
        </View>
      </Surface>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  box: {
    flex: 1,
    justifyContent: "center",
    marginHorizontal: 8,
    backgroundColor: '#F7F7F7'
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
    borderRadius: 10,
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
    padding:10,
    backgroundColor: '#74cbd4',
    borderColor: 'transparent',
    width: 160,
    marginLeft: 11
  },
  down: {
    marginBottom: 35
  },
});

export default MemberMyPage;