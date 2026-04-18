// TEMPLATE: Script Photoshop JSX — Batch Resize + Export
// Uso: File > Scripts > Browse... > selecionar este arquivo
// Ajuste as variáveis abaixo conforme necessidade

// ============ CONFIGURAÇÕES ============
var CONFIG = {
    inputFolder: "~/Desktop/originais/",    // Pasta com imagens originais
    outputFolder: "~/Desktop/exportadas/",  // Pasta de destino
    targetWidth: 1080,                       // Largura desejada (px)
    targetHeight: 1080,                      // Altura desejada (px)
    quality: 80,                             // Qualidade JPEG (1-100)
    format: "jpg",                           // "jpg", "png", "webp"
    addWatermark: false,                     // Adicionar marca d'água
    watermarkText: "© Sua Marca"            // Texto da marca d'água
};

// ============ EXECUÇÃO ============
function main() {
    var inputFolder = new Folder(CONFIG.inputFolder);
    var outputFolder = new Folder(CONFIG.outputFolder);
    
    if (!inputFolder.exists) {
        alert("Pasta de entrada não encontrada: " + CONFIG.inputFolder);
        return;
    }
    if (!outputFolder.exists) outputFolder.create();
    
    var files = inputFolder.getFiles(/\.(jpg|jpeg|png|tif|tiff|psd|bmp)$/i);
    
    if (files.length === 0) {
        alert("Nenhuma imagem encontrada na pasta de entrada.");
        return;
    }
    
    for (var i = 0; i < files.length; i++) {
        var doc = app.open(files[i]);
        
        // Redimensionar
        resizeImage(doc, CONFIG.targetWidth, CONFIG.targetHeight);
        
        // Marca d'água (opcional)
        if (CONFIG.addWatermark) {
            addWatermark(doc, CONFIG.watermarkText);
        }
        
        // Exportar
        var outputFile = new File(outputFolder + "/" + getBaseName(files[i]) + "." + CONFIG.format);
        exportImage(doc, outputFile, CONFIG.format, CONFIG.quality);
        
        doc.close(SaveOptions.DONOTSAVECHANGES);
    }
    
    alert("Processamento concluído! " + files.length + " imagens exportadas.");
}

function resizeImage(doc, w, h) {
    doc.resizeImage(
        UnitValue(w, "px"),
        UnitValue(h, "px"),
        72,
        ResampleMethod.BICUBICSHARPER
    );
}

function addWatermark(doc, text) {
    var layer = doc.artLayers.add();
    layer.kind = LayerKind.TEXT;
    var textItem = layer.textItem;
    textItem.contents = text;
    textItem.size = UnitValue(24, "pt");
    textItem.color.rgb.hexValue = "FFFFFF";
    textItem.position = [doc.width.value - 200, doc.height.value - 30];
    layer.opacity = 50;
}

function exportImage(doc, file, format, quality) {
    if (format === "jpg") {
        var opts = new JPEGSaveOptions();
        opts.quality = Math.round(quality / 8.33);
        doc.saveAs(file, opts, true);
    } else if (format === "png") {
        var opts = new PNGSaveOptions();
        opts.compression = 6;
        doc.saveAs(file, opts, true);
    }
}

function getBaseName(file) {
    var name = file.name;
    return name.substring(0, name.lastIndexOf("."));
}

main();
