import { RemoteAuthentication }  from './remote-authentication';
import {HttpPostClientSpy } from '../../test/mock-http-client';

type SutTypes = {
    sut: RemoteAuthentication
    httpPostClientSpy: HttpPostClientSpy
}
//factory
const makeSut = (url: string = 'any_url'): SutTypes => {    
    const httpPostClientSpy = new HttpPostClientSpy()
    const sut = new RemoteAuthentication(url, httpPostClientSpy)
    return {
        httpPostClientSpy,
        sut       
    }
}
describe('RemoteAuthentication', () => {
    test('Should call HttpPostClient with correct URL', async () => {     
        const url = 'other_url';        
        const { sut, httpPostClientSpy } = makeSut(url)
        await sut.auth()
        expect(httpPostClientSpy.url).toBe(url);
    })
})