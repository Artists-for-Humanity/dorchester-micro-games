document.addEventListener("DOMContentLoaded", () => {
  const gameContainer = document.getElementById("gameContainer");
  const grassSrc = "./assets/img/grass.png";
  const patchSrc = "./assets/img/patch.png";
  const roadSrc = "./assets/img/road-lanes-2.png";
  const trainTrackSrc = "./assets/img/train-track.png";

  // Define the array of sections manually
  const sections = [
    { src: grassSrc, alt: "Grass" },
    { src: patchSrc, alt: "Patch" },
    { src: roadSrc, alt: "Road" },
    { src: trainTrackSrc, alt: "Train Track" },
    { src: patchSrc, alt: "Patch" },
    { src: trainTrackSrc, alt: "Train Track" },
    { src: patchSrc, alt: "Patch" },
    { src: roadSrc, alt: "Road" },
    { src: patchSrc, alt: "Patch" },
    { src: trainTrackSrc, alt: "Train Track" },

    { src: grassSrc, alt: "Grass" },
  ];

  function createImageElement(src, alt) {
    const img = document.createElement("img");
    img.src = src;
    img.alt = alt;
    return img;
  }

  function setupGameSections() {
    sections.forEach((section) => {
      const imgElement = createImageElement(section.src, section.alt);
      gameContainer.appendChild(imgElement);
    });
  }
  setupGameSections();

});
