document.addEventListener("scroll", function() {
    const imageContainer = document.getElementById("imageContainer");
    const scrollPosition = window.scrollY + window.innerHeight;
    const imagePosition = imageContainer.offsetTop;
    
    if (scrollPosition > imagePosition) {
        imageContainer.classList.add("show");
    }
});