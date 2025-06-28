// Configurações
const API_KEY = 'nBGtKyZy1wVKkAdALdWSR5Be'; // Substitua por uma chave de API gratuita
const API_URL = 'https://api.remove.bg/v1.0/removebg';

// Elementos DOM
const dropArea = document.getElementById('dropArea');
const fileInput = document.getElementById('fileInput');
const originalImage = document.getElementById('originalImage');
const resultImage = document.getElementById('resultImage');
const placeholder = document.getElementById('placeholder');
const convertBtn = document.getElementById('convertBtn');
const downloadBtn = document.getElementById('downloadBtn');
const previewArea = document.getElementById('previewArea');
const downloadSection = document.getElementById('downloadSection');
const sensitivity = document.getElementById('sensitivity');
const sensitivityValue = document.getElementById('sensitivityValue');
const qualitySelect = document.getElementById('quality');

let originalFile = null;
let processedImageUrl = null;

// Event Listeners
fileInput.addEventListener('change', handleFileSelect);
dropArea.addEventListener('dragover', handleDragOver);
dropArea.addEventListener('dragleave', handleDragLeave);
dropArea.addEventListener('drop', handleDrop);
convertBtn.addEventListener('click', processImage);
downloadBtn.addEventListener('click', downloadImage);
sensitivity.addEventListener('input', updateSensitivityValue);

// Funções
function handleFileSelect(e) {
    const file = e.target.files[0];
    if (file && isImageFile(file)) {
        loadImage(file);
    } else {
        alert('Por favor, selecione um arquivo JPG ou JPEG.');
    }
}

function handleDragOver(e) {
    e.preventDefault();
    e.stopPropagation();
    dropArea.classList.add('dragover');
}

function handleDragLeave(e) {
    e.preventDefault();
    e.stopPropagation();
    dropArea.classList.remove('dragover');
}

function handleDrop(e) {
    e.preventDefault();
    e.stopPropagation();
    dropArea.classList.remove('dragover');
    
    const file = e.dataTransfer.files[0];
    if (file && isImageFile(file)) {
        loadImage(file);
    } else {
        alert('Por favor, solte um arquivo JPG ou JPEG.');
    }
}

function isImageFile(file) {
    return ['image/jpeg', 'image/jpg'].includes(file.type);
}

function loadImage(file) {
    originalFile = file;
    
    const reader = new FileReader();
    reader.onload = function(e) {
        originalImage.src = e.target.result;
        previewArea.style.display = 'grid';
        placeholder.style.display = 'flex';
        resultImage.style.display = 'none';
        downloadSection.style.display = 'none';
        convertBtn.disabled = false;
    };
    reader.readAsDataURL(file);
}

function updateSensitivityValue() {
    sensitivityValue.textContent = `${sensitivity.value}%`;
}

async function processImage() {
    if (!originalFile) return;
    
    try {
        convertBtn.disabled = true;
        convertBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processando...';
        
        const formData = new FormData();
        formData.append('image_file', originalFile);
        formData.append('size', 'auto');
        formData.append('sensitivity', sensitivity.value);
        
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'X-Api-Key': API_KEY
            },
            body: formData
        });
        
        if (!response.ok) {
            throw new Error(`Erro na API: ${response.status}`);
        }
        
        const blob = await response.blob();
        processedImageUrl = URL.createObjectURL(blob);
        
        resultImage.src = processedImageUrl;
        resultImage.style.display = 'block';
        placeholder.style.display = 'none';
        downloadSection.style.display = 'block';
        
        convertBtn.innerHTML = '<i class="fas fa-magic"></i> Remover Fundo';
        convertBtn.disabled = false;
    } catch (error) {
        console.error('Erro ao processar imagem:', error);
        alert('Ocorreu um erro ao processar a imagem. Por favor, tente novamente.');
        convertBtn.innerHTML = '<i class="fas fa-magic"></i> Remover Fundo';
        convertBtn.disabled = false;
    }
}

function downloadImage() {
    if (!processedImageUrl) return;
    
    const quality = qualitySelect.value;
    const fileName = `logo-transparente-${Date.now()}.${quality === '1' ? 'png' : 'jpg'}`;
    
    const link = document.createElement('a');
    link.href = processedImageUrl;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// Observação: Você precisará obter uma chave de API gratuita de um serviço como:
// - remove.bg (tem um plano gratuito com limitações)
// - Alternativamente, você pode usar a API do ClipDrop (também tem opção gratuita)