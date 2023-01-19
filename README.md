# Настройка глобальных параметров

Глобальные параметры применяются устанавливаются на этапе инициализации приложения

|Параметр|Тип|Назначение|
|--------|:-:|----------|
|baseUrl|string|Префикс адреса запроса|
|headers|object|HTTP заголовки|
|abortActiveType|boolean|Применяется для проверки отсутствия дублирующих запросов с одинаковым типом. По умолчанию - true|
|timeout|number|Время ожидания ответа от сервера|
|withCredentials|boolean|Оправка авторизационных данных (в частности cookie) при CORS. По умолчанию - false|
|onerror|function|Функция, вызываемая при ошибке в каждом запросе|
|ontimeout|function|Функция, вызываемая при принудительном завершении запроса по истечении времени|

``` typescript
import ncoreLink from 'ncore-link';

ncoreLink.setParams({
    baseUrl: 'http://server:8080/api/v1',
    abortActiveType: false,
    headers: {
        'Access-Control-Allow-Origin': '*',
        'Authorization': 'bearer !^(#)@&*#YI!@HJ'
    },
    onerror(error: NcoreLinkError) {
        console.log('Ошибка запроса: ', error.text);
    },
    ontimeout() {
        console.log('Превышение времени ожидания ответа от сервера');
    },
})
```

# Отправка запроса

``` javascript
import ncoreLink from 'ncore-link';

ncoreLink.request({
    url: 'users',
    method: 'GET',
    onsuccess(data) {
        that.setUsers(data);
    },
    onerror(error: NcoreLinkError) {
        console.error(error.text);
    },
    ontimeout(retry) {
        snackbar({
            text: 'Превышено время ожидания ответа от сервера',
            actionText: 'Повторить',
            action: retry
        });
    }
});
```

# Параметры запроса

|Параметр|Тип|Назначение|
|--------|:-:|----------|
|url|string|Суффикс запроса. Если указать http://..., то значение baseUrl будет проигнорировано|
|method|string|Код HTTP метода - GET, POST, PUT, DELETE. По умолчанию - GET|
|responseType|string|Тип ответа от сервера. json, text или ''|
|body|any|Тело запроса|
|header|object|Перечень HTTP заголовков|
|filters|object string[]|Набор параметров для формирования query параметров строки запроса|
|abortActiveType|boolean|Применяется для проверки отсутствия дублирующих запросов с одинаковым типом. По умолчанию - true|
|type|string|При активном параметре abortActiveType прерывает активный запрос в очереди с указанным в этом параметре типом|
|success|function|Функция, вызываемая при получении ответа от сервера с кодом 200|
|error|function|Функция, вызываемая при получении ошибки|
|timeout|function|Функция, вызываемая при принудительном завершении запроса по истечении времени. Вызывается с аргументом retry: () => void, для повторной отправки запроса.|
|include|string[]|Перечень значений параметра include для ncore API. Включает в ответ данные по связям|
|fields|string[]|Перечень значений параметра fields для ncore API. Перечень полей объекта, запрашиваемый от API|

# Типы данных

## NcoreLinkError

``` typescript
interface NcoreLinkError {
    code: number;
    status: string;
    text: string;  
}
```

## NcoreLinkGlobalParams

``` typescript
export interface NcoreLinkGlobalParams {
    baseUrl: string;
    headers?: { [key: string]: string };
    abortActiveType?: boolean;
    onerror?: (error: NcoreLinkError) => void;
    ontimeout?: (retry: () => void) => void;
    timeout?: number;
    withCredentials?: boolean;
}
```

## NcoreLinkRequestParams

``` typescript
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
```