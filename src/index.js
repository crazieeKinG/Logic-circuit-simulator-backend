const PORT = 3000;
const PROJECT_COLLECTION_NAME = "project";
const INFORMATION_COLLECTION_NAME = "information";

const express = require("express");
const cors = require("cors");
const firebase_db = require("./firebase");

const app = express();

app.use(cors());
app.use(express.json());


const get_all = async (collection_name) => {
    const snapshots = await firebase_db.collection(collection_name).get();

    const list = [];
    snapshots.forEach(doc => {
        const data = doc.data();
        if (collection_name === PROJECT_COLLECTION_NAME) {
            const send_data = {
                "id": doc.id,
                "project_name": data.project_name
            }
            list.push(send_data);

        } else if (collection_name === INFORMATION_COLLECTION_NAME) {
            data["id"] = doc.id;
            list.push(data);
        }
    });

    return list;
}

const get_single = async (project_id, collection_name) => {
    const snapshot = await firebase_db.collection(collection_name).doc(project_id).get();

    return snapshot.data();
}

const insert_new = async (data, collection_name) => {
    let response;
    if(data.id !== "null"){
        response = await firebase_db.collection(collection_name).doc(data.id).set(data.project_data);
    } else{
        response = await firebase_db.collection(collection_name).add(data.project_data);
    }

    return response;
}

const delete_project = async (collection_name, document_id) => {
    const response = await firebase_db.collection(collection_name).doc(document_id).delete();

    return response;
}

app.get("/project/all", (req, res) => {
    get_all(PROJECT_COLLECTION_NAME).then(response => res.send(response));
});

app.get("/project/:id", (req, res) => {
    const project_id = req.params.id;

    get_single(project_id, PROJECT_COLLECTION_NAME).then(response => res.send(response));
});


app.post("/project/new", (req, res) => {
    const body = req.body;

    insert_new(body, PROJECT_COLLECTION_NAME).then((response) => {
        res.json({
            success: true,
            project_id: response.id,
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


app.delete("/project/delete/:id", (req, res) => {
    const document_id = req.params.id;

    delete_project(PROJECT_COLLECTION_NAME, document_id).then(() => {
        res.json({
            success: true,
            body: "Data deleted successfully"
        })
    }).catch((response) => {
        console.log(response);
        res.json({
            success: false,
            body: "Unable to delete data"
        })
    });
})

app.get("/information/all", (req, res) => {
    get_all(INFORMATION_COLLECTION_NAME).then(response => {
        res.send(response);
    });
});

app.post("/information/new", (req, res) => {
    const body = req.body;
    insert_new(body, INFORMATION_COLLECTION_NAME).then(() => {
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