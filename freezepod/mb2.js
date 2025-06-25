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
  genericAccess: ["00001800-0000-1000-8000-00805f9b34fb", "Generic Access"],
  genericAttribute: [
    "00001801-0000-1000-8000-00805f9b34fb",
    "Generic Attribute",
  ],
  deviceInformation: [
    "0000180a-0000-1000-8000-00805f9b34fb",
    "Device Information",
  ],
  accelerometerService: [
    "e95d0753-251d-470a-a062-fa1922dfa9a8",
    "Accelerometer Service",
  ],
  magnetometerService: [
    "e95df2d8-251d-470a-a062-fa1922dfa9a8",
    "Magnetometer Service",
  ],
  buttonService: ["e95d9882-251d-470a-a062-fa1922dfa9a8", "Button Service"],
  ioPinService: ["e95d127b-251d-470a-a062-fa1922dfa9a8", "IO Pin Service"],
  ledService: ["e95dd91d-251d-470a-a062-fa1922dfa9a8", "LED Service"],
  eventService: ["e95d93af-251d-470a-a062-fa1922dfa9a8", "Event Service"],
  dfuControlService: [
    "e95d93b0-251d-470a-a062-fa1922dfa9a8",
    "DFU Control Service",
  ],
  temperatureService: [
    "e95d6100-251d-470a-a062-fa1922dfa9a8",
    "Temperature Service",
  ],
  uartService: ["6e400001-b5a3-f393-e0a9-e50e24dcca9e", "UART Service"],
  /**
   * Characteristics
   */
  deviceName: ["00002a00-0000-1000-8000-00805f9b34fb", "Device Name"],
  appearance: ["00002a01-0000-1000-8000-00805f9b34fb", "Appearance"],
  peripheralPreferredConnectionParameters: [
    "00002a04-0000-1000-8000-00805f9b34fb",
    "Peripheral Preferred Connection Parameters",
  ],
  serviceChanged: ["00002a05-0000-1000-8000-00805f9b34fb", "Service Changed"],
  modelNumberString: [
    "00002a24-0000-1000-8000-00805f9b34fb",
    "Model Number String",
  ],
  serialNumberString: [
    "00002a25-0000-1000-8000-00805f9b34fb",
    "Serial Number String",
  ],
  hardwareRevisionString: [
    "00002a27-0000-1000-8000-00805f9b34fb",
    "Hardware Revision String",
  ],
  firmwareRevisionString: [
    "00002a26-0000-1000-8000-00805f9b34fb",
    "Firmware Revision String",
  ],
  manufacturerNameString: [
    "00002a29-0000-1000-8000-00805f9b34fb",
    "Manufacturer Name String",
  ],
  accelerometerData: [
    "e95dca4b-251d-470a-a062-fa1922dfa9a8",
    "Accelerometer Data",
  ],
  accelerometerPeriod: [
    "e95dfb24-251d-470a-a062-fa1922dfa9a8",
    "Accelerometer Period",
  ],
  magnetometerData: [
    "e95dfb11-251d-470a-a062-fa1922dfa9a8",
    "Magnetometer Data",
  ],
  magnetometerPeriod: [
    "e95d386c-251d-470a-a062-fa1922dfa9a8",
    "Magnetometer Period",
  ],
  magnetometerBearing: [
    "e95d9715-251d-470a-a062-fa1922dfa9a8",
    "Magnetometer Bearing",
  ],
  magnetometerCalibration: [
    "e95db358-251d-470a-a062-fa1922dfa9a8",
    "Magnetometer Calibration",
  ],
  buttonAState: ["e95dda90-251d-470a-a062-fa1922dfa9a8", "Button A State"],
  buttonBState: ["e95dda91-251d-470a-a062-fa1922dfa9a8", "Button B State"],
  pinData: ["e95d8d00-251d-470a-a062-fa1922dfa9a8", "Pin Data"],
  pinADConfiguration: [
    "e95d5899-251d-470a-a062-fa1922dfa9a8",
    "Pin AD Configuration",
  ],
  pinIOConfiguration: [
    "e95db9fe-251d-470a-a062-fa1922dfa9a8",
    "Pin IO Configuration",
  ],
  pwmControl: ["e95dd822-251d-470a-a062-fa1922dfa9a8", "PWM Control"],
  ledMatrixState: ["e95d7b77-251d-470a-a062-fa1922dfa9a8", "LED Matrix State"],
  ledText: ["e95d93ee-251d-470a-a062-fa1922dfa9a8", "LED Text"],
  scrollingDelay: ["e95d0d2d-251d-470a-a062-fa1922dfa9a8", "Scrolling Delay"],
  microbitRequirements: [
    "e95db84c-251d-470a-a062-fa1922dfa9a8",
    "MicroBit Requirements",
  ],
  microbitEvent: ["e95d9775-251d-470a-a062-fa1922dfa9a8", "MicroBit Event"],
  clientRequirements: [
    "e95d23c4-251d-470a-a062-fa1922dfa9a8",
    "Client Requirements",
  ],
  clientEvent: ["e95d5404-251d-470a-a062-fa1922dfa9a8", "Client Event"],
  dfuControl: ["e95d93b1-251d-470a-a062-fa1922dfa9a8", "DFU Control"],
  temperature: ["e95d9250-251d-470a-a062-fa1922dfa9a8", "Temperature"],
  temperaturePeriod: [
    "e95d1b25-251d-470a-a062-fa1922dfa9a8",
    "Temperature Period",
  ],
  txCharacteristic: [
    "6e400002-b5a3-f393-e0a9-e50e24dcca9e",
    "Tx Characteristic",
  ],
  rxCharacteristic: [
    "6e400003-b5a3-f393-e0a9-e50e24dcca9e",
    "Rx Characteristic",
  ],
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
};

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
  }
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
  // document.getElementById("body").style = "background-color:#FFD0D0";
}

var microbitList = {
  mb1: {
    ledMatrixChar: null,
    ledTextChar: null,
    scrollingChar: null,
    buttonChar: null,
    buttonBChar: null,
  },
  mb2: {
    ledMatrixChar: null,
    ledTextChar: null,
    scrollingChar: null,
    buttonChar: null,
    buttonBChar: null,
  },
  mb3: {
    ledMatrixChar: null,
    ledTextChar: null,
    scrollingChar: null,
    buttonChar: null,
    buttonBChar: null,
  },
  mb4: {
    ledMatrixChar: null,
    ledTextChar: null,
    scrollingChar: null,
    buttonChar: null,
    buttonBChar: null,
  },
};

function getName(fullName) {
  let regex = /\[([^\]]+)\]/g;
  let nm = regex.exec(fullName);
  return nm[1];
}

function buttonPressEvent(button, deviceName, state) {
  // console.log(button + " " + deviceName);
  if (state == 1) {
    this.dispatchEvent(
      new CustomEvent("microbitButtonPress", {
        bubbles: true,
        detail: { button: button, deviceName: deviceName },
      })
    );
  }

  return { button: button, deviceName: deviceName };
}

// Nicole
function onTXLightEvent(deviceName, lightLevel){
  if (lightLevel = 255){
    this.dispatchEvent(
      new CustomEvent("lightLevel255", {
        bubbles: true,
        detail: { lightLevel: lightLevel, deviceName: deviceName },
      })
    );
  }
}
  

  
//

let patterns = {
  "O": [
    [0, 1, 1, 1, 0],
    [1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1],
    [0, 1, 1, 1, 0]
  ],
  "diamond": [
    [0, 0, 1, 0, 0],
    [0, 1, 1, 1, 0],
    [1, 1, 1, 1, 1],
    [0, 1, 1, 1, 0],
    [0, 0, 1, 0, 0]
  ],
  "o": [
    [0, 0, 0, 0, 0],
    [0, 0, 1, 0, 0],
    [0, 1, 1, 1, 0],
    [0, 0, 1, 0, 0],
    [0, 0, 0, 0, 0]
  ],
  "clear": [
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0]
  ],
  "3": [
    [0, 1, 1, 1, 1],
    [0, 0, 0, 0, 1],
    [0, 0, 1, 1, 0],
    [0, 0, 0, 0, 1],
    [0, 1, 1, 1, 0]
  ],
  "2": [
    [0, 1, 1, 1, 0],
    [0, 0, 0, 0, 1],
    [0, 0, 0, 1, 0],
    [0, 0, 1, 0, 0],
    [0, 1, 1, 1, 1]
  ],
  "1": [
    [0, 0, 1, 0, 0],
    [0, 1, 1, 0, 0],
    [0, 0, 1, 0, 0],
    [0, 0, 1, 0, 0],
    [0, 1, 1, 1, 0]
  ]
};

class Microbit {
  // let ledMatrixChar, ledTextChar, scrollingChar, buttonChar;
  constructor(device) {
    // this.initiateChars();
    this.disconnectCallback = null;
    // let this.
    this.buttonCallback = null;
    this.name = getName(device.name);
    device.addEventListener("gattserverdisconnected", this.disconnectMicrobit.bind(this));
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
    
    // NICOLE
    this.buttonUARTService = null;
    this.txCharacteristic = null;
    this.rxCharacteristic = null;
    //
  }

  setDisconnectCallback(callback) {
    this.disconnectCallback = callback;
  }

  disconnectMicrobit(event) {
    if (this.disconnectCallback) {
      this.disconnectCallback(this);
    }
  }

  get getMicrobitName() {
    return this.name;
  }

  getName() {
    return this.name;
  }

  setButtonCallback(callback) {
    this.buttonCallback = callback;
  }

  buttonAChanged(event) {
    let devName = getName(event.currentTarget.service.device.name);
    let state = event.target.value.getUint8(0);
    console.log(event, state);
    buttonPressEvent("a", devName, state);
    // console.log(this.getMicrobitName());

    if (this.buttonCallback) {
      this.buttonCallback(this, "a");
    }
  }

  buttonBChanged(event) {
    let devName = getName(event.currentTarget.service.device.name);
    let state = event.target.value.getUint8(0);
    buttonPressEvent("b", devName, state);

    if (this.buttonCallback) {
      this.buttonCallback(this, "b");
    }
  }
  
  //Nicole
  onTxCharacteristicValueChanged(event){
    let devName = getName(event.currentTarget.service.device.name);
    let state = event.target.value.getUint8(0);
   // buttonHoverEvent("", devName, state);
    // console.log(event.target.value);
    // console.log(event.target.value.getUint8(0));
    let enc = new TextDecoder("utf-8");
    console.log(event.target.value)
    console.log(enc.decode(event.target.value));
    onTXLightEvent(devName, enc.decode(event.target.value))
    // document.getElementById("tx").innerHTML += enc.decode(event.target.value) + "<br>";
    //addLog("<font color='green'>OK</font>", true);

  }
  //
  
  async ledMatrixDisplay(pattern) {
    // addLog("Writing LED matrix... ", false);
    if (!this.matrixChar) {
        // addLogError("There is no LED Matrix characteristic.");
      showAlert("No LED Matrix characteristic found. Maybe reconnect the microbit or refresh the whole page");
      return false;
    } else {
        let buffer = new ArrayBuffer(5);
        let ledMatrix = new DataView(buffer);
        for (let rowIndex = 0; rowIndex < 5; rowIndex++) {
            ledMatrix.setUint8(rowIndex, 0);
            for (let columnIndex = 0; columnIndex < 5; columnIndex++) {
              // console.log(ledMatrix.getUint8(rowIndex) | (document.getElementById((rowIndex+1).toString() + (5-columnIndex).toString()).checked << columnIndex));
              ledMatrix.setUint8(rowIndex, ledMatrix.getUint8(rowIndex) | ((pattern[rowIndex][4-columnIndex] == 1) << columnIndex));
            };
        };
        // console.log(ledMatrix);  
        await this.matrixChar.writeValue(ledMatrix)
        .then(_ => { return true; })
        .catch(error => { console.log(error); });
    };
    
  } 

  async ledTextDisplay(string) {
    await this.textChar
      .writeValue(this.enc.encode(string))
      .then((_) => {return true})
      .catch((error) => {
        console.error(error);
        showAlert("LED Text printing didn't work, reconnect microbit");
        return false;
      });
    return true;
  }
  
  async uartMessageSend(string) {
    if (!this.rxCharacteristic) {
      showAlert("UART receiver characteristic found. Might need to reconnect");
      return false;
    }

    try {
      let encoder = new TextEncoder();
      this.rxCharacteristic.writeValue(encoder.encode(string + "#"));
    } catch (error) {
      console.log(error);
    }
  }

  async populateCharacteristics(device) {
    let server = await device.gatt.connect();

    this.name = getName(device.name);
    console.log(this.name);
    this.ledservice = await server.getPrimaryService(
      microbitUuid.ledService[0]
    );
    console.log(this.ledservice)
    this.matrixChar = await this.ledservice.getCharacteristic(
      microbitUuid.ledMatrixState[0]
    );
    this.textChar = await this.ledservice.getCharacteristic(
      microbitUuid.ledText[0]
    );
    this.delayChar = await this.ledservice.getCharacteristic(
      microbitUuid.scrollingDelay[0]
    );
    this.buttonService = await server.getPrimaryService(
      microbitUuid.buttonService[0]
    );
    this.buttonAChar = await this.buttonService.getCharacteristic(
      microbitUuid.buttonAState[0]
    );
    console.log("BUTTONA", this.buttonAChar)
    await this.buttonAChar
      .startNotifications()
      .then((_) => {
        this.buttonAChar.addEventListener(
          "characteristicvaluechanged",
          this.buttonAChanged
        );
      console.log("INTERESTING:", this.buttonAChar)
      })
      .catch((error) => {
        console.error(error);
      });
    this.buttonBChar = await this.buttonService.getCharacteristic(
      microbitUuid.buttonBState[0]
    );
    await this.buttonBChar
      .startNotifications()
      .then((_) => {
        this.buttonBChar.addEventListener(
          "characteristicvaluechanged",
          this.buttonBChanged
        );
      })
      .catch((error) => {
        console.error(error);
      });
    
    
    // NICOLE
    this.buttonUARTService = await server.getPrimaryService(
      microbitUuid.uartService[0]
    );
    
    console.log("UARTUART:", this.buttonUARTService)
    
    
    this.txCharacteristicChar = await this.buttonUARTService.getCharacteristic(
      microbitUuid.txCharacteristic[0]
    );
    await this.txCharacteristicChar
      .startNotifications()
      .then((_) => {
        this.txCharacteristicChar.addEventListener(
        "characteristicvaluechanged",
        this.onTxCharacteristicValueChanged
        );
      })
      .catch((error) => {
        console.error(error);
      });
    
    
    
    this.rxCharacteristic = await this.buttonUARTService.getCharacteristic(
      microbitUuid.rxCharacteristic[0]
    );
    
    /*
    this.buttonUARTService0 = await this.buttonUARTService.getCharacteristic(
      microbitUuid._____[0]
       await this.buttonUARTService0
      .startNotifications()
      .then((_) => {
        this.buttonUARTService0.addEventListener(
          "characteristicvaluechanged",
          this.buttonUARTServiceC0Changed
    
    */
    
    
    //
  }
}

class MicrobitList {
  constructor() {
    this.microbits = {};
  }
  // create a new player and save it in the collection
  addMicrobit(mb) {
    this.microbits[mb.getMicrobitName] = mb;
    mb.setDisconnectCallback((mb) => {
      console.log("removing microbit");
      this.removeMicrobit(mb);
    });
    console.log(this.microbits);
    updateUIMicrobitList();
  }

  removeMicrobit(microbit) {
    delete this.microbits[microbit.name];
    updateUIMicrobitList();
  }
  
  displayAllMicrobits(pattern) {
    for (let m in this.microbits) {
      this.microbits[m].ledMatrixDisplay(pattern);
      name = Object.keys(patterns)[Object.values(patterns).indexOf(pattern)];
      console.log(name);
      if (name == "clear") {
        this.microbits[m].uartMessageSend("clear");
      }
      else if (name == "3") {
        console.log('showing 3');
        this.microbits[m].uartMessageSend("purple");
      }
      else if (name == "2") {
        this.microbits[m].uartMessageSend("violet");
      }
      else if (name == "1") {
        this.microbits[m].uartMessageSend("indigo");
      }
    }
  }
  
  clearDisplays() {
    this.displayAllMicrobits(patterns["clear"]);
  }

  get nameList() {
    return Object.keys(this.microbits);
  }

  get randomMicrobit() {
    // console.log(this.numberOfMicrobits);
    if (this.numberOfMicrobits > 0) {
      let randomName =
        this.nameList[Math.floor(Math.random() * this.nameList.length)];
      return this.microbits[randomName];
    } else {
      return;
    }
  }

  get mbList() {
    return this.microbits;
  }
  // this could include summary stats like average score, etc. For simplicy, just the count for now
  get numberOfMicrobits() {
    return this.nameList.length;
  }
}

const toastLiveExample = document.getElementById('liveToast')
const toastBody = document.getElementById('toastBody')

function showAlert(text) {
  const toastBootstrap = bootstrap.Toast.getOrCreateInstance(toastLiveExample, {delay:1500})
  toastBody.textContent = text;
    toastBootstrap.show()
}


function createButton(name) {
  let newButton = document.createElement("button");
  newButton.classList.add("btn", "btn-outline-primary");
  newButton.disabled = true;
  newButton.textContent = name;
  return newButton;
}

function updateUIMicrobitList() {
  let ml = document.getElementById("microbitList");
  ml.replaceChildren();
  let names = MBList.nameList;
  console.log(names);
  for (let i in names) {
    ml.appendChild(createButton(names[i]));
  }
  // <button type="button" disabled class="btn btn-outline-primary">Left</button>
}

function setBlockGameState(gameState) {
  console.log(gameState);
  let states = ["running", "inactive"];
  if (!states.includes(gameState)) {
    console.log("didn't find gameState");
    gameState = "inactive";
  }
  
  let classUpdates = {
    "gameBlock": {
      "running": "text-bg-success",  
      "inactive": "text-bg-secondary",
    }
  } 
  
  let textUpdates = {
    "gameBlockHeader": {
      "running": "Game Running!",
      "inactive": "Press Start Game to Start!"
    },
    "gameCountdown": {
      "running": "0",
      "inactive": "Score Here"
    },
    "scoreText": {
      "running": "0",
      "inactive": "Updates Here"
    },
  }
  
  let gb;
  for (var k in classUpdates){
    gb = document.getElementById(k);
    gb.classList = "";
    gb.classList.add("card", classUpdates[k][gameState]);    
  }
  
  for (var k in textUpdates) {
    gb = document.getElementById(k);
    gb.textContent = textUpdates[k][gameState];
  }
}

// let fadeStyle = {
//   "animation-name": "fade",
//   "animation-fill-mode": "both",
//   "animation-iteration-count": 1,
//   "animation-duration": "1s",
//   "animation-direction": "normal",
// }

// function applyStyles(element, style){
//   for (let fs in style) {
//     element.style[fs] = style[fs];
//   }
// }

async function showReward(score, reward) {
  let scoreText = document.getElementById("gameCountdown");
  let plusText = document.getElementById("scoreText");
  
  scoreText.textContent = score;
  
  plusText.classList.remove("fade")
  plusText.textContent = "+" + reward;
  
  await new Promise(r => setTimeout(r, 900));
  plusText.classList.add("fade")

  // applyStyles(plusText, fadeStyle);
}

function updateGameBlock(gameState) {
  //gameState = running or ended
  setBlockGameState(gameState)
  
  
}


var microbitData = {
  1: {
    //make the keys the microbit NAME
    buttona: -1,
    buttonb: -1,
  },
};

var microbitsAlreadyConnected = [];

var endGameBoolean = false;

let MBList = new MicrobitList();

async function connect() {
  if (!navigator.bluetooth) {
    console.error("Bluetooth not available in this browser or computer.");
    alert("Bluetooth not available in this browser or computer.");
  } else {
    const device = await navigator.bluetooth.requestDevice({
      // To accept all devices, use acceptAllDevices: true and remove filters.
      filters: [{ namePrefix: "BBC micro:bit" }],
      optionalServices: [
        microbitUuid.genericAccess[0],
        microbitUuid.genericAttribute[0],
        microbitUuid.deviceInformation[0],
        microbitUuid.accelerometerService[0],
        microbitUuid.magnetometerService[0],
        microbitUuid.buttonService[0],
        microbitUuid.ioPinService[0],
        microbitUuid.ledService[0],
        microbitUuid.eventService[0],
        microbitUuid.dfuControlService[0],
        microbitUuid.temperatureService[0],
        microbitUuid.uartService[0],
      ],
    });
    bluetoothDevice = device;
    console.log(device.name);
    let mb = new Microbit(device);
    MBList.addMicrobit(mb);
  }
}

function randomIntFromInterval(min, max) {
  // min and max included
  return Math.floor(Math.random() * (max - min + 1) + min);
}

let gameScores = [];
let round = gameScores.length;
function updateScoreTable() {
  round = gameScores.length;
  
}

function addRoundRow() {
  round = gameScores.length;
  let tr = document.createElement("tr");
  let th = document.createElement("th");
  th.setAttribute("scope", "row"); th.textContent=round;
  let td = document.createElement("td");
  td.id = "round"+round+"score";
  tr.appendChild(th);
  tr.appendChild(td);
  let tbd = document.getElementById("tableBody");
  tbd.appendChild(tr);
}

function updateRoundScore(round, score) {
  let td = document.getElementById("round" + round + "score");
  td.textContent = score;
}

// <tr>
//   <th scope="row">1</th>
//   <td id="round1Score">1</td>
// </tr>
let gameRunning = false;

async function startingSequence() {
  MBList.displayAllMicrobits(patterns["3"]);
  await new Promise(r => setTimeout(r, 1000));
  MBList.displayAllMicrobits(patterns["2"])
  await new Promise(r => setTimeout(r, 1000));
  MBList.displayAllMicrobits(patterns["1"]);
  await new Promise(r => setTimeout(r, 1000));
  MBList.displayAllMicrobits(patterns["clear"])
  return true;
  
}

async function startGame() {
  let thisGameScore = 0;
  this.endGameBoolean = false;

  
  //
  var gameRounds = 8;
  if (gameRunning == false && MBList.numberOfMicrobits > 0) {
    gameRunning = true;
    updateGameBlock("running");
    
    gameScores.push(thisGameScore);
    round = gameScores.length;
    addRoundRow();
    
    await startingSequence();
    for (var i = 0; i < gameRounds; i++) {
      if (this.endGameBoolean != true) {
        // console.log(i);

        let randomBit = MBList.randomMicrobit;
        
        console.log(randomBit.getMicrobitName)
        let enc = new TextDecoder("utf-8");
       // console.log("HERE:", enc.decode(event.target.value))
      
        
        // console.log(randomBit);
        randomBit.ledMatrixDisplay(patterns["O"]);
        randomBit.uartMessageSend("green");
        let startTime = Date.now();
        let output = await startWait(3000);
        let endTime = Date.now();
        let success = 0;
        // console.log(output, output["key"] == "button press");
        console.log("OUTPUT:", output)
        
        if (output["key"] == "button press") {
          // console.log(output);
          // console.log("button spotted in time", randomBit.getMicrobitName, output["deviceName"], output["deviceName"] == randomBit.getMicrobitName);
          if (output["deviceName"] == randomBit.getMicrobitName) {
            let speed = endTime - startTime;
            let speedScore = 30 - Math.floor(speed/100);
            success = 1 * speedScore;
            // console.log(speed, speedScore, success);
          }
          else {
            success = -10;
          }
        }
        
        thisGameScore += success;
        showReward(thisGameScore, success);
        gameScores[round - 1] = thisGameScore;
        updateRoundScore(round, thisGameScore);
        MBList.clearDisplays();
        let waitTime = Math.random()*1500 + 500;
        await new Promise(r => setTimeout(r, waitTime));
      }
      else {
        break;
      }
    }
    gameRunning = false
    updateGameBlock("inactive");
  }
  else if (MBList.numberOfMicrobits == 0) {
    showAlert("No microbits connected!");
  }
  this.endGameBoolean = true;
}

function onTimeUp() {
  console.log("Time's up!");
}

function characteristicCheck() {
  let randomMb = MBList.randomMicrobit;
  if (randomMb) {
    console.log(randomMb);
    randomMb.ledTextDisplay("B");
  }
}

function testPattern() {
  let randomMb = MBList.randomMicrobit;
  if (randomMb) {
    console.log(randomMb);
    randomMb.ledMatrixDisplay(patterns["O"]);
  }
}


async function startWait(timeoutDuration) {
  const timeoutPromise = new Promise((resolve) => {
    setTimeout(() => {
      onTimeUp();
      return resolve({ key: "time end" });
    }, timeoutDuration);
  });
  let fn = this;
  
//   const buttonPromise = new Promise((resolve) => {
//     fn.addEventListener("lightLevel255", (event) => {
//       return resolve({
//         key: "light level 255",
//         button: event.detail.lightLevel,
//         deviceName: event.detail.deviceName,
//       });
//     });
//   });

//   // Wait for either promise to resolve
//   let retVal = {"key": "empty"};
//   fn.removeEventListener("lightLevel255",  (event) => {
//      console.log(event)}, false);
//   await Promise.race([timeoutPromise, buttonPromise]).then((value) => {
//     // console.log(value);
//     retVal = value;
//     console.log(retVal);
//     return value;
//   });
  
  
  
  
  

  const buttonPromise = new Promise((resolve) => {
    fn.addEventListener("microbitButtonPress", (event) => {
      return resolve({
        key: "button press",
        button: event.detail.button,
        deviceName: event.detail.deviceName,
      });
    });
  });

  // Wait for either promise to resolve
  let retVal = {"key": "empty"};
  fn.removeEventListener("microbitButtonPress",  (event) => {
     console.log(event)}, false);
  await Promise.race([timeoutPromise, buttonPromise]).then((value) => {
    // console.log(value);
    retVal = value;
    console.log(retVal);
    return value;
  });

  return retVal;
}

// Call the function with a timeout duration in milliseconds (e.g., 5000 for 5 seconds)

// start event listeners for button presses
// if buttonA Press { if this was supposed to be pressed, kill the wait and give points}

function endGame() {
  this.endGameBoolean = true;
  console.log(this.endGameBoolean);
  // setTimeout(() => {  console.log("World!"); }, 5000000);
  // endGameBoolean = false
}
