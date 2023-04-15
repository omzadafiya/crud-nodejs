const { ObjectId } = require("bson");
const multer = require("multer");
const mongoCollections = require("../config/mongoCollections");
const cars = mongoCollections.cars;
const path = require("path")
const url = require("url")



const base_url = "http://localhost:3001/images/Portfolio-pic4.jpg";

async function addCar(data, file) {
    if (data.name == "" || data.name == null) {
        return "Please Enter Name.."
    }
    else if (data.brand == "" || data.brand == null) {
        return "Please Enter Brand.."
    }
    else if (data.price == "" || data.price == null) {
        return "Please Enter Price.."
    }
    else if (data.color == "" || data.color == null) {
        return "Please Enter Color.."
    }
    else {
        const newpath = path.join(process.cwd(), "public/images", file.originalname)
        newurl = url.pathToFileURL(newpath)
        const carsCollection = await cars();
        const insertInfo = await carsCollection.insertOne({
            ...data,
            image: file.originalname
        });
        console.log(file.originalname);

        return insertInfo;

    }
}
async function findCar(id) {
    const carsCollection = await cars();
    const car_id = { _id: new ObjectId(id) }
    let data;
    if (id) {
        data = await carsCollection.findOne(car_id);
    } else {
        data = await carsCollection.find().toArray();
    }
    const cars_item = data.map((item, index) => {
        data[index]['image_url'] = base_url + item.image
    })
    // base_url+item.image
    return data;
}
async function updateCar(id, data, file) {
    const carsCollection = await cars();
    console.log(id);

    if (id) {
        const updatedata = await carsCollection.updateOne(
            { _id: new ObjectId(id) },
            {
                $set: {
                    ...data,
                    image: file.originalname
                }
            }
        )
        return updatedata;
    } else {
        return "Enter valid Id";
    }

}

async function deleteCar(id) {
    const carsCollection = await cars();
    const data = await carsCollection.deleteOne({ _id: new ObjectId(id) });
    return data;
}

const upload = multer({

    storage: multer.diskStorage({
        destination: function (req, resp, callBack) {
            callBack(null, "public/images")
        },

        filename: function (req, file, callBack) {
            callBack(null, file.originalname )
        }
    }),
    fileFilter: function (req, file, callback) {
        var file_type = path.extname(file.originalname);
        if (file_type !== '.png' && file_type !== '.jpg') {
            return callback('Only .png and .jpg Image allowed!')
        }
        callback(null, true)
    },
    limits: {
        fileSize: 1024 * 200
    }
}).single("car_file")

async function uplode_image(id, file) {
    // console.log(file);
    const carsCollection = await cars();
    console.log(file.originalname)
    const newpath = path.join(process.cwd(), "public/images", file.originalname)
    newurl = url.pathToFileURL(newpath)
    const data = await carsCollection.updateOne(
        {
            _id: new ObjectId(id)
        },
        {
            $set: {
                image: file.originalname
            }
        }
    )
    return ({
        message: "File Uploaded",
        url: newurl.href
    })

}

module.exports = {
    addCar,
    findCar,
    updateCar,
    deleteCar,
    upload,
    uplode_image
};