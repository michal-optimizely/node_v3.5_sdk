const optimizelySDK = require('@optimizely/optimizely-sdk');
const defaultEventDispatcher = require('@optimizely/optimizely-sdk').eventDispatcher; // access the default event dispatcher
const defaultErrorHandler = require("@optimizely/optimizely-sdk").errorHandler; // access the default error handler
const optimizelyEnums = require('@optimizely/optimizely-sdk').enums; // needed by notification listener

const {v4: uuidv4 } = require('uuid');      // import a plugin for uuid creation

// create logger object and set the log level
optimizelySDK.setLogger(optimizelySDK.logging.createLogger());
// optimizelySDK.setLogLevel('info');       // use to set the log level

const sdkKey = 'HyxwR6PohJd4uKvqJZqazN'     // Provide the sdkKey of your desired environment here

// initialize Optimizely client instance using the datafile
const optimizelyClientInstance = optimizelySDK.createInstance({
    sdkKey,
    datafile: null,     // optional
    datafileOptions: {
        autoUpdate: true,
        updateInterval: 30000,  // 30 seconds in milliseconds
        urlTemplate: 'https://cdn.optimizely.com/datafiles/%s.json',
    },
    eventDispatcher: defaultEventDispatcher,
    eventBatchSize: 1,          // max number of events to hold in the queue
    eventFlushInterval: 5000,   // max duration an event can exist in the queue; 5 seconds in milliseconds
    errorHandler: defaultErrorHandler
});

const userId = uuidv4();    // create a single uuid OR
const numberOfUsers = null;   // specify the number of user IDs if you need more than one
if(!!numberOfUsers) {
    var userIds = [];
    for(i = 0; i < numberOfUsers; i++) {
        userIds.push(uuidv4());
    }
}

// provide attributes as needed
const attributes = {
    attr_key: 'attribute value'
};

// wait for the datafile to download then do stuff
optimizelyClientInstance.onReady({ timeout: 3000 }).then((result) => {
    if (result.success === false) {
        console.log(`[CUSTOM LOG] Failed to initialize the client instance. Reason: ${result.reason}`);
        return;
    } else {
        console.log(`[CUSTOM LOG] Datafile ready: ${result.success}`);
        
        // set up a 'DECISION' notification listener - fires when calling 'activate', 'isFeatureEnabled', 'getEnabledFeatures'
        const notificationListernerOne = optimizelyClientInstance.notificationCenter.addNotificationListener(
            optimizelyEnums.NOTIFICATION_TYPES.DECISION,
            onDecision,
        );

        // can be used for scenarios when in need of a lot of users
        if(!!numberOfUsers) {
            console.log(`[CUSTOM LOG] Detecting MANY users. Total number of users evaluated:\t ${numberOfUsers}`);
            let variation1 = 0;
            let variation2 = 0;
            let noVariation = 0;

            userIds.forEach((user) => {
                let variationAssignment = optimizelyClientInstance.getVariation('<EXPERIMENT KEY>', user, attributes);

                if (variationAssignment === '<VARIATION KEY>') {
                    variation1 ++;
                } else if (variationAssignment === '<VARIATION KEY>') {
                    variation2 ++;
                } else {
                    noVariation ++;
                }
            });
            console.log(`[CUSTOM LOG] Number of users bucketed in variation_1:\t\t ${variation1}`);
            console.log(`[CUSTOM LOG] Number of users bucketed in variation_2:\t\t ${variation2}`);
            console.log(`[CUSTOM LOG] Number of users not bucketed into variation:\t ${noVariation}`);
        } else {
            console.log(`[CUSTOM LOG] User ID:\t ${userId}`);     // if using a single uuid
            
            // examples of calling supported client APIs
            // evaluate experiments and/or feature rollouts
            optimizelyClientInstance.getVariation('<EXPERIMENT KEY', userId, attributes);
            optimizelyClientInstance.activate('<EXPERIMENT KEY', userId, attributes);
            optimizelyClientInstance.isFeatureEnabled('<FEATURE KEY>', userId, attributes);
            optimizelyClientInstance.getEnabledFeatures(userId, attributes);
            optimizelyClientInstance.getFeatureVariable('<FEATURE KEY', userId, attributes) // only as of v3.3

            // set/get forced variation for given user
            optimizelyClientInstance.setForcedVariation('<EXPERIMENT KEY', userId, '<VARIATION KEY');
            optimizelyClientInstance.getForcedVariation('<EXPERIMENT KEY', userId);

            // track an event
            optimizelyClientInstance.track('<EVENT KEY>', userId, attributes);
        };
        
        let config = optimizelyClientInstance.getOptimizelyConfig();
        // console.log(config);     // log content of the datafile

    }
    
    // call the close method to flush any pending events before terminating the app
    optimizelyClientInstance.close().then((result) => {
        if (result.success === false) {
            console.log(`[CUSTOM LOG] Failed to close the client instance. Reason: ${result.reason}`);
        } else {
            console.log(`[CUSTOM LOG] Safe to close the app: ${result.success}. Closing the app!`);
            process.exit()      // exit the app
        }
    });

    // callback fn to work with object provided by the 'DECISION' notification listener
    function onDecision(decisionObject) {
        console.log(`[NOTIFICATION LISTENER LOG - START]`);
        console.log(decisionObject);
        console.log(`[NOTIFICATION LISTENER LOG - END]`);
    };
});