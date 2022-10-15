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
        values: ["vaesto"]
      }
    }
  ],
  response: {
    format: "json-stat2"
  }
};

const getAreaCode = async () => {
  const url = URL;
  const res = await fetch(url)
  const data = await res.json()
  console.log(data)

  let areaName = data.variables[1].valueTexts
  console.log(areaName)
  let areaCode = data.variables[1].values
  console.log(areaCode)
  return {areaName, areaCode};
}


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

  return data;
};

const buildChart = (data) => {
  const years = Object.values(data.dimension.Vuosi.category.label);
  const aluet = Object.values(data.dimension.Alue.category.label);
  const labels = Object.values(data.dimension.Vuosi.category.label);
  const population = data.value;

  
  let nAluet = aluet.length;
  let nYears = years.length;

  let dataset = [];
  aluet.forEach((alue, idx) => {
    let aluePopu = []
    for (let year = 0; year < nYears; year++) {
      aluePopu.push(population[year * nAluet + idx])
    }
    dataset[idx] = {
      name: alue,
      values: aluePopu
    }
  })
  console.log(dataset)

  const chartData = {
    labels: years,
    datasets: dataset
  }

  const chart = new frappe.Chart("#chart", {
    title: 'Finnish population from ' + years[0] +  ' to ' + years[nYears-1],
    data: chartData,
    type: "line",
    colors: ['#eb5146'],
    height: 450
  })


}

const submitButton = document.getElementById("submit-data");
const inputArea = document.getElementById("input-area");


const main = async () => {
  const data = await getData();
  console.log(data);
  buildChart(data)
};

const {areaName, areaCode} = getAreaCode()
//console.log(areaName)
main();

const addArea = (code) => {
  if (!jsonQuery.query[1].selection.values.includes(code)) {
    jsonQuery.query[1].selection.values.push(code);
  }
}

submitButton.addEventListener("click", async function () {
  let areas = await getAreaCode()
  console.log(areas)
  let code
  let searchArea = inputArea.value;
  let areaName = areas.areaName;
  let areaCode = areas.areaCode;
  try {
    areaName.forEach((name, nameIdx) => {
      if (name.toLowerCase() === searchArea.toLowerCase()) {
        code = areaCode[nameIdx]
        throw 'Break';
      }
    })
  }
  catch (e) {
    if (e !== 'Break') throw e
  }
  
  console.log('code is '+ code)
  if (!code) return;
  console.log('code is '+ code)

  addArea(code)
  main();
})

