# aws-invoices

Instructions for configuring and installing prerequisites to build and deploy the Invoices API on AWS environment.

## Prerequisites
Before installing the project dependencies, you will need to have Yarn and AWS CDK CLI installed.

### Yarn

 It's recommend installing Yarn globally by using the NPM package manager, which is included by default with all Node.js installations.

    npm install --global yarn

### AWS CDK CLI

Install the AWS CDK CLI globally by running the following command:

    npm install -g aws-cdk

## Install project dependencies

To download and install all the project dependencies:

    yarn or yarn install

## Build

Compile and pack the code by running the following command:

    yarn aws
    
## Deploy

Deploy the resources using CDK.

    cdk deploy

## Useful commands

- `npm run build` compile typescript to js
- `npm run watch` watch for changes and compile
- `npm run test` perform the jest unit tests
- `cdk deploy` deploy this stack to your default AWS account/region
- `cdk diff` compare deployed stack with current state
- `cdk synth` emits the synthesized CloudFormation template
- `cdk destroy` detroy stack
