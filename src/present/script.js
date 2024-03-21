let buttonCounter = 0; 
const tool = document.getElementById('tool');
const text = document.getElementById('text');
let canClick = true; 

function toggleTool(){
  if (canClick) { 
    buttonCounter++;
    update();
    canClick = false; 
    setTimeout(() => {
      canClick = true; 
    }, 2100); 
  }
}

function update(){
  if(buttonCounter == 1){
    var body = document.getElementsByTagName('body')[0];
    body.style.backgroundImage = 'url(assets/1.1.png)';
    tool.style.backgroundImage = 'url(assets/hammer.png)'
    text.innerHTML = "Yay! It look's better ... but what happened to the windows?"
    transition()
    rotateToolOnce()
  }
  if(buttonCounter == 2){
    var body = document.getElementsByTagName('body')[0];
    body.style.backgroundImage = 'url(assets/1.2.png)';
    tool.style.backgroundImage = 'url(assets/paintbrush.png)'
    text.innerHTML = "Hmmm, it's missing some color, let's see if you have what it takes."
    transition()
    rotateToolOnce()
  }
  if(buttonCounter == 3){
    var body = document.getElementsByTagName('body')[0];
    body.style.backgroundImage = 'url(assets/1.3.png)';
    tool.style.backgroundImage = 'url(assets/paintbrush.png)'
    text.innerHTML = "Putting those art skills to good use yet? Draw the MBTA logo!"
    transition()
    rotateToolOnce()
  }
  if(buttonCounter == 4){
    var body = document.getElementsByTagName('body')[0];
    body.style.backgroundImage = 'url(assets/1.4.png)';
    tool.style.backgroundImage = 'url(assets/door.png)'
    text.innerHTML = "The outside looks really good! Let's hope it's not THAT bad inside..."
    transition()
    rotateToolOnce()
  }
  if(buttonCounter == 5){
    var body = document.getElementsByTagName('body')[0];
    body.style.backgroundImage = 'url(assets/2.0.png)';
    tool.style.backgroundImage = 'url(assets/broom.png)'
    text.innerHTML = "Dang it, looks like we have ALOT more work to do."
    transition()
    rotateToolOnce()
  }
  if(buttonCounter == 6){
    var body = document.getElementsByTagName('body')[0];
    body.style.backgroundImage = 'url(assets/2.1.png)';
    tool.style.backgroundImage = 'url(assets/paintbrush.png)'
    text.innerHTML = "Well don't just stand there, there's more work to be done."
    transition()
    rotateToolOnce()
  }
  if(buttonCounter == 7){
    var body = document.getElementsByTagName('body')[0];
    body.style.backgroundImage = 'url(assets/2.2.png)';
    tool.style.backgroundImage = 'url(assets/hammer.png)'
    text.innerHTML = "Just trust me. The hard work will pay off, I can feel it."
    transition()
    rotateToolOnce()
  }
  if(buttonCounter == 8){
    var body = document.getElementsByTagName('body')[0];
    body.style.backgroundImage = 'url(assets/2.3.png)';
    tool.style.backgroundImage = 'url(assets/scissors.png)'
    text.innerHTML = "Good work, I like where this is going. Almost there...!"
    transition()
    rotateToolOnce()
  }
  if(buttonCounter == 9){
    var body = document.getElementsByTagName('body')[0];
    body.style.backgroundImage = 'url(assets/2.4.png)';
    tool.style.backgroundImage = 'url(assets/door.png)'
    text.innerHTML = "With YOUR help, this is what our Red Line can be like."
    transition()
    rotateToolOnce()
  }
  if(buttonCounter >= 10){
    if(buttonCounter%2 == 0){
      var body = document.getElementsByTagName('body')[0];
      body.style.backgroundImage = 'url(assets/3.0.png)';
      tool.style.backgroundImage = 'url(assets/view.png)'
      text.innerHTML = ""
      transition()
      rotateToolOnce()
    } else {
      var body = document.getElementsByTagName('body')[0];
      body.style.backgroundImage = 'url(assets/3.1.png)';
      tool.style.backgroundImage = 'url(assets/view.png)'
      text.innerHTML = ""
      transition()
      rotateToolOnce()
    }
  }
}

function transition(){
  var transitionDiv = document.querySelector('.transition');
  transitionDiv.style.display = 'flex';
  var transitionImg = transitionDiv.querySelector('img');
  transitionImg.addEventListener('animationend', () => {
    transitionDiv.style.display = 'none';
  }, {once: true});
}

function rotateToolOnce() {
  const tool = document.getElementById('tool');
  tool.style.animation = 'rotateToolOnce 0.5s linear forwards';
  tool.addEventListener('animationend', () => {
    tool.style.animation = '';
  }, {once: true});
}