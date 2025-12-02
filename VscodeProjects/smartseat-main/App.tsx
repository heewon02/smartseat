/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

//12/1 추가
import 'react-native-get-random-values';

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import RootStack from './screens/RootStack';
import { UserContextProvider } from './contexts/UserContext';
import { SelectedSubjectProvider } from './contexts/SelectedSubjectContext';


function App(){
  return(
    <UserContextProvider>
        <SelectedSubjectProvider>
            <NavigationContainer>
                <RootStack/>
            </NavigationContainer>
        </SelectedSubjectProvider>
    </UserContextProvider>
    
  ) 
}

export default App;

// import {Alert, Button, View} from 'react-native';
// import Toast from 'react-native-toast-message';


// function App() {
//       console.log("1");
//   return (
//       Toast.show({
//       type: 'error',
//       text1: '실패',
//       text2: '비밀번호가 일치하지 않습니다.',
//     })
//   );
// }

// export default App;