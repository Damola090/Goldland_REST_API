const mongoose = require('mongoose');

const ArchiveSchema = new mongoose.Schema({
    categoryName: {
        type: String,
        required: [true, "Please select Category For This Product"],
        enum: {
            values : [
                'furniture',
                'Lighting',
                'Decoration',
                'Bedding & Bath',
                'storage',
                'bathroom',
                'rugs',
                'TableTop',
                'matresses',
                'outdoor',
                'kids',
                'bedding',
            ],
            message: "Please select Correct category for Archive"
        },
    },
    archiveType: {
        type: String,
        required: [true, "Archive Type is either a Picture or Video"]
    },
    links: [
        {
            public_id: {
                type: String,
                default: "No Image yet"
            },
            url: {
                type: String,
                default: "No Image Yet"
            }
        }
    ],
})

const Archive = mongoose.model('Archive', ArchiveSchema)

module.exports = Archive