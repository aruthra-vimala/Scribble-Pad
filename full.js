// Load TensorFlow.js library
const tfjsScript = document.createElement('script');
tfjsScript.src = "https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@3.9.0";
document.head.appendChild(tfjsScript);

tfjsScript.onload = () => {
    // Once the TensorFlow.js library is loaded, initialize the app
    initializeApp();
};

function initializeApp() {
    // Create elements dynamically
    document.title = "Live Harassment Detection";

    // Create a heading
    const heading = document.createElement('h1');
    heading.innerText = "Live Harassment Detection";
    document.body.appendChild(heading);

    // Create video element for webcam feed
    const videoElement = document.createElement('video');
    videoElement.id = 'video';
    videoElement.width = 640;
    videoElement.height = 480;
    videoElement.autoplay = true;
    document.body.appendChild(videoElement);

    // Create a status message paragraph
    const statusElement = document.createElement('p');
    statusElement.id = 'status';
    statusElement.innerText = "Loading model...";
    document.body.appendChild(statusElement);

    // Create a button to start detection
    const button = document.createElement('button');
    button.innerText = "Start Detection";
    button.onclick = startDetection;
    document.body.appendChild(button);

    // Initialize the webcam and model
    loadModel();
    setupWebcam(videoElement);
}

let model;
async function loadModel() {
    try {
        // Load the model from a local file (replace with the actual path if necessary)
        model = await tf.loadLayersModel('file://path/to/your/model/model.json');
        document.getElementById('status').innerText = "Model loaded. Click 'Start Detection'";
    } catch (error) {
        document.getElementById('status').innerText = "Error loading model";
        console.error("Could not load the model:", error);
    }
}

async function setupWebcam(videoElement) {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        videoElement.srcObject = stream;
        await new Promise((resolve) => {
            videoElement.onloadedmetadata = () => {
                resolve();
            };
        });
    } catch (error) {
        console.error("Error accessing the webcam:", error);
    }
}

async function startDetection() {
    if (!model) {
        alert("Model not loaded. Please wait.");
        return;
    }
    document.getElementById('status').innerText = "Starting detection...";
    detectFrame();
}

async function detectFrame() {
    const videoElement = document.getElementById('video');
    const predictions = await model.predict(
        tf.browser.fromPixels(videoElement).resizeNearestNeighbor([224, 224]).expandDims(0).toFloat()
    );
    const harassmentDetected = predictions.dataSync()[1] > 0.8; // Adjust this based on model output

    if (harassmentDetected) {
        sendSosMessage();
    }

    requestAnimationFrame(detectFrame); // Continue detection loop
}

async function sendSosMessage() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
            const { latitude, longitude } = position.coords;
            const message = `SOS Alert! Potential harassment detected. Location: ${latitude}, ${longitude}`;
            alert(message); // Alert the user
            window.open(`https://wa.me/YOUR_PHONE_NUMBER?text=${encodeURIComponent(message)}`);
        });
    } else {
        alert("Geolocation not supported by your browser.");
    }
}
