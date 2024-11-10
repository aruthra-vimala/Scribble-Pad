// Load all images and labels from the data folder
function loadData() {
    const labels = [];
    const images = [];
    const classNames = fs.readdirSync(folderPath); // Get subfolders (labels)

    // Map labels to numeric values (A-Z, 0-9)
    const labelMap = classNames.reduce((acc, className, index) => {
        acc[className] = index;
        return acc;
    }, {});

    classNames.forEach(label => {
        const classFolder = path.join(folderPath, label);
        const imageFiles = fs.readdirSync(classFolder).filter(file => file.endsWith('.jpg') || file.endsWith('.png'));

        imageFiles.forEach(imageFile => {
            const imagePath = path.join(classFolder, imageFile);
            const image = loadImage(imagePath);  // Load and preprocess the image
            images.push(image);
            labels.push(labelMap[label]);  // Convert label to numeric index
        });
    });

    return { images, labels, labelMap };
}
