document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("comprovanteForm");
    const previewContainer = document.getElementById("preview-container");
    const pdfPreview = document.getElementById("pdf-preview");
    const downloadBtn = document.getElementById("download-btn");
    const logoInput = document.getElementById("logo");
    const logoPreview = document.getElementById("preview-logo");
    let pdfBlob = null;
    let logoBase64 = null; // Para armazenar a imagem em Base64

    // Atualiza a pré-visualização da logo ao selecionar um arquivo
    logoInput.addEventListener("change", function () {
        const file = logoInput.files[0];

        if (file) {
            const reader = new FileReader();
            reader.onload = function (e) {
                logoPreview.src = e.target.result;
                logoPreview.classList.remove("hidden"); // Mostra a imagem
                logoBase64 = e.target.result; // Salva a logo em Base64 para uso no PDF
            };
            reader.readAsDataURL(file);
        }
    });

    form.addEventListener("submit", function (event) {
        event.preventDefault();

        // Captura os valores do formulário
        const nome = document.getElementById("nome").value;
        const valorPago = parseFloat(document.getElementById("pago").value).toFixed(2);
        const data = document.getElementById("data").value.split("-").reverse().join("/");
        const forma = document.getElementById("forma").value;
        const numeroT = document.getElementById("numeroT").value || "Não informado";
        const destino = document.getElementById("destino").value;
        const referente = document.getElementById("referente").value;
        const observacoes = document.getElementById("obs").value || "Nenhuma";
        const empresa = document.getElementById("empresa").value;
        const cnpjDes = document.getElementById("cnpj-des").value || "Não informado";
        const cnpjComp = document.getElementById("cnpj-comp").value || "Não informado";

        // Gera o comprovante em PDF
        gerarPDF(nome, valorPago, data, forma, numeroT, destino, referente, observacoes, empresa, cnpjDes, cnpjComp);
    });

    function gerarPDF(nome, valorPago, data, forma, numeroT, destino, referente, observacoes, empresa, cnpjDes, cnpjComp) {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();

        let yPosition = 20; // Posição inicial do texto

        // Se houver logo, adiciona ao topo do PDF
        if (logoBase64) {
            doc.addImage(logoBase64, "PNG", 80, yPosition, 50, 30); // Centraliza a logo (largura 50px)
            yPosition += 40; // Move a posição para baixo após a logo
        }

        // Centraliza o título
        doc.setFont("helvetica", "bold");
        doc.setFontSize(18);
        const title = "Comprovante de Pagamento";
        const titleWidth = doc.getTextWidth(title);
        const pageWidth = doc.internal.pageSize.width;
        doc.text(title, (pageWidth - titleWidth) / 2, yPosition);
        doc.line(20, yPosition + 5, 190, yPosition + 5);
        yPosition += 20;

        // Adiciona os dados do comprovante
        doc.setFont("helvetica", "normal");
        doc.setFontSize(12);
        doc.text(`Pagador: ${nome}`, 20, yPosition);
        doc.text(`Valor Pago: R$ ${valorPago}`, 20, yPosition + 10);
        doc.text(`Data do Pagamento: ${data}`, 20, yPosition + 20);
        doc.text(`Forma de Pagamento: ${forma}`, 20, yPosition + 30);
        doc.text(`Número de Transação: ${numeroT}`, 20, yPosition + 40);
        doc.text(`Destino: ${destino}`, 20, yPosition + 50);
        doc.text(`Referente a: ${referente}`, 20, yPosition + 60);
        doc.text(`Observações: ${observacoes}`, 20, yPosition + 70, { maxWidth: 170 });

        // Informações fiscais
        yPosition += 90;
        doc.setFontSize(10);
        doc.text("--- Detalhes Fiscais ---", 20, yPosition);
        doc.text(`Instituição/Dono: ${empresa}`, 20, yPosition + 10);
        doc.text(`CNPJ/CPF do Destino: ${cnpjDes}`, 20, yPosition + 20);
        doc.text(`CNPJ/CPF do Comprador: ${cnpjComp}`, 20, yPosition + 30);

        doc.line(20, yPosition + 40, 190, yPosition + 40);
        doc.setFontSize(10);
        doc.text("Comprovante gerado automaticamente", 20, yPosition + 50);

        // Gera o PDF e exibe a prévia
        const pdfOutput = doc.output("blob");
        pdfBlob = URL.createObjectURL(pdfOutput);

        if (/Mobi|Android/i.test(navigator.userAgent)) {
            window.open(pdfBlob);
        } else {
            pdfPreview.src = pdfBlob;
        }
        previewContainer.classList.remove("hidden");
    }

    downloadBtn.addEventListener("click", function () {
        if (pdfBlob) {
            const a = document.createElement("a");
            a.href = pdfBlob;
            a.download = "comprovante.pdf";
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        }
    });
});
