const SERVER_URL = 'localhost:50051';
const PROTO_PATH = process.cwd() + '/proto/seatsaver.proto';
const faker = require('faker');

const grpc = require('grpc');
const protoLoader = require('@grpc/proto-loader');
const packageDefinition = protoLoader.loadSync(
    PROTO_PATH,
    {
        keepCase: true,
        longs: String,
        enums: String,
        defaults: true,
        oneofs: true
    });

const seatsaver = grpc.loadPackageDefinition(packageDefinition).seatsaver;
const client = new seatsaver.SeatSaverService(SERVER_URL,
    grpc.credentials.createInsecure());

const chai = require('chai');
const expect = require('chai').expect;
const describe = require('mocha').describe;
const it = require('mocha').it;

const getRandomCustomerSync = () => {
    const obj = {};
    obj.firstName = faker.name.firstName();
    obj.lastName = faker.name.lastName();
    const email = `${obj.firstName}.${obj.lastName}@${faker.internet.domainName()}`;
    obj.email = email;

    return obj;
};

const sample = (arr) => {
    return arr[Math.floor(Math.random() * arr.length)]
};

const getRandomSeatCustomerSync = () => {
    const obj = {};
    obj.firstName = faker.name.firstName();
    obj.lastName = faker.name.lastName();
    const email = `${obj.firstName}.${obj.lastName}@${faker.internet.domainName()}`;
    obj.email = email;
    obj.created = null;
    obj.message = null;

    return obj;
};


describe('Basic Grpc Tests: ', () => {
    before(() => {

    });

    it('Can Ping Server ', function (done) {
        function pingCallback(error, result) {
            if (error) {
                console.log(error);
                done(error);
            }
            expect(result).to.be.an('object');
            done()
        }

        client.Ping({}, pingCallback);
    });

    it('Can Get Venues', function (done) {
        const call = client.GetVenues({});
        call.on('data', function (result) {
            expect(result).to.be.an('object');
        });
        call.on('end', function () {
            done();
        });
        call.on('error', function (e) {
            console.log(error);
            done(error);
        });
        call.on('status', function (status) {
            console.log(status);
        });
    });

    const reserveASeat = async (seat, done) => {
        function reserveSeatCallback(error, result) {
            if (error) {
                console.log(error);
                done(error);
            }
            expect(result).to.be.an('object');
            done();
        }

        client.ReserveSeat(seat, reserveSeatCallback);
    };

    const getKnownSeatRequestSync = () => {
        return  {
            venueId: "5dce2caaba1d1d3201065037",
            seat: {
                id: "5dce2caaba1d1d3201065259",
                number: "Z20",
                section: "Section-Z",
                status: "OPEN",
                changed: "Thu Nov 14 2019 20:42:18 GMT-0800 (Pacific Standard Time)",
                created: "Thu Nov 14 2019 20:42:18 GMT-0800 (Pacific Standard Time)",
                customer: {
                    firstName: "Gonzalo",
                    lastName: "Considine",
                    email: "Gonzalo.Considine@dagmar.name",
                    created: "",
                    message: ""
                },
                message: ""
            }
        }
    }

    it('Can Reserve Seat', function (done) {
        function reserveSeatCallback(error, result) {
            if (error) {
                console.log(error);
                done(error);
            }
            expect(result).to.be.an('object');
            expect(result.status).to.equal('RESERVED');
            done()
        }
        const obj = getKnownSeatRequestSync();
        client.ReserveSeat(obj, reserveSeatCallback);
    });

    it('Can Release Seat', function (done) {
        function releaseSeatCallback(error, result) {
            if (error) {
                console.log(error);
                done(error);
            }
            expect(result).to.be.an('object');
            expect(result.status).to.equal('OPEN');
            done()
        }
        const obj = getKnownSeatRequestSync();
        client.ReleaseSeat(obj, releaseSeatCallback);
    });

    it('Can Buy Seat', function (done) {
        function buySeatCallback(error, result) {
            if (error) {
                console.log(error);
                done(error);
            }
            expect(result).to.be.an('object');
            expect(result.status).to.equal('SOLD');
            done()
        }
        const obj = getKnownSeatRequestSync();
        client.BuySeat(obj, buySeatCallback);
    });
});