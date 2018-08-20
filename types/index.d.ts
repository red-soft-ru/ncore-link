
import ncoreLinkInstance, { NcoreLink } from '../src/index';

declare global {
    interface Window {
        ncoreLink: NcoreLink;
    }
}

export interface NcoreLinkGlobalParams {
    baseUrl?: string;
    headers?: { [key: string]: string };
    abortRequestType?: (params: string | string[]) => void;
    abortActiveType?: boolean;
    onerror?: (error: NcoreLinkError) => void;
    ontimeout?: (retry: () => void) => void;
    timeout?: number;
}

export interface NcoreLinkRequestParams {
    url?: string;
    method?: string;
    responseType?: XMLHttpRequestResponseType;
    body?: any;
    headers?: { [key: string]: string };
    abortActiveType?: boolean;
    type?: string;
    timeout?: number;
    include?: string[];
    offset?: number;
    filters?: string[] | Record<string, string | number> | undefined;
    count?: number;
    debug?: boolean;
    fields?: string[];
    onsuccess?: (data: any, xhr: XMLHttpRequest) => void;
    onerror?: (e: NcoreLinkError, xhr: XMLHttpRequest) => void;
    ontimeout?: (retry: () => void, xhr: XMLHttpRequest) => void;
}

export interface NcoreLinkError {
    code: number;
    status: string;
    text: string;
}

export interface NcoreLinkRequest {
    xhr: XMLHttpRequest;
    type?: string;
}

export default ncoreLinkInstance;
