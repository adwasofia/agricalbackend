var awsIot = require('aws-iot-device-sdk');

var device = awsIot.device({
    keyPath: 'private_key.key',
    certPath: 'device_certificate.crt',
    caPath: 'AmazonRootCA1 (1).pem',
    clientId: 'AgriCal',
    host: 'axgujjldmu0bz-ats.iot.ap-southeast-2.amazonaws.com'
});

device.on('connect', function() {
    console.log('Connected to AWS IoT');
});

// Function to publish the irrigation status
function setIrrigationStatus(status) {
    const message = {
        "message": status
    };
    device.publish('esp32/sub', JSON.stringify(message), function(err) {
        if (err) {
            console.log('Error publishing message:', err);
        } else {
            console.log('Message published:', JSON.stringify(message));
        }
    });
}

// Export the function to set the irrigation status
module.exports = { setIrrigationStatus };
