import * as cdk from '@aws-cdk/core';
import * as dynamodb from '@aws-cdk/aws-dynamodb';
import { DynamoDbTableConstruct } from '../constructs/table-construct';

export class CustomerDataStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const myTable = new DynamoDbTableConstruct(this, 'CustomerDataTable', {
      tableName: 'CustomerData',
      partitionKey: { name: 'customerId', type: dynamodb.AttributeType.STRING },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST, 
      stream: dynamodb.StreamViewType.NEW_IMAGE, 
      encryption: dynamodb.TableEncryption.AWS_MANAGED, 
      pointInTimeRecovery: true, 
      removalPolicy: cdk.RemovalPolicy.RETAIN, 
    });
  }
}
