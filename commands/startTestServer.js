const ngrok = require('ngrok');
const opn = require('opn');
const ncp = require('copy-paste');

let serverStarted = false;

(async function() {
  console.log('Starting local firebase server...');
  let child = require('child_process').spawn('firebase serve --only functions', {shell: true});
  child.stdout.on('data', async function(data) {
    if(serverStarted === true) {
      console.log(data.toString());
    } else if(data.toString().includes('localhost:')) {
      let info = dissectFirebaseInfo(data.toString());
      console.log('Initializing ngrok on port', info.port, 'using HTTP protocol...');
      let ngrokUrl = await createNgrokGateway(info.port);
      let finalPath = ngrokUrl + '/' + info.path;
      console.log('\nSuccessfully generated temporary fulfillment link (expires in 8 hours):\n' + finalPath + '\n');
      ncp.copy(finalPath, () => {
        console.log('Copied link to clipboard. Opening up dialogflow console in your web browser...\n');
        setTimeout(function() { 
          opn('https://console.dialogflow.com/api-client/')
        }, 3000);
      });
      serverStarted = true;
    }     
  });
  child.stderr.on('data', function(data) {
    console.log(data.toString());
  });
})();

function dissectFirebaseInfo(strData) {
  let split = strData.trim().split(/^.*(http:\/\/localhost:\d*\/)/g);
  return {
    port: split[1].match(/:\d{1,5}/g)[0].split(':')[1],
    path: split[2].replace(/\u001b\[.*?m/g, '')
  }
}

async function createNgrokGateway(port) {
  ngrokUrl = await ngrok.connect({proto: 'http', addr: port});
  return ngrokUrl;
}