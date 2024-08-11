var awsIot = require('aws-iot-device-sdk');

var device = awsIot.device({
    keyPath: '0efd6ea83abb6d7fbcc1599e4133505465a555d172722f40ca1e9235fbdbcbc0-private.pem.key',
    certPath: '0efd6ea83abb6d7fbcc1599e4133505465a555d172722f40ca1e9235fbdbcbc0-certificate.pem.crt',
    caPath: 'AmazonRootCA1 (1).pem',
    clientId: 'test',
    host: 'anmy0x4pxvlga-ats.iot.us-east-1.amazonaws.com'
});

device.on('connect', function() {
    console.log('Connected to AWS IoT');
});

// Function to publish the irrigation status
function setIrrigationStatus(status) {
    const message = { status_irigasi: status };
    device.publish('topic_2', JSON.stringify(message), function(err) {
        if (err) {
            console.log('Error publishing message:', err);
        } else {
            console.log('Message published:', message);
        }
    });
}

// Export the function to set the irrigation status
module.exports = { setIrrigationStatus };
