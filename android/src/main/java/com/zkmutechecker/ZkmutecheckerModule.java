package com.zkmutechecker;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.media.AudioManager;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.WritableNativeMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;

public class ZkmutecheckerModule extends ReactContextBaseJavaModule {
    private static final String MODULE_NAME = "Zkmutechecker";
    private static final String EVENT_NAME = "onMuteModeChange";

    private AudioManager audioManager;
    private boolean previousValue;

    private BroadcastReceiver receiver = new BroadcastReceiver() {
        @Override
        public void onReceive(Context context, Intent intent) {
            boolean isMute = audioManager.getRingerMode() == AudioManager.RINGER_MODE_SILENT || audioManager.getRingerMode() == AudioManager.RINGER_MODE_VIBRATE;
            if (isMute != previousValue) {
                sendMuteChangeEvent(isMute);
                previousValue = isMute;
            }
        }
    };

    public ZkmutecheckerModule(ReactApplicationContext reactContext) {
        super(reactContext);
        audioManager = (AudioManager) reactContext.getSystemService(Context.AUDIO_SERVICE);
        previousValue = audioManager.getRingerMode() == AudioManager.RINGER_MODE_SILENT || audioManager.getRingerMode() == AudioManager.RINGER_MODE_VIBRATE;

        // Регистрируем BroadcastReceiver для отслеживания изменений режима звука
        IntentFilter filter = new IntentFilter(AudioManager.RINGER_MODE_CHANGED_ACTION);
        reactContext.registerReceiver(receiver, filter);
    }

    @Override
    public String getName() {
        return MODULE_NAME;
    }

    @ReactMethod
    public void getLastStatus(Promise promise) {
        try {
            boolean lastStatus = audioManager.getRingerMode() == AudioManager.RINGER_MODE_SILENT || audioManager.getRingerMode() == AudioManager.RINGER_MODE_VIBRATE;
            promise.resolve(lastStatus);
        } catch (Exception e) {
            promise.reject("GET_LAST_STATUS_ERROR", e.getMessage());
        }
    }

    private void sendMuteChangeEvent(boolean isMute) {
        ReactApplicationContext reactContext = getReactApplicationContext();
        if (reactContext.hasActiveCatalystInstance()) {
            reactContext
                .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                .emit(EVENT_NAME, isMute);
        }
    }
}
