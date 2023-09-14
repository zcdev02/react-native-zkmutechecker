import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, Button } from 'react-native';
import MuteModeChecker from 'react-native-zkmutechecker';

const App = () => {
  const [isMute, setIsMute] = useState(false);
  const [status, setStatus] = useState<boolean | undefined>(undefined);

  //TODO: поменять местами true false при переключении беззвучного режима
  const handleMuteChange = useCallback((mute: boolean) => {
    setIsMute(mute);
    console.log('MuteModeChangeListener isMute: ', mute);
  }, []);

  //TODO: поменять местами true false при переключении беззвучного режима
  const handleGetStatus = async () => {
    const status = await MuteModeChecker.getLastStatus();
    setStatus(status);
    console.log('MuteModeChangeListener CurrentStatus:', status);
  };

  useEffect(() => {
    console.log('useEffect isMute:', isMute);
    MuteModeChecker.addMuteModeChangeListener(handleMuteChange);
  }, [isMute, handleMuteChange]);

  return (
    <View>
      <Text style={{ alignSelf: 'center', marginTop: 100 }}>
        {isMute ? 'Беззвучный режим включен' : 'Беззвучный режим выключен'}
      </Text>
      <Button
        title={status === undefined ? 'Получить статус ' : `${status}`}
        onPress={handleGetStatus}
      />
    </View>
  );
};

export default App;
