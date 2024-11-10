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

// Function to load the MobileNet model
async function loadModel() {
    model = await mobilenet.load();
    statusElement.innerText = "Model loaded. Click 'Start Detection'";
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
    const predictions = await model.classify(videoElement);
    const harassmentDetected = predictions.some(
        (prediction) => prediction.className === "person" && prediction.probability > 0.8
    );

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
            const message = `SOS Alert! Potential harassment detected. Location: Latitude ${latitude}, Longitude ${longitude}`;
            alert(message); // Alert the user

            // Open WhatsApp web with pre-filled message
            window.open(`https://wa.me/YOUR_PHONE_NUMBER?text=${encodeURIComponent(message)}`);
        });
    } else {
        alert("Geolocation is not supported by your browser.");
    }
}

// Initialize the model and webcam
loadModel();
setupWebcam();
