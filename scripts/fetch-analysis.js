const http = require('http');

http.get('http://localhost:3000/api/create-luft-paytv-staff?secret=eib-fix-2026&mode=analyze', (resp) => {
  let data = '';
  resp.on('data', (chunk) => { data += chunk; });
  resp.on('end', () => {
    const json = JSON.parse(data);
    console.log(JSON.stringify(json.summary, null, 2));
    console.log('Already Exists:');
    console.log(JSON.stringify(json.details.alreadyExists, null, 2));
    console.log('To Create: ' + json.details.toCreate.length);
  });
}).on("error", (err) => {
  console.log("Error: " + err.message);
});
