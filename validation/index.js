const validateEnvVarsSync = ()=> {
 const errors = [];
 if(! process.env.MONGODB_URL) errors.push("Missing EnvVar: MONGODB_URL");
 if(errors.length > 0) throw new Error(JSON.stringify(errors));
};

module.exports = {validateEnvVarsSync};