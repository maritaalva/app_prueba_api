window.onload = () => {

  var plantInfo;

  document.getElementById("clickbutton").addEventListener("click", function(event){
    event.preventDefault();
    sendIdentification();
  });

  function buildTable(data){
		var table = document.getElementById('myTable')

		for (var i = 0; i < data.length; i++){
			var row = `<tr>
					<td>${data[i].plant_name}</td>
					<td>${(data[i].probability).toFixed(3)}%</td>
					<td><img src = ${data[i].similar_images[0]["url"]} width="200" height="200"></td>
			  </tr>`
			table.innerHTML += row
		}
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
          api_key: "m7DriNpPXZgdYme3E78Wo7wovP8eEtqhhHHArGL6ePAnlQgc24",
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
//     // fetch('https://api.floracodex.com/v1/kingdoms?token=1jX7Vx1IxVgo091bMotI')
//     // .then((res)=> res.json())
//     // .then((res)=>{
//     //     console.log(res)
//     // })

};
