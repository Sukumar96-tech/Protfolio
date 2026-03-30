const roles = ["AI/ML Engineer", "Python Developer", "Web Developer"];
let i = 0, j = 0;
let text = "";
let deleting = false;

function type() {
  if (i < roles.length) {
    if (!deleting && j <= roles[i].length) {
      text = roles[i].substring(0, j++);
    } else if (deleting && j >= 0) {
      text = roles[i].substring(0, j--);
    }

    document.getElementById("typing").innerHTML = text;

    if (j === roles[i].length) deleting = true;
    if (j === 0) {
      deleting = false;
      i++;
    }

    setTimeout(type, deleting ? 50 : 100);
  } else {
    i = 0;
  }
}

type();
