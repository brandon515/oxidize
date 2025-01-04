// Modules to control application life and create native browser window
const {app, BrowserWindow} = require('electron')
const path = require('path')

function createWindow () {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  })

  // and load the index.html of the app.
  mainWindow.loadFile('index.html')

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
  const crypto = require('crypto');
  const fs = require('fs');

  const publicKeyFile = 'key.pub';
  const privateKeyFile = 'key';
  if (fs.existsSync(publicKeyFile) && fs.existsSync(privateKeyFile)){
    const publicKeyPem = fs.readFileSync(publicKeyFile, 'utf-8');
    const privateKeyPem = fs.readFileSync(privateKeyFile, 'utf-8');

    const publicKey = crypto.createPublicKey(publicKeyPem);
    const privateKey = crypto.createPrivateKey()
  }
  
  try{
    const serverpubkey = crypto.createPublicKey(`-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA4M8JmAOheDR4qH0EB345
CWd60fARrUcuDS7/vTQ6S0rYS084fWBHbv+fXl7Mg2LAnKAnW0yhUUMzCYBd3Xtc
+ZM+vgKQWReLHUzFmWcACpYIgRNZwcyHExl6mlrlJgMt9eCYgKUBCqwf375YQofI
vuC8GGHI5f9LpkR3T0I/+v1G0b0eqk82+d/q3Iw7PwvE1PLLZJVV5ywoWw2Rl2TS
w1q7zF71IGR7Ds1xTBwbxbx3FIiz7hFYpm0LhgS5uAadrF1XArLEsdfkDouTrrbY
b+bmFYNLGg5ug9jIk95K4RmkUdk5M549pGE/zjAnB/yeKGZ8PeTOwsjF8Nmi6I8E
ywIDAQAB
-----END PUBLIC KEY-----`);

    init_msg = {
      kind: "InitialMessage",
      username: "tester5",
      machine: "TestMachine",
    }

    const init_msg_json = JSON.stringify(init_msg);
    console.log(init_msg_json);
    const init_msg_en = crypto.publicEncrypt({
      key: serverpubkey,
      oaepHash: 'sha256',
      padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
    },init_msg_json);
    console.log(init_msg_en);

    const net = require("net");

    const client = net.Socket();
    client.connect(10000, "142.93.202.81", function(){
      arr = new ArrayBuffer(8);
      view = new DataView(arr)
      view.setBigInt64(0, BigInt(init_msg_en.length), false);
      const buf = new Uint8Array(arr);
      client.write(buf)
      client.write(init_msg_en);
    })

    client.on("data", function(data){
      const json_msg = JSON.parse(data);
      const isVerified = crypto.verify("SHA256", Buffer.from(json_msg.data), serverpubkey, Buffer.from(json_msg.signature))
      if(isVerified){
        const decoder = new TextDecoder("utf-8");
        const decoded_msg = decoder.decode(Buffer.from(json_msg.data));
        console.log(JSON.parse(decoded_msg));
      }else{
        console.log("verification failed");
      }
    })
  }catch(error){
    console.log(error);
    return;
  }

  
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
