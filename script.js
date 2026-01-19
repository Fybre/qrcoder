document.addEventListener("DOMContentLoaded", function () {
  // Get DOM elements
  const textInput = document.getElementById("text-input");
  const sizeSelect = document.getElementById("size-select");
  const qrCodeContainer = document.getElementById("qrcode");
  const downloadBtn = document.getElementById("download-btn");
  const darkModeToggle = document.getElementById("dark-mode-toggle");

  // Current QR code canvas
  let currentQrCanvas = null;

  // Initialize QR code generation
  function initializeQRCode() {
    // Set up event listeners
    textInput.addEventListener("input", handleTextInput);
    sizeSelect.addEventListener("change", handleSizeChange);

    // Add some sample text to demonstrate functionality
    textInput.value = "https://www.example.com";
    handleTextInput();
  }

  // Handle text input changes
  function handleTextInput() {
    const text = textInput.value.trim();

    if (text) {
      generateQRCode(text, sizeSelect.value);
      downloadBtn.disabled = false;
    } else {
      clearQRCode();
      downloadBtn.disabled = true;
    }
  }

  // Handle size selection changes
  function handleSizeChange() {
    const text = textInput.value.trim();

    if (text) {
      generateQRCode(text, sizeSelect.value);
    } else {
      // Update QR code container size even if no text
      qrCodeContainer.style.width = `${sizeSelect.value}px`;
      qrCodeContainer.style.height = `${sizeSelect.value}px`;
    }
  }

  // Generate QR code using canvas
  function generateQRCode(text, size) {
    // Clear existing QR code
    clearQRCode();

    // Update container size
    qrCodeContainer.style.width = `${size}px`;
    qrCodeContainer.style.height = `${size}px`;

    // Create canvas element
    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;
    qrCodeContainer.appendChild(canvas);
    currentQrCanvas = canvas;

    // Use qrcode library to draw on canvas
    try {
      QRCode.toCanvas(
        canvas,
        text,
        {
          width: size,
          margin: 2,
          color: {
            dark: "#000000",
            light: "#ffffff",
          },
        },
        function (error) {
          if (error) {
            console.error("Error generating QR code:", error);
            clearQRCode();
            qrCodeContainer.textContent = "Error generating QR code";
          }
        },
      );
    } catch (error) {
      console.error("QR code generation failed:", error);
      clearQRCode();
      qrCodeContainer.textContent = "QR generation failed";
    }
  }

  // Clear QR code
  function clearQRCode() {
    if (currentQrCanvas) {
      qrCodeContainer.removeChild(currentQrCanvas);
      currentQrCanvas = null;
    }
    qrCodeContainer.innerHTML = "";
  }

  // Set up download button
  downloadBtn.addEventListener("click", function () {
    const text = textInput.value.trim();
    const size = sizeSelect.value;

    if (!text || !currentQrCanvas) return;

    // Create a temporary canvas to generate the QR code image
    const tempCanvas = document.createElement("canvas");
    tempCanvas.width = size;
    tempCanvas.height = size;

    // Draw QR code on temporary canvas
    QRCode.toCanvas(
      tempCanvas,
      text,
      {
        width: size,
        margin: 2,
        color: {
          dark: "#000000",
          light: "#ffffff",
        },
      },
      function (error) {
        if (error) {
          console.error("Error generating download QR code:", error);
          return;
        }

        // Convert canvas to data URL and trigger download
        const dataUrl = tempCanvas.toDataURL("image/png");
        const downloadLink = document.createElement("a");
        downloadLink.href = dataUrl;
        downloadLink.download = `qrcode_${new Date().getTime()}.png`;
        downloadLink.click();
      },
    );
  });

  // Toggle dark mode
  function toggleDarkMode() {
    document.body.classList.toggle("dark-mode");
    const isDarkMode = document.body.classList.contains("dark-mode");
    darkModeToggle.textContent = isDarkMode ? "☀️ Light Mode" : "🌙 Dark Mode";

    // Save preference to localStorage
    localStorage.setItem("darkMode", isDarkMode);
  }

  // Initialize dark mode from localStorage
  function initializeDarkMode() {
    const savedDarkMode = localStorage.getItem("darkMode");
    if (savedDarkMode === "true") {
      document.body.classList.add("dark-mode");
      darkModeToggle.textContent = "☀️ Light Mode";
    }
  }

  // Initialize the application
  initializeQRCode();
  initializeDarkMode();

  // Set up dark mode toggle
  darkModeToggle.addEventListener("click", toggleDarkMode);
});
