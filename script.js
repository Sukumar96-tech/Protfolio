// Scroll reveal
const sections = document.querySelectorAll("section");
const reveal = () => {
  const trigger = window.innerHeight * 0.8;
  sections.forEach(sec => {
    const top = sec.getBoundingClientRect().top;
    if (top < trigger) sec.classList.add("visible");
  });
};
window.addEventListener("scroll", reveal);
reveal();

// Typing effect
const typingText = ["AI & ML Student", "Developer", "Innovator"];
let index = 0, char = 0;

function type() {
  if (char < typingText[index].length) {
    document.getElementById("typing").innerHTML += typingText[index].charAt(char);
    char++;
    setTimeout(type, 100);
  } else {
    setTimeout(erase, 1500);
  }
}

function erase() {
  if (char > 0) {
    document.getElementById("typing").innerHTML = typingText[index].substring(0, char-1);
    char--;
    setTimeout(erase, 50);
  } else {
    index = (index+1) % typingText.length;
    setTimeout(type, 500);
  }
}

type();
