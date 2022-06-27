const PORT = 3000;
const COLLECTION_NAME = "project";

const express = require("express");
const cors = require("cors");
const firebase_db = require("./firebase");

const app = express();

app.use(cors());
app.use(express.json());


const get_all_project = async () => {
    const snapshots = await firebase_db.collection(COLLECTION_NAME).get();
    const list = [];
    snapshots.forEach(doc => {
        const data = doc.data();

        const send_data = {
            "id": doc.id,
            "project_name": data.project_name
        }

        list.push(send_data);
    });
    return list;
}

const get_single_project = async (project_id) => {
    const snapshot = await firebase_db.collection(COLLECTION_NAME).doc(project_id).get();

    return snapshot.data();
}

const insert_new_project = async (data) => {
    const connection = data.id !== "null" ? firebase_db.collection(COLLECTION_NAME).doc(data.id) : firebase_db.collection(COLLECTION_NAME).doc();

    const response = await connection.set(data.project_data);
    return response;
}

app.get("/project/all", (req, res) => {
    get_all_project().then(response => res.send(response));
});

app.get("/project/:id", (req, res) => {
    const project_id = req.params.id;

    get_single_project(project_id).then(response => res.send(response));
});

app.post("/project/new", (req, res) => {
    const body = req.body;

    insert_new_project(body).then(() => {
        res.json({
            success: true,
            body: "Data posted successfully"
        })
    }).catch((response) => {
        console.log(response);
        res.json({
            success: false,
            body: "Unable to post data"
        })
    });
});


app.listen(PORT, () => console.log("Running"));