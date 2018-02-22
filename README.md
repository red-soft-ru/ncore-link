# Настройка глобальных параметров

Глобальные параметры применяются устанавливаются на этапе инициализации приложения

|Параметр|Тип|Назначение|
|--------|:-:|----------|
|baseUrl|string|Префикс адреса запроса|
|header|object|HTTP заголовки|
|abortActiveType|boolean|Применяется для проверки отсутствия дублирующих запросов с одинаковым типом. По умолчанию - true|
|timeout|number|Время ожидания ответа от сервера|
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
    success(data) {
        that.setUsers(data);
    },
    error(error) {
        snackbar({
            text: error.text,
            actionText: 'Повторить',
            action: send
        })
    },
    timeout(retry) {

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
|abortActiveType|Применяется для проверки отсутствия дублирующих запросов с одинаковым типом. По умолчанию - true|
|type|string|При активном параметре abortActiveType прерывает активный запрос в очереди с указанным в этом параметре типом|
|success|function|Функция, вызываемая при получении ответа от сервера с кодом 200|
|error|function|Функция, вызываемая при получении ошибки|
|timeout|function|Функция, вызываемая при принудительном завершении запроса по истечении времени. Вызывается с аргументом retry: () => void, для повторной отправки запроса.|
|include|string[]|Перечень значений параметра include для ncore API. Включает в ответ данные по связям|
|fields|string[]|Перечень значений параметра fields для ncore API. Перечень полей объекта, запрашиваемый от API|

# Формат ошибки NcoreLinkError

``` typescript
interface NcoreLinkError {
    code: number;
    status: string;
    text: string;  
}
```