const Validator = require('jsonschema').Validator;
const v = new Validator();

const validateEnvVarsSync = () => {
    const errors = [];
    if (!process.env.MONGODB_URL) errors.push("Missing EnvVar: MONGODB_URL");
    if (errors.length > 0) throw new Error(JSON.stringify(errors));
};

const getValidationFunctionSync = (objectName, schemaName, ) => {
    return new Function(objectName, `return validator.validate(${objectName}, \'${schemaName}\')`);
};


const getValidatorWithSchemaPopulated = (pathToJsonSchema) => {
    const obj = JSON.parse(fs.readFileSync(pathToJsonSchema, "utf8"));
    for (let prop in obj.definitions) {
        const instanceName = obj.definitions[prop].title.toLowerCase();
        v.addSchema(instanceName, `#/definitions/${prop}`);
    }
    return v;
};


const getValidationFunctionsSync = (pathToJsonSchema, validator) => {
    const obj = JSON.parse(fs.readFileSync(pathToJsonSchema, "utf8"));
    const functions = {};
    for (let prop in obj.definitions) {
        if (obj.definitions.hasOwnProperty(prop)) {
            const instanceName = obj.definitions[prop].title.toLowerCase();
            validator.addSchema(instanceName, `#/definitions/${prop}`);
            const functionName = 'validate' + prop.replace('seatsaver.', '');
            functions[functionName] = getValidationFunctionSync(`${instanceName}ToValidate`, instanceName)
        }
    }
    return functions
};

const generateValidationFunctionsJSSync = (jsonSchemaFileSpec, outputFileSpec) => {

    const fileSpec = jsonSchemaFileSpec;
    const validationFunctions = getValidatonFunctions(jsonSchemaFileSpec, v);

    fs.writeFileSync(outputFileSpec, 'const Validator = require(\'jsonschema\').Validator;\n');
    fs.appendFileSync(outputFileSpec, 'const validator = new Validator();\n');
    const exers = [];
    for (let func in validationFunctions) {

        exers.push(func);
        const str = `const ${func} = ${validationFunctions[func].toString()};`;
        //str.replace(' anonymous', '');
        fs.appendFileSync(fileSpec, str.replace(' anonymous', '') + "\n");
    }

    fs.appendFileSync(fileSpec, `module.exports = {${exers.toString()}}`);
};
const seatSchema = {
    "id": "/Seat",
    "type": "object",
    "properties": {
        "id": {"type": "string"},
        "number": {"type": "string"},
        "section": {"type": "string"},
        "status": {"type": "string"},
        "customer": {
         "oneOf": [
          {"type": "null"},
          {"$ref":"/Customer"}
         ]
        },
        "created": {"type": "string"},
        "changed": {"type": "string"},
    },
    "required": ["number", "section", "status"]
};

const validateSeatSync = (seat) => {
 v.addSchema(customerSchema, '/Customer');
 return v.validate(seat, seatSchema)
};

const customerSchema = {
    "id": "/Customer",
 "type": "object",
 "properties": {
  "id": {"type": "string"},
  "firstName": {"type": "string"},
  "lastName": {"type": "string"},
  "email": {"type": "string"},
  "created": {"type": "string"},
  "changed": {"type": "string"},
 },
 "required": ["firstName", "lastName", "email"]
};

const validateCustomerSync = (customer) => {
    return v.validate(customer, customerSchema)
};

const venueSchema = {
    "id": "/Venue",
    "type": "object",
    "properties": {
        "id": {"type": "string"},
        "name": {"type": "string"},
        "address": {"type": "string"},
        "city": {"type": "string"},
        "state_province": {"type": "string"},
        "postal_code": {"type": "string"},
        "country": {"type": "string"},
        "created": {"type": "string"},
        "changed": {"type": "string"},
        "seats": {
            "type": "array",
            "items": {"$ref": "/Seat"}
        }
    },
    "required": ["name", "address", "city", "state_province", "postal_code","seats"]
};

const validateVenueSync = (venue) => {
    v.addSchema(customerSchema, '/Customer');
    v.addSchema(seatSchema, '/Seat');
    return v.validate(venue, venueSchema)
};
module.exports = {validateEnvVarsSync, validateCustomerSync, validateSeatSync, validateVenueSync, getValidatorWithSchemaPopulated};