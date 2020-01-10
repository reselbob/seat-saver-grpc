const Validator = require('jsonschema').Validator;
const validator = new Validator();
const validateCustomer = function(customerToValidate
) {
return validator.validate(customerToValidate, 'customer')
};
const validateSeat = function(seatToValidate
) {
return validator.validate(seatToValidate, 'seat')
};
const validateVenue = function(venueToValidate
) {
return validator.validate(venueToValidate, 'venue')
};
const validateAuthentication = function(authenticationToValidate
) {
return validator.validate(authenticationToValidate, 'authentication')
};
const validateVenueRequest = function(venuerequestToValidate
) {
return validator.validate(venuerequestToValidate, 'venuerequest')
};
const validateSeatRequest = function(seatrequestToValidate
) {
return validator.validate(seatrequestToValidate, 'seatrequest')
};
const validateSeatStatusRequest = function(seatstatusrequestToValidate
) {
return validator.validate(seatstatusrequestToValidate, 'seatstatusrequest')
};
const validatePingRequest = function(pingrequestToValidate
) {
return validator.validate(pingrequestToValidate, 'pingrequest')
};
const validatePingResponse = function(pingresponseToValidate
) {
return validator.validate(pingresponseToValidate, 'pingresponse')
};
const validateVenuesResponse = function(venuesresponseToValidate
) {
return validator.validate(venuesresponseToValidate, 'venuesresponse')
};
const validateStatus = function(statusToValidate
) {
return validator.validate(statusToValidate, 'status')
};
module.exports = {validateCustomer,validateSeat,validateVenue,validateAuthentication,validateVenueRequest,validateSeatRequest,validateSeatStatusRequest,validatePingRequest,validatePingResponse,validateVenuesResponse,validateStatus}