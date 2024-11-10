const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const target = document.getElementById('target');
const scoreDisplay = document.getElementById('score');
let score = 0;

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
            drawHand(hand.landmarks);
            const gesture = recognizeGesture(hand.landmarks);
            if (gesture === target.innerText) {
                score++;
                scoreDisplay.innerText = `Score: ${score}`;
                setNewTarget();
            }
        }
        await tf.nextFrame();
    }
};

// Function to draw hand landmarks
const drawHand = (landmarks) => {
    ctx.fillStyle = 'red';
    ctx.strokeStyle = 'red';
    ctx.lineWidth = 2;

    landmarks.forEach(point => {
        ctx.beginPath();
        ctx.arc(point[0], point[1], 5, 0, 2 * Math.PI);
        ctx.fill();
    });
};

// Function to recognize gestures
const recognizeGesture = (landmarks) => {
    // Implement your gesture recognition logic here
    // For example, return 'A' if the gesture matches the sign for 'A'
    return 'A'; // Placeholder
};

// Function to set a new target character
const setNewTarget = () => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    target.innerText = characters.charAt(Math.floor(Math.random() * characters.length));
};

// Access the user's webcam
navigator.mediaDevices.getUserMedia({ video: true })
    .then(stream => {
        video.srcObject = stream;
    })
    .catch(error => {
        console.error('Error accessing media devices.', error);
    });

// Initialize the model
loadHandposeModel();

