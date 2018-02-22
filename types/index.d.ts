
import ncoreLinkInstance, { NcoreLink } from '../src/index';

declare global {
    interface Window { 
        ncoreLink: NcoreLink; 
    }
}

export interface NcoreLinkGlobalParams {
    baseUrl: string;
    headers?: { [key: string]: string };
    abortActiveType?: boolean;
    onerror?: (error: NcoreLinkError) => void;
    ontimeout?: (retry: () => void) => void;
    timeout?: number;
}

export interface NcoreLinkRequestParams {
    url: string;
    method?: string;
    responseType?: XMLHttpRequestResponseType;
    body?: any;
    headers?: { [key: string]: string };
    abortActiveType?: boolean;
    type?: string;
    timeout?: number;
    include?: string[];
    fields?: string[];
    onsuccess?: (data: any) => void;
    onerror?: (e: NcoreLinkError) => void;
    ontimeout?: (retry: () => void) => void;
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
