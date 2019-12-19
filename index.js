const grpc = require('grpc');
const protoLoader = require('@grpc/proto-loader');
const {validateEnvVarsSync} = require('./validation');
const {seedVenues} = require('./dataSeeding');
const faker = require('faker');


const PROTO_PATH = __dirname + '/proto/seatsaver.proto';
const PORT = process.env.PORT || 50051;

const packageDefinition = protoLoader.loadSync(
    PROTO_PATH,
    {keepCase: true,
        longs: String,
        enums: String,
        defaults: true,
        oneofs: true
    });
//const seatsaver_proto = grpc.loadPackageDefinition(packageDefinition).seatsaver;

const seatsaver_proto = grpc.loadPackageDefinition(packageDefinition).seatsaver;

/**
 * Implements the GetVenues RPC method.
 */
function ping(call, callback) {
    const runtimeInfo = {};
    runtimeInfo.envVars = process.env;
    runtimeInfo.currentTime = new Date();
    runtimeInfo.memoryUsage = process.memoryUsage();
    callback(null, {runtimeInfo: JSON.stringify(runtimeInfo)});
}

faker.lorem.words(2);

function pingStream(call){
    const cnt = call.request.streamItemCount || 10;
    for(let i = 0; i< cnt; i++){
        const msg = {message: i + ': ' + faker.lorem.words(2)};
        console.log(msg);
        call.write(msg);
    }
    call.end();
}

function getVenues(call, callback) {
    callback(null, {message: 'Not Implemented'});
}
function getVenue(call, callback) {
    callback(null, {message: 'Not Implemented'});
}

function getSeats(call, callback) {
    callback(null, {message: 'Not Implemented'});
}

function getSeat(call, callback) {
    callback(null, {message: 'Not Implemented'});
}

function reserveSeat(call, callback) {
    callback(null, {message: 'Not Implemented'});
}

function releaseSeat(call, callback) {
    callback(null, {message: 'Not Implemented'});
}

function buySeat(call, callback) {
    callback(null, {message: 'Not Implemented'});
}
/**
 * Starts an RPC server that receives requests for the Greeter service at the
 * sample server port
 */
async function main()  {
    validateEnvVarsSync();

    const implementations = {};
    implementations.pingStream = pingStream;
    implementations.ping = ping;
    implementations.getVenues = getVenues;
    implementations.getVenue = getVenue;
    implementations.getSeats = getSeats;
    implementations.getSeat = getSeat;
    implementations.buySeat = buySeat;
    implementations.releaseSeat = releaseSeat;
    implementations.reserveSeat = reserveSeat;

    const server = new grpc.Server();
    server.addService(seatsaver_proto.SeatSaverService.service, implementations);
    server.bind(`0.0.0.0:${PORT}`, grpc.ServerCredentials.createInsecure());
    console.log({message: `Starting gRPC Server on port ${PORT}`, startingTime: new Date()});
    server.start();
    console.log({message: `Started gRPC Server on port ${PORT}`, startedTime: new Date()});
}

seedVenues()
    .then(result => {
        return main();
    });