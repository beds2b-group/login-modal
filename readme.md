## Login modal web component

Usamos este repositorio para buildear y exportar el dist/login-modal-atributes.js para usarlo como componente en cualquier lugar que use js.

Para crear el nuevo fichero tan solo ejecutamos `` npm run build `` y se creará un fichero en dist/login-modal-atributes.js

También podemos usar el archivo dist/login-modal para hacer los cambios directamente en el script, a cuestión de gustos. 

Este fichero lo copiamos y pegamos en la carpeta que queramos y la llamamos en el html como: 

- `` <script src="../dist/login-modal.js"></script>``

Una vez iniciado en el body de nuestro html el script, lo iniciamos 
1. `` <login-modal id="modal"> </login-modal>`` . id para identificarlo después.
2. Revisa el src/index.html para ver cómo funciona y que parámetros necesita, está ejemplificadas ambas versiones.

LENGUAJES DISPONIBLES:  es, en, fr, pt, us
