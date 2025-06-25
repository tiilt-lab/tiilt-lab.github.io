// Make the timeout like a textbox where they can input their own time and that would
// change a global variable


/**
 * Connects to a Bluetooth device.
 * The background color shows if a Bluetooth device is connected (green) or
 * disconnected (red).
 * Allows to interact with the characteristics of the micro:bit Bluetooth LED
 * service.
 */

var bluetoothDevice;
var secondBluetoothDevice;



/**
 * Object containing the Bluetooth UUIDs of all the services and
 * characteristics of the micro:bit.
 */
const microbitUuid = {
    /**
     * Services
     */
    genericAccess:                              ["00001800-0000-1000-8000-00805f9b34fb", "Generic Access"],
    genericAttribute:                           ["00001801-0000-1000-8000-00805f9b34fb", "Generic Attribute"],
    deviceInformation:                          ["0000180a-0000-1000-8000-00805f9b34fb", "Device Information"],
    accelerometerService:                       ["e95d0753-251d-470a-a062-fa1922dfa9a8", "Accelerometer Service"],
    magnetometerService:                        ["e95df2d8-251d-470a-a062-fa1922dfa9a8", "Magnetometer Service"],
    buttonService:                              ["e95d9882-251d-470a-a062-fa1922dfa9a8", "Button Service"],
    ioPinService:                               ["e95d127b-251d-470a-a062-fa1922dfa9a8", "IO Pin Service"],
    ledService:                                 ["e95dd91d-251d-470a-a062-fa1922dfa9a8", "LED Service"],
    eventService:                               ["e95d93af-251d-470a-a062-fa1922dfa9a8", "Event Service"],
    dfuControlService:                          ["e95d93b0-251d-470a-a062-fa1922dfa9a8", "DFU Control Service"],
    temperatureService:                         ["e95d6100-251d-470a-a062-fa1922dfa9a8", "Temperature Service"],
    uartService:                                ["6e400001-b5a3-f393-e0a9-e50e24dcca9e", "UART Service"],
    /**
     * Characteristics
     */
    deviceName:                                 ["00002a00-0000-1000-8000-00805f9b34fb", "Device Name"],
    appearance:                                 ["00002a01-0000-1000-8000-00805f9b34fb", "Appearance"],
    peripheralPreferredConnectionParameters:    ["00002a04-0000-1000-8000-00805f9b34fb", "Peripheral Preferred Connection Parameters"],
    serviceChanged:                             ["00002a05-0000-1000-8000-00805f9b34fb", "Service Changed"],
    modelNumberString:                          ["00002a24-0000-1000-8000-00805f9b34fb", "Model Number String"],
    serialNumberString:                         ["00002a25-0000-1000-8000-00805f9b34fb", "Serial Number String"],
    hardwareRevisionString:                     ["00002a27-0000-1000-8000-00805f9b34fb", "Hardware Revision String"],
    firmwareRevisionString:                     ["00002a26-0000-1000-8000-00805f9b34fb", "Firmware Revision String"],
    manufacturerNameString:                     ["00002a29-0000-1000-8000-00805f9b34fb", "Manufacturer Name String"],
    accelerometerData:                          ["e95dca4b-251d-470a-a062-fa1922dfa9a8", "Accelerometer Data"],
    accelerometerPeriod:                        ["e95dfb24-251d-470a-a062-fa1922dfa9a8", "Accelerometer Period"],
    magnetometerData:                           ["e95dfb11-251d-470a-a062-fa1922dfa9a8", "Magnetometer Data"],
    magnetometerPeriod:                         ["e95d386c-251d-470a-a062-fa1922dfa9a8", "Magnetometer Period"],
    magnetometerBearing:                        ["e95d9715-251d-470a-a062-fa1922dfa9a8", "Magnetometer Bearing"],
    magnetometerCalibration:                    ["e95db358-251d-470a-a062-fa1922dfa9a8", "Magnetometer Calibration"],
    buttonAState:                               ["e95dda90-251d-470a-a062-fa1922dfa9a8", "Button A State"],
    buttonBState:                               ["e95dda91-251d-470a-a062-fa1922dfa9a8", "Button B State"],
    pinData:                                    ["e95d8d00-251d-470a-a062-fa1922dfa9a8", "Pin Data"],
    pinADConfiguration:                         ["e95d5899-251d-470a-a062-fa1922dfa9a8", "Pin AD Configuration"],
    pinIOConfiguration:                         ["e95db9fe-251d-470a-a062-fa1922dfa9a8", "Pin IO Configuration"],
    pwmControl:                                 ["e95dd822-251d-470a-a062-fa1922dfa9a8", "PWM Control"],
    ledMatrixState:                             ["e95d7b77-251d-470a-a062-fa1922dfa9a8", "LED Matrix State"],
    ledText:                                    ["e95d93ee-251d-470a-a062-fa1922dfa9a8", "LED Text"],
    scrollingDelay:                             ["e95d0d2d-251d-470a-a062-fa1922dfa9a8", "Scrolling Delay"],
    microbitRequirements:                       ["e95db84c-251d-470a-a062-fa1922dfa9a8", "MicroBit Requirements"],
    microbitEvent:                              ["e95d9775-251d-470a-a062-fa1922dfa9a8", "MicroBit Event"],
    clientRequirements:                         ["e95d23c4-251d-470a-a062-fa1922dfa9a8", "Client Requirements"],
    clientEvent:                                ["e95d5404-251d-470a-a062-fa1922dfa9a8", "Client Event"],
    dfuControl:                                 ["e95d93b1-251d-470a-a062-fa1922dfa9a8", "DFU Control"],
    temperature:                                ["e95d9250-251d-470a-a062-fa1922dfa9a8", "Temperature"],
    temperaturePeriod:                          ["e95d1b25-251d-470a-a062-fa1922dfa9a8", "Temperature Period"],
    txCharacteristic:                           ["6e400002-b5a3-f393-e0a9-e50e24dcca9e", "Tx Characteristic"],
    rxCharacteristic:                           ["6e400003-b5a3-f393-e0a9-e50e24dcca9e", "Rx Characteristic"],
    /**
     * Method that searches an UUID among the UUIDs of all the services and
     * characteristics and returns:
     * - in HTML blue color the name of the service/characteristic found.
     * - in HTML red color a message if the UUID has not been found.
     * @param uuid The service or characteristic UUID.
     * @param serviceOrCharacteristic True (or 1) if it is a service, and false
     * (or 0) if it is a characteristic.
     */
    searchUuid(uuid, serviceOrCharacteristic) {
        for (const key in microbitUuid) {
            if (uuid === microbitUuid[key][0]) {
                return "<font color='blue'>" + microbitUuid[key][1] + "</font>";
            }
        }
        if (serviceOrCharacteristic) {
            return "<font color='red'>Unknown Micro:Bit Service</font>";
        } else {
            return "<font color='red'>Unknown Micro:Bit Characteristic</font>";
        }
    },
}



/**
 * Function that adds string to the log. If newLine is true, it adds a new line
 * at the end of the string.
 * @param string String to print to the log.
 * @param newLine Boolean that specifies whether to start a new line or not.
 */
function addLog(string, newLine) {
    document.getElementById("log").innerHTML += string;
    if (newLine) {
        document.getElementById("log").innerHTML += "<br>";
    };
}

/**
 * Function that adds string (and newline) to the log in bold and red color.
 * @param string String to print to the log.
 */
function addLogError(string) {
    addLog("<b><font color='red'>" + string + "</font></b>", true);
}

/**
 * Function that empties the log.
 */
function clearLog() {
    document.getElementById("log").innerHTML = "";
}



/**
 * Function that turns the background color red.
 */
function onDisconnected() {
    document.getElementById("body").style = "background-color:#FFD0D0";
}

var microbitCharList = {
  
};

var microbitList = {
  "mb1": {    
    "ledMatrixChar": null,
    "ledTextChar": null,
    "scrollingChar":null,
    "buttonChar": null,
    "buttonBChar": null
  },
  "mb2": {
    "ledMatrixChar": null,
    "ledTextChar": null,
    "scrollingChar":null,
    "buttonChar": null,
    "buttonBChar": null
  },
  "mb3": {
    "ledMatrixChar": null,
    "ledTextChar": null,
    "scrollingChar":null,
    "buttonChar": null,
    "buttonBChar": null
  },
  "mb4": {
    "ledMatrixChar": null,
    "ledTextChar": null,
    "scrollingChar":null,
    "buttonChar": null,
    "buttonBChar": null
  }
}

function getName(fullName) {
  let regex = /\[([^\]]+)\]/g;
  let nm = regex.exec(fullName);
  return nm[1];
}

function buttonPressEvent(button, deviceName) {
  console.log(button + " " + deviceName);
  return {"button": button, "deviceName": deviceName}
}

class Microbit {
  // let ledMatrixChar, ledTextChar, scrollingChar, buttonChar;
  constructor (device) {
    // this.initiateChars();
    this.disconnectCallback = null;
    this.buttonCallback = null;
    device.addEventListener('gattserverdisconnected', this.disconnectMicrobit);
    this.populateCharacteristics(device);   
    this.enc = new TextEncoder();

  }
  
  initiateChars() {
    this.ledservice = null;
    this.matrixChar = null;
    this.textChar = null;
    this.delayChar = null;
    this.buttonService = null;
    this.buttonAChar = null;
    this.buttonBChar = null;
    this.deviceName = null;
  }
  
  setDisconnectCallback(callback) {
    this.disconnectCallback = callback;
  }
  
  disconnectMicrobit() {
    if (this.disconnectCallBack) {
      this.disconnectCallBack(this);
    }
  }
  
  get getMicrobitName () {
    return this.name;
  }
  
  setButtonCallback(callback) {
    this.buttonCallback = callback
  }
  
  buttonAChanged(event) {
    let devName = getName(event.currentTarget.service.device.name);
    buttonPressEvent("a", devName)
    // console.log(this.getMicrobitName());
    
    if (this.buttonCallback) {
      this.buttonCallback(this, "a")
    }
  }
  
  buttonBChanged(event) {
    let devName = getName(event.currentTarget.service.device.name);
    buttonPressEvent("b", devName)

    if (this.buttonCallback) {
      this.buttonCallback(this, "b")
    }
  }
  
  ledTextDisplay(string) {
    console.log(this);
    console.log(self);
    console.log(this.textChar);
    this.textChar.writeValue((this.enc).encode(string))
        .then(_ => { })
        .catch(error => { addLogError(error);  });
  }
  
  async populateCharacteristics(device) {
    let server = await device.gatt.connect();
    
    this.name = getName(device.name)
    console.log(this.name);
    this.ledservice = await server.getPrimaryService(microbitUuid.ledService[0]);
    this.matrixChar = await this.ledservice.getCharacteristic(microbitUuid.ledMatrixState[0])  
    this.textChar = await this.ledservice.getCharacteristic(microbitUuid.ledText[0])
    this.delayChar = await this.ledservice.getCharacteristic(microbitUuid.scrollingDelay[0])
    this.buttonService = await server.getPrimaryService(microbitUuid.buttonService[0]);
    this.buttonAChar = await this.buttonService.getCharacteristic(microbitUuid.buttonAState[0])
    await this.buttonAChar.startNotifications()
      .then(_ => {  this.buttonAChar.addEventListener('characteristicvaluechanged', this.buttonAChanged);   })
      .catch(error => {  addLogError(error);   });;
    this.buttonBChar = await this.buttonService.getCharacteristic(microbitUuid.buttonBState[0])
    await this.buttonBChar.startNotifications()
      .then(_ => {  this.buttonBChar.addEventListener('characteristicvaluechanged', this.buttonBChanged);   })
      .catch(error => {  addLogError(error);   });;
  } 
  
}

class MicrobitList {
  constructor(){
    this.microbits = {}
  }
  // create a new player and save it in the collection
  addMicrobit(mb){
    this.microbits[mb.name] = mb;
    mb.setDisconnectCallback((mb) => {
      this.removeMicrobit(mb);
    });
  }
  
  removeMicrobit(microbit) {
    delete this.microbits[microbit.name];
  }
  
  get nameList() {
    return Object.keys(this.microbits);
  }

  
  get randomMicrobit() {
    console.log(this.numberOfMicrobits);
    if (this.numberOfMicrobits > 0) {
      let randomName = this.nameList[Math.floor(Math.random() * (this.nameList).length)]
      return this.microbits[randomName];
    }
    else {
      return ;
    }
  }
  
  get mbList(){
    return this.microbits;
  }
  // this could include summary stats like average score, etc. For simplicy, just the count for now
  get numberOfMicrobits(){
      return (this.nameList).length;
  }
}


var microbitData = {
  "1": { //make the keys the microbit NAME
    "buttona": -1, 
    "buttonb": -1
  }
}

var microbitsAlreadyConnected=[]

var endGameBoolean = false

function buttonChanged(event) {
    // document.getElementById("buttonA").innerHTML = event.target.value.getUint8(0);
  // console.log("button a changed!!");
  // console.log(event);
  console.log(event.currentTarget.service.device.name);
  //identify microbit name from event details
  //identify buttonState from event details
  //identify which button from event details
  
  //microbitData[microbitName].[buttonName] = buttonState;
}

var ledMatrixCharacteristic;
var ledTextCharacteristic;
var scrollingDelayCharacteristic;
var buttonCharacteristic;

var ledMatrixCharacteristicSecond;
var ledTextCharacteristicSecond;
var scrollingDelayCharacteristicSecond;
var buttonCharacteristicSecond;


/**
 * Function that connects to a Bluetooth device, and saves the characteristics
 * associated with the LED service.
 */

let MBList = new MicrobitList();

async function connect() {
    console.log(microbitList)
    console.log(microbitsAlreadyConnected)
    addLog("Requesting micro:bit Bluetooth devices... ", false);
    if (!navigator.bluetooth) {
        addLogError("Bluetooth not available in this browser or computer.");
    } else {
        const device = await navigator.bluetooth.requestDevice({
            // To accept all devices, use acceptAllDevices: true and remove filters.
            filters: [{namePrefix: "BBC micro:bit"}],
            optionalServices: [microbitUuid.genericAccess[0], microbitUuid.genericAttribute[0], microbitUuid.deviceInformation[0], microbitUuid.accelerometerService[0], microbitUuid.magnetometerService[0], microbitUuid.buttonService[0], microbitUuid.ioPinService[0], microbitUuid.ledService[0], microbitUuid.eventService[0], microbitUuid.dfuControlService[0], microbitUuid.temperatureService[0], microbitUuid.uartService[0]],
        })
          addLog("<font color='green'>OK</font>", true);
          bluetoothDevice = device;
          addLog("Connecting to GATT server (name: <font color='blue'>" + device.name + "</font>, ID: <font color='blue'>" + device.id + "</font>)... ", false);
          device.addEventListener('gattserverdisconnected', onDisconnected);
          document.getElementById("body").style = "background-color:#D0FFD0";
          addLog(device.name)
       
        console.log(device.name)
        if (microbitsAlreadyConnected.includes(bluetoothDevice)){
         
          addLogError("That microbit is already connected");
        }
        else {
          
          microbitsAlreadyConnected.push(bluetoothDevice)
          const key = "mb"+ (microbitsAlreadyConnected.length).toString();
          // console.log(key)
          // console.log(microbitList[key])
          let mb = new Microbit(device);
          MBList.addMicrobit(mb);
          
          // const server = await device.gatt.connect();
          // console.log(server);
          // const ledservice = await server.getPrimaryService(microbitUuid.ledService[0]);
          // const matrixChar = await ledservice.getCharacteristic(microbitUuid.ledMatrixState[0])  
          // const textChar = await ledservice.getCharacteristic(microbitUuid.ledText[0])
          // const delayChar = await ledservice.getCharacteristic(microbitUuid.scrollingDelay[0])
          // const buttonService = await server.getPrimaryService(microbitUuid.buttonService[0]);
          // const buttonAChar = await buttonService.getCharacteristic(microbitUuid.buttonAState[0])
          // microbitList[key].buttonChar = buttonAChar;
          // await buttonAChar.startNotifications()
          //   .then(_ => { buttonAChar.addEventListener('characteristicvaluechanged', buttonChanged("a")); })
          //   .catch(error => { addLogError(error); });;
          // const buttonBChar = await buttonService.getCharacteristic(microbitUuid.buttonBState[0])
          // microbitList[key].buttonBChar = buttonBChar;
          // await buttonBChar.startNotifications()
          //   .then(_ => { buttonBChar.addEventListener('characteristicvaluechanged', buttonChanged("b")); })
          //   .catch(error => { addLogError(error); });;
          // console.log(microbitsAlreadyConnected)
         //  buttonAChar.addEventListener('characteristicvaluechanged', buttonAChanged);
          
        }
    };
}

/**
 * Function that disconnects from the Bluetooth device (if connected).
 */
function disconnect() {
    console.log(bluetoothDevice)
    console.log(microbitsAlreadyConnected)
    console.log(microbitsAlreadyConnected == [])
    addLog("Disconnecting... ", false);
    if (microbitsAlreadyConnected.length == 0) {
        addLogError("There are no devices connected.");
    } else {
        for (let i = 0; i < microbitsAlreadyConnected.length; i++) 
          var dev = microbitsAlreadyConnected[i]
          if (dev.gatt.connected) {
              dev.gatt.disconnect();
              if (!dev.gatt.connected) {
                  addLog("<font color='green'>OK</font>", true);
              };
          } else {
              addLogError("There is no device connected.");
          };
        microbitsAlreadyConnected = []
    };
}



function randomIntFromInterval(min, max) { // min and max included 
  return Math.floor(Math.random() * (max - min + 1) + min)
}


async function startReactionGame() {
  
}

async function startGame(){
  console.log(Object.keys(microbitList).length)
   this.endGameBoolean = false;
  
  //parameters - game time/rounds
  // define order - select random() - allow repeats; randomizeOrder () - each goes once; 
    // select random from 
  // wait time - 
  
  //
  var gameRounds = 8;
  
  for (var i = 0; i < gameRounds; i++){
    if (this.endGameBoolean!= true){
      console.log(i);
      // if (!allMBNotFalse()){
      //   addLogError("There is not enough MBs connected to play the game");
      // }


      let num =  (randomIntFromInterval(1, (Object.keys(microbitList).length)))
      // console.log(num)
      let foundMBThatIsNotFalse = ((microbitList["mb"+(num).toString()]).ledMatrixChar == null)
      // console.log(foundMBThatIsNotFalse)
      while (foundMBThatIsNotFalse != false){
        num = (randomIntFromInterval(1, (Object.keys(microbitList).length)))
        foundMBThatIsNotFalse = ((microbitList["mb"+(num).toString()]).ledMatrixChar == null)
      }
      console.log(num)

      let whichMicrobit = (microbitList["mb"+(num).toString()])

      let matrixChar = whichMicrobit.ledMatrixChar
      let textChar = whichMicrobit.ledTextChar
      let scrollChar = whichMicrobit.scrollingChar
      let theButtonChar = whichMicrobit.buttonChar
      let enc = new TextEncoder();
        // console.log((document.getElementById((rowIndex+1).toString() + (5-columnIndex).toString())))
      textChar.writeValue(enc.encode("A"))
        .then(_ => { })
        .catch(error => { addLogError(error);  });
      
      await startWait(3000);
    }
    
  }
  
}

function onTimeUp() {
    console.log("Time's up!");
}

// Function to execute when the button is pressed
function onButtonPress() {
    console.log("Button pressed!");
}

function characteristicCheck() {
  let randomMb = MBList.randomMicrobit;
  if (randomMb) {
    console.log(randomMb);
    randomMb.ledTextDisplay("B");  
  }
}

async function startWait(timeoutDuration) {
    const timeoutPromise = new Promise((resolve) => {
        setTimeout(() => {
            onTimeUp();
            resolve();
        }, timeoutDuration);
    });

    const buttonPromise = new Promise((resolve) => {
        document.getElementById("myButton").addEventListener("click", () => {
            onButtonPress();
            resolve();
        });
    });

    // Wait for either promise to resolve
    await Promise.race([timeoutPromise, buttonPromise]);

    // Clean up event listener after completion
    document.getElementById("myButton").removeEventListener("click", onButtonPress);
}


// Call the function with a timeout duration in milliseconds (e.g., 5000 for 5 seconds)



// start event listeners for button presses
// if buttonA Press { if this was supposed to be pressed, kill the wait and give points}


function allMBNotFalse(){
  let counter = 0
  for (let i =1; i<Object.keys(microbitList).length+1; i++){
    if ((microbitList["mb"+(i).toString()]).ledMatrixChar != null){
      counter = counter + 1
    }
  }
  if (counter==0 || counter==1){
    return false
  }
  return true
}

function endGame(){
  this.endGameBoolean = true;
  console.log(this.endGameBoolean);
  // setTimeout(() => {  console.log("World!"); }, 5000000);
  // endGameBoolean = false
  
}