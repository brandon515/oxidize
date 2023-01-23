// Modules to control application life and create native browser window
const {app, BrowserWindow} = require('electron')
const path = require('path')
const grpcReflect = require('grpc-js-reflection-client');
const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');

function createWindow () {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeInegration: true
    }
  })

  mainWindow.removeMenu()

  //mainWindow.webContents.openDevTools({mode: "detach"})

  // and load the index.html of the app.
  mainWindow.loadFile('index.html')

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()

  try {
    (async () => {
      const c = new grpcReflect.GrpcReflection("142.93.202.81:10000", grpc.credentials.createInsecure());
      const descriptor = await c.getDescriptorBySymbol('route.Route');


      const desMsg = descriptor.getDescriptorMessage("proto3");

      console.log(desMsg);

      //const packageDef = protoLoader.loadFileDescriptorSetFromObject(desMsg, {});

      //console.log(packageDef);
      /*const packageObject = descriptor.getPackageObject({
          keepCase: true,
          enums: String,
          longs: String
      });

      var proto = new packageObject.apidata.ApiKeyService("142.93.202.81:10000", grpc.credentials.createInsecure());

      proto.TestRun({"msg":"hello there!"}, (d)=>{
        console.log(d);
      });*/

    })();
  }catch(e){
    console.log(e);
  }
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
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
