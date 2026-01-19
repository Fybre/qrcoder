document.addEventListener("DOMContentLoaded", function () {
  // Get DOM elements
  const textInput = document.getElementById("text-input");
  const sizeSelect = document.getElementById("size-select");
  const errorCorrectionSelect = document.getElementById("error-correction-select");
  const qrCodeContainer = document.getElementById("qrcode");
  const downloadBtn = document.getElementById("download-btn");
  const downloadSvgBtn = document.getElementById("download-svg-btn");
  const copyBtn = document.getElementById("copy-btn");
  const darkModeToggle = document.getElementById("dark-mode-toggle");
  const urlIndicator = document.getElementById("url-indicator");
  const charCount = document.getElementById("char-count");

  // Current QR code canvas
  let currentQrCanvas = null;
  let debounceTimer = null;

  // QR code capacity limits by error correction level (alphanumeric mode, version 40)
  const capacityLimits = {
    L: 4296,
    M: 3391,
    Q: 2420,
    H: 1852,
  };

  // Helper function to check if text is a URL
  function isUrl(text) {
    try {
      new URL(text);
      return true;
    } catch (e) {
      return false;
    }
  }

  // Helper function to process text (encode if URL)
  function processText(text) {
    return isUrl(text) ? encodeURI(text) : text;
  }

  // Debounce function
  function debounce(func, delay) {
    return function (...args) {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => func.apply(this, args), delay);
    };
  }

  // Update character count and URL indicator
  function updateInputInfo() {
    const text = textInput.value;
    const errorLevel = errorCorrectionSelect.value;
    const limit = capacityLimits[errorLevel];
    const length = text.length;

    // Update character count
    charCount.textContent = `${length} / ~${limit} characters`;
    charCount.classList.remove("warning", "error");
    if (length > limit) {
      charCount.classList.add("error");
    } else if (length > limit * 0.8) {
      charCount.classList.add("warning");
    }

    // Update URL indicator
    if (text.trim() && isUrl(text.trim())) {
      urlIndicator.classList.remove("hidden");
    } else {
      urlIndicator.classList.add("hidden");
    }
  }

  // Initialize QR code generation
  function initializeQRCode() {
    // Set up event listeners with debounce for text input
    textInput.addEventListener("input", debounce(handleTextInput, 300));
    textInput.addEventListener("input", updateInputInfo);
    sizeSelect.addEventListener("change", handleSizeChange);
    errorCorrectionSelect.addEventListener("change", handleErrorCorrectionChange);

    // Add some sample text to demonstrate functionality
    textInput.value = "https://www.example.com";
    updateInputInfo();
    handleTextInput();
  }

  // Handle text input changes
  function handleTextInput() {
    const text = textInput.value.trim();

    if (text) {
      generateQRCode(processText(text), sizeSelect.value);
      setButtonsEnabled(true);
    } else {
      clearQRCode();
      setButtonsEnabled(false);
    }
  }

  // Handle size selection changes
  function handleSizeChange() {
    const text = textInput.value.trim();

    if (text) {
      generateQRCode(processText(text), sizeSelect.value);
    } else {
      // Update QR code container size even if no text
      qrCodeContainer.style.width = `${sizeSelect.value}px`;
      qrCodeContainer.style.height = `${sizeSelect.value}px`;
    }
  }

  // Handle error correction level changes
  function handleErrorCorrectionChange() {
    updateInputInfo();
    const text = textInput.value.trim();
    if (text) {
      generateQRCode(processText(text), sizeSelect.value);
    }
  }

  // Enable/disable action buttons
  function setButtonsEnabled(enabled) {
    downloadBtn.disabled = !enabled;
    downloadSvgBtn.disabled = !enabled;
    copyBtn.disabled = !enabled;
  }

  // Generate QR code using canvas
  function generateQRCode(text, size = 256) {
    size = parseInt(size, 10);
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
          errorCorrectionLevel: errorCorrectionSelect.value,
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
            setButtonsEnabled(false);
          }
        },
      );
    } catch (error) {
      console.error("QR code generation failed:", error);
      clearQRCode();
      qrCodeContainer.textContent = "QR generation failed";
      setButtonsEnabled(false);
    }
  }

  // Clear QR code
  function clearQRCode() {
    qrCodeContainer.innerHTML = "";
    currentQrCanvas = null;
  }

  // Set up download PNG button
  downloadBtn.addEventListener("click", function () {
    if (!currentQrCanvas) return;

    const dataUrl = currentQrCanvas.toDataURL("image/png");
    const downloadLink = document.createElement("a");
    downloadLink.href = dataUrl;
    downloadLink.download = `qrcode_${Date.now()}.png`;
    downloadLink.click();
  });

  // Set up download SVG button
  downloadSvgBtn.addEventListener("click", function () {
    const text = textInput.value.trim();
    if (!text) return;

    const processedText = processText(text);
    const size = parseInt(sizeSelect.value, 10);

    QRCode.toString(
      processedText,
      {
        type: "svg",
        width: size,
        margin: 2,
        errorCorrectionLevel: errorCorrectionSelect.value,
        color: {
          dark: "#000000",
          light: "#ffffff",
        },
      },
      function (error, svgString) {
        if (error) {
          console.error("Error generating SVG:", error);
          return;
        }

        const blob = new Blob([svgString], { type: "image/svg+xml" });
        const url = URL.createObjectURL(blob);
        const downloadLink = document.createElement("a");
        downloadLink.href = url;
        downloadLink.download = `qrcode_${Date.now()}.svg`;
        downloadLink.click();
        URL.revokeObjectURL(url);
      },
    );
  });

  // Set up copy to clipboard button
  copyBtn.addEventListener("click", async function () {
    if (!currentQrCanvas) return;

    try {
      const blob = await new Promise((resolve) =>
        currentQrCanvas.toBlob(resolve, "image/png"),
      );
      await navigator.clipboard.write([
        new ClipboardItem({ "image/png": blob }),
      ]);

      // Show feedback
      const originalText = copyBtn.textContent;
      copyBtn.textContent = "Copied!";
      copyBtn.classList.add("copied");

      setTimeout(() => {
        copyBtn.textContent = originalText;
        copyBtn.classList.remove("copied");
      }, 2000);
    } catch (error) {
      console.error("Failed to copy to clipboard:", error);
      alert("Failed to copy to clipboard. Your browser may not support this feature.");
    }
  });

  // Toggle light mode (since dark mode is now default)
  function toggleDarkMode() {
    document.body.classList.toggle("light-mode");
    const isLightMode = document.body.classList.contains("light-mode");
    darkModeToggle.textContent = isLightMode ? "🌙 Dark Mode" : "☀️ Light Mode";

    // Save preference to localStorage
    localStorage.setItem("lightMode", isLightMode);
  }

  // Initialize theme from localStorage
  function initializeTheme() {
    const savedLightMode = localStorage.getItem("lightMode");
    if (savedLightMode === "true") {
      document.body.classList.add("light-mode");
      darkModeToggle.textContent = "🌙 Dark Mode";
    } else {
      darkModeToggle.textContent = "☀️ Light Mode";
    }
  }

  // Initialize the application
  initializeQRCode();
  initializeTheme();

  // Set up dark mode toggle
  darkModeToggle.addEventListener("click", toggleDarkMode);
});
