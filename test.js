// app.js
const timeout = function (delay) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve()
    }, delay)
  })
}

async function timer () {
  console.log('timer started')
  await Promise.resolve(timeout(100));
  console.log('timer finished')
}

timer()  
