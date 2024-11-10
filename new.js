let model;
const videoElement = document.getElementById('video');
const statusElement = document.getElementById('status');

// Function to set up webcam streaming
async function setupWebcam() {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    videoElement.srcObject = stream;
    return new Promise((resolve) => {
        videoElement.onloadedmetadata = () => {
            resolve();
        };
    });
}

// Function to load the local model from desktop
async function loadModel() {
    try {
        // Load the model from the specified path (replace with your actual path)
        model = await tf.loadLayersModel('file://path/to/your/model/model.json');
        statusElement.innerText = "Model loaded. Click 'Start Detection'";
    } catch (error) {
        statusElement.innerText = "Error loading model";
        console.error("Could not load the model:", error);
    }
}

// Function to start live detection
async function startDetection() {
    if (!model) {
        alert("Model not loaded. Please wait.");
        return;
    }
    statusElement.innerText = "Starting detection...";
    detectFrame();
}

// Function to detect objects in each video frame
async function detectFrame() {
    const predictions = await model.predict(tf.browser.fromPixels(videoElement).resizeNearestNeighbor([224, 224]).expandDims(0).toFloat());
    const harassmentDetected = predictions.dataSync()[1] > 0.8;  // Assuming class '1' represents harassment

    if (harassmentDetected) {
        sendSosMessage();
    }

    requestAnimationFrame(detectFrame); // Continue detection
}

// Function to send SOS message with location details
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

// Initialize the model and webcam
loadModel();
setupWebcam();
