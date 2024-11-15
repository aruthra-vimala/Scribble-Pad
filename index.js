const video = document.getElementById('video');
const gestureText = document.getElementById('gesture-text');

// Load the handpose model
async function loadHandposeModel() {
    const model = await handpose.load();
    console.log("Handpose model loaded.");
    return model;
}

// Set up the camera
async function setupCamera() {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    video.srcObject = stream;
    return new Promise((resolve) => {
        video.onloadedmetadata = () => {
            resolve(video);
        };
    });
}

// Detect gestures using the handpose model
async function detectGesture(model) {
    const predictions = await model.estimateHands(video);
    
    if (predictions.length > 0) {
        const landmarks = predictions[0].landmarks;

        // Basic gesture recognition logic (for demonstration)
        if (isFist(landmarks)) {
            gestureText.innerText = "Detected: 'A' in ASL";
        } else if (isOpenHand(landmarks)) {
            gestureText.innerText = "Detected: 'B' in ASL";
        } else {
            gestureText.innerText = "Gesture not recognized";
        }
    } else {
        gestureText.innerText = "No hand detected";
    }
}

// Basic gesture recognition functions
function isFist(landmarks) {
    // Example logic: Check if fingers are close to the palm
    const thumbTip = landmarks[4];
    const indexTip = landmarks[8];
    const distance = Math.sqrt(
        Math.pow(thumbTip[0] - indexTip[0], 2) +
        Math.pow(thumbTip[1] - indexTip[1], 2)
    );
    return distance < 40; // Adjust threshold for a "fist"
}

function isOpenHand(landmarks) {
    // Example logic: Check if fingers are spread out
    const thumbTip = landmarks[4];
    const pinkyTip = landmarks[20];
    const distance = Math.sqrt(
        Math.pow(thumbTip[0] - pinkyTip[0], 2) +
        Math.pow(thumbTip[1] - pinkyTip[1], 2)
    );
    return distance > 100; // Adjust threshold for "open hand"
}

// Main function to initialize and run the application
async function main() {
    await setupCamera();
    const model = await loadHandposeModel();
    
    // Run gesture detection at intervals
    setInterval(() => {
        detectGesture(model);
    }, 200);
}

// Start the application
main();
