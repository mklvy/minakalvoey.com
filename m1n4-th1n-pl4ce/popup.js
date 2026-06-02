var inactivityTime = 2 * 60 * 1000;
var fallbackTime = 30 * 1000;
var inactivityTimer;
var fallbackTimer;

// create popup HTML dynamically so we don't need it in every HTML file
var popupEl = document.createElement('div');
popupEl.id = 'inactivity-popup';
popupEl.style.cssText = 'display:none; position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.85); z-index:9999; font-family:Arial Narrow,sans-serif; font-style:none; color:white;';
popupEl.innerHTML = `
  <div style="position:absolute; top:50%; left:50%; transform:translate(-50%,-50%); text-align:center;">
    <p style="font-size:1.4em; margin-bottom:40px;">Still there?</p>
    <div style="display:flex; gap:60px; justify-content:center;">
      <span id="popup-continue" style="font-size:1.4em; cursor:pointer;">Continue</span>
      <span id="popup-restart" style="font-size:1.4em; cursor:pointer;">Restart</span>
    </div>
  </div>
`;
document.body.appendChild(popupEl);

function showPopup() {
  popupEl.style.display = 'block';
  fallbackTimer = setTimeout(function() {
    window.location.href = 'index.html';
  }, fallbackTime);
}

function resetTimer() {
  clearTimeout(inactivityTimer);
  clearTimeout(fallbackTimer);
  if (popupEl.style.display === 'block') return;
  inactivityTimer = setTimeout(showPopup, inactivityTime);
}

document.getElementById('popup-continue').addEventListener('click', function() {
  popupEl.style.display = 'none';
  clearTimeout(fallbackTimer);
  resetTimer();
});

document.getElementById('popup-restart').addEventListener('click', function() {
  localStorage.removeItem('maze-visited');
  window.location.href = 'index.html';
});

document.addEventListener('mousemove', resetTimer);
document.addEventListener('keydown', resetTimer);
document.addEventListener('click', resetTimer);

resetTimer();