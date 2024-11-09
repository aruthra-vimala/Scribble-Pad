const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
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

    video.onloadeddata = () => {
        detectHandGestures(model);
    };
};

// Function to detect hand gestures
const detectHandGestures = async (model) => {
    while (true) {
        const predictions = await model.estimateHands(video);
        ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas

        if (predictions.length > 0) {
            const hand = predictions[0];
            console.log('Hand landmarks:', hand.landmarks);
            drawHand(hand.landmarks);
            output.innerText = recognizeGesture(hand.landmarks);
        } else {
            output.innerText = "No hand detected";
        }
        await tf.nextFrame();
    }
};

// Function to draw hand landmarks
const drawHand = (landmarks) => {
    ctx.fillStyle = 'red';
    ctx.strokeStyle = 'red';
    ctx.lineWidth = 2;

    // Draw points
    landmarks.forEach(point => {
        ctx.beginPath();
        ctx.arc(point[0], point[1], 5, 0, 2 * Math.PI);
        ctx.fill();
    });

    // Draw lines between fingertips
    const fingers = [4, 8, 12, 16, 20];
    for (let i = 0; i < fingers.length - 1; i++) {
        const start = landmarks[fingers[i]];
        const end = landmarks[fingers[i + 1]];
        ctx.beginPath();
        ctx.moveTo(start[0], start[1]);
        ctx.lineTo(end[0], end[1]);
        ctx.stroke();
    }
};

// Function to recognize gestures
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

// Initialize the model
loadHandposeModel();
