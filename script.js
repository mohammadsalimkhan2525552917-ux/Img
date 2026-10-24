const promptInput = document.getElementById("prompt");

const styleSelect = document.getElementById("style");
const ratioSelect = document.getElementById("ratio");
const qualitySelect = document.getElementById("quality");

const generateBtn = document.getElementById("generateBtn");

const imageContainer = document.getElementById("imageContainer");

const resultStatus = document.getElementById("resultStatus");

const downloadBtn = document.getElementById("downloadBtn");
const regenerateBtn = document.getElementById("regenerateBtn");

let currentImage = null;


/* EXAMPLE PROMPTS */

document.querySelectorAll(".prompt-card").forEach(card => {

  card.addEventListener("click", () => {

    promptInput.value = card.dataset.prompt;

    promptInput.focus();

    document
      .getElementById("generator")
      .scrollIntoView({
        behavior: "smooth"
      });

  });

});


/* GENERATE */

generateBtn.addEventListener("click", async () => {

  const prompt = promptInput.value.trim();

  if (!prompt) {

    alert("Please enter an image prompt first.");

    promptInput.focus();

    return;

  }


  generateBtn.disabled = true;

  generateBtn.innerHTML = "Generating...";

  resultStatus.textContent = "Creating your image...";


  /*
    IMPORTANT:

    Abhi backend connected nahi hai.

    Next step mein is jagah Node.js backend ka
    API request connect hoga.
  */

  await new Promise(resolve => setTimeout(resolve, 1800));


  imageContainer.innerHTML = `
    <div class="placeholder">
      <div class="placeholder-icon">✦</div>

      <h3>Backend not connected</h3>

      <p>
        The frontend is working.
        Connect the Node.js image API to generate real images.
      </p>
    </div>
  `;


  resultStatus.textContent = "Waiting for API connection";

  generateBtn.disabled = false;

  generateBtn.innerHTML = "✦ Generate Image";

});


/* REGENERATE */

regenerateBtn.addEventListener("click", () => {

  generateBtn.click();

});


/* DOWNLOAD */

downloadBtn.addEventListener("click", () => {

  if (!currentImage) return;

  const link = document.createElement("a");

  link.href = currentImage;

  link.download = "visionai-image.png";

  link.click();

});
