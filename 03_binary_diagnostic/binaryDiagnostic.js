const report = [
  '00100',
  '11110',
  '10110',
  '10111',
  '10101',
  '01111',
  '00111',
  '11100',
  '10000',
  '11001',
  '00010',
  '01010'
];

const inputToArray = () => {
  const fs = require('fs');
  let array = fs.readFileSync('./input.txt').toString().split("\n");
  return array
}

const powerConsumption = (report = []) => {
   
  let gamma = '';
  let epsilon = ''

  for (let i = 0; i < report[0].length; i++ ){

    let count0 = 0;
    let count1 = 0;

    report.forEach(r => {
      if (r[i] == '0') {
        count0 ++;
      } else {
        count1 ++;
      }
    })

    const gammaBit = (count0 > count1) ? '0' : '1';
    const epsilonBit = (count0 > count1) ? '1' : '0';

    gamma += gammaBit;
    epsilon += epsilonBit;

  }

  // Convert from string to binary
  const gammaNum = parseInt(gamma, 2);
  const epsilonNum = parseInt(epsilon, 2);

  // calculate power consumption for the answer
  const power = gammaNum * epsilonNum;

  // console.log(`\n\n`);
  // console.log(`gamma:   ${gamma}`);
  // console.log(`epsilon: ${epsilon}`);
  // console.log(`gammaNum:   ${gammaNum}`);
  // console.log(`epsilonNum: ${epsilonNum}`);
  // console.log(`power:   ${power}`);

  return {
    gamma,
    epsilon,
    power
  };
}

powerConsumption(report)

// Part 2

const updateMatcher = (report, metric) => {

  const {gamma, epsilon} = powerConsumption(report);

  switch (metric) {
    case 'O2':
      return gamma
      
    case 'CO2':
      return epsilon
      
    default:
      throw new error(`invalid metric ${metric}`)
  }
}

// helper funciton to calculate a metric (O2 or CO2)
const calcRating = (report, codeLength, metric) => {

  // create a copy of the initial report that we can update
  let filteredReport = [...report];

  let {gamma, epsilon} = powerConsumption(report);

  // we are either going to match on gamma or epsilon depending on the metric 
  // in question
  let matcher = updateMatcher(report, metric)

  // calculate oxygen generator rating (most common values left to right)
  for (let i = 0; i < codeLength; i ++) {

    if (filteredReport.length === 1){
      break
    }

    const updatedFilteredReport = [];
    
    // TODO: change this to use the filter() command?
    for (let c = 0; c < filteredReport.length; c++) {

      // if our current code has the same index in the gamma number (most 
      // common), we push it to our updatedFilterReport
      if (filteredReport[c][i] ==  matcher[i]){
        updatedFilteredReport.push(filteredReport[c])
      }

    }

    // reset the filtered report with the updates
    filteredReport = updatedFilteredReport;
    
    // reset the gamma and epsilon for the newly filtered report
    matcher = updateMatcher(filteredReport, metric)

  }

  return filteredReport[0]

}


const lifeSupport = (report = []) => {

  const codeLength = report[0].length;

  // Gamma is most common bits, epsilon is least common bits. Set the initial
  // values for these
  let {gamma, epsilon} = powerConsumption(report);

  let oRatingStr = calcRating(report, codeLength, 'O2');
  let cRatingStr = calcRating(report, codeLength, 'CO2');

  
  const o2RatingNum = parseInt(oRatingStr, 2);
  const co2RatingNum = parseInt(cRatingStr, 2);
  const lrRating = o2RatingNum * co2RatingNum;
  
  console.log(`\n`);
  console.log('oRatingStr', oRatingStr);
  console.log('cRatingStr', cRatingStr);
  console.log(`cRating ${co2RatingNum}`);
  console.log(`oRating ${o2RatingNum}`);
  console.log(`lrRating ${lrRating}`);

}

lifeSupport(inputToArray())