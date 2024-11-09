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
            output.innerText = recognizeGesture(hand.landmarks);
        }
        await tf.nextFrame();
    }
};
const recognizeGesture = (landmarks) => {
    const thumbTip = landmarks[4];
    const indexTip = landmarks[8];
    const middleTip = landmarks[12];
    const ringTip = landmarks[16];
    const pinkyTip = landmarks[20];
    if (thumbTip[1] < indexTip[1] && 
        thumbTip[1] < middleTip[1] && 
        thumbTip[1] < ringTip[1] && 
        thumbTip[1] < pinkyTip[1]) {
        return "Thumbs Up!";
    } else {
        return "Gesture not recognized";
    }
};
loadHandposeModel();
