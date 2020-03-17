# node_v3.5_sdk

**To get up and running:**
1. Clone the repo: `git clone https://github.com/michal-optimizely/node_v3.5_sdk.git`
2. Enter the new folder: `cd node_v3.5_sdk`
3. Install dependencies: `npm install`
4. Execute the app code: `node app.js`

**Usage notes**
1. **Line 10:** (Un)comment this line if you want to enable SDK logs. Select the log level.
2. **Line 12:** Provide the SDK key you want to use with the app.
3. **Line 30:** If you need multiple user IDs, enter a number of users you need.
4. **Line 39:** Provide any attributes you might need for passiing audience targeting of your experiments/rollouts.
5. **Line 57:** Option to keep/remove the notification listener.
6. **Lines 70, 72, 74:** If using, enter valid experiment and variation keys.
7. **Lines 87-99:** Enter valid keys, comment-out the lines you don't need.
8. **Line 108:** Choose whether or not the app should auto-exit after executing.


**Supported features**
* Option to enable Logger.
* Asynchronous initialization.
* Configurable options upon initialization: 
  * Automatic datafile updates
  * Customizable event dispatcher props (max event batch size, flush interval)
* Auto-creation of uuid. Option to generate any number of users.
* Notification listener for notification types 'DECISION' (with option to remove it) & 'CONFIG_UPDATE'.
* Examples of all available client API calls.
* Option to show the content of the Optimizely environment 'config'.
* Termination of the Optimizely client before exiting the app.
