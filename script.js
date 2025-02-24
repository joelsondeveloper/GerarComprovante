document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("comprovanteForm");
    const previewContainer = document.getElementById("preview-container");
    const pdfPreview = document.getElementById("pdf-preview");
    const downloadBtn = document.getElementById("download-btn");
    let pdfBlob = null;

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

        doc.setFont("helvetica", "normal");
        doc.setFontSize(14);
        doc.setTextColor(50, 50, 50);

        doc.setFont("helvetica", "bold");
        doc.setFontSize(18);
        doc.text("Comprovante de Pagamento", 20, 20);
        doc.line(20, 25, 190, 25);

        doc.setFont("helvetica", "normal");
        doc.setFontSize(12);
        doc.text(`Pagador: ${nome}`, 20, 40);
        doc.text(`Valor Pago: R$ ${valorPago}`, 20, 50);
        doc.text(`Data do Pagamento: ${data}`, 20, 60);
        doc.text(`Forma de Pagamento: ${forma}`, 20, 70);
        doc.text(`Número de Transação: ${numeroT}`, 20, 80);
        doc.text(`Destino: ${destino}`, 20, 90);
        doc.text(`Referente a: ${referente}`, 20, 100);
        doc.text(`Observações: ${observacoes}`, 20, 110, { maxWidth: 170 });

        doc.setFontSize(10);
        doc.text("--- Detalhes Fiscais ---", 20, 130);
        doc.text(`Instituição/Dono: ${empresa}`, 20, 140);
        doc.text(`CNPJ/CPF do Destino: ${cnpjDes}`, 20, 150);
        doc.text(`CNPJ/CPF do Comprador: ${cnpjComp}`, 20, 160);

        doc.line(20, 170, 190, 170);
        doc.setFontSize(10);
        doc.text("Comprovante gerado automaticamente", 20, 180);

        const pdfOutput = doc.output("blob");
        pdfBlob = URL.createObjectURL(pdfOutput);

        pdfPreview.src = pdfBlob;
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
