import { RemoteAuthentication }  from './remote-authentication'
import {HttpPostClientSpy } from '../../test/mock-http-client'
import { mockAuthentication } from '../../../domain/test/mock-authentication'
import { InvalidCredentialsError } from '../../../domain/errors/invalid-credentials'
import { UnexpectedError } from '../../../domain/errors/unexpected-error'
import { HttpStatusCode } from '../../protocols/http/http-response'
import faker from 'faker'
import { AccountModel } from 'domain/models/account-model'
import { AuthenticationParams } from 'domain/usecases/authentication'

type SutTypes = {
    sut: RemoteAuthentication
    httpPostClientSpy: HttpPostClientSpy<AuthenticationParams, AccountModel>
}
//factory
const makeSut = (url: string = faker.internet.url()): SutTypes => {    
    const httpPostClientSpy = new HttpPostClientSpy<AuthenticationParams, AccountModel>()
    const sut = new RemoteAuthentication(url, httpPostClientSpy)
    return {
        httpPostClientSpy,
        sut       
    }
}
describe('RemoteAuthentication', () => {
    test('Should call HttpPostClient with correct URL', async () => {     
        const url = faker.internet.url();      
        const { sut, httpPostClientSpy } = makeSut(url)
        await sut.auth(mockAuthentication())
        expect(httpPostClientSpy.url).toBe(url);
    })

    test('Should call httpPostClient with correct body', async () => {
        const { sut, httpPostClientSpy} = makeSut()
        const authenticationParams = mockAuthentication() 
        await sut.auth(authenticationParams)
        expect(httpPostClientSpy.body).toEqual(authenticationParams)
    })

    test('Should throw InvalidCredentialsError if httpPostClient returns 401', async () => {
        const { sut, httpPostClientSpy} = makeSut()    
        httpPostClientSpy.response = { 
            statusCode: HttpStatusCode.unathorized
        }    
        const promise = sut.auth(mockAuthentication())
        await expect(promise).rejects.toThrow(new InvalidCredentialsError())
    })

    test('Should throw UnexpectedError if httpPostClient returns 400', async () => {
        const { sut, httpPostClientSpy} = makeSut()    
        httpPostClientSpy.response = { 
            statusCode: HttpStatusCode.badRequest
        }    
        const promise = sut.auth(mockAuthentication())
        await expect(promise).rejects.toThrow(new UnexpectedError())
    })

    test('Should throw UnexpectedError if httpPostClient returns 500', async () => {
        const { sut, httpPostClientSpy} = makeSut()    
        httpPostClientSpy.response = { 
            statusCode: HttpStatusCode.serverError
        }    
        const promise = sut.auth(mockAuthentication())
        await expect(promise).rejects.toThrow(new UnexpectedError())
    })

    test('Should throw NotFoundError if httpPostClient returns 404', async () => {
        const { sut, httpPostClientSpy} = makeSut()    
        httpPostClientSpy.response = { 
            statusCode: HttpStatusCode.notFound
        }    
        const promise = sut.auth(mockAuthentication())
        await expect(promise).rejects.toThrow(new UnexpectedError())
    })
})