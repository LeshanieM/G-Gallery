import GalleryuserDB from "../models/GalleryModel.js";

// img upload
export const ImageUpload = async (req, res) => {
    const files = req.files.length > 0 && req.files;
    const { username } = req.body;

    if (!username || !files) {
        res.status(400).json({ error: "All Fileds are required" })
    } else {
        try {
            const preuser = await GalleryuserDB.findOne({ username: username });
            if (preuser) {
                res.status(400).json({ error: "This User Is already exist" })
            } else {
                const finalUrl = files.map((element) => element.filename)
                
                const userData = new GalleryuserDB({
                    username, userprofile: finalUrl
                });

                await userData.save();
                res.status(200).json({ message: "Image sucessfully uploaded", userData })
            }
        } catch (error) {
            console.log("catcth block", error)
            res.status(400).json({ error: error })
        }
    }
}

// getUserdata
export const getUserdata = async (req, res) => {
    try {
        const getUsers = await GalleryuserDB.find();
        res.status(200).json(getUsers)
    } catch (error) {
        console.log("catcth block", error)
        res.status(400).json({ error: error })
    }
}

export default {
    ImageUpload,
    getUserdata
};