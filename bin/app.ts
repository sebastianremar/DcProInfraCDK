#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { CustomerDataStack } from '../lib/stacks/data-stack';
import { PaymentApiGatewayStack } from '../lib/stacks/apigateway-stack';

const app = new cdk.App();
new CustomerDataStack(app, 'CustomerDataStack', {
  env: { account: 'accountNumber', region: 'region' },
});

new PaymentApiGatewayStack(app, 'PaymentApiGatewayStack', {
  env: { account: 'accountNumber', region: 'region' },
});