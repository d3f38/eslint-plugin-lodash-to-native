# eslint-plugin-lodash-to-native

ESLint плагин с правилом, которое находит использование функции `_.map`, например `_.map(collection, fn)`, и, если это возможно, предлагает заменить его на использование нативного `Array#map`.

## Установка

Для начала установите [ESLint](http://eslint.org):

```
$ npm i eslint --save-dev
```

Далее установите `eslint-plugin-lodash-to-native`:

```
$ npm install -S https://github.com/d3f38/eslint-plugin-lodash-to-native.git
```

## Использование

Добавьте `lodash-to-native` в раздел плагинов вашей конфигурации ` .eslintrc`. 

```json
{
    "plugins": [
        "lodash-to-native"
    ]
}
```


Затем настройте правила:

```json
{
    "rules": {
        "lodash-to-native/map": "warn"
    }
}
```

## Показ сообщений и исправления
При использовании **без** параметра `--fix` показывает сообщение: 
```Можно использовать нативный `Array#map` ```

При использовании c параметром `--fix` автоматически исправляет проблемы, о которых сообщает правило. Пример:

``` ```
```js
return _.map(collection, fn);
```
заменяется на:
```js
return (Array.isArray(collection)) ?
    collection.map(fn) :
    _.map(collection, fn);
```





