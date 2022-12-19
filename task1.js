process.stdin.on("data", data => {
  const reversed = data.reverse();
  process.stdout.write(reversed + "\n");
});