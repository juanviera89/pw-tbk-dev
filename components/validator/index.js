class classValidator {
    constructor(val, name, encoded, serialized) {
        this.val = val;
        this.error = false;
        this.message = '';
        this.name = name
        this.encoded = false || encoded;
        this.serialized = false || serialized;
    }
    setError(msg, b = true) {
        /* console.log('====================================');
        console.log('set error', msg, b);
        console.log('===================================='); */
        this.error = this.error || b
        this.message += msg
    }
    get isString() {
        try {
            return !this.isUndefined && this.val.toLowerCase != undefined
        } catch (error) {
            return false
        }
    }
    get isNumber() {
        try {
            return !this.isUndefined && !isNaN(this.val) && !Array.isArray(this.val)
        } catch (error) {
            return false
        }
    }
    get isObject() {
        try {
            return !this.isUndefined && this.val.hasOwnProperty && !this.isString && !this.isNumber && !this.isArray && !this.isDate && !this.isBoolean
        } catch (error) {
            return false
        }
    }
    get isArray() {
        try {
            return !this.isUndefined && Array.isArray(this.val)
        } catch (error) {
            return false
        }
    }
    get isBoolean() {
        try {
            return !this.isUndefined && (`${this.val}` === 'false' && this.val + 1 == 1) || (`${this.val}` === 'true' && this.val + 1 == 2)
        } catch (error) {
            return false
        }
    }
    get isDate() {
        try {
            return !this.isUndefined && this.val.getDate != undefined
        } catch (error) {
            return false
        }
    }
    get isNull() {
        return this.val == null
    }
    get isUndefined() {
        return this.val == undefined
    }
    get ValidString() {
        if (this.isUndefined) return undefined
        if (this.isNull) return undefined
        if (this.isString) return this.encoded ? decodeURIComponent(this.val) : `${this.val}`
        if (this.isDate) return this.val.toISOString()
        if (this.isBoolean || this.isNumber) return `${this.val}`
        return undefined
    }
    get ValidNumber() {
        if (this.isUndefined) return undefined
        if (this.isNull) return undefined
        if (this.isString) {
            let n = `${this.val}`
            if (this.encoded) {
                try {
                    n = decodeURIComponent(n)
                } catch (error) {
                    return undefined
                }
            }
            const d = (1.1).toString().split('')[1]
            const p = (n.match(/\./g) || []).length
            const c = (n.match(/\,/g) || []).length
            if (p > 1 || c > 1) return undefined
            if (p && c) return undefined
            n = n.replace(',', d).replace('.', d);
            if (isNaN(n)) return undefined
            return Number(n)
        }
        if (this.isDate) return this.val.getTime()
        if (this.isBoolean || this.isNumber) return Number(this.val)
        return undefined
    }
    get ValidObject() {
        if (this.isUndefined) return undefined
        if (this.isNull) return undefined
        if (this.isObject) return this.val
        if (this.isString) {
            let obj = `${this.val}`;
            if (this.serialized) {
                if (this.encoded) {
                    try {
                        obj = decodeURIComponent(obj)
                    } catch (error) {
                        return undefined
                    }
                }
                try {
                    obj = JSON.parse(obj)
                    if (Array.isArray(obj)) return undefined
                    return obj
                } catch (error) {
                    // last statement will return undefined
                }
            }
        }
        return undefined
    }
    get ValidArray() {
        if (this.isUndefined) return undefined
        if (this.isNull) return undefined
        if (this.isArray) return this.val
        if (this.isString) {
            let arr = `${this.val}`;
            if (this.serialized) {
                if (this.encoded) {
                    try {
                        arr = decodeURIComponent(arr)
                    } catch (error) {
                        return undefined
                    }
                }
                try {
                    arr = JSON.parse(arr)
                    if (Array.isArray(arr)) return arr
                    return undefined
                } catch (error) {
                    // last statement will return undefined
                }
            }
        }
        return undefined
    }
    get ValidBoolean() {
        if (this.isUndefined) return undefined
        if (this.isNull) return undefined
        if (this.isBoolean) return Boolean(this.val)
        if (this.isString) return ['true', '1'].includes(this.val) ? Boolean(this.val) : [ 'false', '0'].includes(this.val) ? false : undefined
        if (this.isNumber) return -1 <= this.val && 1 >= this.val ? Boolean(this.val) : undefined
        return undefined
    }
    get ValidDate() {
        if (this.isUndefined) return undefined
        if (this.isNull) return undefined
        if (this.isDate) return this.val
        if (this.isNumber || this.isString) {
            let d = this.val
            if (this.encoded) {
                try {
                    d = decodeURIComponent(d)
                } catch (error) {
                    return undefined
                }
            }
            d = new Date(d)
            if (d.toString() != "Invalid Date") {
                return d
            }
        }
        return undefined
    }
    required(b) {
        if (this.valid) {
            if (this.val == undefined) {
                this.setError(`Missing param: ${this.name}. `, b)
            }
        } else {
            this.setError(b ? `${this.name} is not a valid value but is required. ` : '', b)
        }
        return this
    }
}

class stringValidator extends classValidator {
    constructor(val, name, schema, encoded, serialized) {
        super(val, name, encoded, serialized);
        this.valid = false;
        this.schema = schema;
        this.validate();
    }
    validate() {
        if (!this.isNull && !this.isUndefined) {
            if (this.isObject || this.isArray || this.isDate) {
                this.val = undefined
                this.valid = false
                this.setError(`${this.name} is not a valid String. `, false || (this.schema.hasOwnProperty('required') && this.schema['required']))
                return this
            }
            this.val = this.ValidString
            this.valid = this.isString
            this.required(false || (this.schema.hasOwnProperty('required') && this.schema['required']))
            for (const fx in this.schema) {
                if (this[fx]) {
                    this[fx](this.schema[fx])
                }
            }
        } else {
            this.val = this.schema['required'] ? undefined : this.ValidString
            this.setError(`Missing param: ${this.name}. `, false || (this.schema.hasOwnProperty('required') && this.schema['required']))
        }
        return this;
    }
    minLength(n) {
        const l = (new classValidator(n, 'minLength')).ValidNumber
        if (this.valid && !this.error && l != undefined) {
            if (!((this.val.split('')).length >= l)) {
                this.setError(`${this.name} Value doesn't match the required minimun length. ${l}`)
            }
        } else if (l == undefined) {
            throw new Error(`Bad schema validation input @minLength for ${this.name}`)
        }
        return this
    }
    maxLength(n) {
        const l = (new classValidator(n, 'maxLength')).ValidNumber
        if (this.valid && !this.error && l != undefined) {
            if (!((this.val.split('')).length <= l)) {
                this.setError(`${this.name} Value doesn't match the required maximun length. ${l}`)
            }
        } else if (l == undefined) {
            throw new Error(`Bad schema validation input @maxLength for ${this.name}`)
        }
        return this
    }
}

class numberValidator extends classValidator {
    constructor(val, name, schema, encoded, serialized) {
        super(val, name, encoded, serialized);
        this.valid = false;
        this.schema = schema;
        this.validate();
    }
    validate() {
        if (!this.isNull && !this.isUndefined) {
            if (this.isObject || this.isArray || this.isDate) {
                this.val = undefined
                this.valid = false
                this.setError(`${this.name} is not a valid Number. `, false || (this.schema.hasOwnProperty('required') && this.schema['required']))
                return this
            }
            this.val = this.ValidNumber
            this.valid = this.isNumber
            this.required(false || (this.schema.hasOwnProperty('required') && this.schema['required']))
            for (const fx in this.schema) {
                if (this[fx]) {
                    this[fx](this.schema[fx])
                }
            }
        } else {
            this.val = this.schema['required'] ? undefined : this.ValidNumber
            this.setError(`Missing param: ${this.name}. `, false || (this.schema.hasOwnProperty('required') && this.schema['required']))
        }
        return this;
    }
    min(n) {
        const m = (new classValidator(n, 'num')).ValidNumber
        if (this.valid && !this.error && m != undefined) {
            if (!(this.val >= m)) {
                this.setError(`${this.name} Value doesn't match the required minimun value. `)
            }
        } else if (m == undefined) {
            throw new Error(`Bad schema validation input @max for ${this.name}`)
        }
        return this
    }
    max(n) {
        const m = (new classValidator(n, 'num')).ValidNumber
        if (this.valid && !this.error && m != undefined) {
            if (!(this.val <= m)) {
                this.setError(`${this.name} Value doesn't match the required maximun value. `)
            }
        } else if (m == undefined) {
            throw new Error(`Bad schema validation input @max for ${this.name}`)
        }
        return this
    }
    integer(b) {
        const i = (new classValidator(b, 'bool')).ValidBoolean
        if (i == undefined) throw new Error(`Bad schema validation input @integer for ${this.name}`)
        if (!i) return this
        const d = (1.1).toString().split('')[1];
        if (this.val.toString().indexOf(d) >= 0) {
            this.setError(`${this.name} Value doesn't match the required format. `)
        }
        return this
    }
}

class dateValidator extends classValidator {
    constructor(val, name, schema, encoded, serialized) {
        super(val, name, encoded, serialized);
        this.valid = false;
        this.schema = schema;
        this.validate();
    }
    validate() {
        if (!this.isNull && !this.isUndefined) {
            if (this.isObject || this.isArray || this.isBoolean) {
                this.val = undefined
                this.valid = false
                this.setError(`${this.name} is not a valid Date. `, false || (this.schema.hasOwnProperty('required') && this.schema['required']))
                return this
            }
            this.val = this.ValidDate
            this.valid = this.isDate
            this.required(false || (this.schema.hasOwnProperty('required') && this.schema['required']))
            for (const fx in this.schema) {
                if (this[fx]) {
                    this[fx](this.schema[fx])
                }
            }
        } else {
            this.val = this.schema['required'] ? undefined : this.ValidDate
            this.setError(`Missing param: ${this.name}. `, false || (this.schema.hasOwnProperty('required') && this.schema['required']))
        }
        return this;
    }
    min(n) {
        const m = (new classValidator(n, 'date')).ValidDate;
        if (this.valid && !this.error && m != undefined) {
            if (!(this.val >= m)) {
                this.setError(`${this.name} Value doesn't match the required minimun value. `)
            }
        } else if (m == undefined) {
            throw new Error(`Bad schema validation input @min for ${this.name}`)
        }
        return this
    }
    max(n) {
        const m = (new classValidator(n, 'date')).ValidDate;
        if (this.valid && !this.error && m != undefined) {
            if (!(this.val <= m)) {
                this.setError(`${this.name} Value doesn't match the required maximun value. `)
            }
        } else if (m == undefined) {
            throw new Error(`Bad schema validation input @max for ${this.name}`)
        }
        return this
    }
}

class booleanValidator extends classValidator {
    constructor(val, name, schema, encoded, serialized) {
        super(val, name, encoded, serialized);
        this.valid = false;
        this.schema = schema;
        this.validate();
    }
    validate() {
        if (!this.isNull && !this.isUndefined) {
            if (this.isObject || this.isArray) {
                this.val = undefined
                this.valid = false
                this.setError(`${this.name} is not a valid Boolean. `, false || (this.schema.hasOwnProperty('required') && this.schema['required']))
                return this
            }
            this.val = this.ValidBoolean
            this.valid = this.isBoolean
            this.required(false || (this.schema.hasOwnProperty('required') && this.schema['required']))
            for (const fx in this.schema) {
                if (this[fx]) {
                    this[fx](this.schema[fx])
                }
            }
        } else {
            this.val = this.schema['required'] ? undefined : this.ValidDate
            this.setError(`Missing param: ${this.name}. `, false || (this.schema.hasOwnProperty('required') && this.schema['required']))
        }
        return this;
    }
}

class arrayValidator extends classValidator {
    constructor(val, name, schema, encoded, serialized) {
        super(val, name, encoded, serialized);
        this.valid = false;
        this.schema = schema;
        this.validate();
    }
    validate() {
        if (!this.isNull && !this.isUndefined) {
            if (this.isObject || this.isNumber || this.isBoolean || this.isDate) {
                this.val = undefined
                this.valid = false
                this.setError(`${this.name} is not a valid Array. `, false || (this.schema.hasOwnProperty('required') && this.schema['required']))
                return this
            }
            this.val = this.ValidArray
            this.valid = this.isArray
            this.required(false || (this.schema.hasOwnProperty('required') && this.schema['required']))
            for (const fx in this.schema) {
                if (this[fx]) {
                    this[fx](this.schema[fx])
                } else if (fx == 'items') {
                    const it = new classValidator(this.schema[fx])
                    if (it.isString) {
                        // TODO: assign valid value to items
                        let validItems = true
                        //const type = it.ValidString.split('').map((c, i) => i == 0 ? c.toUpperCase() : c.toLowerCase()).join('')
                        const type = it.ValidString.toLowerCase();
                        if (!operators.hasOwnProperty(type)) {
                            throw new Error(`Unable to validate ${type.ValidString} type. Please specify one of the follows: ${Object.keys(operators)}`)
                        }

                        for (let item of this.val) {
                            //validItems = validItems && (new classValidator(item, 'item'))[`is${type}`]
                            const validatedItem = new operators[type](item, 'item', {})
                            validItems = validItems && validatedItem.valid
                            if (!validItems) {
                                this.setError(`Items in array ${this.name} doesn't match specified type. `)
                                break
                            }
                            item = validatedItem.val
                        }
                    } else if (it.isArray) {
                        for (const typeItem of it.ValidArray) {
                            if (!((new stringValidator(typeItem, 'type', {})).valid)) {
                                throw new Error(`${this.name} possible types inputs at array item type validator must be a string value. `)
                            }
                        }
                        let validItems = true
                        //const validTypes = it.ValidArray.map(t => t.split('').map((c, i) => i == 0 ? c.toUpperCase() : c.toLowerCase()).join(''))
                        const validTypes = it.ValidArray.map(t => t.toLowerCase())
                        for (let item of this.val) {
                            let tempValid = false;
                            for (const typeItem of validTypes) {
                                //tempValid = tempValid || (new classValidator(item, 'item'))[`is${typeItem}`]
                                const validatedItem = new operators[typeItem](item, 'item', {})
                                tempValid = tempValid || validatedItem.valid
                                if (validatedItem.valid) item = validatedItem.val
                            }
                            validItems = validItems && tempValid
                            if (!validItems) {
                                this.setError(`Items in array ${this.name} doesn't match specified types. `)
                                break
                            }
                        }
                    } else if (it.isObject) {
                        let validItems = false;
                        for (const type in it.ValidObject) {
                            const validType = type.toLowerCase();
                            if (!operators.hasOwnProperty(validType)) {
                                throw new Error(`Invalid type validator at array validator input in ${this.name}`)
                            }
                            let tempValid = true;
                            for (let item of this.val) {
                                const validItem = new operators[validType](item, 'item', it.ValidObject[type])
                                tempValid = tempValid && !validItem.error && validItem.valid
                                if (validItem.valid) item = validItem.val
                                if (!tempValid) {
                                    this.setError(`Items in array ${this.name} doesn't match specified type. `)
                                    break
                                }
                            }
                            if (tempValid) {
                                validItems = true;
                                break
                            }
                        }
                        if (!validItems) {
                            this.setError(`Items in array ${this.name} doesn't match specified types. `)
                            break
                        }
                    } else {
                        throw new Error(`Invalid type validator at array validator input for items in ${this.name}`)
                    }
                }
            }
        } else {
            this.val = this.schema['required'] ? undefined : this.ValidDate
            this.setError(`Missing param: ${this.name}. `, false || (this.schema.hasOwnProperty('required') && this.schema['required']))
        }
        return this;
    }
    minLength(n) {
        const l = (new classValidator(n, 'array')).ValidNumber
        if (this.valid && !this.error && l != undefined) {
            if (!(this.val.length >= l)) {
                this.setError(`${this.name} Value doesn't match the required minimun length. `)
            }
        } else if (l == undefined) {
            throw new Error(`Bad schema validation input @minLength for ${this.name}`)
        }
        return this
    }
    maxLength(n) {
        const l = (new classValidator(n, 'array')).ValidNumber
        if (this.valid && !this.error && l != undefined) {
            if (!(this.val.length <= l)) {
                this.setError(`${this.name} Value doesn't match the required maximun length. `)
            }
        } else if (l == undefined) {
            throw new Error(`Bad schema validation input @maxLength for ${this.name}`)
        }
        return this
    }
}

class objectValidator extends classValidator {
    constructor(val, name, schema, encoded, serialized) {
        super(val, name, encoded, serialized);
        this.valid = false;
        this.schema = schema;
        this.validate();
    }
    validate() {
        if (!this.isNull && !this.isUndefined) {
            if (this.isNumber || this.isArray || this.isDate || this.isBoolean) {
                this.val = undefined
                this.valid = false
                this.setError(`${this.name} is not a valid Object. `, false || (this.schema.hasOwnProperty('required') && this.schema['required']))
                return this
            }
            this.val = this.ValidObject
            this.valid = this.isObject
            this.required(false || (this.schema.hasOwnProperty('required') && this.schema['required']))
            for (const fx in this.schema) {
                if (this[fx]) {
                    this[fx](this.schema[fx])
                }
            }
        } else {
            this.val = this.schema['required'] ? undefined : this.ValidDate
            this.setError(`Missing param: ${this.name}. `, false || (this.schema.hasOwnProperty('required') && this.schema['required']))
        }
        return this;
    }
    properties(objSchema) {
        if (!this.valid || this.error) {
            return this
        }
        const validObjSchema = new classValidator(objSchema, 'objSchema');
        if (!validObjSchema.isObject) {
            throw new Error(`Bad properties specification in ${name} schema. Properties value must be a valid object`)
        }
        for (const key in this.val) {
            if (validObjSchema.ValidObject.hasOwnProperty(key)) {
                const keyType = new classValidator(validObjSchema.ValidObject[key], 'keyType');
                if (keyType.isObject) {
                    if (!keyType.ValidObject.hasOwnProperty('type')) {
                        throw new Error(`Bad properties specification in ${name} schema for '${key}'. Properties with object format schema must have a 'type' specification `)
                    }
                    if (!Object.keys(operators).includes(keyType.ValidObject.type)) {
                        throw new Error(`Bad property type specification in ${name} schema for '${key}'. ${keyType.ValidObject.type} is not a valid type validation `)
                    }
                    const validatedProperty = new operators[keyType.ValidObject.type](this.val[key], key, keyType.ValidObject)
                    if (!validatedProperty.valid) {
                        this.setError(`Porperty '${key}' in '${this.name}' doesn't match the specified schema`)
                        break
                    }
                    if (validatedProperty.error) {
                        this.setError(`Porperty '${key}' in '${this.name}' doesn't match the specified schema`)
                        break
                    }
                    this.val[key] = validatedProperty.val
                } else if (keyType.isString) {
                    if (!Object.keys(operators).includes(keyType.ValidString)) {
                        throw new Error(`Bad property type specification in ${name} schema for '${key}'. ${keyType.ValidString} is not a valid type validation `)
                    }
                    const validatedProperty = new operators[keyType.ValidString](this.val[key], key, {})
                    if (!validatedProperty.valid) {
                        this.setError(`Porperty '${key}' in '${this.name}' doesn't match the specified schema`)
                        break
                    }
                    this.val[key] = validatedProperty.val
                } else {
                    throw new Error(`Bad properties specification in ${name} schema for '${key}'. Properties value must be a valid object or string`)
                }
            }
        }
        return this
    }
}
const operators = {
    string: stringValidator,
    number: numberValidator,
    date: dateValidator,
    boolean: booleanValidator,
    array: arrayValidator,
    object: objectValidator
}

const validate = (values, schema, schemaType, options = {}) => {
    const st = schemaType
    const schemaTypes = ['body', 'headers', 'query', 'parameters', 'inherited'];
    if (!schemaTypes.includes(st)) {
        throw new Error(`Invalid schema type specified: ${SchemaType} `);
    }
    let { encoded, serialized } = options
    const validValues = (new classValidator(values, 'values')), validSchema = (new classValidator(schema, 'schema'));
    encoded = encoded || !['body', 'inherited'].includes(schemaType.toLowerCase());
    serialized = serialized || !['body', 'inherited'].includes(schemaType.toLowerCase());
    if (!validValues.ValidObject) {
        const type = validValues.isString ? 'String' :
            validValues.isNumber ? 'number' :
                validValues.isBoolean ? 'Boolean' :
                    validValues.isDate ? 'Date' :
                        validValues.isArray ? 'Array' :
                            validValues.isNull ? 'Null' : 'undefined';
        throw new Error(`Valid object spected as value, but got: ${type}`);
    }
    if (!validSchema.ValidObject) {
        const type = validSchema.isString ? 'String' :
            validSchema.isNumber ? 'number' :
                validSchema.isBoolean ? 'Boolean' :
                    validSchema.isDate ? 'Date' :
                        validSchema.isArray ? 'Array' :
                            validSchema.isNull ? 'Null' : 'undefined';
        throw new Error(`Valid object spected as schema, but got: ${type}`);
    }
    const valid = {}, validInput = {};
    let error = false;
    let message = ''
    /* console.log('==================================>>');
    console.log(validValues.ValidObject, validSchema.ValidObject);
    console.log('===================================='); */
    for (const key in validSchema.ValidObject) {
        const type = new classValidator(validSchema.ValidObject[key], 'validSchemaKey')
        /* console.log(key, type, type.ValidString);
        console.log('==================================<<'); */
        let valueSchema;
        if (type.isString) {
            if (!operators.hasOwnProperty(type.ValidString)) {
                throw new Error(`Unable to validate ${type.ValidString} type. Please specify one of the follows: ${Object.keys(operators)}`)
            }
            const validatedValue = new operators[type.ValidString](validValues.ValidObject[key], key, {}, encoded, serialized);
            error = validatedValue.error || error
            message = `${message}. ${validatedValue.message}`;
            valid[key] = validatedValue.valid;
            validInput[key] = validatedValue.val;
        } else if (type.isObject) {
            if (!type.ValidObject.hasOwnProperty('type')) {
                throw new Error(`Missing type value in schema validation for ${key}`)
            }
            const objType = new classValidator(type.ValidObject['type'], 'ValidObjectType')
            if (!objType.isString) {
                throw new Error(`Invalid input at type value in object validation format for ${key}`)
            }
            const validatedValue = new operators[objType.ValidString](validValues.ValidObject[key], key, type.ValidObject, encoded, serialized);
            error = validatedValue.error || error
            message = `${message}. ${validatedValue.message}`;
            valid[key] = validatedValue.valid;
            validInput[key] = validatedValue.val;
        } else {
            throw new Error(`Bad input at type validation schema for ${key} `)
        }
        if (error) { break }
    }
    let isValid = true;
    for (const key in valid) {
        isValid = isValid && valid[key]
    }
    return { validInput, valid : isValid, error, message  };
}


module.exports = {
    classValidator,
    stringValidator,
    numberValidator,
    dateValidator,
    booleanValidator,
    arrayValidator,
    objectValidator,
    operators,
    validate
}