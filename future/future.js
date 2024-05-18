document.addEventListener("DOMContentLoaded", () => {
  const gameContainer = document.getElementById("gameContainer");
  const grassSrc = "./assets/img/grass.png";
  const patchSrc = "./assets/img/patch.png";
  const otherSrcs = [
    "./assets/img/road-lanes-2.png",
    "./assets/img/train-track.png",
    patchSrc,
  ];

  const totalSections = 20; // Set the desired length of the sections
  const grassSectionsCount = Math.ceil(totalSections / 6); // Ensure at least a sixth are grass
  const otherSectionsCount = totalSections - grassSectionsCount;

  const grassSections = Array.from({ length: grassSectionsCount }, () =>
    createImageElement(grassSrc, "Grass")
  );
  const otherSections = Array.from({ length: otherSectionsCount }, () =>
    createImageElement(
      otherSrcs[Math.floor(Math.random() * otherSrcs.length)],
      "Other"
    )
  );

  function createImageElement(src, alt) {
    const img = document.createElement("img");
    img.src = src;
    img.alt = alt;
    return img;
  }

  function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }

  function randomizeGameSections() {
    shuffleArray(grassSections);
    shuffleArray(otherSections);

    const randomizedSections = [];
    let grassIndex = 0,
      otherIndex = 0,
      consecutiveRoads = 0;

    // Fill all but the last section
    for (let i = 0; i < totalSections - 1; i++) {
      let nextSection;

      if (i % 2 === 0 && grassIndex < grassSections.length) {
        nextSection = grassSections[grassIndex++];
        consecutiveRoads = 0; // Reset consecutive road counter
      } else if (otherIndex < otherSections.length) {
        nextSection = otherSections[otherIndex++];

        if (
          nextSection.src.includes("patch.png") &&
          (randomizedSections[randomizedSections.length - 1]?.src ===
            grassSrc ||
            randomizedSections[randomizedSections.length - 1]?.src === patchSrc)
        ) {
          if (otherIndex < otherSections.length) {
            nextSection = otherSections[otherIndex++];
          } else {
            nextSection = createImageElement(
              "./assets/img/road-lanes-2.png",
              "Road"
            );
          }
        } else if (
          (nextSection.src.includes("road-lanes-2.png") ||
            nextSection.src.includes("train-track.png")) &&
          consecutiveRoads >= 2
        ) {
          // If more than two consecutive roads, force a non-road section
          if (grassIndex < grassSections.length) {
            nextSection = grassSections[grassIndex++];
          } else {
            nextSection = createImageElement("./assets/img/patch.png", "Patch");
          }
          consecutiveRoads = 0;
        } else {
          if (
            nextSection.src.includes("road-lanes-2.png") ||
            nextSection.src.includes("train-track.png")
          ) {
            consecutiveRoads++;
          } else {
            consecutiveRoads = 0;
          }
        }
      } else if (grassIndex < grassSections.length) {
        nextSection = grassSections[grassIndex++];
        consecutiveRoads = 0; // Reset consecutive road counter
      }

      randomizedSections.push(nextSection);
    }

    // Ensure the last section is always grass
    randomizedSections.push(createImageElement(grassSrc, "Grass"));

    // Append the sections to the game container
    randomizedSections.forEach((section) => gameContainer.appendChild(section));
  }

  randomizeGameSections();
});
