
#ifdef RCT_NEW_ARCH_ENABLED
#import "RNZkmutecheckerSpec.h"

@interface Zkmutechecker : NSObject <NativeZkmutecheckerSpec>
#else
#import <React/RCTBridgeModule.h>

@interface Zkmutechecker : NSObject <RCTBridgeModule>
#endif

@end
