# Image_transform
 
This is an image tranforming application which can change the format of the image (eg:- png, jpg, webp).
This can change the height and width of the image by taking the custom input form the customer.
This can grayscale the image which means it can apply the filte to the image.
This can also blurr the image.
This web application uses Multer dependency to upload the file and store the file in the diskstorage and also retrieves the file by its unique code assigned by the server.
By identifying the unique code it takes the input from the user in the form and applies those effects to the image using the sharp dependency fromn node.js
