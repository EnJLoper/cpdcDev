// ===== Custom Popup Function =====
function showPopup(message, type = "info") {
  const popup = document.createElement("div");
  popup.className = `custom-popup ${type}`;
  popup.innerHTML = `
    <div class="popup-content">
      <span class="popup-message">${message}</span>
      <button class="popup-btn">OK</button>
    </div>
  `;
  document.body.appendChild(popup);

  setTimeout(() => popup.classList.add("show"), 10);

  popup.querySelector(".popup-btn").addEventListener("click", () => {
    popup.classList.remove("show");
    setTimeout(() => popup.remove(), 300);
  });
}

// ===== QR Code Generator =====
function generateQR() {
  const qrText = document.getElementById("qrText").value;
  const qrColor = document.getElementById("qrColor").value;
  const bgColor = document.getElementById("bgColor").value;
  const qrSize = parseInt(document.getElementById("qrSize").value);
  const transparentBg = document.getElementById("transparentBg").checked;
  const qrResult = document.getElementById("qrResult");
  const downloadBtn = document.getElementById("downloadBtn");

  if (qrText.trim() === "") {
    showPopup("⚠ Please enter the employee’s information.", "error");
    return;
  }

  qrResult.innerHTML = "";

  const scale = 4; // HD scaling factor
  const hdSize = qrSize * scale;

  const canvas = document.createElement("canvas");
  canvas.width = hdSize;
  canvas.height = hdSize;
  qrResult.appendChild(canvas);
  const ctx = canvas.getContext("2d");

  const tempDiv = document.createElement("div");
  new QRCode(tempDiv, {
    text: qrText,
    width: hdSize,
    height: hdSize,
    colorDark: qrColor,
    colorLight: transparentBg ? "#ffffff" : bgColor,
    correctLevel: QRCode.CorrectLevel.H
  });

  setTimeout(() => {
    const tempImg = tempDiv.querySelector("img");

    if (tempImg) {
      const tempCanvas = document.createElement("canvas");
      tempCanvas.width = hdSize;
      tempCanvas.height = hdSize;
      const tempCtx = tempCanvas.getContext("2d");

      const image = new Image();
      image.src = tempImg.src;
      image.onload = () => {
        tempCtx.drawImage(image, 0, 0, hdSize, hdSize);

        const imageData = tempCtx.getImageData(0, 0, hdSize, hdSize);
        const data = imageData.data;

        if (transparentBg) {
          for (let i = 0; i < data.length; i += 4) {
            if (data[i] === 255 && data[i + 1] === 255 && data[i + 2] === 255) {
              data[i + 3] = 0; // Make white pixels transparent
            }
          }
        }

        ctx.putImageData(imageData, 0, 0);

        const displayCanvas = document.createElement("canvas");
        displayCanvas.width = qrSize;
        displayCanvas.height = qrSize;
        const displayCtx = displayCanvas.getContext("2d");
        displayCtx.drawImage(canvas, 0, 0, qrSize, qrSize);

        qrResult.innerHTML = "";
        qrResult.appendChild(displayCanvas);
        qrResult.hdCanvas = canvas;

        downloadBtn.style.display = "block";
      };
    }
  }, 300);
}




// ===== Download QR Code =====
function downloadQR() {
  const qrResult = document.getElementById("qrResult");
  const hdCanvas = qrResult.hdCanvas;
  const qrText = document.getElementById("qrText").value.trim();

  if (!hdCanvas) {
    showPopup("⚠ Generate a QR code first!", "error");
    return;
  }

  if (qrText === "") {
    showPopup("⚠ QR content is missing.", "error");
    return;
  }

  const link = document.createElement("a");
  link.href = hdCanvas.toDataURL("image/png");
  link.download = `${qrText}.png`;
  link.click();

  showPopup(`💾 QR Code for "${qrText}" downloaded successfully!`, "success");
}


function formatText(command) {
  document.execCommand(command, false, null);
}

// Save content before submitting form
function saveContent() {
  document.getElementById('employee_info').value =
    document.getElementById('qrText').innerHTML;
}
