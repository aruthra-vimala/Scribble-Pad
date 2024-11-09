/*
const video = document.getElementById('video');
const output = document.getElementById('output');
navigator.mediaDevices.getUserMedia({ video: true })
    .then(stream => {
        video.srcObject = stream;
    })
    .catch(error => {
        console.error('Error accessing media devices.', error);
    });
const recognizeASL = async () => {
    setInterval(() => {
        output.innerText = "Detected Sign: Hello";  // Replace with actual detected sign
    }, 2000);
};
recognizeASL();
*/
const video = document.getElementById('video');
const output = document.getElementById('output');
navigator.mediaDevices.getUserMedia({ video: true })
    .then(stream => {
        video.srcObject = stream;
    })
    .catch(error => {
        console.error('Error accessing media devices.', error);
    });
const loadHandposeModel = async () => {
    const model = await handpose.load();
    console.log('Handpose model loaded.');
    video.onloadeddata = () => {
        detectHandGestures(model);
    };
};
const detectHandGestures = async (model) => {
    while (true) {
        const predictions = await model.estimateHands(video);
        if (predictions.length > 0) {
            const hand = predictions[0];
            output.innerText = `Detected hand with confidence: ${hand.handInViewConfidence}`;
        }
        await tf.nextFrame();
    }
};
loadHandposeModel();
