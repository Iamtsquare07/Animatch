let savedScore = parseInt(localStorage.getItem("score")) || 0;
let score = savedScore;
let highScore = parseInt(localStorage.getItem("highScore")) || 0;
let matchedImages = JSON.parse(localStorage.getItem("matchedImages")) || [];

function restart() {
  const url = window.location.href;
  window.location.replace(url);
}

function clearGameState() {
    localStorage.removeItem("matchedImages"); 
    localStorage.removeItem("score");
}

let root = document.querySelector(".root"),
  eachTemplate = root.querySelector(".each").cloneNode(true),
  boxCount = 12,
  images = [],
  clickedItems = [],
  boxes = []

images.push({
  url: "https://blogger.googleusercontent.com/img/a/AVvXsEg-aSjqFw8zBJLXJhBHz7efkJ4PZQCgyIKLlOpEcXwhP6arVghJUrYnM8IK6AEv3-buCjs_-uMTof9xlt-cB0NxveL6iLpX4HB-IVCpwiagSc7Xm8C-jWsV0Z67QksjxhUnu9vXi3FN5U3Bb4FxocJ8eVBP2ty8ACiHe7LXu2dgh6hMASfLC2ktTbsjtQ=s320"
});
images.push({
  url: "https://blogger.googleusercontent.com/img/a/AVvXsEgT5TLC2HiFyEoPRnMChSVuZlvUDPdsrSNZ962z69Qave5_qp8dD9xklDSl8JcPxzHxVVhE7pUKNqUS9amlRK9Vfp8y5L8d9kRXguZcdiuJn8tM9GO5RudXcFxg9AzP41-65nBDN6uuEYwPWq0GD9ZXEIm_zK_kXir-pAyOldJkmsf8mmm_zsjMfdyk4Q=s320"
});
images.push({
  url: "https://blogger.googleusercontent.com/img/a/AVvXsEgQQAxBSJPI65EfLphjrA4N7cTFnRKwuFglgmj25lDBIgnC1V2w8Ck8yZzuwAE1nm1uK2zocd34WQ9pOCMtw2MqVV4O8yzvs40gquI4bkh23Y7L5LhUQnFnKpbjNHR3KHIR3MFOBfcrOAWiEPfQjT04NTlEKok92y1gk9O_NNqyQiLL5Ib0riS3HBuDbg=s320"
});
images.push({
  url: "https://blogger.googleusercontent.com/img/a/AVvXsEhcFSdoq2utB7E5m4AQOsNQd1tQaujsz_zbOq0dB3nlp6eJTv8zE20BJlL4PIE38S-WLHjmJeS6Q4Zd2tRw0igzRe8SXOn2PIPrAdouhl5YAK5qG_Pu-m9txKDRjvzltVyjM-y8amdrvkO8j_HofZQMUUc9qbXCDzEfEoD6cAdqwsOOLC8JtX7UX_p7ow=s320"
});
images.push({
  url: "https://blogger.googleusercontent.com/img/a/AVvXsEijiiDp74KbBjBx0zpOsY2njcwZ0G78rmfA7P2izqsOKNDfB4_MVWpaRbkeuivk4l2bMUCimButv4JEqkd6DtgD6Zd11Owm418uIi2pbqfiouKjBIxrMIJfs-N7Yq70jQLRQzbHJ3zyT0PZoaxuuiB69JvgqS28bmvSUB4SH_4b2CKIhWS8_1L8t10Hkw=s320"
});
images.push({
  url: "https://blogger.googleusercontent.com/img/a/AVvXsEgK7YOawwCRbctdduU440Mk-A7UADC-oDgevQhhQvYx7-dqGGWWRckX2_wbWPjpr8739doAe033KTF_QHIBwJWSmRpZ9DpYCXKN1MZ72O9mVq-xUHK4aRpUOewd6L5OJ-dey6_iYOHO_116zNv_5iY0Zk91GxCFVEl4L1yBGA9UHoGBw_iEJaLVD-oaew=s320"
});

for (let c = 0; c < boxCount; c++) {
  boxes.push(images[c % images.length]);
} 

function shuffle(array) {
  let currentIndex = array.length,
    randomIndex;
  while (currentIndex != 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex]
    ];
  }
  return array;
}

function renderBoxes(arr) {
  root.innerHTML = "";
  arr.forEach((each, i) => {
    var newEl = eachTemplate.cloneNode(true)
    newEl.ref = each // attaching image object reference to each element
    newEl.querySelector("img").src = each.url
    root.appendChild(newEl)
  });
}

function game(match, failed, win) {
  renderBoxes(shuffle(boxes)) // shuffling array then passing it to render function
  root.querySelectorAll(".each").forEach(each => {
    each.onclick = function () {
      if (each.classList.contains("show")) { return true } // stop function if clicked on solved or same element

      clickedItems.push(each)
      each.classList.add("show")

      if (clickedItems.length == 2) { // on second click
        var one = clickedItems[0],
          two = clickedItems[1],
          isMatched = one.ref === two.ref // comparing two object reference of image object

        if (isMatched) {
          match()
          matchedImages.push(one.ref.url); 
          matchedImages.push(two.ref.url); // Save the matched image URL
          localStorage.setItem("matchedImages", JSON.stringify(matchedImages)); // Save matched images to localStorage

          if (root.querySelectorAll(".show").length == boxCount) { win() }
        } else {
          failed()
          var toRemove = clickedItems
          setTimeout(function () {
            toRemove.forEach(ss => ss.classList.remove("show"))
          }, 800)
        }
        clickedItems = [] // reset clicks
      }
    }
  })

  // Load matched images from localStorage
  matchedImages.forEach(url => {
    const matchedElements = root.querySelectorAll(`.each img[src="${url}"]`);
    if (matchedElements.length === 2) {
      matchedElements.forEach(element => {
        element.parentElement.classList.add("show");
      });
    }
  });
}

let scoreBoard = document.querySelector("#score");
let highScoreBoard = document.querySelector("#highScore");
var textEl = document.querySelector(".text")

game(
    function () { // if matched
      textEl.innerText = "Matched 😀";
      textEl.style.color = "blue";
      score += 50;
      scoreBoard.innerHTML = `Score: ${score}`;
      localStorage.setItem("score", score); // Save the score to localStorage
    },
    function () { // if not matched
      textEl.innerText = "Wrong 😯";
      textEl.style.color = "red";
      if (score > 5) { score -= 5; }
      scoreBoard.innerHTML = `Score: ${score}`;
      localStorage.setItem("score", score); // Save the score to localStorage
    },
    function () { // if won
      textEl.style.color = "green";
      textEl.innerHTML = `Game Completed 🥳🥳<br><button onclick="restart()">Restart Game</button>`;
      savedScore = score;
      localStorage.setItem("score", savedScore); // Save the final score to localStorage
  
      if (savedScore > highScore) {
        highScore = savedScore;
        localStorage.setItem("highScore", highScore);
        highScoreBoard.innerHTML = `New High Score: ${highScore}`;
      } else {
        highScoreBoard.innerHTML = `Your High Score: ${highScore}`;
      }

      clearGameState()
    }
  );