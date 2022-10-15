import { Chart } from "frappe-charts/dist/frappe-charts.esm.js";
//var http = require("http");
//const { dataset } = require("./application.js");
//console.log(dataset);
//import dataset from "./application";
//console.log(dataset);
//var dataset;

//var dataset2;

const URL =
  "https://statfin.stat.fi/PxWeb/api/v1/en/StatFin/synt/statfin_synt_pxt_12dy.px";

const jsonQuery = {
  query: [
    {
      code: "Vuosi",
      selection: {
        filter: "item",
        values: [
          "2000",
          "2001",
          "2002",
          "2003",
          "2004",
          "2005",
          "2006",
          "2007",
          "2008",
          "2009",
          "2010",
          "2011",
          "2012",
          "2013",
          "2014",
          "2015",
          "2016",
          "2017",
          "2018",
          "2019",
          "2020",
          "2021"
        ]
      }
    },
    {
      code: "Alue",
      selection: {
        filter: "item",
        values: ["SSS"]
      }
    },
    {
      code: "Tiedot",
      selection: {
        filter: "item",
        values: ["vaesto", "vm01", "vm11"]
      }
    }
  ],
  response: {
    format: "json-stat2"
  }
};

const getData = async () => {
  const url = URL;
  const res = await fetch(url, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(jsonQuery)
  });
  if (!res.ok) {
    return;
  }
  const data = await res.json();
  console.log(data);
  const years = Object.values(data.dimension.Vuosi.category.label);
  const aluet = Object.values(data.dimension.Alue.category.label);
  const values = data.value;

  const nTiedot = Object.values(data.dimension.Tiedot.category.label).length;

  let nAluet = aluet.length;
  let nYears = years.length;

  dataset = {
    years: years,
    data: []
  };

  dataset2 = {
    years: years,
    data: []
  };

  aluet.forEach((alue, idx) => {
    let aluePopu = [];
    let alueBirths = [];
    let alueDeaths = [];
    for (let year = 0; year < nYears; year++) {
      //aluePopu.push(population[year * nAluet + idx])
      alueBirths.push(values[nTiedot * nAluet * year + idx * nTiedot + 0]);
      console.log(nTiedot * nAluet * year + idx * nTiedot + 0);
      alueDeaths.push(values[nTiedot * nAluet * year + idx * nTiedot + 1]);
      console.log(nTiedot * nAluet * year + idx * nTiedot + 1);
      aluePopu.push(values[nTiedot * nAluet * year + idx * nTiedot + 2]);
      console.log(nTiedot * nAluet * year + idx * nTiedot + 2);
    }
    dataset.data[idx] = {
      name: alue,
      values: aluePopu
    };

    if (alue === "WHOLE COUNTRY") {
      dataset2.data[0] = {
        name: "births",
        values: alueBirths
      };

      dataset2.data[1] = {
        name: "deaths",
        values: alueDeaths
      };
    }
  });
  return { dataset, dataset2 };
};

const buildNewChart = (dataset2) => {
  let nYears = dataset2.years.length;

  const newchartData = {
    labels: dataset2.years,
    datasets: dataset2.data
  };

  const chart = new Chart("#new_chart", {
    title:
      "Finnish Births and Deaths from " +
      dataset2.years[0] +
      " to " +
      dataset2.years[nYears - 1],
    data: newchartData,
    type: "bar",
    colors: ["#63d0ff", "#363636"],
    height: 450
  });
};

const reloadchart = async () => {
  //let { dataset, dataset2 } = await getData();
  var dataset2 = await JSON.parse(sessionStorage.getItem("dataset2"));
  console.log(dataset2);
  buildNewChart(dataset2);
};

//reloadchart();

reloadchart();
