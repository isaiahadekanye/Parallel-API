const express = require("express");
const router = express.Router();

const success = {
    "success": true
};

router.get("/", async (req, res) => {
    res.status(200).send(success);
});


module.exports = router;