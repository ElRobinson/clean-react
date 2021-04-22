import { RemoteAuthentication }  from './remote-authentication'
import {HttpPostClientSpy } from '../../test/mock-http-client'
import faker from 'faker'

type SutTypes = {
    sut: RemoteAuthentication
    httpPostClientSpy: HttpPostClientSpy
}
//factory
const makeSut = (url: string = faker.internet.url()): SutTypes => {    
    const httpPostClientSpy = new HttpPostClientSpy()
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
        await sut.auth()
        expect(httpPostClientSpy.url).toBe(url);
    })
})