import { NativeEventEmitter, NativeModules } from 'react-native';
import type { eventCallback, zkMutecheckerType } from './types';

const { Zkmutechecker } = NativeModules;
const muteModeEventEmitter: NativeEventEmitter = new NativeEventEmitter(
  Zkmutechecker
);

const EVENT_NAME = 'onMuteModeChange';

const addMuteModeChangeListener = (callback: eventCallback): void => {
  muteModeEventEmitter.addListener(EVENT_NAME, callback);
};

// Получает предыдущее значение, когда пользователь щелкнул беззвучный режим
const getLastStatus = async (): Promise<boolean> => {
  try {
    const previousValue = await Zkmutechecker.getLastStatus();
    return previousValue;
  } catch (error) {
    console.error('Error fetching previous value:', error);
    return false;
  }
};

const zkMuteChecker: zkMutecheckerType = {
  addMuteModeChangeListener,
  getLastStatus,
};

export default zkMuteChecker;
