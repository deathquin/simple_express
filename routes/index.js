const express = require('express');
const router = express.Router();
const path = require('path');
const multer = require('multer');
const file = require("../models/file").file;

const upload = multer({
  storage: multer.diskStorage({
    filename(req, file, done) {
      //console.log(file);
      done(null, file.originalname);
    },
    destination(req, file, done) {
      //console.log(file);
      done(null, path.join(__dirname, "../public/images"));
    },
  }),
});

const uploadMiddleware = upload.single('image');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/file', function(req, res, next) {
  res.render('file');
});

router.post('/file', uploadMiddleware, async function(req, res, next) {

  try {

    // uploadMiddleware가 성공적으로 GCS에 업로드하고 결과를 req.gcsUrl 등에 담아줬다고 가정
    //const gcsUrl = req.gcsUrl || 'GCS_URL_FROM_UPLOAD_PROCESS';
    const filename = req.file ? req.file.originalname : 'uploaded_file';

    // GCS 업로드 함수 호출
    await file.gcpStorageUpload(req.file);

    res.status(200).json({
      message: 'File uploaded successfully to GCS!',
      filename: filename,
      //gcsUrl: gcsUrl
    });

  } catch (error) {
    // 업로드 미들웨어에서 발생한 오류를 처리
    console.error("Final response error:", error);
    res.status(500).json({ error: 'Upload failed.', detail: error.message });
  }

});


module.exports = router;
