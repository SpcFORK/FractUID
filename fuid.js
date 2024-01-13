function mandelbrotCostFunction(x, y, maxIterations) {
  let real = x;
  let imaginary = y;
  let iter = 0;

  while (iter < maxIterations) {
    let realSquared = real * real;
    let imaginarySquared = imaginary * imaginary;
    let realUpdated = realSquared - imaginarySquared + x;
    let imaginaryUpdated = 2 * real * imaginary + y;

    real = realUpdated;
    imaginary = imaginaryUpdated;

    if (realSquared + imaginarySquared > 16) {
      break;
    }

    iter++;
  }

  return iter % 16;
}

function generateChaoticValues(x, y, z, coefficients) {
  const [a, b, c] = coefficients;
  const newX = Math.sin(a * y) + c * Math.cos(a * x);
  const newY = Math.sin(b * x) + z;
  const newZ = Math.cos(b * y) + x + z;

  return { x: newX, y: newY, z: newZ };
}

function generateFUID() {
  let x = Math.random();
  let y = Math.random();
  let z = Math.random();

  return "xxxxxxxx:xxxx:4xxx:yxxx:xxxxxxxxxxxx".replace(/[xy:]/g, function(char) {
    const chaoticVals = generateChaoticValues(x, y, z, [2.6, 1.5, 1.2]);
    x = chaoticVals.x;
    y = chaoticVals.y;
    z = chaoticVals.z;

    const mandelbrotIndex = mandelbrotCostFunction(x, y, 100).toString(32);
    const chaoticIndex = Math.floor((x + y + z) * 32) % 32;

    const index = (parseInt(mandelbrotIndex, 32) + chaoticIndex) % 32;
    return (char === 'x') 
      ? index.toString(32).replace('-', '')
      : (char != ':') 
        ? (8 | Math.floor(3 * Math.random())).toString(32) 
        : '-';
  });
}

// ---

const eobj = {
  mandelbrotCostFunction,
  generateChaoticValues,
  generateFUID
};

;(
  globalThis?.window
    ? Object.assign(window, eobj)
    : module.exports = eobj
);

// Example
console.log(eobj.generateFUID());