#stop script if any problem happen
set -e

cd ..

##Layer creation
mkdir dist/aws
mkdir dist/aws/layer
mkdir dist/aws/layer/nodejs

echo "$PWD"

# updating lambda layer content
cp -r package.json dist/aws/layer/nodejs
cp -r dist/src/shared dist/aws/layer

cd tools
node remove-aws-dependencies.js
cd ..

cd dist/aws/layer/nodejs
npm i | true
