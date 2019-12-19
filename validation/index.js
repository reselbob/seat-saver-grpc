const validateEnvVarsSync = ()=> {
 const errors = [];
 if(! process.env.MESSAGE_BROKER_HOST) errors.push("Missing EnvVar: MESSAGE_BROKER_HOST");
 if(! process.env.MONGODB_URL) errors.push("Missing EnvVar: MONGODB_URL");
 if(errors.length > 0) throw new Error(JSON.stringify(errors));
};

module.exports = {validateEnvVarsSync};