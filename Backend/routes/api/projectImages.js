const express = require('express');
const { ProjectImage, Project } = require('../../db/models');
const { requireAuth } = require('../../utils/auth');

const router = express.Router();

// Delete a Project Image
router.delete('/:imageId', requireAuth, async (req, res) => {
    const imageId = Number(req,params.imageId);

    const projectImage = await ProjectImage.findByPk(imageId, {
        include: {
            model: Project,
            attributes: ['projectId']
        }
    })

    if (!projectImage) return res.status(404).json({ message: `Project Image couldn't be found`});

    if(req.user.id !== projectImage.Project.projectId) {
        return res.status(403).json({ message: 'Forbidden' });
    };

    await projectImage.destroy();

    return res.json({ message: "Successfully deleted"})
});


module.exports = router;