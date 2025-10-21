Installation local (Ubuntu)

1) Installer les fichiers utilisateur (icône, .desktop) :

   ./install-desktop.sh

2) Lancer l'AppImage (debug):

   dist/entraineur-rythme-electron-0.1.0.AppImage --no-sandbox

3) Pour un démarrage sécurisé (recommandé), exécuter avec sudo les commandes indiquées dans le script pour fixer le `chrome-sandbox` (ou utiliser `linux-unpacked` et fixer `chrome-sandbox` là-bas).
