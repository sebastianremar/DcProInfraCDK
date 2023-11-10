import * as cdk from '@aws-cdk/core';
import * as lambda from '@aws-cdk/aws-lambda';
import * as ecr from '@aws-cdk/aws-ecr';
import * as iam from '@aws-cdk/aws-iam';

export interface LambdaFromEcrProps {
    repositoryName: string;
    role?: iam.Role;
}

export class LambdaFromEcrConstruct extends cdk.Construct {
    public readonly lambdaFunction: lambda.Function;

    constructor(scope: cdk.Construct, id: string, props: LambdaFromEcrProps) {
        super(scope, id);

        const repositoryArn = `arn:aws:ecr:${cdk.Stack.of(this).region}:${cdk.Stack.of(this).account}:repository/${props.repositoryName}`;

        const repository = ecr.Repository.fromRepositoryAttributes(this, 'Repository', {
            repositoryArn: repositoryArn,
            repositoryName: props.repositoryName,
        });

        const lambdaRole = props.role || new iam.Role(this, 'LambdaRole', {
            assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
            managedPolicies: [
                iam.ManagedPolicy.fromAwsManagedPolicyName('service-role/AWSLambdaBasicExecutionRole'), 
            ],
        });

        this.lambdaFunction = new lambda.DockerImageFunction(this, 'LambdaFunction', {
            code: lambda.DockerImageCode.fromEcr(repository, {
                tag: 'latest'
            }),
            role: lambdaRole,
        });
    }
}
