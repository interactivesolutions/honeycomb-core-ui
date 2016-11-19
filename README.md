# honeycomb-core-ui
HoneyComb coreui repository

Contains
- Formbuilder

# Formbuilder

Formbuilder is created to ease the job of backend developers.

```javascript
var config   = {
    "storageURL": "http://www.domain.com/admin/api/service-name",
    "availableLanguages":["en", "de"],
    "buttons": [{ "label": "Submit", "type": "submit", "attributes": { "class": "center-block" } }],
    "structure": [],
    "divID":"#form"
};

var form = HCService.FormManager.createForm (config);
```

Parameter | What it is used for |
--- | --- |
storageURL | URL of an API where the data should be parsed via AJAX call, if nothing is provided it is posting to SELF |
availableLanguages | When form have some fields which are multilanguage those language needed to be added here first |
buttons | If there is a need for form to have submit button as Login, additional clases or other attributes |
structure | Array of objects for each field |
divID | Location in HTML where form should be generated, if empty form will be added to body |

## General configuration for every single field.

These parameters are **required**

```javascript
{
  "type": "typeOfField",
  "fieldID": "fieldID",
  "label": "FieldLabel",
  "editType": 1,
  "required": 1,
  "requiredVisible": 1,
}
```
Parameter | What it is used for |
--- | --- |
type | Type of a field every field will have its own unique type (all types are described below) |
fieldID | ID of the field or value. Under which name it should be sent to backend |
label | Label of the field |
editType | Should field be allowed to be edited |
required | Is this field required |
requiredVisible | Should required be visible (*) |

## SingleLine
Simple single line with multilanguage support.

### Configuration and usage:
Goes into structure array of form configuration.

```javascript
{
  "type": "singleLine",
  "fieldID": "singleMultiLanguageLine",
  "label": "Single Line",
  "editType": 0,
  "required": 1,
  "requiredVisible": 1,

  "multiLanguage":true,
  "requiredLanguages":["lt", "en"],
  "maxLength":255
}
```

Parameter | What it is used for |
--- | --- |
multiLanguage | Does this field support multi language data input |
requiredLanguages | If some languages are strictly required here must be it's list |
maxLength | Maximum input length for a single line |