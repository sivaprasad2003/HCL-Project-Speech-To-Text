const start = document.getElementById('start');
const stop = document.getElementById('stop');
const download = document.getElementById('download');
const microphoneIcon = document.getElementById("microphone");


let recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition || window.mozSpeechRecognition || window.msSpeechRecognition)();

recognition.lang = 'en-US';
recognition.continuous = true;
recognition.interimResults = true;


recognition.addEventListener('result', e => {
    const transcript = Array.from(e.results)
        .map(result => result[0])
        .map(result => result.transcript)
        
        convert_text.innerHTML = transcript;
});

start.addEventListener('click', () => {
    microphoneIcon.classList.add("listening-animation");
    recognition.start();
});

stop.addEventListener('click', () => {
    microphoneIcon.classList.remove("listening-animation");
    recognition.stop();
});

download.addEventListener('click', () => {
    const textToDownload = convert_text.innerHTML;
    window.jsPDF = window.jspdf.jsPDF;
    const doc = new jsPDF();
    
    // setting the page width and height
    const pageWidth = doc.internal.pageSize.width;
    const pageHeight = doc.internal.pageSize.height;

    // setting margins and padding
    const leftMargin = 20;
    const topMargin = 20;
    const maxWidth = pageWidth - 2 * leftMargin;

    // split text into lines that fit within the PDF width
    const lines = doc.splitTextToSize(textToDownload, maxWidth);

    // calculate the total height of the text
    const textHeight = lines.length * 12; 

    // check if the text fits within the page height
    if (topMargin + textHeight > pageHeight) {
        alert("Text content is too long to fit on a single page.");
        return;
    }

    // starting from the top margin
    let currentY = topMargin;

    // add each line to the pdf
    lines.forEach(line => {
        doc.text(leftMargin, currentY, line);
        currentY += 12; 
    });

    const pdfBlob = doc.output('blob');
    
    const downloadLink = document.createElement('a');
    downloadLink.href = URL.createObjectURL(pdfBlob);
    downloadLink.download = 'voice_to_text.pdf';

    downloadLink.click();
});

