const crypto = require('crypto');
const path = require('path');



exports.saveImage = async (req, res) => {
    
    const imageId = crypto.randomUUID();

    const { image } = req.files;
    console.log(image);
    if (!image) return res.sendStatus(400);
    if (!/^image/.test(image.mimetype)){
        return res.sendStatus(400);
    }

    const imageNameSplit = image.name.split('.');
    const filename = imageId + '.' + imageNameSplit[imageNameSplit.length - 1]

    image.mv('./upload/' + filename);

    res.send(filename);
}

exports.getImage = async (req, res) => {

    const imageId = req.params.id;
    const options = {
        root: path.join('./upload')
    };

    res.sendFile(imageId, options, function (err) {
        if (err) {
            next(err);
        } else {
            console.log('Sent:', imageId);
        }
    });
}

