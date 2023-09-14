#import "Zkmutechecker.h"
#import <notify.h>

@implementation Zkmutechecker

RCT_EXPORT_MODULE();

+ (BOOL)requiresMainQueueSetup {
  return YES; // Initialize on the main thread
}

- (NSArray<NSString *> *)supportedEvents {
  return @[@"onMuteModeChange"];
}

BOOL hasListeners = NO;
BOOL previousValue = NO;

- (id)init {
  if (self) {
    previousValue = [self isMuteModeOn];
    [self updateMuteState];
  }
  return self;
}

- (void)startObserving {
    hasListeners = YES;
    [self updateMuteState];
}

- (void)stopObserving {
    hasListeners = NO;
}

- (void)updateMuteState {
  BOOL isMute = [self isMuteModeOn];
    
  if (previousValue == isMute) {
        return;
  }
  
    previousValue = isMute;
    
  if (hasListeners) {
    [self sendEventWithName:@"onMuteModeChange" body:@(isMute)];
  }
}

- (BOOL)isMuteModeOn {
  int token = NOTIFY_TOKEN_INVALID;
  int result = notify_register_dispatch(
    "com.apple.springboard.ringerstate",
    &token,
    dispatch_get_main_queue(),
    ^(int token) {
      [self updateMuteState];
    }
  );
  
  if (result != NOTIFY_STATUS_OK) {
    NSLog(@"notify_register_dispatch failed with status %d", result);
    return NO; // Handle the error
  }
  
  uint64_t state;
  notify_get_state(token, &state);
  
  return state == 0;
}

RCT_EXPORT_METHOD(getLastStatus:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject) {
  @try {
    BOOL lastStatus = [Zkmutechecker getLastStatus];
    resolve(@(lastStatus));
  } @catch (NSException *exception) {
    NSString *errorMessage = [NSString stringWithFormat:@"Error fetching previous value: %@", exception.reason];
    reject(@"GET_LAST_STATUS_ERROR", errorMessage, nil);
  }
}

+ (BOOL)getLastStatus {
    return previousValue;
}

@end
