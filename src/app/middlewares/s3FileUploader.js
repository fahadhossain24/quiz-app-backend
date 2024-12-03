import multer from 'multer'
import multerS3 from 'multer-s3'
import { S3Client } from '@aws-sdk/client-s3'
// import express from 'express';
// const app = express();

const config = {
  s3: {
    region: 'eu-north-1', // e.g., 'us-east-1'
    accessKeyId: 'AKIAR7HWYGTFFUISD3GC',
    secretAccessKey: '0XBV2bA21KZpRVoSwVD1uA91ajdOY7GhFxAI79ff',
    bucket: 'quizs3'
  }
}

const s3 = new S3Client({
  region: config.s3.region,
  credentials: {
    accessKeyId: config.s3.accessKeyId,
    secretAccessKey: config.s3.secretAccessKey
  }
})

const s3Upload = (fieldName, isMultiple = false) => {
  const storage = multerS3({
    s3: s3,
    bucket: config.s3.bucket,
    contentType: multerS3.AUTO_CONTENT_TYPE,
    metadata: (req, file, cb) => {
      cb(null, { fieldName: file.fieldname })
    },
    key: (req, file, cb) => {
      console.log('File received:', file.originalname) // Debugging log
      const fileName = `${Date.now().toString()}_${file.originalname}`
      cb(null, fileName)
    }
  })

  return multer({
    storage,
    limits: { fileSize: 50 * 1024 * 1024 }
  }).fields(
    isMultiple
      ? [
          { name: `${fieldName}`, maxCount: 10 },
          { name: 'image', maxCount: 10 },
          { name: 'video', maxCount: 10 }
        ]
      : [{ name: `${fieldName}`, maxCount: 1 }]
  )
}

// app.post('/upload/multiple', s3Upload('file', true), (req, res) => {
//     if (!req.files) {
//         return res.status(400).json({ message: 'No files uploaded' });
//     }

//     const files = req.files.file.map(file => file.location);
//     res.status(200).json({
//         message: 'Files uploaded successfully',
//         files,
//     });
// });

// app.listen(3000, () => console.log('Server running on port 3000'));

export default s3Upload
