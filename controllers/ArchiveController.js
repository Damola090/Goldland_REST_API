const Archive = require("../models/Archive");

const createArchive = async (req, res, next) => {
  try {
    //We new to upload to cloudinary first before creating

    const newArchive = await Archive.create(req.body);

    if (!newArchive) {
      return res.status(400).json({
        success: false,
        message: "Failed To Create a New Archive",
      });
    }

    return res.status(201).json({
      success: true,
      message: "Archive Successfully Created",
    });
  } catch (err) {
    return res.status(400).json({
      success: false,
      message: "Something went wrong",
    });
  }
};

const fetchAllArchiveImage = async (req, res, next) => {
  try {
    console.log("allImageArchives");
    const allImageArchives = await Archive.find({ archiveType: "Picture" });

    if (!allImageArchives) {
      return res.status(404).json({
        success: false,
        message: "No Image was found",
      });
    }

    res.status(200).json({
      success: true,
      images: allImageArchives,
    });
  } catch (err) {
    return res.status(400).json({
      success: false,
      message: "Failed to fetch all Images",
    });
  }
};

const fetchAllArchiveVideo = async (req, res, next) => {
  const allVideoArchives = await Archive.find({ archiveType: "Video" });

  if (!allVideoArchives) {
    return res.status(404).json({
      success: false,
      message: "No Video was found",
    });
  }

  res.status(200).json({
    success: true,
    videos: allVideoArchives,
  });
};

const fetchSingleArchive = async (req, res, next) => {
  const archive = await Archive.findById(req.params.id);

  if (!archive) {
    return res.status(404).json({
      success: false,
      message: "Archive not found",
    });
  }

  return res.status(200).json({
    success: true,
    archive: archive,
  });
};

const deleteSingleArchive = async (req, res, next) => {
  const archive = await Archive.findById(req.params.id);

  if (!archive) {
    return res.status(404).json({
      success: false,
      message: "Archive To be Deleted not found",
    });
  }

  await Archive.deleteOne({ _id: req.params.id });

  res.status(200).send({
    success: true,
    message: "Archive has been deleted",
  });
};

module.exports = {
  createArchive: createArchive,
  fetchAllArchiveImage: fetchAllArchiveImage,
  fetchAllArchiveVideo: fetchAllArchiveVideo,
  fetchSingleArchive: fetchSingleArchive,
  deleteSingleArchive: deleteSingleArchive,
};
