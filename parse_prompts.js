const fs = require('fs');

function run() {
  const logPath = 'C:\\Users\\Administrator\\.gemini\\antigravity-ide\\brain\\51fdae7d-d52f-45f1-bfeb-82344b642be5\\.system_generated\\logs\\transcript.jsonl';
  const lines = fs.readFileSync(logPath, 'utf8').split('\n');
  const mapping = {};

  for(const line of lines) {
    if(!line) continue;
    try {
      const obj = JSON.parse(line);
      if(obj.tool_calls) {
        for(const tc of obj.tool_calls) {
          if(tc.name === 'generate_image') {
            try {
              let args = tc.args;
              if (typeof args === 'string') args = JSON.parse(args);
              let imageName = args.ImageName;
              let prompt = args.Prompt;
              if (typeof imageName === 'string') imageName = imageName.replace(/"/g, '');
              if (typeof prompt === 'string') prompt = prompt.replace(/"/g, '');
              if (imageName && imageName.startsWith('course_')) {
                mapping[imageName] = prompt;
              }
            } catch(e) {}
          }
        }
      }
    } catch(e) {}
  }

  // Also try to find if there are strings with "ImageName":"course_..."
  for(const line of lines) {
    const regex = /"ImageName":\s*"\\?"?(course_\d+)\\?"?"\s*,\s*"Prompt":\s*"\\?"?([^"]+)\\?"?"/g;
    let match;
    while((match = regex.exec(line)) !== null) {
      mapping[match[1]] = match[2];
    }
  }

  console.log(JSON.stringify(mapping, null, 2));
}

run();
