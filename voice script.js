const languageFonts = {
    english: 'Arial, Helvetica, sans-serif',
    spanish: 'Arial, Helvetica, sans-serif',
    french: 'Arial, Helvetica, sans-serif',
    german: 'Arial, Helvetica, sans-serif',
    
};
// Get references to HTML elements
const start = document.getElementById('start');
const stop = document.getElementById('stop');
const download = document.getElementById('download');
const microphoneIcon = document.getElementById("microphone");
const languageSelector = document.getElementById('language-selector');

// Create a speech recognition instance
let recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition || window.mozSpeechRecognition || window.msSpeechRecognition)();

// Configure speech recognition settings
recognition.lang = languageSelector.value; // Set the default language from the dropdown
recognition.continuous = true;
recognition.interimResults = true;

// Event listener for language selection change
languageSelector.addEventListener('change', () => {
    // Update the language for speech recognition
    recognition.lang = languageSelector.value;
});

// Event listener for speech recognition results
recognition.addEventListener('result', e => {
    // Extract and display the transcribed text
    const transcript = Array.from(e.results)
        .map(result => result[0])
        .map(result => result.transcript);
    convert_text.innerHTML = transcript;
});

// Event listener for starting speech recognition
start.addEventListener('click', () => {
    // Add a visual animation to indicate listening
    microphoneIcon.classList.add("listening-animation");
    // Start speech recognition
    recognition.start();
});

// Event listener for stopping speech recognition
stop.addEventListener('click', () => {
    // Remove the listening animation
    microphoneIcon.classList.remove("listening-animation");
    // Stop speech recognition
    recognition.stop();
});

// Event listener for downloading transcribed text as PDF
download.addEventListener('click', () => {
    // Get the transcribed text to be downloaded
    const textToDownload = convert_text.innerHTML;
    // Load the custom font
const customFont = new Promise((resolve, reject) => {
    const font = new FontFace('CustomFont', 'url(custom-font.ttf)');
    font.load().then(function(loadedFont) {
        document.fonts.add(loadedFont);
        resolve();
    }).catch(function(error) {
        console.error('Failed to load custom font:', error);
        reject(error);
    });
});

// Wait for the custom font to load before generating the PDF
customFont.then(() => {
    // Create a new jsPDF instance with the custom font
    const doc = new jsPDF({
        unit: 'px',
        format: 'a4',
    });

    // Set the font for the document
    doc.setFont('CustomFont'); // Use the font family name you defined earlier

    // Continue with the rest of your PDF generation code
    // You can add text, images, and other content to the PDF here
}).catch((error) => {
    // Handle the font loading error
    console.error('Font loading error:', error);
});
    window.jsPDF = window.jspdf.jsPDF;
    const doc = new jsPDF();
    
    // Set the page width and height
    const pageWidth = doc.internal.pageSize.width;
    const pageHeight = doc.internal.pageSize.height;

    // Set margins and padding
    const leftMargin = 20;
    const topMargin = 20;
    const maxWidth = pageWidth - 2 * leftMargin;

    // Split text into lines that fit within the PDF width
    const lines = doc.splitTextToSize(textToDownload, maxWidth);

    // Calculate the total height of the text
    const textHeight = lines.length * 12; 

    // Check if the text fits within the page height
    if (topMargin + textHeight > pageHeight) {
        alert("Text content is too long to fit on a single page.");
        return;
    }

    // Start from the top margin
    let currentY = topMargin;

    // Add each line to the PDF
    lines.forEach(line => {
        doc.text(leftMargin, currentY, line);
        currentY += 12; 
    });

    // Generate a Blob object representing the PDF
    const pdfBlob = doc.output('blob');
    
    // Create a download link and trigger the download
    const downloadLink = document.createElement('a');
    downloadLink.href = URL.createObjectURL(pdfBlob);
    downloadLink.download = 'voice_to_text.pdf';

    downloadLink.click();
});
