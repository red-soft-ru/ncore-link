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

  onerror!: (error: NcoreLinkError, xhr: XMLHttpRequest) => void;
  ontimeout!: (retry: () => void, xhr: XMLHttpRequest) => void;

  setParams(params: NcoreLinkGlobalParams) {

    for (const param in params) {
      this[param] = params[param];
    }
  }

  /*
   * Promise версия request
   */
  async async(params: NcoreLinkRequestParams) {
    return new Promise<[any, any, any]>((resolve, reject) => {
      this.request({
        ...params,
        onsuccess(data, xhr) {
          resolve([null, data, xhr]);
        },
        onerror(err, xhr) {
          resolve([err, null, xhr]);
        },
        ontimeout(err, xhr) {
          resolve([err, null, xhr]);
        }
      })
    })
  }

  get(params) {
    return this.async({
      ...params,
      method: 'GET'
    })
  }

  post(params) {
    return this.async({
      ...params,
      method: 'POST'
    })
  }

  put(params) {
    return this.async({
      ...params,
      method: 'PUT'
    })
  }

  request(params: NcoreLinkRequestParams) {

    if (!params.url) {
      console.error('Отсутвует URL запроса');
      return;
    }

    const {
      type,
      responseType,
      method
    } = params;

    const {
      baseUrl
    } = this;

    const that = this;
    const abortActiveType = (() => {
      if (params.abortActiveType === undefined) {
        return this.abortActiveType;
      } else {
        return params.abortActiveType;
      }
    })();

    let timer;

    if (type && abortActiveType) {
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

      const finalError = (error: NcoreLinkError, xhr: XMLHttpRequest) => {

        if (params.onerror instanceof Function) {
          params.onerror(error, xhr);
        }

        if (that.onerror instanceof Function) {
          that.onerror(error, xhr);
        }

        this.removeRequest(request);
      };

      xhr.onreadystatechange = function () {
        if (xhr.readyState !== xhr.DONE) return;

        if (/^2.+/.test(String(xhr.status)) && params.onsuccess) {
          params.onsuccess(xhr.response, xhr);
        } else {
          finalError({
            code: xhr.status,
            status: xhr.statusText,
            text: xhr.responseType === 'json' ? '' : xhr.responseText
          }, xhr);
        }
      };

      xhr.ontimeout = function () {

        if (params.ontimeout instanceof Function) {
          params.ontimeout(send, xhr);
        }

        if (that.ontimeout instanceof Function) {
          that.ontimeout(send, xhr);
        }
      }

      const ensureBody = typeof params.body === 'string' ? params.body : JSON.stringify(params.body);

      xhr.send(ensureBody);
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

  public abortRequestType(type: string | string[]) {
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

    if (filters) {

      if (filters instanceof Array) {
        queryParams = queryParams.concat(filters);
      } else {
        for (let fname in filters) {
          const fval = `${fname}=${filters[fname]}`;
          queryParams.push(fval);
        }
      }
    }

    if (queryParams.length) {
      const pfx = url.indexOf('?') < 0 ? '?' : '&';
      url += pfx + queryParams.join('&');
    }

    return encodeURI(url);
  }
}

const ncoreLinkInstance = new NcoreLink();

export default ncoreLinkInstance;
