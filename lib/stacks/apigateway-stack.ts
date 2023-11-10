import * as cdk from '@aws-cdk/core';
import * as apigateway from '@aws-cdk/aws-apigateway';
import * as iam from '@aws-cdk/aws-iam';
import { LambdaFromEcrConstruct } from '../constructs/lambda-construct';

export class PaymentApiGatewayStack extends cdk.Stack {
    constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
        super(scope, id, props);

        const dynamoLambdaRole = new iam.Role(this, 'DynamoLambdaRole', {
            assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
        });

        const tableName = 'CustomerData';

        dynamoLambdaRole.addToPolicy(new iam.PolicyStatement({
            actions: ['dynamodb:PutItem', 'dynamodb:UpdateItem'],
            resources: [`arn:aws:dynamodb:${this.region}:${this.account}:table/${tableName}`],
        }));

        const lambdaTest = new LambdaFromEcrConstruct(this, 'MyLambda', {
            repositoryName: 'dcpro-images',
            role: dynamoLambdaRole,
        }).lambdaFunction;

        const api = new apigateway.RestApi(this, 'PaymentApi', {
            restApiName: 'PaymentService',
            description: 'API service for processing payments.',
        });

        const paymentIntentResource = api.root.addResource('create-payment-intent');
        paymentIntentResource.addMethod('POST', new apigateway.LambdaIntegration(lambdaTest));

        new cdk.CfnOutput(this, 'ApiUrl', {
            value: api.url,
        });
    }
}