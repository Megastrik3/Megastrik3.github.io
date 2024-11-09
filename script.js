document.getElementById("otherBtn").addEventListener("click", function() {
    const inputBox = document.getElementById("locationDD");
    if (inputBox.style.display === "none") {
        inputBox.style.display = "block";
    } else {
        inputBox.style.display = "none";
    }
}); 

