// import CustomError from '../app/errors/index.js'
// import fs from 'fs'
// import path from 'path'

// const fileUploader = async(files, directory, imageName) => {
//     // check the file
//     if (!files || Object.keys(files).length === 0) {
//         throw new CustomError.BadRequestError('No files were uploaded!')
//     }

//     const folderPath = path.join('uploads', directory);

//     // Ensure the directory exists, if not, create it
//     if (!fs.existsSync(folderPath)) {
//         fs.mkdirSync(folderPath, { recursive: true })
//     }


//      // check one image or two image
//      if (!Array.isArray(files[imageName])) {
//         const fileName = files[imageName].name
//         const filePath = path.join(folderPath, fileName)
//         await files[imageName].mv(filePath)

//         return filePath
//     } else if (files[imageName].length > 0) {
//         // Handle multiple file uploads
//         const filePaths = []
//         for (const item of files[imageName]) {
//             const fileName = item.name
//             const filePath = path.join(folderPath, fileName)
//             await item.mv(filePath)
//             filePaths.push(filePath) // Collect all file paths
//         }

//         return filePaths
//     } else {
//         throw new CustomError.BadRequestError('Invalid file format!')
//     }
// }

// export default fileUploader


// ............................................upload file to s3 bucket...............................................

// import CustomError from '../app/errors/index.js';
// import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'; 
// import { v4 as uuidv4 } from 'uuid'; 

// const config = {
//   s3: {
//     region: 'eu-north-1', // e.g., 'us-east-1'
//     accessKeyId: 'AKIAR7HWYGTFFUISD3GC',
//     secretAccessKey: '0XBV2bA21KZpRVoSwVD1uA91ajdOY7GhFxAI79ff',
//     bucket: 'quizs3',
//   },
// };

// // Initialize the S3 client
// const s3 = new S3Client({
//   region: config.s3.region,
//   credentials: {
//     accessKeyId: config.s3.accessKeyId,
//     secretAccessKey: config.s3.secretAccessKey,
//   },
// });

// // Function to upload file to S3
// const fileUploader = async (files, directory, fieldName) => {
//   // Check if the files object exists and contains files
//   if (!files || Object.keys(files).length === 0) {
//     throw new CustomError.BadRequestError('No files were uploaded!');
//   }

//   const file = files[fieldName]; // Assuming 'file' is the field name in the request body
//   if (!file) {
//     throw new CustomError.BadRequestError('No file provided!');
//   }

//   // Generate a unique file name (you can use the original name, or a UUID)
//   const fileName = `${directory}_${file.name}`;

//   try {
//     // Upload the file to S3
//     const uploadParams = {
//       Bucket: config.s3.bucket,
//       Key: fileName, // The file name in the S3 bucket
//       Body: file.data, // The file data
//       ContentType: file.mimetype, // The file mimetype
//     };

//     const command = new PutObjectCommand(uploadParams);

//     // Perform the upload
//     const uploadResponse = await s3.send(command);

//     // Return the S3 URL of the uploaded file
//     const fileUrl = `https://${config.s3.bucket}.s3.${config.s3.region}.amazonaws.com/${fileName}`;
//     return fileUrl;

//   } catch (error) {
//     // Handle errors (e.g., upload failure)
//     throw new CustomError.BadRequestError('Failed to upload file to S3!');
//   }
// };

// export default fileUploader;



// .........................................................................Upload to cloudinary..............................................................................
import { v2 as cloudinary } from 'cloudinary';
import CustomError from '../app/errors/index.js';


// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || '',
  api_key: process.env.CLOUDINARY_API_KEY || '',
  api_secret: process.env.CLOUDINARY_API_SECRET || ''
});

const fileUploader = async (files, directory, imageName) => {
  if (!files || Object.keys(files).length === 0) {
    throw new CustomError.BadRequestError('No files were uploaded!');
  }

  const uploadToCloudinary = (file) => {
    return new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: `uploads/${directory}` },
        (error, result) => {
          if (error || !result) {
            console.error('Cloudinary Upload Error:', error);
            reject(new CustomError.BadRequestError(error?.message || 'Upload failed'));
          } else {
            resolve(result.secure_url);
          }
        }
      );
      stream.end(file.data);
    });
  };

  const fileData = files[imageName];

  if (!Array.isArray(fileData)) {
    return await uploadToCloudinary(fileData);
  } else if (fileData.length > 0) {
    const uploadPromises = fileData.map(file => uploadToCloudinary(file));
    return await Promise.all(uploadPromises);
  } else {
    throw new CustomError.BadRequestError('Invalid file format!');
  }
};

export default fileUploader;

