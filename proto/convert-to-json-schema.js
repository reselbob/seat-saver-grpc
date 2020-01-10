const Validator = require('jsonschema').Validator;
const v = new Validator();
const compile = require('protobuf-jsonschema');
const all = compile('seatsaver.proto');
const fs = require('fs');
const testHelpers = require('../test/test-helpers');

const convertToJsonFile = () => {
    fs.writeFileSync("schema.json", JSON.stringify(all, null, 4));
    console.log(JSON.stringify(all));
};

const getValidationFunction = (objectName, schemaName, ) => {
    return new Function(objectName, `return validator.validate(${objectName}, \'${schemaName}\')`);
};

const populateValidatorWithSchema = (pathToJsonSchema, validator) => {
    const obj = JSON.parse(fs.readFileSync(pathToJsonSchema, "utf8"));
    for (let prop in obj.definitions) {
        const instanceName = obj.definitions[prop].title.toLowerCase();
        validator.addSchema(instanceName, `#/definitions/${prop}`);
    }
    return validator;
};

const getValidationFunctionsWithValidatorSync = (pathToJsonSchema, validator) => {
    const obj = JSON.parse(fs.readFileSync(pathToJsonSchema, "utf8"));
    const functions = {};
    for (let prop in obj.definitions) {
        if (obj.definitions.hasOwnProperty(prop)) {
            const instanceName = obj.definitions[prop].title.toLowerCase();
            validator.addSchema(instanceName, `#/definitions/${prop}`);
            const functionName = 'validate' + prop.replace('seatsaver.', '');
            functions[functionName] = getValidationFunction(`${instanceName}ToValidate`, instanceName)
        }
    }
    return {functions, validator}
};

const generateValidationFunctionsJS = () => {
    const fileSpec = './validationFunctions.js'
    const validationFunctions = getValidatonFunctions("schema.json", v);

    fs.writeFileSync(fileSpec, 'const Validator = require(\'jsonschema\').Validator;\n');
    fs.appendFileSync(fileSpec, 'const validator = new Validator();\n');
    const exers = [];
    for (let func in validationFunctions) {

        exers.push(func);
        const str = `const ${func} = ${validationFunctions[func].toString()};`;
        //str.replace(' anonymous', '');
        fs.appendFileSync(fileSpec, str.replace(' anonymous', '') + "\n");
    }

    fs.appendFileSync(fileSpec, `module.exports = {${exers.toString()}}`);
};


generateValidationFunctionsJS();

module.exports = {getValidationFunctionsWithValidatorSync}

