import Window from '../../src/window/Window';
import IWindow from '../../src/window/IWindow';
import IDocument from '../../src/nodes/document/IDocument';
import ResourceFetchHandler from '../../src/fetch/ResourceFetchHandler';
import IResponse from '../../src/fetch/IResponse';

const URL = 'https://localhost:8080/base/';

describe('ResourceFetchHandler', () => {
	let window: IWindow;
	let document: IDocument;

	beforeEach(() => {
		window = new Window({ url: URL });
		document = window.document;
	});

	afterEach(() => {
		jest.restoreAllMocks();
	});

	describe('fetch()', () => {
		it('Returns resource data asynchrounously.', async () => {
			let fetchedURL = null;

			jest.spyOn(window, 'fetch').mockImplementation((url: string) => {
				fetchedURL = url;
				return Promise.resolve(<IResponse>{
					text: () => Promise.resolve('test'),
					ok: true
				});
			});

			const test = await ResourceFetchHandler.fetch(document, 'path/to/script/');

			expect(fetchedURL).toBe('path/to/script/');
			expect(test).toBe('test');
		});
	});

	describe('fetchSync()', () => {
		it('Returns resource data synchrounously.', () => {
			const test = ResourceFetchHandler.fetchSync(document, 'path/to/script/');

			expect(mockedModules.modules.child_process.execFileSync.parameters.command).toEqual(
				process.argv[0]
			);
			expect(mockedModules.modules.child_process.execFileSync.parameters.args[0]).toBe('-e');
			expect(
				mockedModules.modules.child_process.execFileSync.parameters.args[1].replace(/\s/gm, '')
			).toBe(
				`
                const HTTP = require('http');
                const HTTPS = require('https');
                const sendRequest = HTTPS.request;
                const options = {\"host\":\"localhost\",\"port\":8080,\"path\":\"/base/path/to/script/\",\"method\":\"GET\",\"headers\":{\"accept\":\"*/*\",\"referer\":\"https://localhost:8080\",\"user-agent\":\"Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:97.0) Gecko/20100101 Firefox/97.0\",\"cookie\":\"\",\"host\":\"localhost:8080\"},\"agent\":false,\"rejectUnauthorized\":true,\"key\":\"-----BEGIN PRIVATE KEY-----\\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCp6tBJASD9LFXF\\nGLCUi2K2Gvl7kQxmjWeyq3/E7FqBualbcgSa3SNulsfuIQXgMMSjsoA7BQI7BVZ4\\nXFGhqDyUbZrHjzCuCOUKdrjlcOfRd6DUBFqMvTiCzjodnRWvMiWhUZ+WfTOC39W6\\nbkE2qz05zl9CgGag/dwCfd2fhlVw/QAq2G1zI+WrYO41E3Q9XQPZG0xKIDL2XUqj\\no3nH6wB4KUPI4v6xMMueBkFV5nI4q30h3XlLxm1e0DpUyAeecXeMKGfulqDvuux3\\n/LmIA0BU1lipGX4SDvFoNyy9uAfjpQE6sFwHf1C1OHky2OjF6nl7dkMUb6RDUdQT\\n6LPk7mfTAgMBAAECggEAKkwTkTjAt4UjzK56tl+EMQTB+ep/hb/JgoaChci4Nva6\\nm9LkJpDJ0yuhlTuPNOGu8XjrxsVWas7HWarRf0Zb3i7yip6wZYI9Ub+AA015x4DZ\\n/i0fRU2NFbK0cM67qSL4jxG8gj+kZP3HPGNZxHwX/53JxMolwgmvjMc8NgvAlSFd\\nNnV9h4xtbhUh1NGS5zmP3iU2rwnE8JrIEzwy6axLom7nekAgkdcbAr0UoBs8gcgH\\naYNhU4Gz3tGcZZ0IXAfT/bJIH1Ko8AGv4pssWc3BXcmmNdm/+kzvHIxEIV7Qegmo\\nXG1ZyZCyD/0b4/3e8ySDBEDqwR+HeyTW2isWG2agAQKBgQDp44aTwr3dkIXY30xv\\nFPfUOipg/B49dWnffYJ9MWc1FT9ijNPAngWSk0EIiEQIazICcUBI4Yji6/KeyqLJ\\nGdLpDi1CkKqtyh73mjELinYp3EUQgEa77aQogGa2+nMOVfu+O5CtloUrv/A18jX3\\n+VEyaEASK0fWmnSI0OdlxQHIAQKBgQC5+xOls2F3MlKASvWRLlnW1wHqlDTtVoYg\\n5Nh8syZH4Ci2UH8tON3A5/7SWNM0t1cgV6Cw4zW8Z2spgIT/W0iYYrQ4hHL1xdCu\\n+CxL1km4Gy8Uwpsd+KdFahFqF/XTmLzW0HXLxWSK0fTwmdV0SFrKF3MXfTCU2AeZ\\njJoMFb6P0wKBgQC3Odw6s0vkYAzLGhuZxfZkVvDOK5RRF0NKpttr0iEFL9EJFkPo\\n2KKK8jr3QTDy229BBJGUxsJi6u6VwS8HlehpVQbV59kd7oKV/EBBx0XMg1fDlopT\\nPNbmN7i/zbIG4AsoOyebJZjL7kBzMn1e9vzKHWtcEHXlw/hZGja8vjooAQKBgAeg\\nxK2HLfg1mCyq5meN/yFQsENu0LzrT5UJzddPgcJw7zqLEqxIKNBAs7Ls8by3yFsL\\nPQwERa/0jfCl1M6kb9XQNpQa2pw6ANUsWKTDpUJn2wZ+9N3F1RaDwzMWyH5lRVmK\\nM0qoTfdjpSg5Jwgd75taWt4bxGJWeflSSv8z5R0BAoGAWL8c527AbeBvx2tOYKkD\\n2TFranvANNcoMrbeviZSkkGvMNDP3p8b6juJwXOIeWNr8q4vFgCzLmq6d1/9gYm2\\n3XJwwyD0LKlqzkBrrKU47qrnmMosUrIRlrAzd3HbShOptxc6Iz2apSaUDKGKXkaw\\ngl5OpEjeliU7Mus0BVS858g=\\n-----END PRIVATE KEY-----\",\"cert\":\"-----BEGIN CERTIFICATE-----\\nMIIDYzCCAkugAwIBAgIUJRKB/H66hpet1VfUlm0CiXqePA4wDQYJKoZIhvcNAQEL\\nBQAwQTELMAkGA1UEBhMCU0UxDjAMBgNVBAgMBVNrYW5lMQ4wDAYDVQQHDAVNYWxt\\nbzESMBAGA1UECgwJSGFwcHkgRE9NMB4XDTIyMTAxMTIyMDM0OVoXDTMyMTAwODIy\\nMDM0OVowQTELMAkGA1UEBhMCU0UxDjAMBgNVBAgMBVNrYW5lMQ4wDAYDVQQHDAVN\\nYWxtbzESMBAGA1UECgwJSGFwcHkgRE9NMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8A\\nMIIBCgKCAQEAqerQSQEg/SxVxRiwlItithr5e5EMZo1nsqt/xOxagbmpW3IEmt0j\\nbpbH7iEF4DDEo7KAOwUCOwVWeFxRoag8lG2ax48wrgjlCna45XDn0Xeg1ARajL04\\ngs46HZ0VrzIloVGfln0zgt/Vum5BNqs9Oc5fQoBmoP3cAn3dn4ZVcP0AKthtcyPl\\nq2DuNRN0PV0D2RtMSiAy9l1Ko6N5x+sAeClDyOL+sTDLngZBVeZyOKt9Id15S8Zt\\nXtA6VMgHnnF3jChn7pag77rsd/y5iANAVNZYqRl+Eg7xaDcsvbgH46UBOrBcB39Q\\ntTh5Mtjoxep5e3ZDFG+kQ1HUE+iz5O5n0wIDAQABo1MwUTAdBgNVHQ4EFgQU69s9\\nYSobG/m2SN4L/7zTaF7iDbwwHwYDVR0jBBgwFoAU69s9YSobG/m2SN4L/7zTaF7i\\nDbwwDwYDVR0TAQH/BAUwAwEB/zANBgkqhkiG9w0BAQsFAAOCAQEAi/WUXx2oal8L\\nYnPlIuKfh49n/K18wXSYG//oFYwxfVxqpYH8hUiXVm/GUcXCxS++hUkaKLqXmH9q\\nMKJiCrZr3vS+2nsBKopkICu/TLdROl0sAI9lByfnEbfSAzjxe1IWJdK8NdY0y5m5\\n9pEr/URVIAp/CxrneyASb4q0Jg5To3FR7vYc+2X6wZn0MundKMg6Dp9/A37jiF3l\\nTt/EJp299YZcsUzh+LnRuggRjnoOVu1aLcLFlaUiwZfy9m8mLG6B/mdW/qNzNMh9\\nOqvg1zfGdpz/4D/2UUUBn6pq1vbsoAaF3OesoA3mfDcegDf/H9woJlpT0Wql+e68\\nY3FblSokcA==\\n-----END CERTIFICATE-----\"};
                const request = sendRequest(options, (response) => {
                    let responseText = '';
                    let responseData = Buffer.alloc(0);
                    response.setEncoding('utf8');
                    response.on('data', (chunk) => {
                        responseText += chunk;
                        responseData = Buffer.concat([responseData, Buffer.from(chunk)]);
                    });
                    response.on('end', () => {
                        console.log(JSON.stringify({err: null, data: { statusCode: response.statusCode, headers: response.headers, text: responseText, data: responseData.toString('base64')}}));
                    });
                    response.on('error', (error) => {
                        console.log(JSON.stringify({err: error, data: null}));
                    });
                });
                request.write(\`\`);
                request.end();
            `.replace(/\s/gm, '')
			);
			expect(mockedModules.modules.child_process.execFileSync.parameters.options).toEqual({
				encoding: 'buffer',
				maxBuffer: 1024 * 1024 * 1024
			});

			expect(test).toBe('child_process.execFileSync.returnValue.data.text');
		});

		it('Handles error when resource is fetched synchrounously.', () => {
			mockedModules.modules.child_process.execFileSync.returnValue.data.statusCode = 404;
			expect(() => {
				ResourceFetchHandler.fetchSync(document, 'path/to/script/');
			}).toThrowError(`Failed to perform request to "${URL}path/to/script/". Status code: 404`);
		});
	});
});
