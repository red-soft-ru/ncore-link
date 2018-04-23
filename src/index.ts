import { 
    NcoreLinkRequestParams,
    NcoreLinkRequest,
    NcoreLinkGlobalParams,
    NcoreLinkError
} from '../types';

function trim(str: string) {
    return str.replace(/^[\s\uFEFF\xA0\\/]+|[\s\uFEFF\xA0\\/]+$/g, '');
}

export class NcoreLink {
    
    baseUrl: string = '';
    requests: NcoreLinkRequest[] = [];
    abortActiveType: boolean = true;
    headers: { [key: string]: string } = {};
    timeout: number = 10000;
    
    onerror: (error: NcoreLinkError) => void;
    ontimeout: (retry: () => void) => void;

    setParams(params: NcoreLinkGlobalParams) {

        for (const param in params) {
            this[param] = params[param];
        }
    }

    /*
     * Promise версия request
     */
    async send(params: NcoreLinkRequestParams): Promise<any> {

        return new Promise((resolve, reject) => {
            
            this.request({
                ...params,
                onsuccess(data) {
                    resolve(data);

                    if (params.onsuccess instanceof Function) {
                        params.onsuccess(data);
                    }
                },
                onerror(e) {
                    reject(e);

                    if (params.onerror instanceof Function) {
                        params.onerror(e);
                    }
                }
            })
        })
    }

    request(params: NcoreLinkRequestParams) {

        if (!params.url) {
            console.error('Отсутвует URL запроса');
            return;
        }

        const {
            type,
            abortActiveType,
            responseType,
            method
        } = params;

        const {
            baseUrl
        } = this;

        const that = this;

        let timer;

        if (type && (abortActiveType || this.abortActiveType)) {
            this.abortRequestType(type);
        }

        const headers: object = {
            'Content-Type': 'application/json; charset=UTF-8',
            ...this.headers,
            ...params.headers
        };

        const send = () => {
            const xhr: XMLHttpRequest = new XMLHttpRequest();
            const request = { type, xhr };

            xhr.open(method || 'GET', this.genUrl(params), true);
            xhr.responseType = typeof responseType === 'string' ? responseType : 'json';
            xhr.timeout = params.timeout || this.timeout;

            for (const header in headers) {
                xhr.setRequestHeader(header, headers[header]);
            }

            const finalError = (error: NcoreLinkError) => {

                if (params.onerror instanceof Function) {
                    params.onerror(error);
                }

                if (that.onerror instanceof Function) {
                    that.onerror(error);
                }

                this.removeRequest(request);
            };

            xhr.onreadystatechange = function () {
                if (xhr.readyState !== xhr.DONE) return;

                console.log(xhr.readyState);

                if (/^2.+/.test(String(xhr.status)) && params.onsuccess) {
                    params.onsuccess(xhr.response);
                } else {
                    finalError({
                        code: xhr.status,
                        status: xhr.statusText,
                        text: xhr.responseType === 'json' ? '' : xhr.responseText
                    });
                }
            };

            xhr.ontimeout = function () {

                if (params.ontimeout instanceof Function) {
                    params.ontimeout(send);
                }

                if (this.ontimeout instanceof Function) {
                    that.ontimeout(send);
                }
            }

            xhr.send(params.body);
            this.addRequest(request);
        }

        send();
    }

    private addRequest(request: NcoreLinkRequest): void {
        this.requests.push(request);
    }

    private abortRequests(): void {
        this.requests.forEach((request) => {
            request.xhr.abort();
        });
    }

    private abortRequestType(type: string) {
        this.requests.forEach((request) => {
            if (request.type === type) {
                request.xhr.abort();
            }
        });
    }

    private removeRequest(request: NcoreLinkRequest) {
        const index = this.requests.indexOf(request);
        this.requests.splice(index, 1);
    }

    private genUrl(params: NcoreLinkRequestParams): string {

        if (!params.url) return '';

        const {
            include,
            fields,
            offset,
            count,
            filters
        } = params;

        let url = (() => {
            
            if (/^http.+/.test(params.url)) {
                return params.url;
            }
            
            const divider = params.url[0] === '/' ? '' : '/';
            
            return trim(this.baseUrl) + divider + params.url;
        })();

        let queryParams: string[] = [];

        if (include && include.length) {
            queryParams.push('@include=' + include.join(';'));
        }

        if (fields && fields.length) {
            queryParams.push('@fields=' + fields.join(';'));
        }

        if (offset || offset === 0) {
            queryParams.push('@offset=' + offset);
        }

        if (count) {
            queryParams.push('@count=' + count);
        }

        if (filters && filters.length) {
            queryParams = queryParams.concat(filters);
            console.log(filters);
        }

        if (queryParams.length) {
            url += '?' + queryParams.join('&');
        }

        return url;
    }
}

const ncoreLinkInstance = new NcoreLink();

export default ncoreLinkInstance;