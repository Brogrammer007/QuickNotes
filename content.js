(function() {
  if (window.qnLoaded) return;
  window.qnLoaded = true;

  var note = document.createElement('div');
  note.id = 'qn-container';
  note.style.display = 'none';
  
  // HTML sa dugmićima
  note.innerHTML = `
    <div class="qn-header">
      <div class="qn-controls-left">
        <div class="qn-color-btn qn-c-yellow" data-c="yellow"></div>
        <div class="qn-color-btn qn-c-blue" data-c="blue"></div>
        <div class="qn-color-btn qn-c-green" data-c="green"></div>
        <div class="qn-color-btn qn-c-pink" data-c="pink"></div>
        <div class="qn-color-btn qn-c-dark" data-c="dark"></div>
        <button class="qn-btn" id="qn-font" title="Font">Aa</button>
        <button class="qn-btn" id="qn-size" title="Size">T+</button>
        <button class="qn-btn" id="qn-ghost" title="Ghost">👻</button>
        <button class="qn-btn" id="qn-pin" title="Pin">📌</button>
      </div>
      <div class="qn-controls-right">
        <button class="qn-btn" id="qn-min">_</button>
        <button class="qn-btn" id="qn-close">✕</button>
      </div>
    </div>
    <textarea class="qn-area" placeholder="Quick note..."></textarea>
    <div class="qn-resize-handle"></div>
  `;
  
  document.body.appendChild(note);

  // Elementi
  var area = note.querySelector('.qn-area');
  var header = note.querySelector('.qn-header');
  var url = window.location.href;

  // Stanja
  var fonts = ['hand', 'sans', 'mono', 'serif'];
  var sizes = [14, 16, 18, 20, 24];
  var savedH = 200;

  // Učitavanje
  chrome.storage.local.get(url, (data) => {
    if (data[url]) {
      var d = data[url];
      area.value = d.text || '';
      note.style.top = (d.top || 100) + 'px';
      note.style.left = (d.left || 100) + 'px';
      note.style.width = (d.width || 250) + 'px';
      
      if (d.color && d.color !== 'yellow') note.classList.add('qn-' + d.color);
      if (d.font && d.font !== 'hand') note.classList.add('qn-font-' + d.font);
      if (d.size) area.style.fontSize = d.size + 'px';
      if (d.ghost) note.classList.add('qn-ghost');
      
      if (d.minimized) {
        savedH = d.height || 200;
        note.classList.add('qn-minimized');
        note.querySelector('#qn-min').textContent = '+';
      } else {
        note.style.height = (d.height || 200) + 'px';
      }
      
      if (d.visible) note.style.display = 'flex';
    } else {
      note.style.top = '100px';
      note.style.left = '100px';
    }
  });

  // Funkcije
  function save(isVisible) {
    var vis = (typeof isVisible === 'boolean') ? isVisible : (note.style.display !== 'none');
    
    // Nadji boju i font
    var color = 'yellow';
    ['blue', 'green', 'pink', 'dark'].forEach(c => {
      if (note.classList.contains('qn-' + c)) color = c;
    });
    
    var font = 'hand';
    fonts.forEach(f => {
      if (note.classList.contains('qn-font-' + f)) font = f;
    });

    var data = {};
    data[url] = {
      text: area.value,
      top: note.offsetTop,
      left: note.offsetLeft,
      width: note.offsetWidth,
      height: note.classList.contains('qn-minimized') ? savedH : note.offsetHeight,
      visible: vis,
      color: color,
      font: font,
      size: parseInt(area.style.fontSize) || 16,
      ghost: note.classList.contains('qn-ghost'),
      minimized: note.classList.contains('qn-minimized')
    };
    chrome.storage.local.set(data);
  }

  // Event Listeners
  chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
    if (msg.action === "toggle") {
      if (note.style.display === 'none') {
        note.style.display = 'flex';
        save(true);
      } else {
        note.style.display = 'none';
        save(false);
      }
      sendResponse({status: "ok"});
    }
  });

  area.addEventListener('input', () => save());
  note.querySelector('#qn-close').onclick = () => { note.style.display = 'none'; save(false); };

  // Colors
  note.querySelectorAll('.qn-color-btn').forEach(btn => {
    btn.onclick = (e) => {
      e.stopPropagation();
      var c = btn.getAttribute('data-c');
      ['blue', 'green', 'pink', 'dark'].forEach(cls => note.classList.remove('qn-' + cls));
      if (c !== 'yellow') note.classList.add('qn-' + c);
      save();
    };
  });

  // Fonts
  note.querySelector('#qn-font').onclick = (e) => {
    e.stopPropagation();
    var cur = 'hand';
    fonts.forEach(f => { if(note.classList.contains('qn-font-'+f)) cur = f; });
    var next = fonts[(fonts.indexOf(cur) + 1) % fonts.length];
    fonts.forEach(f => note.classList.remove('qn-font-' + f));
    note.classList.add('qn-font-' + next);
    save();
  };

  // Size
  note.querySelector('#qn-size').onclick = (e) => {
    e.stopPropagation();
    var cur = parseInt(area.style.fontSize) || 16;
    var next = sizes[(sizes.indexOf(cur) + 1) % sizes.length];
    area.style.fontSize = next + 'px';
    save();
  };

  // Ghost
  note.querySelector('#qn-ghost').onclick = (e) => {
    e.stopPropagation();
    note.classList.toggle('qn-ghost');
    save();
  };

  // Pin
  note.querySelector('#qn-pin').onclick = (e) => {
    e.stopPropagation();
    var w = window.innerWidth, h = window.innerHeight;
    var nw = note.offsetWidth, nh = note.offsetHeight;
    var t = note.offsetTop, l = note.offsetLeft;
    
    // Logika: Koji je kvadrant?
    if (l > w/2 && t < h/2) { note.style.left = (w-nw-20)+'px'; note.style.top = (h-nh-20)+'px'; } // Top-Right -> Bottom-Right
    else if (l > w/2) { note.style.left = '20px'; note.style.top = (h-nh-20)+'px'; } // Bottom-Right -> Bottom-Left
    else if (t > h/2) { note.style.left = '20px'; note.style.top = '20px'; } // Bottom-Left -> Top-Left
    else { note.style.left = (w-nw-20)+'px'; note.style.top = '20px'; } // Top-Left -> Top-Right
    
    save();
  };

  // Minimize
  note.querySelector('#qn-min').onclick = (e) => {
    e.stopPropagation();
    if (note.classList.contains('qn-minimized')) {
      note.classList.remove('qn-minimized');
      note.style.height = savedH + 'px';
      e.target.textContent = '_';
    } else {
      savedH = note.offsetHeight;
      note.classList.add('qn-minimized');
      note.style.height = 'auto';
      e.target.textContent = '+';
    }
    save();
  };

  // Dragging
  var isDragging = false, startX, startY, origLeft, origTop;
  header.onmousedown = (e) => {
    if (e.target.tagName === 'BUTTON' || e.target.classList.contains('qn-color-btn')) return;
    isDragging = true;
    startX = e.clientX;
    startY = e.clientY;
    origLeft = note.offsetLeft;
    origTop = note.offsetTop;
    e.preventDefault();
  };

  document.addEventListener('mousemove', (e) => {
    if (isDragging) {
      note.style.left = (origLeft + (e.clientX - startX)) + 'px';
      note.style.top = (origTop + (e.clientY - startY)) + 'px';
    }
  });

  document.addEventListener('mouseup', () => {
    if (isDragging) { isDragging = false; save(); }
  });

  // Resize
  var resizeHandle = note.querySelector('.qn-resize-handle');
  var isResizing = false;
  resizeHandle.onmousedown = (e) => {
    isResizing = true;
    startX = e.clientX;
    startY = e.clientY;
    origLeft = note.offsetWidth;
    origTop = note.offsetHeight;
    e.preventDefault();
    e.stopPropagation();
  };
  
  document.addEventListener('mousemove', (e) => {
    if (isResizing) {
      note.style.width = Math.max(150, origLeft + (e.clientX - startX)) + 'px';
      note.style.height = Math.max(100, origTop + (e.clientY - startY)) + 'px';
    }
  });

  document.addEventListener('mouseup', () => {
    if (isResizing) { isResizing = false; save(); }
  });

})();
