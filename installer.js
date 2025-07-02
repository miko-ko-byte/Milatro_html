let deferredPrompt;
const installButton = document.getElementById('install-button');

window.addEventListener('beforeinstallprompt', (e) => {
  // Prevenir que el mini-infobar aparezca en Chrome
  e.preventDefault();
  // Guardar el evento para que pueda ser disparado más tarde.
  deferredPrompt = e;
  // Mostrar el botón de instalación
  installButton.style.display = 'block';
});

installButton.addEventListener('click', (e) => {
  // Ocultar el botón de instalación
  installButton.style.display = 'none';
  // Mostrar el prompt de instalación
  deferredPrompt.prompt();
  // Esperar a que el usuario responda al prompt
  deferredPrompt.userChoice.then((choiceResult) => {
    if (choiceResult.outcome === 'accepted') {
      console.log('User accepted the install prompt');
    } else {
      console.log('User dismissed the install prompt');
    }
    deferredPrompt = null;
  });
});

window.addEventListener('appinstalled', (evt) => {
  // Registrar el evento de instalación
  console.log('App installed successfully');
});
