const fs = require('fs')

function getRandomArbitrary(min, max) {
  return parseInt(Math.random() * (max - min) + min, 10);
}

const generateContent = () => {
  let cave = ''
  for (let i = 0; i < 4; i++){
    let line = '';
    for (let j = 0; j < 4; j++){
      console.log(`${i}${j}`);
      line = line.concat(getRandomArbitrary(1,9))
    }  
    cave = (i == 3) ? cave.concat(line) : cave.concat(line, '\n');
  }
  return cave
}

const content = generateContent();

console.log('content',content);

fs.writeFile('./test_input.txt', content, err => {
  if (err) {
    console.error(err)
    return
  }
  //file written successfully
})