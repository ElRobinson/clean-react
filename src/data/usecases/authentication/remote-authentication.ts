import { HttpStatusCode } from 'data/protocols/http/http-response';
import { InvalidCredentialsError } from 'domain/errors/invalid-credentials';
import { UnexpectedError } from 'domain/errors/unexpected-error';
import { AccountModel } from 'domain/models/account-model';
import { AuthenticationParams } from '../../../domain/usecases/authentication';
import { HttpPostClient } from '../../protocols/http/http-post-client';

export class RemoteAuthentication {
    constructor( 
        private readonly url: string,
        private readonly HttpPostClient: HttpPostClient<AuthenticationParams, AccountModel> 
    ) {}

    async auth (params: AuthenticationParams): Promise<void> {
        const httpResponse = await this.HttpPostClient.post({
            url: this.url,
            body: params
        })
        switch (httpResponse.statusCode){
            case HttpStatusCode.ok: break;
            case HttpStatusCode.unathorized: throw new InvalidCredentialsError()
            default: throw new UnexpectedError()            
        }
    }
}