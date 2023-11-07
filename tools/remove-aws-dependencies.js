const fs = require('fs');
const fileName = '../dist/aws/layer/nodejs/package.json';
const packageJson = require(fileName);

delete packageJson.scripts;
delete packageJson.devDependencies;
delete packageJson.dependencies['@aws-sdk/client-cognito-identity-provider']; 
delete packageJson.dependencies['@types/aws-lambda'];
delete packageJson.dependencies['aws-cdk-lib'];
delete packageJson.dependencies['aws-sdk'];
delete packageJson.dependencies['constructs'];
delete packageJson.dependencies['source-map-support'];

fs.writeFile(fileName, JSON.stringify(packageJson), function writeJSON(err) {
  if (err) {
    console.log('Error removing aws dependencies', err);
  }
});
