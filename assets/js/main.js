window.onload = () => {


  let menuCamera = document.querySelector("#menu_camera");
  let menuSearch = document.querySelector("#menu_search");
  let menuLike = document.querySelector("#menu_like");
  let menuPlaylist = document.querySelector("#menu_playlist");

  let pageCamera = document.querySelector(".page_camera");
  let pageSearch = document.querySelector(".page_search");
  let pageLike = document.querySelector(".page_like");
  let pagePlaylist = document.querySelector(".page_playlist");

  let searchBtn = document.querySelector("#search_btn");
  let browseBtn = document.querySelector("#browse_btn");

  let btnLoc = document.querySelector(".btn-loc"); //  ver localizaciones 
  let btnMisLocs = document.querySelector(".btn-mis-locs"); // añadir localización
  let locList = document.querySelector(".name-locations");
  let counter = 0;
  let btnCerrar = document.querySelector(".close");
  let lista = document.querySelector(".listaFavPlants");
  var table = document.getElementById('myTable')
  let preview = document.querySelector("#imgpreview");

  const apiUrl = 'https://api.floracodex.com/v1';

  //////////////CAMBIO PÁGINA MENU///////////////77
  //botones menu
  menuCamera.addEventListener('click', (e) => {
    page = 1;
    mostrarPagina();
    //console.log("camera")
  });
  menuLike.addEventListener('click', (e) => {
    page = 2;
    mostrarPagina();
    //console.log("like")
  });
  menuPlaylist.addEventListener('click', (e) => {
    page = 3;
    mostrarPagina();
    //console.log("playlist")
  });

  function mostrarPagina() {
    if (page == 1) {
      pageCamera.style.display = "flex";
      pageLike.style.display = "none";
      pagePlaylist.style.display = "none";
    };
    if (page == 2) {
      pageCamera.style.display = "none";
      pageLike.style.display = "flex";
      pagePlaylist.style.display = "none";
    };
    if (page == 3) {
      pageCamera.style.display = "none";
      pageLike.style.display = "none";
      pagePlaylist.style.display = "flex";
    }
  }


  /** escuchar evento botón buscar datos **/

  let plantInfo;
  searchBtn.addEventListener("click", function (event) {
    searchBtn.style.color = "#F4F4EA";
    searchBtn.style.backgroundColor = "#377E59";
    event.preventDefault();
    sendIdentification();
  });

  /** cargar imagen y buscar datos en la api **/
  function sendIdentification() {
    const files = [...document.querySelector('input[type=file]').files];
    const promises = files.map((file) => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (event) => {
          const res = event.target.result;
          //console.log(res);
          preview.src = reader.result;
          resolve(res);
        }
        reader.readAsDataURL(file)
      })
    })
    Promise.all(promises).then((base64files) => {
      //console.log(base64files)

      const data = {
        api_key: "yDNbhsgjTIPWwz3Umubs2zUGLOjM1iKLwKBRDfYn5bZ4xaXJi2",
        images: base64files,
        modifiers: ["crops_fast", "similar_images"],
        plant_language: "en",
        plant_details: ["common_names",
          "url",
          "name_authority",
          "wiki_description",
          "taxonomy",
          "synonyms"]
      };
      fetch('https://api.plant.id/v2/identify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })
        .then(response => response.json())
        .then(data => {
          //console.log('Success:', data);
          plantInfo = data["suggestions"];
          buildTable(plantInfo);
        })
        .catch((error) => {
          console.error('Error:', error);
        });
    })
  };
  /** función pinta la lista de plantas sugeridas */
  function buildTable(data) { 
    for (var i = 0; i < data.length; i++) {
      var row = `<div class="plant_card" id="${data[i].id}">
      <div class="plant_card_img"><img id="plant_card_img" src = ${data[i].similar_images[0]["url"]} width="200" height="200"></div>
      <a><span class="plant_name">${data[i].plant_name}</span></a>
      <p> coincidencia ${(data[i].probability).toFixed(2)}%</p>
      // <input type="submit" class="addbtn_" value="Añadir">
      </div>`
      table.innerHTML += row
    }
    // let btns = document.querySelectorAll('.addbtn_');
    // btns.forEach(function (cadaboton) {
    //   console.log(cadaboton)
    //   cadaboton.addEventListener('click', (btn) => {
    //     let hijos = btn.target.parentElement.childNodes;
    //     let ppimg = hijos[1].childNodes[0].src;
    //     let ppname = hijos[2].nextSibling.textContent;
    //     console.log(hijos);
    //     console.log(ppimg);
    //     console.log(ppname);
    //     addPlant();
  
    //   }, false);
    // })
  } 

  ////////////////PAGINA CAMERA IMG ID/////////////

  let addBtn = document.querySelector("#add_btn");
  addBtn.addEventListener("click", addPlant, false);
  

  let plantaid;
  /** Crear / conectar bbdd */
  let db = new PouchDB('plantasFav');
/** Pintar la lista de usuarios */
renderPlants();
 /** Función para añadir usuarios */
 function addPlant(){
  let pname = document.querySelector("span.plant_name");
  let pimg= document.querySelector("#plant_card_img");
      // Añadir registro a la BBDD
      let doc = {
          "_id": `planta${counter}`,
          "pname": pname.textContent,        
          "pimg": pimg.src        
        };            
      db.put(doc);     
      renderPlants();
      console.log(pname.textContent);
}
 /** Función para pintar la lista de usuarios */
 function renderPlants(){
  //Retrieving all the documents in PouchDB
  db.allDocs({include_docs: true}, function(err, docs) {
      if (err) {
          return console.log(err);
      } else {                
        plantaid = docs.rows;
        counter = docs.rows.length;
        plantaid.forEach(element => {
              let plant = `
                          <li id="fav_card">
                          <div class="plant_card_img" id="${element.doc._id}"><img id="plant_card_img" src = ${element.doc.pimg} width="200" height="200"></div>
                          <a><span class="plant_name">${element.doc.pname}</span></a>                    
                              <button class="delete">borrar</button>
                          </li>
                          `;
              lista.innerHTML += plant;
              table.innerHTML="";
              preview.src="";
          });
          let btnsBorrar = document.querySelectorAll(".delete");
                btnsBorrar.forEach(item => {
                    item.addEventListener("click", (e) => {
                      plantaid.forEach(element => {
                            if(element.doc.pname == e.target.previousSibling.previousSibling.outerText){
                                db.get(element.doc._id).then(function(doc){
                                        return db.remove(doc)
                                });
                                item.parentElement.remove();
                            }
                        });
                    })
                });
      }
  });
}

};
