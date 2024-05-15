document.addEventListener("DOMContentLoaded", function () {
  setTimeout(() => {
    document.getElementById("loading-screen").classList.add("hidden");
    document.getElementById("main-screen").classList.remove("hidden");
  }, 3000); // 3000 milliseconds = 3 seconds
});
