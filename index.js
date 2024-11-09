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
            console.log('Hand landmarks:', hand.landmarks);
            output.innerText = recognizeGesture(hand.landmarks);
        } else {
            output.innerText = "No hand detected";
        }
        await tf.nextFrame();
    }
};

// Function to recognize gestures
const recognizeGesture = (landmarks) => {
    // Example logic for recognizing a specific gesture
    // You can replace this with more complex logic for different ASL signs

    const thumbTip = landmarks[4];
    const indexTip = landmarks[8];
    const middleTip = landmarks[12];
    const ringTip = landmarks[16];
    const pinkyTip = landmarks[20];

    // Example: Recognizing a "thumbs up" gesture
    if (thumbTip[1] < indexTip[1] && 
        thumbTip[1] < middleTip[1] && 
        thumbTip[1] < ringTip[1] && 
        thumbTip[1] < pinkyTip[1]) {
        return "Thumbs Up!";
    } else {
        return "Gesture not recognized";
    }
};

// Initialize the model
loadHandposeModel();
