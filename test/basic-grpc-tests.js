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


let testSeat = null;




describe('Basic Grpc Tests: ', () => {
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

    it('Can Get Venues and Reserve Seats', function (done) {
        const call = client.GetVenues({});
        call.on('data', function (result) {
            expect(result).to.be.an('object');
            const obj = {seat: sample(result.seats), venueId: result.id};
            obj.seat.customer = getRandomCustomerSync();
            function reserveSeatCallback(error, result) {
                if (error) {
                    console.log(error);
                    done(error);
                }
                expect(result).to.be.an('object');
                expect(result.status).to.equal('RESERVED');
                expect(result.customer).to.be.an('object');
            }
            client.ReserveSeat(obj, reserveSeatCallback);
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

    it('Can Get Seats in Venue', function (done) {
        const call = client.GetSeats({});
        call.on('data', function (result) {
            expect(result).to.be.an('object');
            expect(result.number).to.be.a('string');
            expect(result.section).to.be.a('string');
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

    it('Can Get Venues and Release Seats', function (done) {
        const call = client.GetVenues({});
        call.on('data', function (result) {
            expect(result).to.be.an('object');
            const obj = {seat: sample(result.seats), venueId: result.id};
            function releaseSeatCallback(error, result) {
                if (error) {
                    console.log(error);
                    done(error);
                }
                expect(result).to.be.an('object');
                expect(result.status).to.equal('OPEN');
                expect(result.customer).to.be.a('null');
            }
            client.ReleaseSeat(obj, releaseSeatCallback);
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

    it('Can Get Venues and Buy Seats', function (done) {
        const call = client.GetVenues({});
        call.on('data', function (result) {
            expect(result).to.be.an('object');
            const obj = {seat: sample(result.seats), venueId: result.id};
            obj.seat.customer = getRandomCustomerSync();
            function buySeatCallback(error, result) {
                if (error) {
                    console.log(error);
                    done(error);
                }
                expect(result).to.be.an('object');
                expect(result.status).to.equal('SOLD');
                expect(result.customer).to.be.an('object');
                done()
            }
            client.BuySeat(obj, buySeatCallback);
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
});