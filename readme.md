## Login modal web component

- LENGUAJES DISPONIBLES:  es, en, fr, pt, us

~~~
<html>
  <head></head>
  <body>

    <login-modal 
    visible="true" 
    language="en" 
    secondary-color="#F0F0F0" 
    primary-color="#1D7CE3"   
    url-to-register="/registro"
    client-app-domain="senator.beds2pro.com"
    api-key="asdadada-asdasd2-ada2-ds"
    > </login-modal>

    <script src="https://beds2b-group.github.io/login-modal/dist/login-modal.js"></script>
     <script>

      // Si queremos mostrar notificaciones desde el componente creamos el evento y lo pasamos a las notificaciones que usamos en nuestra app.
      window.addEventListener("show-notification", (e) => {
        const { type, message, description } = e.detail;
        notification[type]?.({ message, description }); //ejemplo con antDesign
      });
      
    </script>
  </body>
</html>
~~~

Si queremos generar un nuevo archivo, tan solo tienes que actualizar lo que quieras y hacer ```npm run build```. Esto generará el nuevo archivo minificado y actualizado. Una vez terminada la build (que es rápida), subimos a la rama master y se actualizará automáticamente la url, ya que, usamos github pages.
