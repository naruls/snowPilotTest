import express from 'express';
import fetch from 'node-fetch';
import axios from 'axios';
import convert from 'xml-js';
import React from 'react';
import pg from 'pg';
import momentZone from 'moment-timezone';



const app = express();





const { PORT = 3030 } = process.env;


function fetchSnowpilotData(){
axios.get('https://snowpilot.org/snowpit/41484/download/xml', {
    withCredentials: false,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS",
      "Content-Type": "application/xml; charset=utf-8",
    },
  })
  .then((response) =>{
  let jsonData = convert.xml2json(response.data, {compact: true, spaces: 4});
  let endJsonData = JSON.parse(jsonData);
  for (let i = 0; i < endJsonData.Pit_Observation.Shear_Test_Result.length; i++) {
    console.log(endJsonData.Pit_Observation.Shear_Test_Result[i]._attributes.code)
    let currentTime = momentZone().tz("Europe/Moscow").format();
    const query = `
      INSERT INTO in_openweatherdata (code, sdepth, depthUnits, score, ecScore, ctScore, quality, dateString, numberOfTaps, fractureCat, fractureCharacter, lengthOfCut, lengthOfColumn, releaseType, dataCode, time)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16) returning *
    `;
    client.query(query, [
      endJsonData.Pit_Observation.Shear_Test_Result[i]._attributes.code,
      endJsonData.Pit_Observation.Shear_Test_Result[i]._attributes.sdepth,
      endJsonData.Pit_Observation.Shear_Test_Result[i]._attributes.depthUnits,
      endJsonData.Pit_Observation.Shear_Test_Result[i]._attributes.score,
      endJsonData.Pit_Observation.Shear_Test_Result[i]._attributes.ecScore,
      endJsonData.Pit_Observation.Shear_Test_Result[i]._attributes.ctScore,
      endJsonData.Pit_Observation.Shear_Test_Result[i]._attributes.quality,
      endJsonData.Pit_Observation.Shear_Test_Result[i]._attributes.dateString,
      endJsonData.Pit_Observation.Shear_Test_Result[i]._attributes.numberOfTaps,
      endJsonData.Pit_Observation.Shear_Test_Result[i]._attributes.fractureCat,
      endJsonData.Pit_Observation.Shear_Test_Result[i]._attributes.fractureCharacter,
      endJsonData.Pit_Observation.Shear_Test_Result[i]._attributes.lengthOfCut,
      endJsonData.Pit_Observation.Shear_Test_Result[i]._attributes.lengthOfColumn,
      endJsonData.Pit_Observation.Shear_Test_Result[i]._attributes.releaseType,
      endJsonData.Pit_Observation.Shear_Test_Result[i]._attributes.dataCode,
      currentTime], (err, res) => {
      if (err) {
        console.error(err);
        return;
        }
      console.log('Data insert successful');
      });

  }
  })
  .catch((err) => console.log(err));
}

let timerId = setInterval(() => fetchSnowpilotData(), 6000/*86400000*/);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});

