# eslint-plugin-map

description

## Installation

You'll first need to install [ESLint](http://eslint.org):

```
$ npm i eslint --save-dev
```

Next, install `eslint-plugin-map`:

```
$ npm install eslint-plugin-map --save-dev
```

**Note:** If you installed ESLint globally (using the `-g` flag) then you must also install `eslint-plugin-map` globally.

## Usage

Add `map` to the plugins section of your `.eslintrc` configuration file. You can omit the `eslint-plugin-` prefix:

```json
{
    "plugins": [
        "map"
    ]
}
```


Then configure the rules you want to use under the rules section.

```json
{
    "rules": {
        "map/rule-name": 2
    }
}
```

## Supported Rules

* Fill in provided rules here





