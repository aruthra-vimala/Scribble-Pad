const video = document.getElementById('video');
const output = document.getElementById('output');

// Access the user's webcam
navigator.mediaDevices.getUserMedia({ video: true })
    .then(stream => {
        video.srcObject = stream;
    })
    .catch(error => {
        console.error('Error accessing media devices.', error);
    });

// Load the handpose model
const loadHandposeModel = async () => {
    const model = await handpose.load();
    console.log('Handpose model loaded.');

    // Start detecting gestures
    video.onloadeddata = () => {
        detectHandGestures(model);
    };
};

// Function to detect hand gestures
const detectHandGestures = async (model) => {
    while (true) {
        const predictions = await model.estimateHands(video);
        if (predictions.length > 0) {
            const hand = predictions[0];
            output.innerText = recognizeGesture(hand.landmarks);
        } else {
            output.innerText = "No hand detected";
        }
        await tf.nextFrame();
    }
};

// Function to recognize gestures
const recognizeGesture = (landmarks) => {
    const gestures = {
        "Thumbs Up": isThumbsUp(landmarks),
        "Peace": isPeace(landmarks),
        "Fist": isFist(landmarks)
    };

    for (let [gesture, detected] of Object.entries(gestures)) {
        if (detected) return gesture;
    }
    return "Gesture not recognized";
};

// Example gesture recognition functions
const isThumbsUp = (landmarks) => {
    const [thumbTip, indexTip, middleTip, ringTip, pinkyTip] = [landmarks[4], landmarks[8], landmarks[12], landmarks[16], landmarks[20]];
    return (thumbTip[1] < indexTip[1] && thumbTip[1] < middleTip[1] && thumbTip[1] < ringTip[1] && thumbTip[1] < pinkyTip[1]);
};

const isPeace = (landmarks) => {
    const [indexTip, middleTip, ringTip, pinkyTip] = [landmarks[8], landmarks[12], landmarks[16], landmarks[20]];
    return (indexTip[1] < ringTip[1] && middleTip[1] < ringTip[1] && ringTip[1] > pinkyTip[1]);
};

const isFist = (landmarks) => {
    const [thumbTip, indexTip, middleTip, ringTip, pinkyTip] = [landmarks[4], landmarks[8], landmarks[12], landmarks[16], landmarks[20]];
    return (thumbTip[1] > indexTip[1] && thumbTip[1] > middleTip[1] && thumbTip[1] > ringTip[1] && thumbTip[1] > pinkyTip[1]);
};

// Initialize the model
loadHandposeModel();
