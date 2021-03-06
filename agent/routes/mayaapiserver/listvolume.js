const express = require("express");
const router = express();
const http = require("request");

router.get("/volume", (req, res) => {
  var mayaVolume = [];
  var options = {
    url: `http://maya-apiserver-service.openebs:5656/latest/volumes/`,
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      namespace: req.query.workloadname + "-" + req.query.openebsengine
    }
  };

  numberOfPVC = JSON.parse(req.query.pvcDetails).length;
  http.get(options, function(err, resp, body) {
    if (err) {
      console.log("this is volume error namespaces");
    } else { 
      data = JSON.parse(body);
      x = JSON.parse(req.query.pvcDetails)
      for (let j=0; j<numberOfPVC; j++ ){

       for (i = 0; i < data.items.length; i++) {
        // console.log(i +" "+ x[j].volumeName +" "+ data.items[i].metadata.name + "gfcgfcgfcj")
            if(JSON.parse(req.query.pvcDetails)[j].volumeName == data.items[i].metadata.name){
              // console.log(i +" "+ x[j].volumeName +" "+ data.items[i].metadata.name)
            mayaVolume.push({
              name: data.items[i].metadata.name,
              size:
                data.items[i].metadata.annotations["openebs.io/volume-size"],
              status:
                data.items[i].metadata.annotations[
                  "openebs.io/controller-status"
                ],
              replicas: data.items[i].spec.replicas,
              kind: data.items[i].kind,
              castype: data.items[i].spec.casType
            });
      }}}}

    res.status(200).json(mayaVolume);
  });
});
module.exports = router;
