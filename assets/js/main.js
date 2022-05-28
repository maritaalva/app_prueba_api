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

  let btnLoc= document.querySelector(".btn-loc"); //  ver localizaciones 
  let btnMisLocs= document.querySelector(".btn-mis-locs"); // añadir localización
    let locList = document.querySelector(".name-locations");  
    let counter = 0;
    let btnCerrar= document.querySelector(".close");

  const apiUrl = 'https://api.floracodex.com/v1';

  //////////////CAMBIO PÁGINA MENU///////////////77
 //botones menu
  menuCamera.addEventListener('click', (e) => {
    page = 1;
    mostrarPagina();
    console.log("camera")

  });
  // menuSearch.addEventListener('click', (e) => {
  //   page = 2;
  //   mostrarPagina();
  //   console.log("search")

  // });
  menuLike.addEventListener('click', (e) => {
    page = 2;
    mostrarPagina();
    console.log("like")
  });
  menuPlaylist.addEventListener('click', (e) => {
    page = 3;
    mostrarPagina();
    console.log("playlist")
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
    // if (page == 4) {
    //   pageCamera.style.display = "none";
    //   pageSearch.style.display = "none";
    //   pageLike.style.display = "none";
    //   pagePlaylist.style.display = "flex";
    // }
  }
  ////////////////PAGINA CAMERA IMG ID/////////////
  var plantInfo;
  searchBtn.addEventListener("click", function(event){
    event.preventDefault();
    sendIdentification();
  });



  function buildTable(data){
		var table = document.getElementById('myTable')


 /** Escuchar eventos de los botones */
let addBtn = document.querySelector("#add_btn");
let i = 0;
addBtn.addEventListener("click", addPlant, false);
		for (let i = 0; i < data.length; i++){
			var row = `<div class="plant_card" id="${data[i].id}">
      <div class="plant_card_img"><img id="plant_card_img" src = ${data[i].similar_images[0]["url"]} width="200" height="200"></div>
      <a><span class="plant_name">${data[i].plant_name}</span></a>
      <p>${(data[i].probability).toFixed(2)}%</p>
      <input type="submit" id="addbtn_${data[i].id}" value="Añadir">
      </div>`
      table.innerHTML += row
		}  
    let boton = document.querySelector("#addbtn_");
    boton.addEventListener("click", function() {
      alert("xdcfvgbhnjmkl,ñl");
      // document.getElementById("demo").innerHTML = "Hello World";
      console.log(plantInfo[i].id);
    });   

// <button class="btn-mis-locs"><span class="mis-locs-text">♡</span></button>
   // <input type="submit" id="add" value="Añadir">
	}

  function sendIdentification() {
      const files = [...document.querySelector('input[type=file]').files];
      const promises = files.map((file) => {
        return new Promise((resolve, reject) => {
          const preview = document.querySelector("#imgpreview");
            const reader = new FileReader();
            reader.onload = (event) => {
              const res = event.target.result;
              console.log(res);
              preview.src = reader.result;
              resolve(res);
            }
            reader.readAsDataURL(file)
        })
      })

      Promise.all(promises).then((base64files) => {
        console.log(base64files)

        const data = {
          api_key: "e6LD14IsKS4eIbpJqPpRGsT4wbUcmqOAaoZjbevpiwLb4y7ctK",
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
          console.log('Success:', data);
          plantInfo = data["suggestions"];
          buildTable(plantInfo);
        })
        .catch((error) => {
          console.error('Error:', error);
        });
      })
  };
    

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
      console.log(pname.textContent, )

}



 /** Función para pintar la lista de usuarios */
 function renderPlants(){
  let lista = document.querySelector(".listaFavPlants");
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


//  // Pouch Db
//  let plants;
//  /** Crear / conectar bbdd */
//  let db = new PouchDB('plants');
//  /** Escuchar eventos de los botones */
//     btnMisLocs.addEventListener("click", addplants, false);
//     /** Función para añadir plantas */
//     function addplants(){       
//         let plantstoadd = document.querySelector("span.plants");
//         // Añadir registro a la BBDD
//         let doc = {
//                 "_id": `planta${counter}`,
//                 "name": plantstoadd.textContent,
//                 };
//                 console.log(plantstoadd.textContent,)

//         db.put(doc);
//         renderplants();
//     };



//     /** Función para pintar la lista de plantas */
//     function renderplants(){
//         //Retrieving all the documents in PouchDB
//         db.allDocs({include_docs: true}, function(err, docs) {
//             if (err) {
//                 return console.log(err);
//             } else {                
//                 plants = docs.rows;          
//                 counter = docs.rows.length;
//                 locList.innerHTML = "";
//                 plants.forEach(element => {     
//                     let plants = `<li class="loc-saved">
//                                     <div>${element.doc.name}</div>
//                                     <button class="delete">borrar</button>
//                                 </li> 
//                                 `;
//                     locList.innerHTML += plants;
//                 });

//                 let btnsBorrar = document.querySelectorAll(".delete");
//                 btnsBorrar.forEach(item => {
//                     item.addEventListener("click", (e) => {
//                         plants.forEach(element => {
//                             if(element.doc.name == e.target.previousSibling.previousSibling.outerText){
//                                 db.get(element.doc._id).then(function(doc){
//                                         return db.remove(doc)
//                                 });
//                                 item.parentElement.remove();
//                             }
//                         });
//                     })
//                 });

//             }
//         });
     
//     };

  // console.log("hh")
  //     document.querySelector('button').onclick = function sendIdentification() {
  //         const files = [...document.querySelector('input[type=file]').files];
  //         const promises = files.map((file) => {
  //           return new Promise((resolve, reject) => {
  //               const reader = new FileReader();
  //               reader.onload = (event) => {
  //                 const res = event.target.result;
  //                 console.log(res);
  //                 resolve(res);
  //                 console.log(res);

  //               }
  //               reader.readAsDataURL(target)
  //           })
  //         })
  //         console.log(images);

  //         Promise.all(promises).then((base64files) => {
  //           console.log(base64files);

  //           const data = {
  //             api_key: "e6LD14IsKS4eIbpJqPpRGsT4wbUcmqOAaoZjbevpiwLb4y7ctK",
  //             images: base64files,
  //             // modifiers docs: https://github.com/flowerchecker/Plant-id-API/wiki/Modifiers
  //             modifiers: ["crops_fast", "similar_images", "health_all", "disease_similar_images"],
  //             plant_language: "en",
  //             // plant details docs: https://github.com/flowerchecker/Plant-id-API/wiki/Plant-details
  //             plant_details: ["common_names",
  //                               "url",
  //                               "name_authority",
  //                               "wiki_description",
  //                               "taxonomy",
  //                               "synonyms"],
  //             // disease details docs: https://github.com/flowerchecker/Plant-id-API/wiki/Disease-details
  //             disease_details: ["common_names", "url", "description"]
  //           };

  //           fetch('https://api.plant.id/v2/identify', {
  //             method: 'POST',
  //             headers: {
  //               'Content-Type': 'application/json',
  //             },
  //             body: JSON.stringify(data),
  //           })
  //           .then(response => response.json())
  //           .then(data => {
  //             console.log('Success:', data);
  //           })
  //           .catch((error) => {
  //             console.error('Error:', error);
  //           });
  //         })

  //     };




  // let token = '?token=1jX7Vx1IxVgo091bMotI';
  //     fetch('https://api.floracodex.com/v1/kingdoms' + token)
  //     .then((res)=> res.json())
  //     .then((res)=>{
  //         console.log(res)

  //     })
  //     fetch('https://api.floracodex.com//v1/subkingdoms?token=1jX7Vx1IxVgo091bMotI&609cc9add3d3ececc3fb6746')
  //     .then((res)=> res.json())
  //     .then((res)=>{
  //         console.log(res)
  //     })

  //     fetch('https://api.floracodex.com/v1/plants?token=1jX7Vx1IxVgo091bMotI')
  //   .then(res => res.json())
  //   .then(res => {
  //      let lista = document.querySelector("#usuarios");
  //      let data = res.data;

  //      data.sort((a, b) => a.scientific_name.localeCompare(b.scientific_name));
  //      data.forEach((user) => {
  //         //  let avatar = `https://source.boringavatars.com/bauhaus/50/${user.first_name}%20${user.last_name}?colors=264653,2a9d8f,e9c46a,f4a261,e76f51`;
  //          let item=`<li class="user">
  //                   <img src="${user.image_url}" alt="${user.scientific_name} "/>
  //                   <span class="name">${user.scientific_name}</span>
  //                   <span class="surname"> ${user.last_name} </span>

  //           </li>`;
  //        console.log(user.scientific_name);
  //        console.log(user.image_url)
  //        lista.innerHTML += item;
  //      });
  //    })
  //   .then(() => {
  //       let monkeyList = new List('test-list', {
  //           valueNames: ['name', 'surname']
  //         });
  //   });
};
