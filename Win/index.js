import { criaApp } from "./apps.js";
let openApps = [];
let lastIndex = 5;
let offset = [0, 0];
let mousePosition;
let lastPosition = [];

const main = document.getElementById("main");
const menu = document.getElementById("painel-menu");
const btn_iniciar = document.getElementById("btn-iniciar");
const barraMenu = document.getElementById("barra-menu");

// Botões da barra de tarefas 👇🏻
const btnAddStock = document.getElementById("btn-AddStock");
const chrome = document.getElementById("btn-Chrome");
// Botões da barra de tarefas ☝🏻

const menuPopup = document.createElement("div");
menuPopup.classList.add("menuPopup");
const btnTask = document.createElement("button");
btnTask.classList.add("btnSelections");


//CAPTURA O CLICK DO BOTÃO INICIAR E EXIBE A PAINEL DE MENU
btn_iniciar.addEventListener("click", function () {
  menu.classList.toggle("toggleMostrar");
});

document.addEventListener("contextmenu", (e) => {
  e.preventDefault();
});

// Abre o App:
const openApp = (name, icon) => {
  let appExists = false;
  let childs = main.children;
  let app = document.documentElement;

  for (let i = 0; i < childs.length; i++) {
    if (childs[i].id == name) {
      appExists = true;
      break;
    }
  }

  if (!appExists) {
    app = criaApp(name);
    app.setAttribute("id", name);
    app.style.opacity = 1;

    const appBar = document.createElement("div");
    appBar.classList.add("appBarContainer");
    const aboutApp = document.createElement("div");
    aboutApp.classList.add("aboutApp");
    const containerApp = document.createElement("iframe");
    containerApp.classList.add("containerApp");

    // Div dos botões
    const actionBtns = document.createElement("div");
    actionBtns.setAttribute("class", "actionBtns");

    // Botões 👇🏻
    const cMinBtn = document.createElement("div");
    const minBtn = document.createElement("img");
    minBtn.setAttribute("src", "../../Assets/minimize.png");
    cMinBtn.appendChild(minBtn);

    const cResBtn = document.createElement("div");
    const resBtn = document.createElement("img");
    resBtn.setAttribute("src", "../../Assets/maxmin.png");
    cResBtn.appendChild(resBtn);

    const cCloseBtn = document.createElement("div");
    const closeBtn = document.createElement("img");
    closeBtn.setAttribute("src", "../../Assets/close.png");
    cCloseBtn.appendChild(closeBtn);

    actionBtns.appendChild(cMinBtn);
    actionBtns.appendChild(cResBtn);
    actionBtns.appendChild(cCloseBtn);
    // Botões ☝🏻

    app.appendChild(appBar);

    appBar.appendChild(aboutApp);
    appBar.appendChild(actionBtns);
    app.appendChild(containerApp);

    let btn;
    switch (name) {
      case "Chrome":
        btn = document.getElementById("btn-Chrome");
        containerApp.setAttribute("src", "./Pages/Chrome/index.html")
        break;
      case "Estoque":
        btn = document.getElementById("btn-AddStock");
        break;
    }

    btn.style.transition = "cubic-bezier(0.1,0.9,0,.1) 0.08s";
    btn.style.backgroundColor = "rgba(0, 0, 0, 0.041)";
    aboutApp.innerHTML = `<img src='${icon}'><p>${name}</p>`;
    lastIndex++;
    app.style.zIndex = lastIndex;

    let isDragging = false;

    app.addEventListener("mousedown", (e) => {
      if (
        e.target == appBar &&
        app.offsetWidth != main.offsetWidth &&
        e.button == 0
      ) {
        offset = [app.offsetLeft - e.clientX, app.offsetTop - e.clientY];
        isDragging = true;
      } else if (
        e.target == cCloseBtn ||
        (e.target == closeBtn && e.button == 0)
      ) {
        closeApp(name);
      } else if (e.target == cMinBtn || (e.target == minBtn && e.button == 0)) {
        minimizeApp(name);
      } else if (e.target == cResBtn || (e.target == resBtn && e.button == 0)) {
        maximizeApp(name);
      }
    });

    containerApp.addEventListener("mouseenter", (e) => {
      if(isDragging) {
        moveWindow(e, name);
      }
    })

    document.addEventListener("mousemove", (e) => {
      if (isDragging) {
        lastIndex++
        app.style.zIndex = lastIndex;
        moveWindow(e, name);
      }
    });

    window.addEventListener("mouseup", () => {
      isDragging = false;
    });

    window.addEventListener("mouseleave", () => {
      isDragging = false;
    });

    main.appendChild(app);
    setTimeout(() => {
      app.classList.add("showApp");
      lastIndex++;
      app.style.zIndex = lastIndex;
      app.style.transform = "translate(-50%, -50%) scale(1)";
      app.style.transition = "cubic-bezier(0.4,0,0,1) .2s";
    }, 1);
    setTimeout(() => {
      app.style.transition = "0s";
    }, 300);
  } else {
    const app = document.getElementById(name);
    if (app.classList == "appContainer showApp") {
      minimizeApp(name);
    } else {
      showApp(name);
    }
  }
};

btnAddStock.addEventListener("click", () => {
  openApp("Estoque", "../../Assets/IconAdd.png");
});

chrome.addEventListener("click", () => {
  openApp("Chrome", "../../Assets/chrome.png");
});

// Minimiza o App
const minimizeApp = (name) => {
  const app = document.getElementById(name);

  let btn;
  switch (name) {
    case "Chrome":
      btn = document.getElementById("btn-Chrome");
      break;
    case "Estoque":
      btn = document.getElementById("btn-AddStock");
      break;
  }
  lastPosition = [app.offsetTop, app.offsetLeft]
  btn.style.top = "9px";
  btn.style.transform = "scale(.85)";
  btn.style.backgroundColor = "";
  app.style.left = "50%";
  app.style.transform = "translate(-50%, -50%) scale(0)";
  app.style.opacity = 1;
  app.style.top = "calc(100% + 600px)";
  app.style.transition = "cubic-bezier(0.4,0,0,1) .6s";
  setTimeout(() => {
    btn.style.transform = "scale(1)";
  }, 100);
  setTimeout(() => {
    btn.style.top = "0px";
  }, 200);
  setTimeout(() => {
    app.classList.remove("showApp");
  }, 1);
};

const maximizeApp = (name) => {
  const app = document.getElementById(name);
  if (
    app.offsetWidth != main.offsetWidth &&
    app.offsetHeight != main.offsetHeight - 60
  ) {
    lastPosition = [app.offsetTop, app.offsetLeft]
    lastIndex++;
    app.style.zIndex = lastIndex;
    app.style.width = "100%";
    app.style.height = "calc(100% - 50px)";
    app.style.top = "calc(50% - 25px)";
    app.style.left = "50%";
    app.style.borderRadius = 0;
    app.style.transition = ".2s";

    setTimeout(() => {
      app.style.transition = "0s";
    }, 200);
  } else {
    lastIndex++;
    app.style.zIndex = lastIndex;
    app.style.width = "800px";
    app.style.height = "600px";
    app.style.top = lastPosition[0] + "px";
    app.style.left = lastPosition[1] + "px";
    app.style.borderRadius = "8px";
    app.style.transition = "cubic-bezier(0.4,0,0,1) .2s";
    setTimeout(() => {
      app.style.transition = "0s";
    }, 200);
  }
};

const closeApp = (name) => {
  const app = document.getElementById(name);

  let btn;
  switch (name) {
    case "Chrome":
      btn = document.getElementById("btn-Chrome");
      break;
    case "Estoque":
      btn = document.getElementById("btn-AddStock");
      break;
  }

  setTimeout(() => {
    btn.style.backgroundColor = "";
    app.style.transition = "cubic-bezier(0.4,0,0,1) .3s";
    app.style.transform = "translate(-50%, -50%) scale(0.8)";
    app.style.borderRadius = "8px";
    app.classList.remove("showApp");
    app.style.opacity = 0;
  }, 1);
  setTimeout(() => {
    main.removeChild(app);
  }, 300);
};

const showApp = (name) => {
  const app = document.getElementById(name);

  let btn;
  switch (name) {
    case "Chrome":
      btn = document.getElementById("btn-Chrome");
      break;
    case "Estoque":
      btn = document.getElementById("btn-AddStock");
      break;
  }

  if (app.offsetWidth == main.offsetWidth) {
    app.style.top = "calc(50% - 25px)";
  } else {
    app.style.top = lastPosition[0] + "px";
    app.style.left = lastPosition[1] + "px";
  }
  btn.style.top = "-6px";
  app.style.transition = "cubic-bezier(0.4,0,0,1) .2s";
  btn.style.backgroundColor = "rgba(0, 0, 0, 0.041)";
  app.style.transform = "translate(-50%, -50%) scale(1)";
  setTimeout(() => {
    app.classList.add("showApp");
    lastIndex++;
    app.style.zIndex = lastIndex;
  }, 1);
  setTimeout(() => {
    btn.style.transform = "scale(1)";
  }, 100);
  setTimeout(() => {
    btn.style.top = "0px";
  }, 200);
  setTimeout(() => {
    app.style.transition = "0s";
  }, 300);
};

const moveWindow = (e, name) => {
  const app = document.getElementById(name);

  mousePosition = {
    x: e.clientX,
    y: e.clientY,
  };
  app.style.top = mousePosition.y + offset[1] + "px";
  app.style.left = mousePosition.x + offset[0] + "px";
};

document.addEventListener("keydown", (e) => {
  if (e.keyCode == 116) {
    e.preventDefault();
  }
});

document.addEventListener("mousedown", (e) => {
  if(menu.classList == "menu toggleMostrar") {
    menu.classList.remove("toggleMostrar");
  }
  if (e.button == 2 && e.target == barraMenu) {
    main.appendChild(menuPopup);
    btnTask.innerHTML = "Gerenciador de Tarefas";
    menuPopup.appendChild(btnTask);
    menuPopup.style.position = "absolute";
    menuPopup.style.display = "block";
    menuPopup.style.marginLeft = e.clientX + "px";
    menuPopup.style.marginTop = e.clientY - 100 + "px";
  } else if (menuPopup.style.display == "block") {
    menuPopup.style.display = "none";
    main.removeChild(menuPopup);
  }
});
