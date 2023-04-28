async function verify(contractAddress, args) {
    console.log("Verifying Contract ...");
    try {
        await run("verify:verify", {
            address: contractAddress,
            constructorArguments: args,
        });
    } catch (error) {
        if (error.message.toLowerCase().includes("already verified")) {
            console.log("Already verfied");
        } else {
            console.log(error);
        }
    }
}
