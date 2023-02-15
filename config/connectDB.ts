import url from "./url";

export default async function () {
    console.log("Trying to connect...");

    const connectionResponse = await fetch(`${url}/api/connectMongo`).then(
        (res) => res.json()
    );

    if (connectionResponse.error) {
        console.log(
            "***********************\nError during connection\n***********************"
        );
        return false;
    } else {
        console.log(
            "====================\nConnected to MongoDB\n===================="
        );
        return true;
    }
}
