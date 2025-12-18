import readline from 'readline';

function input(msg) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) => {
    rl.question(`${msg}\n`, (userInput) => {
      rl.close();
      resolve(userInput);
    });
  });
}

export default input;
