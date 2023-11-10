import * as cdk from '@aws-cdk/core';
import * as dynamodb from '@aws-cdk/aws-dynamodb';

export interface DynamoDbTableConstructProps {
    tableName: string;
    partitionKey: { name: string; type: dynamodb.AttributeType };
    sortKey?: { name: string; type: dynamodb.AttributeType };
    readCapacity?: number;
    writeCapacity?: number;
    billingMode?: dynamodb.BillingMode;
    stream?: dynamodb.StreamViewType;
    encryption?: dynamodb.TableEncryption;
    pointInTimeRecovery?: boolean;
    removalPolicy?: cdk.RemovalPolicy;
}

export class DynamoDbTableConstruct extends cdk.Construct {
    public readonly table: dynamodb.Table;
    constructor(scope: cdk.Construct, id: string, props: DynamoDbTableConstructProps) {
        super(scope, id);
        this.table = new dynamodb.Table(this, 'Table', {
            tableName: props.tableName,
            partitionKey: props.partitionKey,
            sortKey: props.sortKey,
            billingMode: props.readCapacity && props.writeCapacity ? dynamodb.BillingMode.PROVISIONED : dynamodb.BillingMode.PAY_PER_REQUEST,
            readCapacity: props.readCapacity,
            writeCapacity: props.writeCapacity,
        });
    }
}